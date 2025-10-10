import connectDB from "@/config/db";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/User";

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

    const { cartData } = await request.json();

    user.cartItems = cartData;
    await user.save();

    return NextResponse.json({ success: true, message: "Cart updated" });

  } catch (error) {
    console.error("Cart update error:", error);
    return NextResponse.json({ success: false, message: "An error occurred while updating the cart." }, { status: 500 });
  }
}