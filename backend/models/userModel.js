const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "full name is required"],
      trim: true,
    },
    email: {
      type: String,
      require: [true, "Plase add a email address"],
      unique: true,
      trim: true,
      match: [/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      require: [true, "plaesse add the pasword"],
      minLength: [8, "Password must be 8 character long"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

///encrypting the password befor saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  ///hasing the password
  const salt = await bcryptjs.genSalt(10);
  const hashPassword = await bcryptjs.hash(this.password, salt);
  this.password = hashPassword;
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
