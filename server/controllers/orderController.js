import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import User from "../models/User.js";

// Place Order COD: /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        // Calculate total amount
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            amount += product.offerPrice * item.quantity;
        }

        // Add 2% tax
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Place Order Stripe: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        let productData = [];
        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            amount += product.offerPrice * item.quantity;
        }

        // Add 2% tax
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = productData.map(item => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.floor(item.price * 100), // cents
            },
            quantity: item.quantity,
        }));

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            },
        });

        return res.json({ success: true, url: session.url });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Stripe Webhook: /api/order/stripe-webhook
export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const { orderId, userId } = session.metadata;

                await Order.findByIdAndUpdate(orderId, { isPaid: true });
                await User.findByIdAndUpdate(userId, { cartItems: {} });
                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                const metadata = paymentIntent.metadata;

                if (metadata && metadata.orderId) {
                    await Order.findByIdAndDelete(metadata.orderId);
                }
                break;
            }

            default:
                console.warn(`Unhandled event type: ${event.type}`);
        }

        response.json({ received: true });
    } catch (error) {
        console.error("Webhook Error:", error.message);
        response.status(400).send(`Webhook Error: ${error.message}`);
    }
};

// Get Orders by User ID: /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log("Requesting orders for userId:", userId);

        const orders = await Order.find({
            userId: new mongoose.Types.ObjectId(userId),
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Orders (Admin/Seller): /api/order/seller
export const getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
