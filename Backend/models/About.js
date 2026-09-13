import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    heading: String,
    subheading: String,
    paragraph1: String,

    founder_message: String,
    founder_name: String,

    mission: String,
    vision: String,

    image_url: String,
    founder_image_url: String,
    home_image_url: String,

    is_active: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model("About", aboutSchema);