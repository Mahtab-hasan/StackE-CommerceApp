import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export async function GET(request) {
    try {
        const { userId} = getAuth(request)

        const isSeller = await authSeller(userId)
        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not Authorized' }, { status: 401 })
        }
        
        await connectDB()

        const products = await Product.find({ userId })
        return NextResponse.json({ success: true, products }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}