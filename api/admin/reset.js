import { createClient } from "@supabase/supabase-js";
import { sendEmail, adminResetCodeEmail } from "../_lib/email.js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function handleRequest(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Rate limit: max 3 requests per email per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("admin_reset_codes")
    .select("id", { count: "exact", head: true })
    .eq("admin_email", email.toLowerCase().trim())
    .gte("created_at", oneHourAgo);

  if (count >= 3) {
    return res.status(200).json({
      success: true,
      message: "If an admin account exists with that email, a reset code has been sent.",
    });
  }

  // Check if this email belongs to an admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("email", email.toLowerCase().trim())
    .eq("role", "admin")
    .maybeSingle();

  if (!profile) {
    return res.status(200).json({
      success: true,
      message: "If an admin account exists with that email, a reset code has been sent.",
    });
  }

  // Generate 6-digit code
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const { error: insertError } = await supabase
    .from("admin_reset_codes")
    .insert({
      admin_email: email.toLowerCase().trim(),
      code,
      expires_at: expiresAt,
    });

  if (insertError) {
    console.error("Reset code insert error:", insertError);
    return res.status(500).json({ error: "Failed to generate reset code" });
  }

  const template = adminResetCodeEmail(code);
  await sendEmail({
    to: email.toLowerCase().trim(),
    subject: template.subject,
    html: template.html,
    idempotencyKey: `admin_reset_${email}_${Date.now()}`,
    eventType: "admin_reset_code",
  });

  return res.status(200).json({
    success: true,
    message: "If an admin account exists with that email, a reset code has been sent.",
  });
}

async function handleVerify(req, res) {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  const { data: resetRecord, error: fetchError } = await supabase
    .from("admin_reset_codes")
    .select("*")
    .eq("admin_email", email.toLowerCase().trim())
    .is("used_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error("Reset verify fetch error:", fetchError);
    return res.status(500).json({ error: "Internal server error" });
  }

  if (!resetRecord) {
    return res.status(400).json({ error: "Invalid or expired code. Please request a new one." });
  }

  if (resetRecord.attempts >= 5) {
    await supabase
      .from("admin_reset_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("id", resetRecord.id);
    return res.status(400).json({ error: "Too many attempts. Please request a new code." });
  }

  await supabase
    .from("admin_reset_codes")
    .update({ attempts: resetRecord.attempts + 1 })
    .eq("id", resetRecord.id);

  if (new Date(resetRecord.expires_at) < new Date()) {
    return res.status(400).json({ error: "Code has expired. Please request a new one." });
  }

  if (resetRecord.code !== code.trim()) {
    return res.status(400).json({
      error: `Invalid code. ${4 - resetRecord.attempts} attempts remaining.`,
    });
  }

  const verificationToken = crypto.randomUUID();

  await supabase
    .from("admin_reset_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("id", resetRecord.id);

  await supabase
    .from("admin_reset_codes")
    .insert({
      admin_email: email.toLowerCase().trim(),
      code: `TOKEN:${verificationToken}`,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

  return res.status(200).json({
    success: true,
    verification_token: verificationToken,
    message: "Code verified. You may now set a new password.",
  });
}

async function handleConfirm(req, res) {
  const { email, verification_token, new_password } = req.body;
  if (!email || !verification_token || !new_password) {
    return res.status(400).json({ error: "Email, verification token, and new password are required" });
  }

  if (new_password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }

  const { data: tokenRecord, error: fetchError } = await supabase
    .from("admin_reset_codes")
    .select("*")
    .eq("admin_email", email.toLowerCase().trim())
    .eq("code", `TOKEN:${verification_token}`)
    .is("used_at", null)
    .maybeSingle();

  if (fetchError) {
    console.error("Reset confirm fetch error:", fetchError);
    return res.status(500).json({ error: "Internal server error" });
  }

  if (!tokenRecord) {
    return res.status(400).json({ error: "Invalid or expired verification token" });
  }

  if (new Date(tokenRecord.expires_at) < new Date()) {
    await supabase
      .from("admin_reset_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("id", tokenRecord.id);
    return res.status(400).json({ error: "Verification token has expired. Please start over." });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email.toLowerCase().trim())
    .eq("role", "admin")
    .maybeSingle();

  if (!profile) {
    return res.status(400).json({ error: "Admin account not found" });
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(
    profile.id,
    { password: new_password }
  );

  if (updateError) {
    console.error("Password update error:", updateError);
    return res.status(500).json({ error: "Failed to update password" });
  }

  await supabase
    .from("admin_reset_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("id", tokenRecord.id);

  return res.status(200).json({
    success: true,
    message: "Password updated successfully. You can now sign in with your new password.",
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { action } = req.body;

    switch (action) {
      case "request":
        return await handleRequest(req, res);
      case "verify":
        return await handleVerify(req, res);
      case "confirm":
        return await handleConfirm(req, res);
      default:
        return res.status(400).json({ error: "Invalid action. Use 'request', 'verify', or 'confirm'." });
    }
  } catch (error) {
    console.error("Reset handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
