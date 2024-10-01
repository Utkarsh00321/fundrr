import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { NextRequest, NextResponse } from "next/server";
import Idea from "@/models/Idea";
import getServerSession from "next-auth";
import { Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { ideaId: string} },
) {
  await dbConnect();

  const session = (await getServerSession(authOptions)) as unknown as Session;
  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json({
      success: false,
      message: "User not authenticated",
      status: 401,
    });
  }

  const { ideaId} = params;
  const {commentId} = await request.json();

  try {
    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({
        success: false,
        message: "Comment not found",
        status: 404,
      });
    }

    // Ensure the comment belongs to the user making the request
    if (comment.user.toString() !== user._id) {
      return NextResponse.json({
        success: false,
        message: "You are not authorized to delete this comment",
        status: 403,
      });
    }

    // Delete the comment
    await comment.deleteOne();

    // Remove the reference 
    await Idea.findByIdAndUpdate(
        ideaId,
        { $pull: { comments: commentId } }, // Remove the commentId from the comments array
        { new: true, useFindAndModify: false }
    );
  

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error occurred while deleting comment: ", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete comment",
      status: 500,
    });
  }
}
