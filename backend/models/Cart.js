import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },

  size: {
    type: String,
    required: true,
  },

  color: {
    type: String,
  },
});

const cartSchema = new mongoose.Schema(
  {
    cartId: {
      type: String,
      required: true,
      unique: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;