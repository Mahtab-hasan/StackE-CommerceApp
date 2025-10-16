import connectDB from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(request) {

    try {
        const {userId} = getAuth(request)
        if (!userId) {
            return NextResponse.json({success:false, message:'Please log in to add an address.'})
        }
        const {address} = await request.json()

        const requiredFields = ['fullName', 'phoneNumber', 'area', 'city', 'state'];
        for (const field of requiredFields) {
            if (!address[field]) {
                return NextResponse.json({success:false, message:'Please fill out all address fields.'})
            }
        }

        await connectDB()
        const newAddress = await Address.create({...address, userId})
        return NextResponse.json({success:true, message:'Address Added Successfully',newAddress})



    } catch (error) {
        return NextResponse.json({success:false, message:"Error adding address. Please try again later."})
    }

}
