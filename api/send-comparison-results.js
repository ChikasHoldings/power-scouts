import {
  supabase,
  sendEmail,
  APP_BASE_URL,
  LOGO_HEADER_URL,
  LOGO_EMAIL_HEADER_URL,
} from "./_lib/email.js";

/**
 * Send Comparison Results via Email
 * 
 * Sends a beautifully formatted HTML email with:
 * - Top recommended plans with affiliate links
 * - Rate comparison details
 * - CTA buttons to switch plans
 * 
 * Works for Residential, Business, and Renewable comparison flows
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, name, plans, zipCode, cityName, monthlyUsage, comparisonType } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!plans || plans.length === 0) {
      return res.status(400).json({ error: "No plans to send" });
    }

    const usage = parseInt(monthlyUsage) || 1000;
    const type = comparisonType || 'residential';
    const firstName = name ? name.split(' ')[0] : '';
    const year = new Date().getFullYear();
    const unsubUrl = `${APP_BASE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`;
    
    // Type-specific styling
    const typeConfig = {
      residential: {
        label: 'Residential',
        headerBg: 'linear-gradient(135deg,#0A5C8C,#084a6f)',
        accentColor: '#0A5C8C',
        emoji: '🏠',
        subtitle: 'Residential Electricity Plans',
        compareUrl: `${APP_BASE_URL}/compare-rates?zip=${zipCode || ''}`,
      },
      business: {
        label: 'Business',
        headerBg: 'linear-gradient(135deg,#0A5C8C,#1e3a5f)',
        accentColor: '#0A5C8C',
        emoji: '🏢',
        subtitle: 'Business Electricity Plans',
        compareUrl: `${APP_BASE_URL}/business-compare-rates?zip=${zipCode || ''}`,
      },
      renewable: {
        label: 'Renewable',
        headerBg: 'linear-gradient(135deg,#059669,#047857)',
        accentColor: '#059669',
        emoji: '🌿',
        subtitle: '100% Green Energy Plans',
        compareUrl: `${APP_BASE_URL}/renewable-compare-rates?zip=${zipCode || ''}`,
      },
    };

    const config = typeConfig[type] || typeConfig.residential;

    // Build plan cards HTML
    const plansHtml = plans.slice(0, 6).map((plan, index) => {
      const affiliateUrl = plan.affiliateUrl || `${APP_BASE_URL}/api/go?slug=${encodeURIComponent((plan.provider_name || '').toLowerCase().replace(/\s+/g, '-'))}`;
      const estimatedCost = ((plan.rate_per_kwh * usage) / 100 + (plan.monthly_base_charge || 0)).toFixed(2);
      
      const bestBadge = index === 0 
        ? `<div style="background:#FF6B35;color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:4px;display:inline-block;margin-bottom:8px;">⭐ TOP PICK</div><br/>`
        : '';
      
      const renewableBadge = plan.renewable_percentage >= 50 
        ? `<div style="color:#059669;font-size:13px;margin-top:6px;">🌿 ${plan.renewable_percentage}% Renewable</div>`
        : '';

      const contractText = plan.contract_length ? `${plan.contract_length} mo term` : 'Variable';

      return `
        <tr><td style="padding:8px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:${index === 0 ? '2px solid #FF6B35' : '1px solid #e5e7eb'};border-radius:10px;overflow:hidden;">
            <tr><td style="padding:18px;">
              ${bestBadge}
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:top;width:55%;">
                    <div style="font-size:17px;font-weight:700;color:#1a1a1a;margin-bottom:4px;">${plan.provider_name || 'Provider'}</div>
                    <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">${plan.plan_name || 'Plan'}</div>
                    ${plan.plan_type ? `<div style="background:#f3f4f6;color:#374151;font-size:12px;font-weight:600;padding:3px 10px;border-radius:10px;display:inline-block;margin-bottom:4px;">${plan.plan_type}</div>` : ''}
                    ${renewableBadge}
                  </td>
                  <td style="vertical-align:top;text-align:right;width:45%;">
                    <div style="font-size:13px;color:#6b7280;">Rate</div>
                    <div style="font-size:22px;font-weight:700;color:${config.accentColor};">${plan.rate_per_kwh}¢<span style="font-size:14px;font-weight:400;">/kWh</span></div>
                    <div style="font-size:13px;color:#6b7280;margin-top:8px;">Est. Monthly</div>
                    <div style="font-size:17px;font-weight:700;color:#1a1a1a;">$${estimatedCost}</div>
                    <div style="font-size:13px;color:#6b7280;margin-top:4px;">${contractText}</div>
                  </td>
                </tr>
              </table>
              <table cellpadding="0" cellspacing="0" style="margin-top:14px;" width="100%">
                <tr><td style="background:#FF6B35;border-radius:6px;text-align:center;padding:12px 20px;">
                  <a href="${affiliateUrl}" style="color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;display:block;">Get This Plan →</a>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>`;
    }).join('');

    // Lowest rate for summary
    const lowestRate = Math.min(...plans.map(p => p.rate_per_kwh));
    const lowestCost = ((lowestRate * usage) / 100).toFixed(2);
    const planCount = plans.length;

    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:20px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            
            <!-- Header -->
            <tr><td style="background-color:${config.accentColor};background:${config.headerBg};padding:24px 30px;border-radius:12px 12px 0 0;text-align:center;">
              <img src="${LOGO_EMAIL_HEADER_URL}" alt="Electric Scouts" width="200" height="42" style="display:block;margin:0 auto;max-width:200px;height:auto;" />
              <div style="font-size:14px;color:#ffffff;margin-top:8px;font-weight:600;">${config.emoji} ${config.subtitle}</div>
            </td></tr>

            <!-- Body -->
            <tr><td style="background:#fff;padding:30px;">
              
              <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 8px;">${firstName ? `Hi ${firstName},` : 'Hi there,'}</p>
              <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">
                Here are your personalized ${config.label.toLowerCase()} electricity plan recommendations for <strong>${cityName || 'your area'}</strong> (${zipCode || 'N/A'}).
              </p>

              <!-- Summary Stats -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td width="33%" style="padding:0 6px 0 0;vertical-align:top;">
                    <div style="background:#f0f9ff;border-radius:10px;padding:16px;text-align:center;">
                      <div style="font-size:13px;color:#6b7280;margin-bottom:6px;">Plans Found</div>
                      <div style="font-size:28px;font-weight:700;color:${config.accentColor};">${planCount}</div>
                      <div style="font-size:12px;color:#6b7280;">${config.label}</div>
                    </div>
                  </td>
                  <td width="33%" style="padding:0 3px;vertical-align:top;">
                    <div style="background:#f0fdf4;border-radius:10px;padding:16px;text-align:center;">
                      <div style="font-size:13px;color:#6b7280;margin-bottom:6px;">Lowest Rate</div>
                      <div style="font-size:28px;font-weight:700;color:#059669;">${lowestRate.toFixed(1)}¢</div>
                      <div style="font-size:12px;color:#6b7280;">per kWh</div>
                    </div>
                  </td>
                  <td width="33%" style="padding:0 0 0 6px;vertical-align:top;">
                    <div style="background:#fff7ed;border-radius:10px;padding:16px;text-align:center;">
                      <div style="font-size:13px;color:#6b7280;margin-bottom:6px;">Est. Monthly</div>
                      <div style="font-size:28px;font-weight:700;color:#FF6B35;">$${lowestCost}</div>
                      <div style="font-size:12px;color:#6b7280;">@ ${usage} kWh</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Recommended Plans -->
              <div style="font-size:17px;font-weight:700;color:#1a1a1a;margin-bottom:12px;">⚡ Top ${config.label} Plans For You</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${plansHtml}
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:24px;">
                <tr><td style="background:${config.accentColor};border-radius:8px;text-align:center;padding:14px 24px;">
                  <a href="${config.compareUrl}" style="color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;display:block;">Compare All ${config.label} Plans →</a>
                </td></tr>
              </table>

              <p style="color:#9ca3af;font-size:13px;margin-top:24px;text-align:center;line-height:1.6;">
                Rates and savings are estimates based on current market rates and ${usage} kWh monthly usage. Actual rates may vary.
              </p>
            </td></tr>

            <!-- Branded Footer -->
            <tr><td style="padding:0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #e5e7eb;">
                <!-- Logo -->
                <tr><td style="padding:28px 30px 12px;text-align:center;">
                  <a href="${APP_BASE_URL}" style="text-decoration:none;display:inline-block;">
                    <img src="${LOGO_HEADER_URL}" alt="Electric Scouts" width="200" height="41" style="display:block;margin:0 auto;max-width:200px;height:auto;" />
                  </a>
                  <p style="margin:12px 0 0;font-size:14px;color:#6b7280;line-height:1.6;">
                    Compare electricity rates from 40+ providers.<br/>Save up to $800/year.
                  </p>
                </td></tr>
                <!-- Social Icons -->
                <tr><td style="padding:20px 30px;text-align:center;">
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                    <tr>
                      <td style="padding:0 10px;">
                        <a href="https://facebook.com/electricscouts" style="text-decoration:none;display:inline-block;">
                          <table cellpadding="0" cellspacing="0"><tr><td style="background:#0A5C8C;border-radius:50%;width:40px;height:40px;text-align:center;vertical-align:middle;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="20" height="20" style="display:block;margin:0 auto;filter:brightness(0) invert(1);" />
                          </td></tr></table>
                        </a>
                      </td>
                      <td style="padding:0 10px;">
                        <a href="https://x.com/electricscouts" style="text-decoration:none;display:inline-block;">
                          <table cellpadding="0" cellspacing="0"><tr><td style="background:#0A5C8C;border-radius:50%;width:40px;height:40px;text-align:center;vertical-align:middle;">
                            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968958.png" alt="X" width="20" height="20" style="display:block;margin:0 auto;filter:brightness(0) invert(1);" />
                          </td></tr></table>
                        </a>
                      </td>
                      <td style="padding:0 10px;">
                        <a href="https://linkedin.com/company/electricscouts" style="text-decoration:none;display:inline-block;">
                          <table cellpadding="0" cellspacing="0"><tr><td style="background:#0A5C8C;border-radius:50%;width:40px;height:40px;text-align:center;vertical-align:middle;">
                            <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LinkedIn" width="20" height="20" style="display:block;margin:0 auto;filter:brightness(0) invert(1);" />
                          </td></tr></table>
                        </a>
                      </td>
                      <td style="padding:0 10px;">
                        <a href="https://instagram.com/electricscouts" style="text-decoration:none;display:inline-block;">
                          <table cellpadding="0" cellspacing="0"><tr><td style="background:#0A5C8C;border-radius:50%;width:40px;height:40px;text-align:center;vertical-align:middle;">
                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="20" height="20" style="display:block;margin:0 auto;filter:brightness(0) invert(1);" />
                          </td></tr></table>
                        </a>
                      </td>
                    </tr>
                  </table>
                </td></tr>
                <!-- Quick Links -->
                <tr><td style="padding:12px 30px;text-align:center;font-size:14px;">
                  <a href="${APP_BASE_URL}/compare-rates" style="color:#0A5C8C;text-decoration:none;font-weight:600;">Compare Rates</a>
                  <span style="color:#d1d5db;margin:0 10px;">|</span>
                  <a href="${APP_BASE_URL}/bill-analyzer" style="color:#0A5C8C;text-decoration:none;font-weight:600;">Bill Analyzer</a>
                  <span style="color:#d1d5db;margin:0 10px;">|</span>
                  <a href="${APP_BASE_URL}" style="color:#0A5C8C;text-decoration:none;font-weight:600;">www.electricscouts.com</a>
                </td></tr>
                <!-- Divider -->
                <tr><td style="padding:20px 30px 0;"><div style="border-top:1px solid #e5e7eb;"></div></td></tr>
                <!-- Copyright & Opt-out -->
                <tr><td style="padding:20px 30px 28px;text-align:center;">
                  <p style="margin:0 0 8px;font-size:13px;color:#6b7280;line-height:1.6;">© ${year} Electric Scouts. All rights reserved.</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#6b7280;line-height:1.6;">You're receiving this because you requested comparison results.</p>
                  <p style="margin:0;font-size:13px;line-height:1.6;">
                    <a href="${unsubUrl}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>
                    <span style="color:#d1d5db;margin:0 8px;">|</span>
                    <a href="${APP_BASE_URL}/privacy-policy" style="color:#6b7280;text-decoration:underline;">Privacy Policy</a>
                  </p>
                </td></tr>
              </table>
            </td></tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>`;

    // Resolve city and state from ZIP code
    const zipToState = {
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
    const stateNames = {
      'TX': 'Texas', 'OH': 'Ohio', 'PA': 'Pennsylvania', 'NY': 'New York', 'NJ': 'New Jersey',
      'MD': 'Maryland', 'IL': 'Illinois', 'CT': 'Connecticut', 'MA': 'Massachusetts',
      'ME': 'Maine', 'NH': 'New Hampshire', 'RI': 'Rhode Island'
    };
    const resolvedState = zipCode ? (zipToState[zipCode.substring(0, 3)] || null) : null;
    const resolvedStateName = resolvedState ? stateNames[resolvedState] : null;

    // Save lead with enhanced data
    const { data: lead } = await supabase
      .from("leads")
      .upsert({
        email: email.toLowerCase().trim(),
        name: firstName || null,
        zip: zipCode || null,
        city: cityName || null,
        state: resolvedState || null,
        source: `${type}_comparison_results`,
        source_page: `${type}_results`,
        status: 'new',
        search_preferences: {
          comparisonType: type,
          monthlyUsage: usage,
          topPlans: plans.slice(0, 3).map(p => ({
            name: p.plan_name,
            provider: p.provider_name,
            rate: p.rate_per_kwh,
          })),
          searchedAt: new Date().toISOString(),
        },
        last_activity_at: new Date().toISOString(),
      }, { onConflict: 'email' })
      .select()
      .single();

    const leadId = lead?.id || null;

    // Send the email
    const result = await sendEmail({
      to: email,
      subject: `${firstName ? firstName + ', here are your' : 'Your'} ${config.label.toLowerCase()} electricity plan options`,
      html,
      idempotencyKey: `comparison_${type}_${email}_${Date.now()}`,
      eventType: `${type}_comparison_results`,
      leadId,
    });

    if (result.success) {
      return res.status(200).json({ success: true, message: "Results sent successfully!" });
    } else {
      console.error("Failed to send comparison results email:", result.error);
      return res.status(500).json({ error: "Failed to send email. Please try again." });
    }

  } catch (error) {
    console.error("Send comparison results error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
