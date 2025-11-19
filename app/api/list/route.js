import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { user1Id: decoded.userId },
          { user2Id: decoded.userId },
        ]
      },
      include: {
        user1: {
          select: { id: true, username: true, name: true, image: true },
        },
        user2: {
          select: { id: true, username: true, name: true, image: true },
        },
      }
    });

    // Return the friend (the other user in the friendship)
    const friends = friendships.map(friendship => {
      return friendship.user1Id === decoded.userId 
        ? friendship.user2 
        : friendship.user1;
    });

    return NextResponse.json({ friends });
  } catch (error) {
    console.error("Error fetching friends list:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
