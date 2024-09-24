import dbConnect from "@/lib/dbConnect";
import Idea from "@/models/Idea";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import User from "@/models/User"; // Assuming User model is here
import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth"; // Correct import for `getServerSession`
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; // Adjust the path to your auth options
import { Session } from "next-auth"; // Import the Session interface

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Connect to the database
  await dbConnect();
  // Get user session (ensure the session has the correct type)
  const session = (await getServerSession(authOptions)) as unknown as Session;

  // Check if the session and user exist (user property should be accessed safely)
  if (!session || !session.user) {
    return NextResponse.json({
      success: false,
      message: "User not authenticated",
      status: 401,
    });
  }

  try {
    // Get the post ID from the URL parameters
    const { id } = params;

    // Find the post by ID
    const post = await Idea.findById(id);

    if (!post) {
      return NextResponse.json({
        success: false,
        message: "Post not found",
        status: 404,
      });
    }

    // Check if the logged-in user is the owner of the post
    if (post.owner.toString() !== session.user._id) {
      return NextResponse.json({
        success: false,
        message: "You are not authorized to delete this post",
        status: 403,
      });
    }

    // Cascade delete: Remove related comments and likes
    await Comment.deleteMany({ idea: id });
    await Like.deleteMany({ idea: id });

    // Remove the post ID from the user's posts array
    await User.updateOne(
      { _id: session.user._id }, // Corrected access to the user ID
      { $pull: { ideas: id } }, // Remove the post ID from the user's posts array
    );

    // Delete the post
    await post.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Post and related data deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error occurred while deleting post: ", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete post",
      status: 500,
    });
  }
}
