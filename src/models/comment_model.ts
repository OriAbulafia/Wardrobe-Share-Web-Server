import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    content: {
        type: String,
        required: true,
    },
});

const Comments = mongoose.model("Comments", commentsSchema);

export default Comments;