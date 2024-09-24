import dbConnect from "@/lib/dbConnect";
import Idea from "@/models/Idea";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"; // Adjust this path
import { Session } from "next-auth";

export async function POST(request: NextRequest) {
  await dbConnect();

  // Get the authenticated user's session
  const session = (await getServerSession(authOptions)) as unknown as Session;

  if (!session || !session.user) {
    return NextResponse.json({
      success: false,
      message: "User not authenticated",
      status: 401,
    });
  }

  try {
    // Parse the request body
    const { title, description, goalAmount } = await request.json();

    // Validate the required fields
    if (!title || !description || !goalAmount) {
      return NextResponse.json({
        success: false,
        message: "All fields (title, description, goalAmount) are required",
        status: 400,
      });
    }

    // Create a new post
    const newPost = new Idea({
      title: title,
      description: description,
      goalAmount: goalAmount,
      owner: session.user._id, // Associate the post with the authenticated user
    });

    // Save the post to the database
    const savedPost = await newPost.save();

    // Add the post ID to the user's posts array
    await User.updateOne(
      { _id: session.user._id },
      { $push: { posts: savedPost._id } },
    );

    // Return a successful response
    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      status: 201,
      post: savedPost, // Optionally return the created post
    });
  } catch (error) {
    console.error("Error occurred while creating post: ", error);
    return NextResponse.json({
      success: false,
      message: "Failed to create post",
      status: 500,
    });
  }
}
