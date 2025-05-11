import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// GET all UNO accounts
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const unoUsers = await User.find({ role: "uno" })
      .select("-password")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: unoUsers });
  } catch (error) {
    console.error("Error fetching UNO accounts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch UNO accounts" },
      { status: 500 }
    );
  }
}

// Create new UNO account
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { district, subDistrict, password } = await req.json();

    // Validate required fields
    if (!district || !subDistrict || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Generate username and email
    const username = `uno_${district.toLowerCase().replace(/\s+/g, "_")}_${subDistrict.toLowerCase().replace(/\s+/g, "_")}`;
    const email = `${username}@gmail.com`;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username },
        { role: "uno", district, subDistrict }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "UNO account already exists for this upazila" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create UNO user
    const unoUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "uno",
      fullName: `UNO ${district} ${subDistrict}`,
      district,
      subDistrict,
      status: "active",
      profileCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Remove password from response
    const userResponse = unoUser.toObject();
    delete userResponse.password;

    return NextResponse.json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error("Error creating UNO account:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create UNO account" },
      { status: 500 }
    );
  }
} 