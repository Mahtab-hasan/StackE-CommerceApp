import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import Address from "@/models/Address";
import Order from "@/models/Order";
import connectDB from "@/config/db";



export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not Authorized" }, { status: 401 });
        }  

        await connectDB()

        Address.length
        const orders = await Order.find({}).populate('address items.product')
        return NextResponse.json({ success: true, orders })

    }
    catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}