import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    const currentUserId = decoded.userId;

    if (userId) {

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          createdAt: true,
          // Don't expose sensitive information
        },
      });

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      // Check if they are friends to determine what info to show
      const friendship = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: userId, status: "accepted" },
            { senderId: userId, receiverId: currentUserId, status: "accepted" },
          ],
        },
      });

      const isFriend = !!friendship;

      return NextResponse.json({
        user: {
          ...user,
          isFriend,
        },
      });
    } else {
      // Get current user's full profile
      const user = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      });

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

     
      const [sentRequests, receivedRequests, friends] = await Promise.all([
        prisma.friendRequest.count({
          where: { senderId: currentUserId, status: "pending" },
        }),
        prisma.friendRequest.count({
          where: { receiverId: currentUserId, status: "pending" },
        }),
        prisma.friendRequest.count({
          where: {
            OR: [
              { senderId: currentUserId, status: "accepted" },
              { receiverId: currentUserId, status: "accepted" },
            ],
          },
        }),
      ]);

      return NextResponse.json({
        user: {
          ...user,
          stats: {
            friendsCount: friends,
            pendingRequestsSent: sentRequests,
            pendingRequestsReceived: receivedRequests,
          },
        },
      });
    }
  } catch (error) {
    console.error("User API GET Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    const userId = decoded.userId;

    const body = await req.json();
    const { name, username, email, currentPassword, newPassword } = body;

    // Validate input
    if (!name && !username && !email && !newPassword) {
      return NextResponse.json(
        { message: "At least one field must be provided for update" },
        { status: 400 }
      );
    }

    // Check if username/email already exists (if being updated)
    if (username || email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } }, // Not current user
            {
              OR: [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : []),
              ],
            },
          ],
        },
      });

      if (existingUser) {
        const field = existingUser.username === username ? "username" : "email";
        return NextResponse.json(
          { message: `${field} already taken` },
          { status: 409 }
        );
      }
    }


    let hashedPassword: string | undefined;
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: "Current password required to change password" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });

      if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(email && { email }),
        ...(hashedPassword && { password: hashedPassword }),
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("User API PUT Error:", error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    const userId = decoded.userId;

    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { message: "Password required to delete account" },
        { status: 400 }
      );
    }

    // Verify password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 400 }
      );
    }

    // Delete user and related data (cascading deletes handled by Prisma)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("User API DELETE Error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
