const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "service title is required"],
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

    image: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("SErvice", serviceSchema);
module.exports = Service;
