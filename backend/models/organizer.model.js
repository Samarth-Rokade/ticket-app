import mongoose, { Schema } from "mongoose";


const organizerSchema = new Schema({

  eventsOrganized: [{
    type: Schema.Types.ObjectId,
    ref: "Event",
  }],
  bio: {
    type: String,
    trim: true,
  },
  socialLinks: {
    facebook: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
  },
  website: {
    type: String,
    trim: true,
  },

  username: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  avatar: {
    type: String, //cloudinary url
    // required:true
  }, //user will upload his profile photo here

  password: {
    type: String,
    required: [true, "Password is required"],
  },
  UPI_id: [{
    type: String,
    required: [true, "UPI ID is required"],
  }],
  refreshToken: {
    type: String,
  },
}, {
  timestamps: true
});

organizerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 7);
    next();
  } else {
    next();
  }
});

organizerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

organizerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
      address: this.address,
      phoneNo: this.phoneNo,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

organizerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};


export const Organizer = mongoose.model("Organizer", organizerSchema)