import Cart from "../models/Cart.js";

// ============================
// ADD TO CART
// ============================
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      productId,
      quantity,
      size,
      color,
    } = req.body;

    if (!userId || !productId || !size) {
      return res.status(400).json({
        success: false,
        message: "productId and size are required",
      });
    }

    const qty = Number(quantity) || 1;

    // User ID will be the cart ID
    const cartId = userId.toString();

    let cart = await Cart.findOne({ cartId });

    // ============================
    // CREATE NEW CART
    // ============================
    if (!cart) {
      cart = await Cart.create({
        cartId,
        items: [
          {
            productId,
            quantity: qty,
            size,
            color,
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        cart,
      });
    }

    // ============================
    // CHECK EXISTING ITEM
    // ============================
    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.size === size
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({
        productId,
        quantity: qty,
        size,
        color,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.log("Add to cart error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ============================
// GET CART
// ============================
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const cartId = userId.toString();

    const cart = await Cart.findOne({ cartId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          cartId,
          items: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Get cart error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ============================
// UPDATE QUANTITY
// ============================
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.userId;

    const { productId, size } = req.params;
    const { quantity } = req.body;

    const newQuantity = Number(quantity);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!newQuantity || newQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cartId = userId.toString();

    const cart = await Cart.findOne({ cartId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.size === size
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.quantity = newQuantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart,
    });
  } catch (error) {
    console.log("Update quantity error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ============================
// REMOVE CART ITEM
// ============================
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.userId;

    const { productId, size } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const cartId = userId.toString();

    const cart = await Cart.findOne({ cartId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const oldLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId.toString() &&
          item.size === size
        )
    );

    if (cart.items.length === oldLength) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.log("Remove cart item error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};