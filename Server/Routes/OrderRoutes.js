import express from "express";
import asyncHandler from "express-async-handler";
import { admin, protect } from "../Middleware/AuthMiddleware.js";
import Order from "./../Models/OrderModel.js";
import Product from "./../Models/ProductModel.js";

const orderRouter = express.Router();

// Create order
orderRouter.post(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error("No order items");
        } else {
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createOrder = await order.save();
            res.status(201).json(createOrder);
        }
    })
);

// Admin get all orders
orderRouter.get(
    "/all",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const orders = await Order.find({})
            .sort({
                _id: -1,
            })
            .populate("user", "id name email");
        res.json(orders);
    })
);

// User login orders
orderRouter.get(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        const order = await Order.find({ user: req.user._id }).sort({
            _id: -1,
        });
        res.json(order);
    })
);

// Get order by id
orderRouter.get(
    "/:id",
    protect,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );

        if (order) {
            res.json(order);
        } else {
            res.status(404);
            throw new Error("Order Not Found");
        }
    })
);

// Order is paid
orderRouter.put(
    "/:id/pay",
    protect,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            var productIds = order.orderItems.map((x) => x.product);
            var countItemOrders = order.orderItems.map((x) => x.qty);

            if (
                Object.keys(productIds).length === 1 &&
                Object.values(countItemOrders).length === 1
            ) {
                // Buy a product
                var productId = order.orderItems
                    .map((x) => x.product)
                    .toString();
                const product = await Product.findById(productId);

                if (product) {
                    const newCountInStock =
                        product.countInStock -
                        parseInt(order.orderItems.map((x) => x.qty).toString());
                    product.countInStock = newCountInStock;
                    console.log(product.countInStock);
                    await product.save();
                }
            } else if (
                Object.keys(productIds).length > 1 &&
                Object.values(countItemOrders).length > 1
            ) {
                // Buy multiple products
                var productIds = order.orderItems
                    .map((x) => x.product)
                    .toString();
                var countItemOrders = order.orderItems
                    .map((x) => x.qty)
                    .toString();
                var productId = productIds.split(",");
                var countItemOrder = countItemOrders.split(",");
                var arrayMergeObj = [...productId, ...countItemOrder];
                var arrayMerge = Object.values(arrayMergeObj);
                var newArray = [];

                for (var i = 0; i < arrayMerge.length / 2; i += 1) {
                    newArray.push([
                        arrayMerge[i],
                        arrayMerge[arrayMerge.length / 2 + i],
                    ]);
                }

                for (var i = 0; i < newArray.length; i++) {
                    const product = await Product.findById(newArray[i][0]);

                    if (product) {
                        var newCountInStock =
                            product.countInStock - parseInt(newArray[i][1]);
                        product.countInStock = newCountInStock;
                        console.log(product.countInStock);
                        await product.save();
                    }
                }
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error("Order Not Found");
        }
    })
);

// Order is paid
orderRouter.put(
    "/:id/delivered",
    protect,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error("Order Not Found");
        }
    })
);

export default orderRouter;
