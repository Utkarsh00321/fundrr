import dbConnect from "@/lib/dbConnect";
import Idea from "@/models/Idea";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    // Fetch all posts from the Idea model
    // Get query parameters from the request URL
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10); // default to page 1
    const limit = parseInt(url.searchParams.get("limit") || "10", 10); // default to 10 posts per page

    // Calculate the pagination values
    const skip = (page - 1) * limit;

    // Fetch posts with pagination
    const allPosts = await Idea.find({}).skip(skip).limit(limit);

    // Get total count of posts for pagination metadata
    const totalPosts = await Idea.countDocuments();

    return NextResponse.json({
      success: true,
      message: "Fetched posts successfully",
      data: allPosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts: totalPosts,
        limit: limit,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error occurred while fetching posts: ", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch posts",
      status: 500,
    });
  }
}
