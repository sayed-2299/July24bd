import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import FundApplication from "@/models/FundApplication"
import Fund from "@/models/Fund"
import { cookies } from "next/headers"
import mongoose from "mongoose"

export async function POST(req: NextRequest) {
  try {
    let session = await getServerSession(authOptions)
    let userId = session?.user?.id
    let userRole = session?.user?.role
    let victimId = session?.user?.victimId
    let nomineeUser = null;
    let nomineeProfile = null;
    let victimProfile = null;
    // Fallback: check for user_email cookie if session is not found or not nominee
    if (!userId || userRole !== "nominee") {
      const cookieStore = await cookies();
      const userEmail = cookieStore.get("user_email")?.value
      if (!userEmail) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
      }
      await dbConnect()
      nomineeUser = await (await import("@/models/User")).default.findOne({ email: userEmail })
      if (!nomineeUser || nomineeUser.role !== "nominee") {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
      }
      userId = nomineeUser._id.toString()
      nomineeProfile = await (await import("@/models/Nominee")).default.findOne({ userId: nomineeUser._id })
      if (!nomineeProfile) {
        return NextResponse.json(
          { success: false, error: "No nominee profile found. Please complete your profile." },
          { status: 400 }
        );
      }
      if (!nomineeProfile.victimId) {
        return NextResponse.json(
          { success: false, error: "No victim is associated with your nominee profile. Please complete your profile." },
          { status: 400 }
        );
      }
      let victimObjectId = nomineeProfile.victimId;
      if (typeof victimObjectId === "string" && !victimObjectId.match(/^[0-9a-fA-F]{24}$/)) {
        const Victim = (await import("@/models/Victim")).default;
        victimProfile = await Victim.findOne({ victimId: nomineeProfile.victimId });
        if (!victimProfile) {
          return NextResponse.json(
            { success: false, error: "Victim not found for your nominee profile. Please contact support." },
            { status: 400 }
          );
        }
        victimObjectId = victimProfile._id;
      } else {
        const Victim = (await import("@/models/Victim")).default;
        victimProfile = await Victim.findById(victimObjectId);
      }
      victimId = victimProfile?._id;
    } else {
      // If session is present, fetch nominee and victim info
      await dbConnect();
      nomineeUser = await (await import("@/models/User")).default.findById(userId);
      nomineeProfile = await (await import("@/models/Nominee")).default.findOne({ userId });
      const Victim = (await import("@/models/Victim")).default;
      victimProfile = await Victim.findById(victimId);
    }

    const { fundId, requestedAmount, note } = await req.json()
    await dbConnect()

    // Verify fund exists
    const fund = await Fund.findById(fundId)
    if (!fund) {
      return NextResponse.json({ success: false, error: "Fund not found" }, { status: 404 })
    }

    // Defensive logging before creation
    console.log('FundApplication.create payload:', {
      fundId,
      fundIdType: typeof fundId,
      nomineeId: userId,
      nomineeIdType: typeof userId,
      victimId,
      victimIdType: typeof victimId,
      requestedAmount,
      note
    });
    if (!victimProfile || !victimProfile._id) {
      return NextResponse.json(
        { success: false, error: "Victim not found or not linked to nominee profile." },
        { status: 400 }
      );
    }
    let createPayload = {
      fundId: new mongoose.Types.ObjectId(fundId),
      nomineeId: new mongoose.Types.ObjectId(userId),
      victimId: victimProfile._id,
      requestedAmount,
      note,
      nomineeSnapshot: nomineeUser && nomineeProfile ? (() => {
        const nomineeObj = typeof nomineeProfile.toObject === 'function' ? nomineeProfile.toObject() : nomineeProfile;
        return {
          name: nomineeObj.name || nomineeUser.fullName || "",
          nid: nomineeObj.nid || "",
          phone: nomineeUser.phone || "",
          email: nomineeUser.email || "",
          district: nomineeObj.district || "",
          subDistrict: nomineeObj.subDistrict || "",
          relationship: nomineeObj.relationship || "",
          address: nomineeObj.address || "",
        }
      })() : undefined,
      victimSnapshot: victimProfile ? {
        victimId: victimProfile.victimId || (victimProfile._id ? victimProfile._id.toString() : ""),
        fullName: victimProfile.fullName || "",
      } : undefined
    };
    try {
      const application = await FundApplication.create(createPayload);
      return NextResponse.json({ success: true, data: application })
    } catch (err) {
      console.error('Error details:', err);
      return NextResponse.json(
        { success: false, error: 'Failed to apply for fund', details: (err && typeof err === 'object' && 'message' in err) ? err.message : String(err) },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error applying for fund:", error)
    return NextResponse.json(
      { success: false, error: "Failed to apply for fund" },
      { status: 500 }
    )
  }
} 