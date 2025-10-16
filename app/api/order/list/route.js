import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Address from "@/models/Address";


export async function GET(request) {
    try {
        const { userId } = getAuth(request);
             
        await connectDB();

        Address.length
        Product.length
        
        const orders = await Order.find({ userId }).populate('address items.product')        

        return NextResponse.json({ success: true, orders });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Error fetching orders. Please try again later." });
    }
}