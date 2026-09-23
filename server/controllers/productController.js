import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);

    console.log("PRODUCT DATA:", productData);
    console.log("FILES:", req.files);

    // Agar images nahi aayi to product create hi mat karo
    if (!req.files || req.files.length === 0) {
      return res.json({
        success: false,
        message: "No images received",
      });
    }

    const imagesUrl = [];

    for (const item of req.files) {
      console.log("UPLOADING:", item.path);

      const result = await cloudinary.uploader.upload(item.path);

      console.log("CLOUDINARY RESULT:", result);

      imagesUrl.push(result.secure_url);
    }

    console.log("FINAL IMAGES URL:", imagesUrl);

    const product = await Product.create({
      ...productData,
      images: imagesUrl,
    });

    console.log("PRODUCT CREATED:", product);

    res.json({
      success: true,
      message: "Product Added",
    });
  } catch (error) {
    console.log("========== PRODUCT ERROR ==========");

    console.log("MESSAGE:", error.message);
    console.log("HTTP CODE:", error.http_code);
    console.log("NAME:", error.name);

    console.log("FULL ERROR:", error);

    if (error.response) {
      console.log("RESPONSE:", error.response);
      console.log("RESPONSE DATA:", error.response.data);
      console.log("RESPONSE HEADERS:", error.response.headers);
    }

    console.log("==================================");

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get Product : /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Single Product : /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    if (quantity < 0) {
      return res.json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { quantity, inStock: quantity > 0 },
      { new: true },
    );

    res.json({
      success: true,
      message: "Stock Updated",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
