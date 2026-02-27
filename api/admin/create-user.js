import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "../_lib/email.js";

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const VALID_ROLES = ["admin", "editor", "viewer"];

const APP_BASE_URL =
  process.env.VITE_APP_BASE_URL ||
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://www.electricscouts.com";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, full_name, role } = req.body;

    // Validate inputs
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({
        error: "Email, password, full name, and role are required.",
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
      });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
      });
    }

    // Verify the requesting user is an admin
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user: requestingUser },
      error: tokenError,
    } = await supabaseAdmin.auth.getUser(token);

    if (tokenError || !requestingUser) {
      return res.status(401).json({ error: "Unauthorized. Invalid session." });
    }

    const { data: requestingProfile } = await supabaseAdmin
      .from("profiles")
      .select("role, full_name")
      .eq("id", requestingUser.id)
      .single();

    if (!requestingProfile || requestingProfile.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden. Only admins can create new users.",
      });
    }

    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingProfile) {
      return res.status(400).json({
        error: "A user with this email already exists.",
      });
    }

    // Create the user in Supabase Auth
    const { data: newAuthUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          full_name: full_name.trim(),
          role,
        },
      });

    if (createError) {
      console.error("Create user error:", createError);
      return res.status(500).json({
        error: createError.message || "Failed to create user.",
      });
    }

    // Create the profile record
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: newAuthUser.user.id,
        email: normalizedEmail,
        full_name: full_name.trim(),
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // User was created in auth but profile failed — try to clean up
      await supabaseAdmin.auth.admin.deleteUser(newAuthUser.user.id);
      return res.status(500).json({
        error: "Failed to create user profile. Please try again.",
      });
    }

    // Send welcome email to the new user
    const roleLabel =
      role === "admin"
        ? "Administrator"
        : role === "editor"
        ? "Editor"
        : "Viewer";

    const baseUrl =
      process.env.VITE_APP_BASE_URL || "https://www.electricscouts.com";

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: `Welcome to Electric Scouts — Your ${roleLabel} Account`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background-color:#0A5C8C;padding:24px 30px;border-radius:12px 12px 0 0;text-align:center;">
              <img src="${baseUrl}/images/logo-email-header.png" alt="Electric Scouts" width="200" style="display:block;margin:0 auto;max-width:200px;height:auto;" />
            </div>
            <div style="padding:30px;background:#ffffff;">
              <h2 style="margin:0 0 16px;font-size:20px;color:#1f2937;">Welcome to Electric Scouts!</h2>
              <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
                Hi ${full_name.trim()},
              </p>
              <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
                Your <strong>${roleLabel}</strong> account has been created by ${requestingProfile.full_name || "an administrator"}.
              </p>
              <div style="background:#f3f4f6;border-radius:8px;padding:20px;margin:20px 0;">
                <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Your login credentials:</p>
                <p style="margin:0 0 4px;font-size:15px;color:#1f2937;"><strong>Email:</strong> ${normalizedEmail}</p>
                <p style="margin:0;font-size:15px;color:#1f2937;"><strong>Password:</strong> (the password provided by your administrator)</p>
              </div>
              <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
                We recommend changing your password after your first login for security.
              </p>
              <div style="text-align:center;">
                <a href="${baseUrl}/admin/login" style="display:inline-block;background:#0A5C8C;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
                  Sign In to Dashboard
                </a>
              </div>
            </div>
            <div style="padding:20px 30px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;">© ${new Date().getFullYear()} Electric Scouts. All rights reserved.</p>
            </div>
          </div>
        `,
        idempotencyKey: `welcome_${normalizedEmail}_${Date.now()}`,
        eventType: "admin_welcome",
      });
    } catch (emailErr) {
      // Don't fail the whole request if email fails
      console.error("Welcome email failed:", emailErr);
    }

    return res.status(200).json({
      success: true,
      message: `${roleLabel} account created successfully for ${normalizedEmail}.`,
      user: {
        id: newAuthUser.user.id,
        email: normalizedEmail,
        full_name: full_name.trim(),
        role,
      },
    });
  } catch (error) {
    console.error("Create user handler error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
