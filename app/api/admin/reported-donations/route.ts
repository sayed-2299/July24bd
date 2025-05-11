import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FundTransaction from "@/models/FundTransaction";

export async function GET() {
  await dbConnect();
  const reported = await FundTransaction.find({ status: "reported" })
    .populate("nomineeId", "fullName name email")
    .populate({
      path: "fundId",
      select: "donorId title",
      populate: { path: "donorId", select: "fullName name email" }
    })
    .sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: reported });
} 