import dbConnect from "@/lib/dbConnect";
import Idea from "@/models/Idea";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react"; // Import for user session

export async function POST(request: NextRequest) {
  // connect to db
  await dbConnect();

  try {
    const session = await getSession(); // Get the authenticated user session
    if (!session) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
        status: 401,
      });
    }

    const { title, description, goalAmount } = await request.json();

    // Validate input fields
    if (!title || !description || !goalAmount) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
        status: 400,
      });
    }

    // Create the new post with user ID
    const newPost = new Idea({
      title,
      description,
      goalAmount,
      creator: session.user.id, // Assuming session holds user's ID
    });

    await newPost.save();
    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      status: 200,
    });
  } catch (error) {
    console.log("Error occurred in adding the post: ", error);
    return NextResponse.json({
      success: false,
      message: "Failed to add the post",
      status: 500,
    });
  }
}
