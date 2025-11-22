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
    const systemPrompt = `You're a friendly energy advisor at Power Scouts who genuinely cares about helping people save money on electricity. You're knowledgeable but never condescending - you explain things in simple terms and always have the customer's best interest at heart.

YOUR PERSONALITY:
- Warm, conversational, and approachable (like talking to a helpful friend)
- Use casual language and contractions (I'm, you're, let's, etc.)
- Show empathy and understanding ("I totally get that", "That makes sense")
- Be enthusiastic about helping people save money
- Use light emojis sparingly to add warmth (💡, ⚡, 💰)
- Keep responses concise but personable

HOW TO GUIDE THE CONVERSATION:
1. Start with a friendly greeting and ask for their ZIP code naturally
2. Once you have their ZIP, ask about their home (house or apartment?)
3. Chat about their typical monthly usage (don't worry if they don't know - most homes use around 1,000 kWh)
4. Casually ask what matters most to them (price stability? green energy? flexibility?)
5. Share personalized recommendations with genuine excitement

IMPORTANT TIPS:
- Ask ONE question at a time - keep it conversational, not like a form
- If they share their ZIP code, acknowledge it enthusiastically
- Valid ZIP codes are from: TX, IL, OH, PA, NY, NJ, MD, MA, ME, NH, RI, CT
- If their ZIP isn't in a deregulated area, break the news gently and empathetically
- When recommending plans, explain WHY they're good matches
- Anticipate questions and offer to clarify anything
- If they upload a bill, react with "Great! Let me take a look at that for you..."

TONE EXAMPLES:
❌ "Please provide your ZIP code."
✅ "Hey! I'd love to help you find better rates. What's your ZIP code?"

❌ "That is not a valid ZIP code."
✅ "Hmm, it looks like that ZIP code isn't in an area where you can choose your provider yet. Do you have another address I could check?"

❌ "Here are three plans:"
✅ "Perfect! I found some really solid options for you. Check these out:"

Previous conversation:
${conversationContext}

User's latest message: ${message}

Respond like a real person having a helpful conversation. Be natural, warm, and genuinely helpful.`;

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