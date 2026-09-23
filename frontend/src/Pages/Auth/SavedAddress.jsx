import React, { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./SavedAddress.css";

const SavedAddresses = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "https://internship-e-commerce-backend.vercel.app/api/address",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Address response:", data);

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }

        return;
      }

      setAddresses(data.addresses || []);
      setUser(data.user || null);
    } catch (error) {
      console.error("Saved addresses error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://internship-e-commerce-backend.vercel.app/api/address/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setAddresses((prev) =>
          prev.filter((address) => address._id !== id)
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Delete address error:", error);
    }
  };

  const handleDefault = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://internship-e-commerce-backend.vercel.app/api/address/${id}/default`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchAddresses();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Default address error:", error);
    }
  };

  return (
    <div className="saved-address-page">
      <div className="saved-address-container">

        {/* BACK */}
        <button
          className="saved-back"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft size={19} />
          <span>BACK</span>
        </button>

        {/* HEADER */}
        <div className="saved-heading">
          <span>ACCOUNT</span>
          <h1>SAVED ADDRESSES</h1>
        </div>

        {/* USER INFO */}
        {user && (
          <div className="saved-user-info">
            <h3>{user.name}</h3>
            <p>+{user.phone}</p>
          </div>
        )}

        {/* ADD BUTTON */}
        <button
          className="add-address-btn"
          onClick={() => navigate("/addresses/add")}
        >
          <Plus size={20} />
          ADD NEW ADDRESS
        </button>

        {/* LOADING */}
        {loading && (
          <div className="address-loading">
            LOADING...
          </div>
        )}

        {/* NO ADDRESS */}
        {!loading && addresses.length === 0 && (
          <div className="no-address">
            <MapPin size={42} />

            <h3>NO SAVED ADDRESSES</h3>

            <p>
              Add an address for a faster checkout.
            </p>

            <button
              onClick={() => navigate("/addresses/add")}
            >
              ADD ADDRESS
            </button>
          </div>
        )}

        {/* ADDRESS LIST */}
        {!loading && addresses.length > 0 && (
          <div className="address-list">

            {addresses.map((address) => (
              <div
                className="address-card"
                key={address._id}
              >

                <div className="address-card-top">

                  <div className="address-icon">
                    <MapPin size={21} />
                  </div>

                  <div className="address-details">

                    <div className="address-name-row">

                      <h3>
                        {user?.name || "ADDRESS"}
                      </h3>

                      {address.isDefault && (
                        <span className="default-badge">
                          DEFAULT
                        </span>
                      )}

                    </div>

                    <p>{address.house}</p>

                    <p>{address.street}</p>

                    <p>
                      {address.city}, {address.state} -{" "}
                      {address.pincode}
                    </p>

                    <p>
                      +{user?.phone}
                    </p>

                  </div>

                </div>

                <div className="address-actions">

                  {!address.isDefault && (
                    <button
                      className="make-default"
                      onClick={() =>
                        handleDefault(address._id)
                      }
                    >
                      MAKE DEFAULT
                    </button>
                  )}

                  <button
                    className="delete-address"
                    onClick={() =>
                      handleDelete(address._id)
                    }
                    aria-label="Delete address"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default SavedAddresses;