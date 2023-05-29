const mongoose = require("mongoose");

const countrySchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "country name is required"],
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

const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
