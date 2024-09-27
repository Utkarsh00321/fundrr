import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import getServerSession from "next-auth";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  await dbConnect();

  // get sesssion from server
  const session = (await getServerSession(authOptions)) as unknown as Session;

  // session or user unavailable
  if (!session) {
    return NextResponse.json({
      success: false,
      message: "User not authenticated",
      status: 401,
    });
  }

  try {
    // extract user id from session
    const { userId } = params;

    // find all the posts from posts array of user and populate.
    const getUser = await User.findById(userId).populate("ideas").exec();

    // user not found
    if (!getUser) {
      return NextResponse.json({
        message: "User not found",
        success: false,
        status: 404,
      });
    }

    // user found but no posts
    if (getUser.ideas.length === 0) {
      return NextResponse.json({
        message: "No posts for this user.",
        success: true,
        status: 200,
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      message: "All the posts from user fetched successfully.",
      data: getUser.ideas,
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
