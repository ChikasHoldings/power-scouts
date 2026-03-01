import React, { useState, useEffect, useRef } from "react";
import { X, Bell, MapPin, User, Mail, CheckCircle } from "lucide-react";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const hasTriggered = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Don't show if already dismissed or submitted
    if (localStorage.getItem("exitPopupDismissed") || localStorage.getItem("rateAlertsSubmitted")) {
      hasTriggered.current = true;
      return;
    }

    // Wait at least 5 seconds before enabling exit intent detection
    timeoutRef.current = setTimeout(() => {
      const handleMouseLeave = (e) => {
        // Only trigger when mouse moves above the viewport (toward browser chrome/close button)
        if (e.clientY <= 0 && !hasTriggered.current) {
          hasTriggered.current = true;
          setIsVisible(true);
          document.removeEventListener("mouseout", handleMouseLeave);
        }
      };

      document.addEventListener("mouseout", handleMouseLeave);

      return () => {
        document.removeEventListener("mouseout", handleMouseLeave);
      };
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("exitPopupDismissed", "true");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) { setError("Please enter your first name"); return; }
    if (!/^\d{5}$/.test(zipCode)) { setError("Please enter a valid 5-digit ZIP code"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address"); return; }

    setLoading(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName.trim(),
          email: email.trim(),
          zip_code: zipCode,
          source: "exit_intent_rate_alerts",
        }),
      });
      if (!response.ok) throw new Error("Failed to submit");
      setSubmitted(true);
      localStorage.setItem("rateAlertsSubmitted", "true");
      localStorage.setItem("exitPopupDismissed", "true");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300"
        onClick={handleDismiss}
      />

      {/* Popup — centered square */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90vw] max-w-[420px] animate-popup-in">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {submitted ? (
            /* Success State */
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">You're All Set!</h3>
              <p className="text-gray-600 text-sm mb-5">
                We'll notify you when rates drop in your area. Check your inbox for a confirmation.
              </p>
              <button
                onClick={handleDismiss}
                className="px-6 py-2.5 bg-[#084a6f] text-white font-semibold rounded-lg hover:bg-[#063a57] transition-colors text-sm"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            /* Form State */
            <div>
              {/* Header */}
              <div className="bg-gradient-to-br from-[#084a6f] to-[#0A2540] px-6 pt-7 pb-5 text-center">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1.5">
                  Wait — Don't Miss Out!
                </h3>
                <p className="text-blue-200 text-sm leading-relaxed">
                  Get notified when electricity rates drop in your area. Free, no spam.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#084a6f]/20 focus:border-[#084a6f] transition-all bg-gray-50"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#084a6f]/20 focus:border-[#084a6f] transition-all bg-gray-50"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#084a6f]/20 focus:border-[#084a6f] transition-all bg-gray-50"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:from-[#e55a2b] hover:to-[#e6703f] text-white font-bold rounded-xl transition-all text-sm shadow-md hover:shadow-lg disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Get Rate Alerts →"}
                </button>

                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                  We respect your privacy. No spam, unsubscribe anytime.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes popup-in {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .animate-popup-in { animation: popup-in 0.3s ease-out; }
      `}</style>
    </>
  );
}
