const mongoose = require("mongoose");

const teamSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "title is required"],
      trim: true,
    },
    email: {
      type: String,
      require: [true, "Plase add a email address"],
      unique: true,
      trim: true,
      match: [/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/, "Please enter a valid email"],
    },
    position: {
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

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
