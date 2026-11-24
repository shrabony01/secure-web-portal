import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    // Password is only required for local accounts (not GitHub OAuth users)
    password: {
      type: String,
      required: function () {
        return !this.githubId;
      },
      minlength: [6, "Password must be at least 6 characters long"],
    },
    // Stores GitHub profile ID for third-party OAuth users
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

// Hash plain-text password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) {
    return next();
  }

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Compare candidate password against hashed password during local login
userSchema.methods.isCorrectPassword = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

export default User;
