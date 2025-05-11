import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token");
    const userEmail = cookieStore.get("user_email")?.value;
    if (!authToken || !userEmail) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (user.role !== "donor") {
      return NextResponse.json({ success: false, error: "Not a donor" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch donor information" }, { status: 500 });
  }
} 