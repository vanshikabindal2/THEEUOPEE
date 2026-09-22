import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRound, Mail, Phone, ChevronDown } from "lucide-react";

import "./complete.css";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!phone) {
      setError("Phone number is missing. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/complete-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone,
            gender: formData.gender,
          }),
        }
      );

      const data = await response.json();

      console.log("Complete profile response:", data);

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to create account.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("authUpdated"));

      navigate("/");
    } catch (error) {
      console.error("Complete profile error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complete-profile-page">
      <div className="complete-profile-box">
        <div className="complete-profile-heading">
          <span>WELCOME TO</span>
          <h1>THE EPOPEE</h1>
          <p>Complete your profile to continue.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-input">
            <UserRound size={18} />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="profile-input">
            <Mail size={18} />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="profile-input disabled-input">
            <Phone size={18} />

            <input
              type="text"
              value={`+${phone}`}
              disabled
            />
          </div>

          <div className="profile-input select-input">
            <UserRound size={18} />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>

            <ChevronDown size={18} />
          </div>

          {error && (
            <p className="complete-profile-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "CREATING ACCOUNT..." : "CONTINUE"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;