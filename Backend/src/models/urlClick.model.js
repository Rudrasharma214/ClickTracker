import mongoose from 'mongoose';

const urlClickSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url',
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    ipAddress: {
      type: String,
      required: true,
    },

    country: {
      type: String,
    },

    region: {
      type: String,
    },

    city: {
      type: String,
    },

    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'unknown'],
      default: 'unknown',
      index: true,
    },

    browser: {
      type: String,
      index: true,
    },

    os: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    referrer: {
      type: String,
      default: 'direct',
    },

    sessionHash: {
      type: String,
      index: true,
    },

    clickedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

urlClickSchema.index({ urlId: 1, clickedAt: -1 });
urlClickSchema.index({ userId: 1, clickedAt: -1 });
urlClickSchema.index({ country: 1 });

const UrlClick = mongoose.model('UrlClick', urlClickSchema);

export default UrlClick;
