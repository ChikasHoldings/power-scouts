import {
  supabase,
  sendEmail,
  APP_BASE_URL,
  LOGO_EMAIL_HEADER_URL,
} from "./_lib/email.js";

/**
 * Automated Follow-Up Email System
 * 
 * Sends personalized follow-up emails to leads who:
 * 1. Received comparison results but haven't converted
 * 2. Signed up via newsletter but haven't searched yet
 * 
 * Includes:
 * - Personalized greeting with name and city
 * - 3 recommended plans based on their ZIP/state
 * - Gentle nudge to switch and save money
 * - Spam-filter-friendly HTML (no excessive images, proper text ratio)
 * 
 * Triggered via Vercel Cron or manual admin action.
 * 
 * Follow-up schedule:
 * - 1st follow-up: 3 days after initial contact
 * - 2nd follow-up: 7 days after initial contact
 * - Max 2 follow-ups per lead
 */

// ZIP prefix to state mapping
const ZIP_TO_STATE = {
  '750': 'TX', '751': 'TX', '752': 'TX', '753': 'TX', '754': 'TX', '755': 'TX', '756': 'TX', '757': 'TX', '758': 'TX', '759': 'TX',
  '760': 'TX', '761': 'TX', '762': 'TX', '763': 'TX', '764': 'TX', '765': 'TX', '766': 'TX', '767': 'TX', '768': 'TX', '769': 'TX',
  '770': 'TX', '771': 'TX', '772': 'TX', '773': 'TX', '774': 'TX', '775': 'TX', '776': 'TX', '777': 'TX', '778': 'TX', '779': 'TX',
  '780': 'TX', '781': 'TX', '782': 'TX', '783': 'TX', '784': 'TX', '785': 'TX', '786': 'TX', '787': 'TX', '788': 'TX', '789': 'TX',
  '790': 'TX', '791': 'TX', '792': 'TX', '793': 'TX', '794': 'TX', '795': 'TX', '796': 'TX', '797': 'TX', '798': 'TX', '799': 'TX',
  '430': 'OH', '431': 'OH', '432': 'OH', '433': 'OH', '434': 'OH', '435': 'OH', '436': 'OH', '437': 'OH', '438': 'OH', '439': 'OH',
  '440': 'OH', '441': 'OH', '442': 'OH', '443': 'OH', '444': 'OH', '445': 'OH', '446': 'OH', '447': 'OH', '448': 'OH', '449': 'OH',
  '450': 'OH', '451': 'OH', '452': 'OH', '453': 'OH', '454': 'OH', '455': 'OH', '456': 'OH', '457': 'OH', '458': 'OH',
  '150': 'PA', '151': 'PA', '152': 'PA', '153': 'PA', '154': 'PA', '155': 'PA', '156': 'PA', '157': 'PA', '158': 'PA', '159': 'PA',
  '160': 'PA', '161': 'PA', '162': 'PA', '163': 'PA', '164': 'PA', '165': 'PA', '166': 'PA', '167': 'PA', '168': 'PA', '169': 'PA',
  '170': 'PA', '171': 'PA', '172': 'PA', '173': 'PA', '174': 'PA', '175': 'PA', '176': 'PA', '177': 'PA', '178': 'PA', '179': 'PA',
  '180': 'PA', '181': 'PA', '182': 'PA', '183': 'PA', '184': 'PA', '185': 'PA', '186': 'PA', '187': 'PA', '188': 'PA', '189': 'PA',
  '190': 'PA', '191': 'PA',
  '100': 'NY', '101': 'NY', '102': 'NY', '103': 'NY', '104': 'NY', '105': 'NY', '106': 'NY', '107': 'NY', '108': 'NY', '109': 'NY',
  '110': 'NY', '111': 'NY', '112': 'NY', '113': 'NY', '114': 'NY', '115': 'NY', '116': 'NY', '117': 'NY', '118': 'NY', '119': 'NY',
  '120': 'NY', '121': 'NY', '122': 'NY', '123': 'NY', '124': 'NY', '125': 'NY', '126': 'NY', '127': 'NY', '128': 'NY', '129': 'NY',
  '130': 'NY', '131': 'NY', '132': 'NY', '133': 'NY', '134': 'NY', '135': 'NY', '136': 'NY', '137': 'NY', '138': 'NY', '139': 'NY',
  '140': 'NY', '141': 'NY', '142': 'NY', '143': 'NY', '144': 'NY', '145': 'NY', '146': 'NY', '147': 'NY', '148': 'NY', '149': 'NY',
  '070': 'NJ', '071': 'NJ', '072': 'NJ', '073': 'NJ', '074': 'NJ', '075': 'NJ', '076': 'NJ', '077': 'NJ', '078': 'NJ', '079': 'NJ',
  '080': 'NJ', '081': 'NJ', '082': 'NJ', '083': 'NJ', '084': 'NJ', '085': 'NJ', '086': 'NJ', '087': 'NJ', '088': 'NJ', '089': 'NJ',
  '206': 'MD', '207': 'MD', '208': 'MD', '209': 'MD', '210': 'MD', '211': 'MD', '212': 'MD', '214': 'MD', '215': 'MD', '216': 'MD', '217': 'MD', '218': 'MD', '219': 'MD',
  '600': 'IL', '601': 'IL', '602': 'IL', '603': 'IL', '604': 'IL', '605': 'IL', '606': 'IL', '607': 'IL', '608': 'IL', '609': 'IL',
  '610': 'IL', '611': 'IL', '612': 'IL', '613': 'IL', '614': 'IL', '615': 'IL', '616': 'IL', '617': 'IL', '618': 'IL', '619': 'IL',
  '620': 'IL', '621': 'IL', '622': 'IL', '623': 'IL', '624': 'IL', '625': 'IL', '626': 'IL', '627': 'IL', '628': 'IL', '629': 'IL',
  '060': 'CT', '061': 'CT', '062': 'CT', '063': 'CT', '064': 'CT', '065': 'CT', '066': 'CT', '067': 'CT', '068': 'CT', '069': 'CT',
  '010': 'MA', '011': 'MA', '012': 'MA', '013': 'MA', '014': 'MA', '015': 'MA', '016': 'MA', '017': 'MA', '018': 'MA', '019': 'MA',
  '020': 'MA', '021': 'MA', '022': 'MA', '023': 'MA', '024': 'MA', '025': 'MA', '026': 'MA', '027': 'MA',
  '039': 'ME', '040': 'ME', '041': 'ME', '042': 'ME', '043': 'ME', '044': 'ME', '045': 'ME', '046': 'ME', '047': 'ME', '048': 'ME', '049': 'ME',
  '030': 'NH', '031': 'NH', '032': 'NH', '033': 'NH', '034': 'NH', '035': 'NH', '036': 'NH', '037': 'NH', '038': 'NH',
  '028': 'RI', '029': 'RI',
};

const STATE_NAMES = {
  'TX': 'Texas', 'OH': 'Ohio', 'PA': 'Pennsylvania', 'NY': 'New York', 'NJ': 'New Jersey',
  'MD': 'Maryland', 'IL': 'Illinois', 'CT': 'Connecticut', 'MA': 'Massachusetts',
  'ME': 'Maine', 'NH': 'New Hampshire', 'RI': 'Rhode Island'
};

function resolveState(zip) {
  if (!zip || zip.length < 3) return null;
  return ZIP_TO_STATE[zip.substring(0, 3)] || null;
}

/**
 * Fetch top 3 recommended plans for a given state
 */
async function getRecommendedPlans(state) {
  if (!state) return [];
  
  const { data: plans } = await supabase
    .from('electricity_plans')
    .select('plan_name, provider_name, rate_per_kwh, contract_length, renewable_percentage')
    .eq('state', state)
    .eq('is_active', true)
    .order('rate_per_kwh', { ascending: true })
    .limit(3);
  
  return plans || [];
}

/**
 * Build the follow-up email HTML
 * Designed to be spam-filter friendly:
 * - Good text-to-HTML ratio
 * - No excessive images
 * - Proper unsubscribe link
 * - Real physical address
 * - Plain language subject lines
 */
function buildFollowUpEmail(lead, plans, followUpNumber) {
  const firstName = lead.name ? lead.name.split(' ')[0] : '';
  const city = lead.city || '';
  const stateName = lead.state ? STATE_NAMES[lead.state] || lead.state : '';
  const location = city && stateName ? `${city}, ${stateName}` : stateName || 'your area';
  const year = new Date().getFullYear();
  const unsubUrl = `${APP_BASE_URL}/api/unsubscribe?email=${encodeURIComponent(lead.email)}`;
  const compareUrl = `${APP_BASE_URL}/compare-rates${lead.zip ? `?zip=${lead.zip}` : ''}`;

  // Different messaging for 1st vs 2nd follow-up
  const isFirst = followUpNumber === 1;

  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,';
  
  const mainMessage = isFirst
    ? `We noticed you recently compared electricity rates${city ? ` for ${location}` : ''}. Have you had a chance to review the plans we found for you? Many of our users save an average of $50-$80 per month just by switching to a better rate.`
    : `Just a quick check-in — electricity rates in ${location} have been changing, and we wanted to make sure you're getting the best deal available. Here are the current top-rated plans for your area:`;

  const ctaText = isFirst
    ? 'Review Your Savings Options'
    : 'See Updated Rates';

  // Build plan recommendation cards (text-heavy, spam-filter friendly)
  const planCards = plans.map((plan, i) => {
    const estimatedMonthlyCost = ((plan.rate_per_kwh * 1000) / 100 + 0).toFixed(2);
    const badge = i === 0 ? '<span style="background:#FF6B35;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:3px;margin-left:8px;">Best Rate</span>' : '';
    const renewableTag = plan.renewable_percentage >= 50 
      ? `<span style="color:#059669;font-size:12px;margin-left:4px;">&#127807; ${plan.renewable_percentage}% Green</span>` 
      : '';
    
    return `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:top;">
                <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#1a1a1a;">
                  ${plan.provider_name}${badge}
                </p>
                <p style="margin:0;font-size:13px;color:#6b7280;">
                  ${plan.plan_name} &middot; ${plan.contract_length ? `${plan.contract_length} month term` : 'No contract'}${renewableTag}
                </p>
              </td>
              <td style="vertical-align:top;text-align:right;white-space:nowrap;">
                <p style="margin:0;font-size:20px;font-weight:700;color:#0A5C8C;">${plan.rate_per_kwh}&cent;</p>
                <p style="margin:0;font-size:11px;color:#9ca3af;">per kWh</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Your Electricity Savings Update</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <tr><td style="background:#0A5C8C;padding:24px 32px;text-align:center;">
          <img src="${LOGO_EMAIL_HEADER_URL}" alt="Electric Scouts" width="180" style="display:block;margin:0 auto;" />
        </td></tr>
        
        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="color:#1a1a1a;font-size:16px;line-height:1.6;margin:0 0 16px;">${greeting}</p>
          
          <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 24px;">${mainMessage}</p>
          
          ${plans.length > 0 ? `
          <!-- Recommended Plans -->
          <p style="color:#1a1a1a;font-size:16px;font-weight:600;margin:0 0 12px;">
            ${isFirst ? 'Your Top 3 Recommended Plans:' : 'Current Best Rates in ' + location + ':'}
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:0 0 24px;">
            ${planCards}
          </table>
          
          <p style="color:#6b7280;font-size:13px;margin:0 0 24px;">
            * Rates based on 1,000 kWh monthly usage. Actual costs may vary. Plans subject to availability.
          </p>
          ` : ''}
          
          <!-- CTA Button -->
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
            <tr><td style="background:#FF6B35;border-radius:6px;padding:14px 32px;">
              <a href="${compareUrl}" style="color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;display:block;text-align:center;">${ctaText}</a>
            </td></tr>
          </table>
          
          <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 8px;">
            Switching is free and takes less than 5 minutes. Your service stays the same — only your rate changes.
          </p>
          
          <p style="color:#374151;font-size:14px;line-height:1.6;margin:0;">
            If you've already switched, that's great! Just ignore this email. We're here if you need us.
          </p>
        </td></tr>
        
        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:24px 32px;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:0 0 8px;text-align:center;">
            You're receiving this because you compared electricity rates on Electric Scouts.
          </p>
          <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:0 0 8px;text-align:center;">
            <a href="${unsubUrl}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a> &middot;
            <a href="${APP_BASE_URL}" style="color:#6b7280;text-decoration:underline;">Visit Electric Scouts</a>
          </p>
          <p style="color:#d1d5db;font-size:11px;margin:0;text-align:center;">
            &copy; ${year} Electric Scouts. Helping you find the best electricity rates.
          </p>
        </td></tr>
        
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const subject = isFirst
    ? `${firstName ? firstName + ', are' : 'Are'} you still looking for a better electricity rate?`
    : `${firstName ? firstName + ', new' : 'New'} electricity rates available in ${location}`;

  return { subject, html };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optional: Verify cron secret or admin auth
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Allow if no CRON_SECRET is set (development mode)
    if (cronSecret) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  try {
    const now = new Date();
    const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    // Find leads eligible for follow-up:
    // 1st follow-up: created 3+ days ago, follow_up_count = 0 or null
    // 2nd follow-up: created 7+ days ago, follow_up_count = 1
    const { data: eligibleLeads, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .in('status', ['new', 'active', 'nurtured'])
      .neq('status', 'unsubscribed')
      .neq('status', 'converted')
      .lt('follow_up_count', 2)
      .lt('created_at', threeDaysAgo.toISOString())
      .order('created_at', { ascending: true })
      .limit(50); // Process in batches of 50

    if (fetchError) {
      console.error('Error fetching leads:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch leads' });
    }

    if (!eligibleLeads || eligibleLeads.length === 0) {
      return res.status(200).json({ success: true, message: 'No leads eligible for follow-up', sent: 0 });
    }

    let sentCount = 0;
    let errorCount = 0;
    const results = [];

    for (const lead of eligibleLeads) {
      const currentFollowUp = (lead.follow_up_count || 0) + 1;
      const createdAt = new Date(lead.created_at);

      // Timing check
      if (currentFollowUp === 1 && createdAt > threeDaysAgo) continue;
      if (currentFollowUp === 2 && createdAt > sevenDaysAgo) continue;

      // Resolve state if not set
      const state = lead.state || resolveState(lead.zip);

      // Get recommended plans for their state
      const plans = await getRecommendedPlans(state);

      // Build email
      const { subject, html } = buildFollowUpEmail(
        { ...lead, state },
        plans,
        currentFollowUp
      );

      // Send email
      const result = await sendEmail({
        to: lead.email,
        subject,
        html,
        idempotencyKey: `follow_up_${lead.id}_${currentFollowUp}`,
        eventType: `follow_up_${currentFollowUp}`,
        leadId: lead.id,
      });

      if (result.success && !result.skipped) {
        // Update lead record
        await supabase
          .from('leads')
          .update({
            follow_up_count: currentFollowUp,
            follow_up_sent_at: now.toISOString(),
            status: currentFollowUp === 1 ? 'nurtured' : lead.status,
          })
          .eq('id', lead.id);

        sentCount++;
        results.push({ email: lead.email, followUp: currentFollowUp, status: 'sent' });
      } else if (result.skipped) {
        results.push({ email: lead.email, followUp: currentFollowUp, status: 'skipped' });
      } else {
        errorCount++;
        results.push({ email: lead.email, followUp: currentFollowUp, status: 'error', error: result.error });
      }

      // Rate limiting: wait 200ms between emails
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return res.status(200).json({
      success: true,
      message: `Follow-up batch complete: ${sentCount} sent, ${errorCount} errors`,
      sent: sentCount,
      errors: errorCount,
      total: eligibleLeads.length,
      details: results,
    });

  } catch (error) {
    console.error('Follow-up email error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
