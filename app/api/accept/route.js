import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { requestId } = await req.json();

    if (!requestId) {
      return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
    }

    
    const friendRequest = await prisma.friendRequest.update({
      where: {
        id: requestId,
        receiverId: decoded.userId, 
      },
      data: {
        status: "accepted",
      },
    });

   
    await prisma.friendship.create({
      data: {
        user1Id: decoded.userId,
        user2Id: friendRequest.senderId,
      },
    });

    return NextResponse.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Accept friend request error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}