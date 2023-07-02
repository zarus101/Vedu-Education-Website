const mongoose = require("mongoose");

const careerSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Please add a title"],
      trime: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    salary: {
      type: String,
      require: [true, "Please add a salary"],
      trime: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trime: true,
    },
    image: {
      type: Object,
      default: {},
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Category",
    },
  },
  { timestamps: true }
);
const Career = mongoose.model("Career", careerSchema);
module.exports = Career;
