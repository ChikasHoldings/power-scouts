import {
  supabase,
  sendEmail,
  leadWelcomeEmail,
  adminNewLeadEmail,
  ADMIN_EMAILS,
} from "./_lib/email.js";

// ZIP prefix to state mapping for server-side resolution
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

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, zip, name, source, source_page, city } = req.body;

    if (!email || !source) {
      return res.status(400).json({ error: "Email and source are required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Resolve state from ZIP
    const resolvedState = resolveState(zip);

    // Check for existing lead with same email (prevent duplicates)
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id, status")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (existingLead) {
      if (existingLead.status === "unsubscribed") {
        return res.status(200).json({
          success: true,
          message: "Thank you! We already have your information on file.",
          duplicate: true,
        });
      }
      // Update existing lead with new info
      const updateData = {};
      if (zip) updateData.zip = zip;
      if (name) updateData.name = name;
      if (city) updateData.city = city;
      if (resolvedState) updateData.state = resolvedState;
      if (source_page) updateData.source_page = source_page;
      updateData.last_activity_at = new Date().toISOString();

      await supabase
        .from("leads")
        .update(updateData)
        .eq("id", existingLead.id);

      return res.status(200).json({
        success: true,
        message: "Thank you! We already have your information on file.",
        duplicate: true,
      });
    }

    // Create new lead with enhanced data
    const { data: lead, error: insertError } = await supabase
      .from("leads")
      .insert({
        email: email.toLowerCase().trim(),
        zip: zip || null,
        name: name || null,
        city: city || null,
        state: resolvedState || null,
        source,
        source_page: source_page || source,
        status: "new",
        last_activity_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Lead insert error:", insertError);
      return res.status(500).json({ error: "Failed to save lead" });
    }

    // Send welcome email
    const welcomeTemplate = leadWelcomeEmail(lead.email, lead.name);
    await sendEmail({
      to: lead.email,
      subject: welcomeTemplate.subject,
      html: welcomeTemplate.html,
      idempotencyKey: `lead_welcome_${lead.id}`,
      eventType: "lead_welcome",
      leadId: lead.id,
    });

    // Notify admin(s)
    if (ADMIN_EMAILS.length > 0) {
      const adminTemplate = adminNewLeadEmail(lead);
      await sendEmail({
        to: ADMIN_EMAILS,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
        idempotencyKey: `admin_new_lead_${lead.id}`,
        eventType: "admin_new_lead",
        leadId: lead.id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Thank you! Check your email for next steps.",
    });
  } catch (error) {
    console.error("Leads API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
