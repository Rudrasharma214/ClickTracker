import Url from '../models/url.model.js';
import UrlClick from '../models/urlClick.model.js';

export class RedirectRepository {
  // Find URL by shortCode
  async findByShortCode(shortCode) {
    return Url.findOne({ shortCode: shortCode.toUpperCase() });
  }

  // Find URL by custom alias
  async findByCustomAlias(customAlias) {
    return Url.findOne({ customAlias: customAlias.toLowerCase() });
  }

  // Increment click count on URL
  async incrementClicks(id) {
    return Url.findByIdAndUpdate(id, { $inc: { totalClicks: 1 } }, { returnDocument: 'after' });
  }

  // Save a click tracking document
  async saveClick(clickData) {
    const click = new UrlClick(clickData);
    await click.save();
    return click;
  }
}
