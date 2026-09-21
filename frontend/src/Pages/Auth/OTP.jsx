import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OTP.css";

const OTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const phone = location.state?.phone;

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] = useState(false);

  const inputs = useRef([]);

  // =================================
  // CHECK PHONE
  // =================================
  useEffect(() => {
    if (!phone) {
      navigate("/login");
      return;
    }

    inputs.current[0]?.focus();
  }, [phone, navigate]);

  // =================================
  // OTP INPUT
  // =================================
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // =================================
  // BACKSPACE
  // =================================
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  // =================================
  // VERIFY OTP
  // =================================
  const handleVerify = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      alert("Please enter 6 digit OTP");
      return;
    }

    // =================================
    // CHECK MSG91 SDK
    // =================================
    if (typeof window.verifyOtp !== "function") {
      alert(
        "MSG91 OTP service is not ready. Please refresh the page and try again."
      );

      console.error(
        "MSG91 verifyOtp function not found"
      );

      return;
    }

    try {
      setLoading(true);

      // =================================
      // VERIFY OTP WITH MSG91
      // =================================
      window.verifyOtp(
        finalOtp,

        // =================================
        // MSG91 SUCCESS
        // =================================
        async (data) => {
          console.log("MSG91 OTP verification successful");

          /*
            MSG91 response generally contains:

            {
              message: "ACCESS_TOKEN",
              type: "success"
            }

            We take the access token from message.
          */

          const accessToken = data?.message;

          // =================================
          // CHECK MSG91 RESPONSE
          // =================================
          if (
            !accessToken ||
            data?.type !== "success"
          ) {
            console.error(
              "Invalid MSG91 verification response:",
              {
                type: data?.type,
                hasAccessToken: Boolean(accessToken),
              }
            );

            alert(
              "OTP verified but access token was not received."
            );

            setLoading(false);
            return;
          }

          console.log(
            "MSG91 access token received:",
            Boolean(accessToken)
          );

          // =================================
          // SEND MSG91 TOKEN TO BACKEND
          // =================================
          try {
            const response = await fetch(
              "http://localhost:5000/api/auth/verify-otp",
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  phone,
                  accessToken,
                }),
              }
            );

            const backendData =
              await response.json();

            // =================================
            // SAFE DEBUG LOG
            // =================================
            console.log(
              "Backend verification success:",
              backendData.success
            );

            console.log(
              "Is new user:",
              backendData.isNewUser
            );

            console.log(
              "Token received:",
              Boolean(backendData.token)
            );

            console.log(
              "User received:",
              Boolean(backendData.user)
            );

            // =================================
            // BACKEND ERROR
            // =================================
            if (
              !response.ok ||
              !backendData.success
            ) {
              alert(
                backendData.message ||
                  "Unable to login"
              );

              setLoading(false);
              return;
            }

            // =================================
            // NEW USER
            // =================================
            if (backendData.isNewUser) {
              console.log(
                "New user detected. Going to profile."
              );

              navigate(
                "/complete-profile",
                {
                  state: {
                    phone:
                      backendData.phone ||
                      phone,
                  },
                }
              );

              setLoading(false);
              return;
            }

            // =================================
            // EXISTING USER
            // =================================

            if (!backendData.token) {
              console.error(
                "Backend did not return JWT token."
              );

              alert(
                "Login successful, but login token was not received."
              );

              setLoading(false);
              return;
            }

            // =================================
            // SAVE JWT TOKEN
            // =================================
            localStorage.setItem(
              "token",
              backendData.token
            );

            console.log(
              "JWT token saved:",
              Boolean(
                localStorage.getItem("token")
              )
            );

            // =================================
            // SAVE USER
            // =================================
            if (backendData.user) {
              localStorage.setItem(
                "user",
                JSON.stringify(
                  backendData.user
                )
              );
            }

            console.log(
              "User saved:",
              Boolean(
                localStorage.getItem("user")
              )
            );

            // =================================
            // UPDATE NAVBAR
            // =================================
            window.dispatchEvent(
              new Event("authUpdated")
            );

            // =================================
            // GO HOME
            // =================================
            navigate("/");
          } catch (error) {
            console.error(
              "Backend verification error:",
              error
            );

            alert(
              "Unable to connect with server"
            );

            setLoading(false);
          }
        },

        // =================================
        // MSG91 FAILURE
        // =================================
        (error) => {
          console.error(
            "MSG91 OTP verification failed:",
            error
          );

          alert(
            "Invalid or expired OTP. Please try again."
          );

          setLoading(false);
        }
      );
    } catch (error) {
      console.error(
        "MSG91 verify OTP error:",
        error
      );

      alert(
        "Unable to verify OTP"
      );

      setLoading(false);
    }
  };

  // =================================
  // RESEND OTP
  // =================================
  const handleResendOtp = () => {
    if (
      typeof window.retryOtp !== "function"
    ) {
      alert(
        "MSG91 OTP service is not ready."
      );

      return;
    }

    window.retryOtp(
      "11",

      (data) => {
        console.log(
          "OTP resent successfully"
        );

        alert("OTP sent again");
      },

      (error) => {
        console.error(
          "Resend OTP error:",
          error
        );

        alert(
          "Unable to resend OTP"
        );
      }
    );
  };

  // =================================
  // UI
  // =================================
  return (
    <div className="otp-page">

      <div className="otp-box">

        <div className="otp-header">

          <h1>
            VERIFY OTP
          </h1>

          <p>
            Enter the 6 digit OTP sent to
          </p>

          <strong>
            +{phone}
          </strong>

        </div>

        <form onSubmit={handleVerify}>

          <div className="otp-inputs">

            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) =>
                  (inputs.current[index] = el)
                }
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) =>
                  handleChange(
                    e.target.value,
                    index
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(
                    e,
                    index
                  )
                }
              />
            ))}

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "VERIFYING..."
              : "VERIFY OTP"}

            {!loading && (
              <ArrowRight size={18} />
            )}
          </button>

        </form>

        <button
          type="button"
          className="resend-otp"
          onClick={handleResendOtp}
          disabled={loading}
        >
          RESEND OTP
        </button>

        <button
          type="button"
          className="change-number"
          onClick={() =>
            navigate("/login")
          }
        >
          CHANGE PHONE NUMBER
        </button>

      </div>

    </div>
  );
};

export default OTP;