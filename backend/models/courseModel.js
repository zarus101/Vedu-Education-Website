const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "course title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      require: [true, "description is required"],
      trim: true,
    },
    description1: {
      type: String,
      require: [true, "this is required"],
      trim: true,
    },
    description2: {
      type: String,
      require: [true, "this is required"],
      trim: true,
    },
    image:{
        type: Object,
        default:{}
    }
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
