import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postsSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: "",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
    },
  ],
  category: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

const Posts = mongoose.model("Posts", postsSchema);

export default Posts;
