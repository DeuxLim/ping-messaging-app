import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  // only hash if password is new or modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // 10 = cost factor
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Add method to compare plain password with hashed one
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;