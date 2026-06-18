import axios from "axios";
import config from "../config/config.js";
import { AppError } from "../utils/error.utils.js";

const PRODUCT_API = config.PRODUCT_API_URL;

const normalizeProduct = (payload) => {
  const product = payload?.data ?? payload?.product ?? payload;

  if (!product || typeof product !== "object" || !product._id) {
    return null;
  }

  return {
    _id: product._id,
    title: product.title ?? "Unavailable product",
    price: product.price ?? { amount: 0, currency: "INR" },
    images: Array.isArray(product.images) ? product.images : [],
    stock: Number(product.stock ?? 0),
  };
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(
      `${PRODUCT_API}/${encodeURIComponent(productId)}`,
      { timeout: 5000 },
    );

    const product = normalizeProduct(response.data);
    if (!product) {
      throw new AppError("Product Service returned an invalid response", 502);
    }

    return product;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }

    if (error.isOperational) {
      throw error;
    }

    console.error(
      `Product Service request failed for ${productId}:`,
      error.response?.status ?? error.code ?? error.message,
    );

    throw new AppError("Product Service is unavailable", 502);
  }
};
