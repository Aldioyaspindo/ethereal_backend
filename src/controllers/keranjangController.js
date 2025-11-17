import Cart from "../models/keranjangModel.js";
import Catalog from "../models/catalogModel.js";


export const addToCart = async (req, res) => {
  try {
    const { sessionId, productId, quantity } = req.body;

    if (!sessionId) return res.status(400).json({ message: "Session ID wajib dikirim." });

    const product = await Catalog.findById(productId);
    if (!product) return res.status(404).json({ message: "Produk tidak ditemukan." });

    let cart = await Cart.findOne({ sessionId, status: "active" });

    // Jika belum ada keranjang, buat baru
    if (!cart) cart = new Cart({ sessionId, items: [] });

    // Cek apakah produk sudah ada di cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    // Hitung total
    let total = 0;
    for (const item of cart.items) {
      const prod = await Catalog.findById(item.product);
      total += prod.productPrice * item.quantity;
    }
    cart.totalPrice = total;

    await cart.save();
    res.status(200).json({ message: "Produk ditambahkan ke keranjang.", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCart = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const cart = await Cart.findOne({ sessionId, status: "active" }).populate("items.product");

    if (!cart) return res.status(404).json({ message: "Keranjang kosong." });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { sessionId, productId } = req.params;
    const cart = await Cart.findOne({ sessionId, status: "active" });
    if (!cart) return res.status(404).json({ message: "Keranjang tidak ditemukan." });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    // Hitung ulang total
    let total = 0;
    for (const item of cart.items) {
      const prod = await Catalog.findById(item.product);
      total += prod.productPrice * item.quantity;
    }
    cart.totalPrice = total;

    await cart.save();
    res.status(200).json({ message: "Produk dihapus dari keranjang.", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const clearCart = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const cart = await Cart.findOne({ sessionId, status: "active" });
    if (!cart) return res.status(404).json({ message: "Keranjang tidak ditemukan." });

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ message: "Keranjang dikosongkan.", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
