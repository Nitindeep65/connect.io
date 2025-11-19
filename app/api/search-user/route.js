import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET);

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
      },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("ERROR SEARCH USER:", err);
    return NextResponse.json(
      { message: "Server Error", error: err.message },
      { status: 500 }
    );
  }
}
