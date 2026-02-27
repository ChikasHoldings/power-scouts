import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabaseAuth = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { current_password, new_password } = req.body;

    // Validate inputs
    if (!current_password || !new_password) {
      return res.status(400).json({
        error: "Current password and new password are required.",
      });
    }

    if (!PASSWORD_REGEX.test(new_password)) {
      return res.status(400).json({
        error:
          "New password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
      });
    }

    // Extract the JWT from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the current user from the token
    const {
      data: { user: tokenUser },
      error: tokenError,
    } = await supabaseAdmin.auth.getUser(token);

    if (tokenError || !tokenUser) {
      return res.status(401).json({ error: "Unauthorized. Invalid session." });
    }

    // Verify the user is an admin
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", tokenUser.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return res.status(403).json({ error: "Forbidden. Admin access required." });
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabaseAuth.auth.signInWithPassword({
      email: tokenUser.email,
      password: current_password,
    });

    if (signInError) {
      return res.status(400).json({
        error: "Current password is incorrect.",
      });
    }

    // Update the password using admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      tokenUser.id,
      { password: new_password }
    );

    if (updateError) {
      console.error("Password update error:", updateError);
      return res.status(500).json({ error: "Failed to update password." });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
