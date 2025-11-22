import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { message, conversationHistory = [], billFileUrl = null } = await req.json();

    // Build conversation context
    const conversationContext = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // System prompt for the chatbot
    const systemPrompt = `You are a helpful electricity rate comparison assistant for Power Scouts. Your goal is to help users find the best electricity plans.

CONVERSATION FLOW:
1. Greet the user warmly
2. Ask for their ZIP code (5 digits)
3. If ZIP is valid, ask about their property type (home/apartment)
4. Ask about their average monthly usage (kWh) - typical is 1000 kWh
5. Ask about preferences: fixed vs variable rates, renewable energy, contract length
6. Based on their answers, provide personalized plan recommendations

IMPORTANT RULES:
- Be conversational and friendly
- Ask ONE question at a time
- Validate ZIP codes (must be 5 digits from deregulated states: TX, IL, OH, PA, NY, NJ, MD, MA, ME, NH, RI, CT)
- If ZIP is invalid, politely explain and ask again
- Provide 2-3 specific plan recommendations with rates, providers, and estimated monthly costs
- Always mention you can provide more details or help compare plans

Previous conversation:
${conversationContext}

User's latest message: ${message}

Respond naturally and guide the conversation forward. If you have enough information (ZIP code and preferences), provide specific recommendations.`;

    // Call LLM to generate response
    const llmResponse = await base44.integrations.Core.InvokeLLM({
      prompt: systemPrompt,
      add_context_from_internet: false
    });

    let botResponse = llmResponse;
    let recommendations = null;
    let billAnalysis = null;

    // Handle bill upload
    if (billFileUrl) {
      try {
        const extractionResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
          file_url: billFileUrl,
          json_schema: {
            type: "object",
            properties: {
              current_provider: { type: "string" },
              current_rate: { type: "number" },
              monthly_usage: { type: "number" },
              current_cost: { type: "number" },
              zip_code: { type: "string" },
              account_number: { type: "string" }
            }
          }
        });

        if (extractionResult.status === 'success' && extractionResult.output) {
          billAnalysis = {
            currentProvider: extractionResult.output.current_provider,
            currentRate: extractionResult.output.current_rate,
            monthlyUsage: extractionResult.output.monthly_usage,
            currentCost: extractionResult.output.current_cost,
            zipCode: extractionResult.output.zip_code
          };

          botResponse = `Great! I've analyzed your bill:\n\n` +
            `• Current Provider: ${billAnalysis.currentProvider || 'Not found'}\n` +
            `• Current Rate: ${billAnalysis.currentRate || 'N/A'}¢/kWh\n` +
            `• Monthly Usage: ${billAnalysis.monthlyUsage || 'N/A'} kWh\n` +
            `• Current Cost: $${billAnalysis.currentCost || 'N/A'}\n\n` +
            `Let me find better plans for you...`;
        } else {
          botResponse = "I had trouble reading some details from your bill. Could you tell me your ZIP code and average monthly usage so I can find better rates for you?";
        }
      } catch (error) {
        console.error('Bill extraction error:', error);
        botResponse = "I had trouble analyzing your bill. Could you tell me your ZIP code and average monthly usage?";
      }
    }

    // Check if we should fetch actual plan data
    const shouldFetchPlans = conversationHistory.some(msg => 
      msg.content && /\b\d{5}\b/.test(msg.content)
    ) || /\b\d{5}\b/.test(message) || (billAnalysis && billAnalysis.zipCode);

    if (shouldFetchPlans) {
      // Extract ZIP code from bill or conversation
      let zipCode = billAnalysis?.zipCode;
      if (!zipCode) {
        const zipMatch = (conversationHistory.map(m => m.content).join(' ') + ' ' + message).match(/\b(\d{5})\b/);
        zipCode = zipMatch ? zipMatch[1] : null;
      }
      
      if (zipCode) {
        
        // Fetch plans from database
        const plans = await base44.entities.ElectricityPlan.list();
        
        // Get providers for the ZIP
        const providers = await base44.entities.ElectricityProvider.filter({ is_active: true });
        
        // Filter plans (simplified - in production would check provider availability by ZIP)
        const filteredPlans = plans
          .filter(p => !p.plan_name?.toLowerCase().includes('business'))
          .sort((a, b) => a.rate_per_kwh - b.rate_per_kwh)
          .slice(0, 5);

        if (filteredPlans.length > 0) {
          const usage = billAnalysis?.monthlyUsage || 1000;
          const currentCost = billAnalysis?.currentCost || 0;
          
          recommendations = filteredPlans.map(plan => {
            const provider = providers.find(p => p.name === plan.provider_name);
            const estimatedCost = (plan.rate_per_kwh * usage / 100 + (plan.monthly_base_charge || 0)).toFixed(2);
            const savings = currentCost > 0 ? Math.max(0, (currentCost - parseFloat(estimatedCost))).toFixed(2) : 0;
            
            return {
              provider: plan.provider_name,
              plan: plan.plan_name,
              rate: plan.rate_per_kwh,
              contractLength: plan.contract_length,
              renewable: plan.renewable_percentage || 0,
              estimatedMonthlyCost: estimatedCost,
              savings: parseFloat(savings),
              type: plan.plan_type,
              affiliateUrl: provider?.affiliate_url || provider?.website_url
            };
          }).sort((a, b) => b.savings - a.savings);

          // Enhance bot response with actual data
          const planSummary = recommendations.slice(0, 3).map((rec, i) => 
            `${i + 1}. **${rec.provider}** - ${rec.plan}\n   • Rate: ${rec.rate}¢/kWh\n   • Estimated Monthly: $${rec.estimatedMonthlyCost}\n   • Contract: ${rec.contractLength} months\n   • Type: ${rec.type}${rec.savings > 0 ? '\n   • 💰 Save $' + rec.savings + '/month' : ''}${rec.renewable >= 50 ? '\n   • 🌱 ' + rec.renewable + '% Renewable' : ''}`
          ).join('\n\n');

          if (billAnalysis && billAnalysis.currentCost) {
            const totalSavings = recommendations.slice(0, 3).reduce((sum, rec) => sum + (rec.savings || 0), 0);
            if (totalSavings > 0) {
              botResponse = `Based on your bill analysis, I found plans that could save you money!\n\n📊 **Top recommendations for ZIP ${zipCode}:**\n\n${planSummary}\n\nYou could save up to $${Math.max(...recommendations.slice(0, 3).map(r => r.savings))} per month! Would you like more details?`;
            } else {
              botResponse += `\n\n📊 **Here are competitive plans for ZIP ${zipCode}:**\n\n${planSummary}\n\nThese plans offer similar or better rates. Would you like more details?`;
            }
          } else {
            botResponse += `\n\n📊 **Here are my top recommendations for ZIP ${zipCode}:**\n\n${planSummary}\n\nWould you like more details about any of these plans?`;
          }
        }
      }
    }

    return Response.json({
      response: botResponse,
      recommendations: recommendations,
      billAnalysis: billAnalysis
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    return Response.json({ 
      error: error.message,
      response: "I apologize, but I'm having trouble processing your request right now. Could you please try again?"
    }, { status: 500 });
  }
});