import express from "express";

import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
} from "../controllers/cartController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ADD TO CART
// ==========================================
router.post(
  "/add",
  authMiddleware,
  addToCart
);

// ==========================================
// GET CART
// ==========================================
router.get(
  "/",
  authMiddleware,
  getCart
);

// ==========================================
// UPDATE QUANTITY
// ==========================================
router.put(
  "/:productId/:size",
  authMiddleware,
  updateCartQuantity
);

// ==========================================
// REMOVE ITEM
// ==========================================
router.delete(
  "/:productId/:size",
  authMiddleware,
  removeCartItem
);

export default router;