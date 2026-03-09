import Url from '../models/url.model.js';

export class UrlRepository {
  // Create a new shortened URL
  async create(urlData) {
    const url = new Url(urlData);
    await url.save();
    return url;
  }

  // Find URL by shortCode
  async findByShortCode(shortCode) {
    const url = await Url.findOne({ shortCode: shortCode.toUpperCase() });
    return url;
  }

  // Find URL by custom alias
  async findByCustomAlias(customAlias) {
    const url = await Url.findOne({ customAlias: customAlias.toLowerCase() });
    return url;
  }

  // Find URL by ID
  async findById(id) {
    const url = await Url.findById(id);
    return url;
  }

  // Find all URLs by user ID
  async findByUserId(userId, filters = {}) {
    const query = { userId };

    // Apply filters
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const urls = await Url.find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 50)
      .skip(filters.skip || 0);

    return urls;
  }

  // Count all URLs by user ID
  async countByUserId(userId) {
    const count = await Url.countDocuments({ userId });
    return count;
  }

  // Update URL by ID
  async updateById(id, updateData) {
    const url = await Url.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });
    return url;
  }

  // Increment click count
  async incrementClicks(id) {
    const url = await Url.findByIdAndUpdate(
      id,
      { $inc: { totalClicks: 1 } },
      { returnDocument: 'after' }
    );
    return url;
  }

  // Delete URL by ID
  async deleteById(id) {
    const url = await Url.findByIdAndDelete(id);
    return url;
  }

  // Deactivate URL by ID
  async deactivateById(id) {
    const url = await Url.findByIdAndUpdate(
      id,
      { isActive: false },
      { returnDocument: 'after' }
    );
    return url;
  }

  // Find active URLs by user
  async findActiveByUserId(userId) {
    const urls = await Url.find({
      userId,
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    }).sort({ createdAt: -1 });
    return urls;
  }
}
