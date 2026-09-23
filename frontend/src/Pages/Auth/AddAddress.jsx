import React, { useEffect, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./AddAddress.css";

const AddAddress = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);

  // GET LOGGED-IN USER
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(
          "https://internship-e-commerce-backend.vercel.app/api/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("User fetch error:", error);
      }
    };

    fetchUser();
  }, [navigate]);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (
      !formData.house.trim() ||
      !formData.street.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      alert("Please fill all address fields.");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      alert("Please enter a valid 6 digit pincode.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://internship-e-commerce-backend.vercel.app/api/address/add",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log("Add address response:", data);

      if (!response.ok || !data.success) {
        alert(data.message || "Unable to add address.");
        return;
      }

      alert("Address added successfully.");

      navigate("/addresses");
    } catch (error) {
      console.error("Add address error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-address-page">
      <div className="add-address-container">

        {/* BACK */}
        <button
          className="add-address-back"
          onClick={() => navigate("/addresses")}
        >
          <ArrowLeft size={19} />
          <span>BACK</span>
        </button>

        {/* HEADING */}
        <div className="add-address-heading">
          <span>ACCOUNT</span>

          <h1>ADD NEW ADDRESS</h1>

          <p>
            Save your address for a faster checkout experience.
          </p>
        </div>

        {/* USER INFO */}
        {user && (
          <div className="add-address-user">
            <div className="add-address-user-icon">
              <MapPin size={20} />
            </div>

            <div>
              <strong>{user.name}</strong>
              <span>+{user.phone}</span>
            </div>
          </div>
        )}

        {/* FORM */}
        <form
          className="address-form"
          onSubmit={handleSubmit}
        >

          {/* HOUSE */}
          <div className="address-field">
            <label htmlFor="house">
              HOUSE / FLAT
            </label>

            <input
              id="house"
              name="house"
              type="text"
              placeholder="House / Flat number"
              value={formData.house}
              onChange={handleChange}
            />
          </div>

          {/* STREET */}
          <div className="address-field">
            <label htmlFor="street">
              STREET / AREA
            </label>

            <input
              id="street"
              name="street"
              type="text"
              placeholder="Street / Area"
              value={formData.street}
              onChange={handleChange}
            />
          </div>

          {/* CITY + STATE */}
          <div className="address-form-row">

            <div className="address-field">
              <label htmlFor="city">
                CITY
              </label>

              <input
                id="city"
                name="city"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="address-field">
              <label htmlFor="state">
                STATE
              </label>

              <input
                id="state"
                name="state"
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* PINCODE */}
          <div className="address-field">
            <label htmlFor="pincode">
              PINCODE
            </label>

            <input
              id="pincode"
              name="pincode"
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="6 digit pincode"
              value={formData.pincode}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6);

                setFormData((prev) => ({
                  ...prev,
                  pincode: value,
                }));
              }}
            />
          </div>

          {/* DEFAULT */}
          <label className="default-address-check">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />

            <span>
              Set as default address
            </span>
          </label>

          {/* SUBMIT */}
          <button
            type="submit"
            className="save-address-btn"
            disabled={loading}
          >
            {loading
              ? "SAVING..."
              : "SAVE ADDRESS"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddAddress;