import axios from "axios";
import config from "../config/config.js";

const PRODUCT_API = config.PRODUCT_API_URL;

export const getProductById = async (productId) => {
  try {
    const res = await axios.get(`${PRODUCT_API}/${productId}`);
    return res.data.data; 
  } catch (error) {
    console.error("Failed to fetch product:", productId, error.message);
    return null;
  }
};
