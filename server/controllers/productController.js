import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);

    const images = req.files;

    console.log("FILES:", images);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        console.log("UPLOADING:", item.path);

        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });

        console.log("CLOUDINARY RESULT:", result);

        console.log("UPLOAD SUCCESS:", result.secure_url);

        return result.secure_url;
      }),
    );

    console.log("Image url: ", imagesUrl);

    await Product.create({
      ...productData,
      image: null,
    });

    res.json({
      success: true,
      message: "Product Added",
    });
  } catch (error) {
    console.log("========== PRODUCT UPLOAD ERROR ==========");
    console.log(error);
    console.log("MESSAGE:", error.message);
    console.log("HTTP CODE:", error.http_code);
    console.log("NAME:", error.name);
    console.log("==========================================");

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
