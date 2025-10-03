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
			type: String, // URL to uploaded image
			default: null,
		},
		bio: {
			type: String,
			maxlength: 150, // Short status like "Hey there! I'm using Messenger"
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

userSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
