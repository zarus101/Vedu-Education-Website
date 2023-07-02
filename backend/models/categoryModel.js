const mongoose = require("mongoose");

const CategroySchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "name is required"],
    },
    description: {
      type: String,
      require: [true, "description is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", CategroySchema);

module.exports = Category
