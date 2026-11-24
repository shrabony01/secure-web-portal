import { Schema, model } from "mongoose";

const bookmarkSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Bookmark title is required"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Bookmark URL is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    // Links each bookmark strictly to the authenticated User who created it
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Bookmark = model("Bookmark", bookmarkSchema);

export default Bookmark;
