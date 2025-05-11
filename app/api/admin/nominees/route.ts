import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Nominee from "@/models/Nominee";

// GET: Fetch nominees by status
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    let validStatuses = ["uno-verified", "admin-verified", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid or missing status" }, { status: 400 });
    }
    const nominees = await Nominee.find({ status });
    return NextResponse.json({ success: true, data: nominees });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch nominees" }, { status: 500 });
  }
}

// PUT: Admin verify or reject nominee
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { nomineeId, action, rejectionReason } = await req.json();
    if (!nomineeId || !action) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    let update: any = {};
    if (action === "verify") {
      update.status = "admin-verified";
      update["adminVerification.status"] = "verified";
      update["adminVerification.verifiedAt"] = new Date();
    } else if (action === "reject") {
      update.status = "rejected";
      update["adminVerification.status"] = "rejected";
      update["adminVerification.rejectionReason"] = rejectionReason || "";
    } else {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }
    const nominee = await Nominee.findByIdAndUpdate(nomineeId, update, { new: true });
    if (!nominee) {
      return NextResponse.json({ success: false, error: "Nominee not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: nominee });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update nominee" }, { status: 500 });
  }
} 