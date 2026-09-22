import Address from "../models/Address.js";
import User from "../models/User.js";

// ======================================
// GET SAVED ADDRESSES
// ======================================

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      userId: req.userId,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    const user = await User.findById(req.userId).select(
      "name phone"
    );

    return res.status(200).json({
      success: true,
      addresses,
      user: {
        name: user?.name || "",
        phone: user?.phone || "",
      },
    });
  } catch (error) {
    console.error("Get addresses error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch addresses",
    });
  }
};

// ======================================
// ADD ADDRESS
// ======================================

export const addAddress = async (req, res) => {
  try {
    const {
      house,
      street,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    // Required fields
    if (
      !house ||
      !street ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all address fields",
      });
    }

    // Pincode validation
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6 digit pincode",
      });
    }

    // User check
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If default address selected,
    // make all old addresses non-default
    if (isDefault) {
      await Address.updateMany(
        {
          userId: req.userId,
        },
        {
          $set: {
            isDefault: false,
          },
        }
      );
    }

    // Check if this is first address
    const addressCount = await Address.countDocuments({
      userId: req.userId,
    });

    const address = await Address.create({
      userId: req.userId,
      house: house.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),

      // First address automatically default
      isDefault:
        addressCount === 0
          ? true
          : Boolean(isDefault),
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
      user: {
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Add address error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add address",
    });
  }
};

// ======================================
// DELETE ADDRESS
// ======================================

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await Address.deleteOne({
      _id: id,
      userId: req.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete address",
    });
  }
};

// ======================================
// SET DEFAULT ADDRESS
// ======================================

export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Remove default from all addresses
    await Address.updateMany(
      {
        userId: req.userId,
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );

    // Make selected address default
    address.isDefault = true;

    await address.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated",
      address,
    });
  } catch (error) {
    console.error(
      "Set default address error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update default address",
    });
  }
};