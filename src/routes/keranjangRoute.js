import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/keranjangController.js";

const Cartrouter = express.Router();

Cartrouter.post("/add", addToCart); // body: { sessionId, productId, quantity }
Cartrouter.get("/:sessionId", getCart);
Cartrouter.delete("/:sessionId/:productId", removeFromCart);
Cartrouter.delete("/:sessionId", clearCart);

export default Cartrouter;
