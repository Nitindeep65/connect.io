import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req){
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if(!token){
        return NextResponse.json({message:"unauthorized"}, {status: 401})
    }
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    const {receiverId}= await req.json();

    if(!receiverId){
        return NextResponse.json({message:"Receiver ID is required"}, {status: 400})
    } 
    await prisma.friendRequest.create({
    data: {
      senderId: decoded.userId,
      receiverId,
    },
  });
    return NextResponse.json({message:"Friend request sent successfully"});

}