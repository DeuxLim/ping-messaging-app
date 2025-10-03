import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		fullName: {
			type: String,
			index: true, // create index for faster search
		},
		userName: {
			type: String,
			unique: true,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		profilePicture: {
			type: String,
			default: null,
		},
		bio: {
			type: String,
			maxlength: 150,
			default: null,
		},
		isOnline: {
			type: Boolean,
			default: false,
		},
		lastSeen: {
			type: Date,
			default: null,
		},
		refreshToken: {
			type: String,
			default: null,
		},
		refreshTokenExpiresAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

// Keep fullname updated automatically
userSchema.pre("save", function (next) {
	this.fullName = `${this.firstName} ${this.lastName}`;
	next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err) {
		next(err);
	}
});

// Hide sensitive fields in JSON/Object
userSchema.set("toJSON", {
	transform: (doc, ret) => {
		delete ret.password;
		delete ret.__v;
		return ret;
	},
});

userSchema.set("toObject", {
	transform: (doc, ret) => {
		delete ret.password;
		delete ret.__v;
		return ret;
	},
});

// Compare password method
userSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

// Create a text index for searching fullName, userName, and email
userSchema.index({ fullName: "text", userName: "text", email: "text" });

const User = mongoose.model("User", userSchema);

export default User;
