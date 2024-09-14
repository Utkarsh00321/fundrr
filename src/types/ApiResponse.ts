import { IUser } from "@/models/User";
import { IIdea } from "@/models/Idea";
import { IComment } from "@/models/Comment";
import { ILike } from "@/models/Like";

export interface ApiResponse {
  success: boolean; // Whether the API call was successful
  message: string;
  status: number; // Message indicating success/failure reason
  user?: IUser; // Optional User object for user-related requests
  idea?: IIdea; // Optional Idea object for idea-related requests
  comment?: IComment; // Optional Comment object for comment-related requests
  like?: ILike; // Optional Like object for like-related requests
  users?: IUser[]; // Optional array of User objects (e.g., for listing users)
  ideas?: IIdea[]; // Optional array of Idea objects (e.g., for listing ideas)
  comments?: IComment[]; // Optional array of Comment objects (e.g., for listing comments)
  likes?: ILike[]; // Optional array of Like objects (e.g., for listing likes)
  isAuthenticated?: boolean; // Optional field to indicate authentication status
  isAuthorized?: boolean; // Optional field to indicate if the user is authorized for the action
}
