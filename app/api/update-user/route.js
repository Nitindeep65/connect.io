import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = auth.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { name } = await req.json();

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { name },
    });

    return NextResponse.json({ message: "Name updated successfully" });
  } catch{
    return NextResponse.json({ message: "Error updating name" }, { status: 500 });
  }
}
