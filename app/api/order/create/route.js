import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function POST(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" }
      );
    }

    const { address, items } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid Data" }
      );
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        amount += product.offerPrice * item.quantity;
      }
    }

    // Save the order in the database
    const orderData = {
      userId,
      address,
      items,
      amount: amount + Math.floor(amount * 0.02), // Add 2% tax
      date: Date.now(),
    };

    const order = await Order.create(orderData);

    // Clear the user's cart
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    // Send the order event to Inngest
    await inngest.send({
      name: "order/created",
      data: orderData,
    });

    return NextResponse.json({
      success: true,
      message: "Order Placed",
      orderId: order._id, // Return the order ID
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error.message }
    );
  }
}