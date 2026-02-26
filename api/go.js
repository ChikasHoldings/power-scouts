import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Affiliate redirect handler: /api/go?slug=xxx
 * 1. Looks up the affiliate_links table for a matching active slug
 * 2. Records the click in click_tracking
 * 3. Redirects to the target_url
 * 4. If slug is invalid or inactive, returns a styled fallback page
 */
export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).send(buildFallbackPage("Missing Link", "No affiliate link was specified."));
  }

  try {
    // Look up the affiliate link
    const { data: link, error } = await supabase
      .from("affiliate_links")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !link) {
      return res.status(404).send(buildFallbackPage(
        "Link Not Found",
        "This affiliate link is no longer available or has expired."
      ));
    }

    // Record the click (non-blocking — don't await)
    const referrer = req.headers.referer || req.headers.referrer || null;
    const userAgent = req.headers["user-agent"] || null;
    const ipRaw = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.socket?.remoteAddress || "";
    const ipHash = crypto.createHash("sha256").update(ipRaw).digest("hex").substring(0, 16);

    supabase
      .from("click_tracking")
      .insert({
        slug: link.slug,
        referrer,
        user_agent: userAgent,
        ip_hash: ipHash,
      })
      .then(() => {})
      .catch(() => {});

    // Redirect to target URL
    res.setHeader("Location", link.target_url);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.status(302).end();

  } catch (err) {
    console.error("Affiliate redirect error:", err);
    return res.status(500).send(buildFallbackPage(
      "Something Went Wrong",
      "We encountered an error processing this link. Please try again later."
    ));
  }
}

function buildFallbackPage(title, message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ElectricScouts</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a2332 0%, #0f1923 100%);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 480px;
    }
    .icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }
    h1 {
      font-size: 1.75rem;
      margin-bottom: 1rem;
      color: #f97316;
    }
    p {
      font-size: 1.1rem;
      color: #94a3b8;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    a {
      display: inline-block;
      background: #f97316;
      color: #fff;
      text-decoration: none;
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: background 0.2s;
    }
    a:hover { background: #ea580c; }
    .brand {
      margin-top: 3rem;
      font-size: 0.85rem;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">⚡</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="/">Back to ElectricScouts</a>
    <div class="brand">ElectricScouts — Compare. Save. Go Green.</div>
  </div>
</body>
</html>`;
}
