import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },

        shippingInfo: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            zip: { type: String, required: true },
            country: { type: String, required: true },
        },

        cartItems: [
            {
                product: {
                    id: String,
                    name: String,
                    description: String,
                    fullDescription: String,
                    originalPrice: Number,
                    price: Number,
                    discount: Number,
                    image: String,
                    category: String,
                    rating: Number,
                    reviews: Number,
                    inStock: Boolean,
                    brand: String,
                    features: [String],
                },
                quantity: Number,
            },
        ],

        subtotal: Number,
        shipping: Number,
        totalAmount: Number,

        status: {
            type: String,
            default: "Pending",
        },
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
