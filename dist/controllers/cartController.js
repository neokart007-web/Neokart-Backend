"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.mergeCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const Cart_1 = require("../models/Cart");
const Product_1 = require("../models/Product");
const asyncHandler_1 = require("../utils/asyncHandler");
const responseHandler_1 = require("../utils/responseHandler");
// Get Cart
exports.getCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    let cart = await Cart_1.Cart.findOne({ user: req.user?._id }).populate('items.product');
    if (!cart) {
        cart = await Cart_1.Cart.create({ user: req.user?._id, items: [] });
    }
    return (0, responseHandler_1.successResponse)(res, 200, 'Cart fetched successfully', cart);
});
// Add Item to Cart
exports.addToCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { productId, quantity, size } = req.body;
    const product = await Product_1.Product.findById(productId);
    if (!product) {
        return (0, responseHandler_1.errorResponse)(res, 404, 'Product not found');
    }
    let cart = await Cart_1.Cart.findOne({ user: req.user?._id });
    if (!cart) {
        cart = await Cart_1.Cart.create({ user: req.user?._id, items: [] });
    }
    const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId && item.size === size);
    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
    }
    else {
        cart.items.push({ product: productId, quantity, size });
    }
    await cart.save();
    await cart.populate('items.product');
    return (0, responseHandler_1.successResponse)(res, 200, 'Item added to cart', cart);
});
// Update Cart Item Quantity
exports.updateCartItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { productId, quantity, size } = req.body;
    let cart = await Cart_1.Cart.findOne({ user: req.user?._id });
    if (!cart) {
        return (0, responseHandler_1.errorResponse)(res, 404, 'Cart not found');
    }
    const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId && item.size === size);
    if (existingItemIndex > -1) {
        if (quantity > 0) {
            cart.items[existingItemIndex].quantity = quantity;
        }
        else {
            cart.items.splice(existingItemIndex, 1);
        }
        await cart.save();
        await cart.populate('items.product');
        return (0, responseHandler_1.successResponse)(res, 200, 'Cart updated', cart);
    }
    else {
        return (0, responseHandler_1.errorResponse)(res, 404, 'Item not found in cart');
    }
});
// Remove Item from Cart
exports.removeFromCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { productId, size } = req.body; // or params, but using body is easier for optional size
    let cart = await Cart_1.Cart.findOne({ user: req.user?._id });
    if (!cart) {
        return (0, responseHandler_1.errorResponse)(res, 404, 'Cart not found');
    }
    cart.items = cart.items.filter((item) => !(item.product.toString() === productId && item.size === size));
    await cart.save();
    await cart.populate('items.product');
    return (0, responseHandler_1.successResponse)(res, 200, 'Item removed from cart', cart);
});
// Merge a guest cart into the authenticated user's cart.
// Adds incoming quantities to matching lines (same product + size) and pushes new ones.
exports.mergeCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { items } = req.body;
    let cart = await Cart_1.Cart.findOne({ user: req.user?._id });
    if (!cart) {
        cart = await Cart_1.Cart.create({ user: req.user?._id, items: [] });
    }
    if (Array.isArray(items)) {
        for (const incoming of items) {
            const quantity = Number(incoming?.quantity);
            if (!incoming?.productId || !quantity || quantity < 1)
                continue;
            // Skip items whose product no longer exists.
            const product = await Product_1.Product.findById(incoming.productId);
            if (!product)
                continue;
            const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === incoming.productId && item.size === incoming.size);
            if (existingItemIndex > -1) {
                cart.items[existingItemIndex].quantity += quantity;
            }
            else {
                cart.items.push({ product: incoming.productId, quantity, size: incoming.size });
            }
        }
        await cart.save();
    }
    await cart.populate('items.product');
    return (0, responseHandler_1.successResponse)(res, 200, 'Cart merged successfully', cart);
});
// Clear Cart
exports.clearCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    let cart = await Cart_1.Cart.findOne({ user: req.user?._id });
    if (cart) {
        cart.items = [];
        await cart.save();
    }
    return (0, responseHandler_1.successResponse)(res, 200, 'Cart cleared', cart);
});
//# sourceMappingURL=cartController.js.map