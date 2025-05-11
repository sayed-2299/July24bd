import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import FundTransaction from "@/models/FundTransaction"
import Victim from "@/models/Victim"
import mongoose from "mongoose"

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await context.params;

    // Find the victim by code or ObjectId
    let victim;
    if (mongoose.Types.ObjectId.isValid(id)) {
      victim = await Victim.findOne({ $or: [{ _id: id }, { victimId: id }] });
    } else {
      victim = await Victim.findOne({ victimId: id });
    }
    if (!victim) {
      return NextResponse.json({ success: false, error: "Victim not found" }, { status: 404 });
    }

    // Now use victim._id (ObjectId) to query FundTransaction
    const transactions = await FundTransaction.find({ victimId: victim._id })
      .populate({
        path: "fundId",
        select: "donorId donorName title",
        populate: { path: "donorId", select: "name" }
      })
      .populate("nomineeId", "name")
      .populate("applicationId", "note")
      .sort({ createdAt: -1 })
    const totalReceived = transactions
      .filter(tx => tx.status === "received")
      .reduce((sum, tx) => sum + tx.amount, 0)
    return NextResponse.json({
      success: true,
      data: {
        victimId: id,
        totalReceived,
        transactions
      }
    })
  } catch (error) {
    console.error("Error fetching financial support data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch financial support data" }, { status: 500 })
  }
} 