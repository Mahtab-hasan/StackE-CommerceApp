import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Please log in to delete products." });
        }

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "You must be a seller to delete products." });
        }

        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required." });
        }

        await connectDB();

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found." });
        }

        if (product.userId.toString() !== userId) {
            return NextResponse.json({ success: false, message: "You are not authorized to delete this product." });
        }

        await Product.findByIdAndDelete(productId);

        return NextResponse.json({ success: true, message: "Product deleted successfully." });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Error deleting product. Please try again later." });
    }
}