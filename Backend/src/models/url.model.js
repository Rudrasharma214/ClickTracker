import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    longUrl: {
      type: String,
      required: [true, 'Long URL is required'],
      validate: {
        validator: function (value) {
          const urlRegex =
            /^(https?:\/\/)([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
          return urlRegex.test(value);
        },
        message: 'Invalid URL format',
      },
      trim: true,
    },
    shortCode: {
      type: String,
      required: [true, 'Short code is required'],
      unique: true,
      index: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    shortUrl: {
      type: String,
      trim: true,
    },
    customAlias: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          if (!value) return true;
          const aliasRegex = /^[a-zA-Z0-9-]{3,30}$/;
          return aliasRegex.test(value);
        },
        message:
          'Custom alias must be 3-30 characters and contain only alphanumeric characters and hyphens',
      },
    },
    totalClicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for active URLs by user
urlSchema.index({ userId: 1, isActive: 1 });

// Compound index for user's URLs ordered by creation
urlSchema.index({ userId: 1, createdAt: -1 });

// Pre-save hook to validate expiration
urlSchema.pre('save', function (next) {
  if (this.expiresAt && this.expiresAt < new Date()) {
    next(new Error('Expiration date must be in the future'));
  }
  next();
});

// Virtual to check if URL is expired
urlSchema.virtual('isExpired').get(function () {
  return this.expiresAt && this.expiresAt < new Date();
});

// Ensure virtuals are included in JSON output
urlSchema.set('toJSON', { virtuals: true });
urlSchema.set('toObject', { virtuals: true });

const Url = mongoose.model('Url', urlSchema);

export default Url;
