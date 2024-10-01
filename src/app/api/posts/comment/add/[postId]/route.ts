import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { NextRequest, NextResponse } from "next/server";
import Idea from "@/models/Idea";
import getServerSession from "next-auth";
import { Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(
  request: NextRequest,
  { params }: { params: { ideaId: string } },
) {
  await dbConnect();

  const session = (await getServerSession(authOptions)) as unknown as Session;
  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json({
      message: "User not authenticated",
      success: false,
      status: 401,
    });
  }

  try {
    // extract ideaId and content of comment from the request
    const { content } = await request.json();

    const { ideaId } = params;

    // extract userid from the user
    const userId = user._id;

    // Check if the idea exists
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return NextResponse.json({
        message: "Idea not found",
        success: false,
        status: 404,
      });
    }

    // create new comment
    const newComment = new Comment({
      content,
      idea: ideaId,
      user: userId,
    });

    // save new comment
    const savedComment = await newComment.save();

    // update idea accordingly
    await Idea.findByIdAndUpdate(
      ideaId,
      {
        $push: { comments: savedComment._id },
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );

    return NextResponse.json({
      success: true,
      message: "Comment added successfully.",
      status: 200,
      data: savedComment,
    });
  } catch (error) {
    console.log("Some error occured while adding the comment", error);
    return NextResponse.json({
      success: false,
      message: "Failed to add the comment",
      status: 500,
    });
  }
}
