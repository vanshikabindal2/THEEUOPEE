import React, { useEffect, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// ==========================================
// CONFIG
// ==========================================
const MSG91_SCRIPT_SRC = "https://verify.msg91.com/otp-provider.js";
const WIDGET_ID = import.meta.env.VITE_MSG91_WIDGET_ID;
const TOKEN_AUTH = import.meta.env.VITE_MSG91_TOKEN_AUTH;

// Dashboard me captcha ON hai to true karo, OFF hai to false rakho.
// Dono jagah (dashboard + yaha) same hona chahiye.
const USE_CAPTCHA = false;
const CAPTCHA_DIV_ID = "msg91-captcha";

// Module-level flag: StrictMode me useEffect 2 baar chalta hai,
// isse init sirf ek hi baar hoga.
let msg91InitStarted = false;

const Login = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg91Ready, setMsg91Ready] = useState(false);

  // ==========================================
  // MSG91 OTP WIDGET INITIALIZATION
  // ==========================================
  console.log("ENV:", WIDGET_ID, TOKEN_AUTH);
  useEffect(() => {
    // Agar pehle hi init ho chuka hai (page revisit / StrictMode)
    if (msg91InitStarted) {
      if (window.__msg91Ready) setMsg91Ready(true);
      return;
    }

    if (!WIDGET_ID || !TOKEN_AUTH) {
      console.error(
        "MSG91 env missing. .env me VITE_MSG91_WIDGET_ID aur VITE_MSG91_TOKEN_AUTH daalo aur dev server restart karo."
      );
      return;
    }

    const configuration = {
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      exposeMethods: true,
      identifier: "",
      ...(USE_CAPTCHA ? { captchaRenderId: CAPTCHA_DIV_ID } : {}),

      success: (data) => {
        console.log("MSG91 Widget initialized successfully:", data);
        window.__msg91Ready = true;
        setMsg91Ready(true);
      },

      failure: (error) => {
        console.error("MSG91 Widget initialization failed:", error);
        window.__msg91Ready = false;
        msg91InitStarted = false; // dobara try karne do
        setMsg91Ready(false);
      },
    };

    const initializeMSG91 = () => {
      if (typeof window.initSendOTP !== "function") {
        console.error("MSG91 initSendOTP function not found");
        return;
      }
      if (msg91InitStarted) return;
      msg91InitStarted = true;

      try {
        console.log("Initializing MSG91 OTP...");
        window.initSendOTP(configuration);
      } catch (error) {
        console.error("MSG91 initialization error:", error);
        msg91InitStarted = false;
        setMsg91Ready(false);
      }
    };

    // Script pehle se loaded hai
    if (typeof window.initSendOTP === "function") {
      initializeMSG91();
      return;
    }

    // Script tag hai lekin abhi load ho raha hai
    const existingScript = document.querySelector(
      `script[src="${MSG91_SCRIPT_SRC}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", initializeMSG91, { once: true });
      return;
    }

    // Naya script load karo
    const script = document.createElement("script");
    script.src = MSG91_SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      console.log("MSG91 OTP script loaded");
      initializeMSG91();
    };
    script.onerror = () => {
      console.error("Unable to load MSG91 OTP script");
      setMsg91Ready(false);
    };
    document.head.appendChild(script);

    // Cleanup me script remove NAHI karna
  }, []);

  // ==========================================
  // SEND OTP
  // ==========================================
  const handleSendOtp = (e) => {
    e.preventDefault();

    if (phone.length !== 10) {
      alert("Please enter a valid 10 digit phone number");
      return;
    }

    if (typeof window.sendOtp !== "function") {
      alert("OTP service is not loaded. Please refresh the page.");
      return;
    }

    try {
      setLoading(true);

      // 9876543210 -> 919876543210 (+ ke bina)
      const identifier = `91${phone}`;
      console.log("Sending OTP to:", identifier);

      window.sendOtp(
        identifier,

        (data) => {
          console.log("MSG91 OTP sent successfully:", data);
          setLoading(false);
          navigate("/verify-otp", { state: { phone: identifier } });
        },

        (error) => {
          console.error("MSG91 SEND OTP ERROR:", error);
          setLoading(false);
          alert(
            "Unable to send OTP. Please check your MSG91 configuration and try again."
          );
        }
      );
    } catch (error) {
      console.error("Send OTP error:", error);
      setLoading(false);
      alert("Unable to send OTP. Please try again.");
    }
  };

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-header">
          <h1>WELCOME BACK</h1>
          <p>Login or create your account using your phone number.</p>
        </div>

        <form onSubmit={handleSendOtp}>
          <label>PHONE NUMBER</label>

          <div className="phone-input">
            <span>+91</span>
            <Phone size={18} />
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhone(value);
              }}
            />
          </div>

          {/* Captcha ka div: sirf USE_CAPTCHA true ho tab. Conditional
              render ke andar hi rakha hai lekin stable (re-mount nahi hota). */}
          {USE_CAPTCHA && <div id={CAPTCHA_DIV_ID}></div>}

          <button type="submit" disabled={loading}>
            {loading ? "SENDING..." : "GET OTP"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;