import cartModel from "../model/cart.model.js";
import { getProductById } from "../services/product.service.js";
import { AppError, catchAsync } from "../utils/error.utils.js"; // ✅

// ── helper to populate cart items via Products API ─────────────────
const populateCartItems = async (cart) => {
  const populatedItems = await Promise.all(
    cart.items.map(async (item) => {
      const product = await getProductById(item.productId.toString());
      return {
        _id:       item._id,
        quantity:  item.quantity,
        productId: product, // full product object
      };
    })
  );
  return {
    ...cart.toObject(),
    items: populatedItems,
  };
};

// ─────────────────────────────────────────────────────────────────
// GET CART
// ─────────────────────────────────────────────────────────────────
export const getCart = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    return res.status(200).json({ cart: { items: [] } });
  }

  const populatedCart = await populateCartItems(cart);
  res.status(200).json({ cart: populatedCart });
});

// ─────────────────────────────────────────────────────────────────
// ADD ITEM TO CART
// ─────────────────────────────────────────────────────────────────
export const addItemToCart = catchAsync(async (req, res) => {
  const { productId, qty } = req.body;
  const userId = req.user.userId;

  if (!productId) {
    throw new AppError("productId is required", 400);
  }

  if (!qty || Number(qty) < 1) {
    throw new AppError("qty must be at least 1", 400);
  }

  let cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    cart = new cartModel({ user: userId, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += Number(qty);
  } else {
    cart.items.push({ productId, quantity: Number(qty) });
  }

  await cart.save();

  const rawCart       = await cartModel.findOne({ user: userId });
  const populatedCart = await populateCartItems(rawCart);

  res.status(200).json({ message: "Item added to cart", cart: populatedCart });
});

// ─────────────────────────────────────────────────────────────────
// UPDATE ITEM QUANTITY
// ─────────────────────────────────────────────────────────────────
export const updateItemQuentity = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { qty }       = req.body;
  const userId        = req.user.userId;

  if (!qty || Number(qty) < 1) {
    throw new AppError("qty must be at least 1", 400);
  }

  const cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex < 0) {
    throw new AppError("Item not found in cart", 404);
  }

  cart.items[existingItemIndex].quantity = Number(qty);
  await cart.save();

  const rawCart       = await cartModel.findOne({ user: userId });
  const populatedCart = await populateCartItems(rawCart);

  res.status(200).json({ cart: populatedCart });
});

// ─────────────────────────────────────────────────────────────────
// REMOVE ITEM FROM CART
// ─────────────────────────────────────────────────────────────────
export const removeItemFromCart = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const userId        = req.user.userId;

  if (!productId) {
    throw new AppError("productId is required", 400);
  }

  await cartModel.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { productId } } }
  );

  const rawCart       = await cartModel.findOne({ user: userId });
  const populatedCart = await populateCartItems(rawCart);

  res.status(200).json({ message: "Item removed from cart", cart: populatedCart });
});

// ─────────────────────────────────────────────────────────────────
// CLEAR CART
// ─────────────────────────────────────────────────────────────────
export const clearCart = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const cart = await cartModel.findOneAndUpdate(
    { user: userId },
    { $set: { items: [] } },
    { new: true }
  );

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  res.status(200).json({ message: "Cart cleared", cart });
});