import express from "express";
import asyncHandler from "express-async-handler";
import Category from "../Models/CategoryModel.js";
import Product from "../Models/ProductModel.js";
import { admin, protect } from "./../Middleware/AuthMiddleware.js";

const categoryRouter = express.Router();

// Get category frontend
categoryRouter.get(
    "/",
    asyncHandler(async (req, res) => {
        const categories = await Category.find({});
        res.json(categories);
    })
);

// Get category admin
categoryRouter.get(
    "/all",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const categories = await Category.find({}).sort({ _id: -1 });
        res.json(categories);
    })
);

// Create product
categoryRouter.post(
    "/",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const { name, description } = req.body;
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            res.status(400);
            throw new Error("Category name already exists");
        } else {
            const category = new Category({ name, description });

            if (category) {
                const createCategory = await category.save();
                res.status(201).json(createCategory);
            } else {
                res.status(400);
                throw new Error("Invalid category data");
            }
        }
    })
);

// Delete category
categoryRouter.delete(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const products = await Product.findOne({ category: req.params.id });
        if (products) {
            res.status(400);
            throw new Error("Please delete all products with a relationship");
        }

        const category = await Category.findById(req.params.id);
        if (category) {
            await category.remove();
            res.json({ message: "Category deleted" });
        } else {
            res.status(404);
            throw new Error("Category not found");
        }
    })
);

// Admin get single categories
categoryRouter.get(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const category = await Category.findById(req.params.id);
        if (category) {
            res.json(category);
        } else {
            res.status(404);
            throw new Error("Category not found!");
        }
    })
);

// Update product
categoryRouter.put(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const { name, description } = req.body;
        const category = await Category.findById(req.params.id);

        if (category) {
            category.name = name || category.name;
            category.description = description || category.description;

            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404);
            throw new Error("Product not found");
        }
    })
);

export default categoryRouter;
