import express from "express";
import { createAuthMiddleware } from "../middleware/auth.middleware.js";
import validate from "../middleware/cart.middleware.js";
import * as cartController from "../controller/cart.controller.js";

const router = express.Router();

router.get("/", createAuthMiddleware(["user"]), cartController.getCart);

router.post(
  "/items",
  createAuthMiddleware(["user"]),
  validate.validateAddItemToCart,
  cartController.addItemToCart,
);

router.patch(
  "/items/:productId",
  createAuthMiddleware(["user"]),
  validate.validateUpdateCartItem,
  cartController.updateItemQuentity,
);

router.delete(
  "/items/:productId",
  createAuthMiddleware(["user"]),
  cartController.removeItemFromCart,
);

router.delete("/", createAuthMiddleware(["user"]), cartController.clearCart);

export default router;
