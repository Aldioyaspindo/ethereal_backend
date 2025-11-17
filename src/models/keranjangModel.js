import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Catalog",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Minimal 1 produk."],
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true, // karena ini identitas satu-satunya
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "checked_out"],
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "carts",
  }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
