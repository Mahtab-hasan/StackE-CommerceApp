import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if the user already exists by userId
    let user = await User.findOne({ _id: userId });

    if (!user) {
      const cu = await currentUser();
      if (!cu) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }

      // Check if a user with the same email already exists
      const existingUser = await User.findOne({
        email: cu.emailAddresses?.[0]?.emailAddress || "",
      });

      if (existingUser) {
        // If a user with the same email exists, use that user
        user = existingUser;
      } else {
        // Otherwise, create a new user
        const userData = {
          _id: cu.id,
          name: `${cu.firstName || ""} ${cu.lastName || ""}`.trim(),
          email: cu.emailAddresses?.[0]?.emailAddress || "",
          imageUrl: cu.imageUrl || "",
        };
        user = await User.create(userData);
      }
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}