import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =================================
// SEND OTP
// =================================
export const sendOtp = async (req, res) => {
  try {
    let { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Remove spaces, +, -, etc.
    phone = phone.replace(/\D/g, "");

    // If 10 digit Indian number
    if (phone.length === 10) {
      phone = "91" + phone;
    }

    if (phone.length !== 12) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid Indian phone number",
      });
    }

    // =================================
    // MSG91 OTP WIDGET
    // =================================
    // OTP actually MSG91 frontend widget se send hoga.
    // Backend sirf normalized phone frontend ko return karega.

    return res.status(200).json({
      success: true,
      message: "Phone number is valid",
      phone,
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process phone number",
    });
  }
};

// =================================
// VERIFY MSG91 ACCESS TOKEN
// =================================
export const verifyOtp = async (req, res) => {
  try {
    const { phone, accessToken } = req.body;

    if (!phone || !accessToken) {
      return res.status(400).json({
        success: false,
        message: "Phone number and MSG91 access token are required",
      });
    }

    // =================================
    // NORMALIZE PHONE
    // =================================
    let normalizedPhone = phone.replace(/\D/g, "");

    if (normalizedPhone.length === 10) {
      normalizedPhone = "91" + normalizedPhone;
    }

    if (normalizedPhone.length !== 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    // =================================
    // VERIFY ACCESS TOKEN WITH MSG91
    // =================================

    const msg91Response = await fetch(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authkey: process.env.MSG91_AUTHKEY,
          "access-token": accessToken,
        }),
      }
    );

    const msg91Data = await msg91Response.json();

    console.log("MSG91 verification response:", msg91Data);

    // =================================
    // CHECK MSG91 RESPONSE
    // =================================

    if (!msg91Response.ok) {
      return res.status(401).json({
        success: false,
        message: "MSG91 token verification failed",
      });
    }

    // MSG91 must confirm successful verification
    if (
      msg91Data.type &&
      msg91Data.type !== "success"
    ) {
      return res.status(401).json({
        success: false,
        message: "OTP verification failed",
      });
    }

    // =================================
    // CHECK USER
    // =================================

    let user = await User.findOne({
      phone: normalizedPhone,
    });

    // =================================
    // EXISTING USER
    // =================================

    if (user) {
      user.phoneVerified = true;

      await user.save();

      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECERT,
        {
          expiresIn: "7d",
        }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        isNewUser: false,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    }

    // =================================
    // NEW USER
    // =================================

    return res.status(200).json({
      success: true,
      message: "OTP verified",
      isNewUser: true,
      phone: normalizedPhone,
    });
  } catch (error) {
    console.error("Verify MSG91 OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
};

// =================================
// COMPLETE PROFILE
// =================================
export const completeProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required",
      });
    }

    // =================================
    // NORMALIZE PHONE
    // =================================

    let normalizedPhone = phone.replace(/\D/g, "");

    if (normalizedPhone.length === 10) {
      normalizedPhone = "91" + normalizedPhone;
    }

    if (normalizedPhone.length !== 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    // =================================
    // CHECK PHONE
    // =================================

    const existingUser = await User.findOne({
      phone: normalizedPhone,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone number",
      });
    }

    // =================================
    // CHECK EMAIL
    // =================================

    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // =================================
    // CREATE USER
    // =================================

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: normalizedPhone,
      phoneVerified: true,
    });

    // =================================
    // CREATE OUR JWT
    // =================================

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Complete profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create account",
    });
  }
};

// =================================
// GET CURRENT USER
// =================================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-__v"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};