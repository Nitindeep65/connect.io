import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = auth.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary using Promise wrapper
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        dataURI,
        { folder: "profile_pics" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Save URL in Prisma
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        image: result.secure_url,
      },
    });

    return NextResponse.json({ 
      message: "Upload successful", 
      url: result.secure_url,
      image: result.secure_url
    });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ 
      message: "Server error", 
      error: err.message 
    }, { status: 500 });
  }
}
