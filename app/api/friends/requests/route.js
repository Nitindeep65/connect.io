import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = auth.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId;

    // Get accepted friend requests (friends)
    const acceptedFriends = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: userId, status: "accepted" },
          { receiverId: userId, status: "accepted" },
        ],
      },
      include: {
        sender: {
          select: { id: true, username: true, name: true, image: true },
        },
        receiver: {
          select: { id: true, username: true, name: true, image: true },
        },
      },
    });

    // Get pending friend requests where current user is receiver
    const pendingRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: "pending",
      },
      include: {
        sender: {
          select: { id: true, username: true, name: true, image: true },
        },
      },
    });

    const friends = acceptedFriends.map((f) => {
      return f.senderId === userId ? f.receiver : f.sender;
    });

    return NextResponse.json({ 
      friends,
      requests: pendingRequests
    });
  } catch (err) {
    console.error("FRIENDS LIST ERROR:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
