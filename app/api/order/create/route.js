import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function POST(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let user = await User.findById(userId);

    if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }

      // Check if a user with the same email already exists
      const email = clerkUser.emailAddresses?.[0]?.emailAddress;
      const existingUser = email ? await User.findOne({ email }) : null;

      if (existingUser) {
        // If a user with the same email exists, use that record.
        // This can happen if the Clerk userId changes for the same user.
        user = existingUser;
      } else {
        // Otherwise, create a new user record.
        const userData = {
          _id: clerkUser.id,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
          email: email || "",
          imageUrl: clerkUser.imageUrl || "",
        };
        user = await User.create(userData);
      }
    }

    const { address, items } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid Data" },
        { status: 400 }
      );
    }

    let amount = 0;
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (product) {
            amount += product.offerPrice * item.quantity;
        }
    }

    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: amount + Math.floor(amount * 0.02),
        date: Date.now()
      }
    });

    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order Placed" });
  
  } 
  catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message },{ status: 500 });
  }
}