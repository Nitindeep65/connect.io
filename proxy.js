import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default function proxy(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/me"],
};
