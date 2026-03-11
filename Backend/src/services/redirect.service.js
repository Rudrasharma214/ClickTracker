import crypto from 'node:crypto';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';
import { STATUS } from '../constant/statusCodes.js';
import { RedirectRepository } from '../repositories/redirect.repository.js';

const redirectRepo = new RedirectRepository();

export class RedirectService {
    // Handle redirect: resolve URL, track click, return original URL
    async handleRedirect(shortCode, req) {
        try {
            // Find the URL by shortCode or customAlias
            let url = await redirectRepo.findByShortCode(shortCode);
            if (!url) {
                url = await redirectRepo.findByCustomAlias(shortCode);
            }

            if (!url) {
                return {
                    success: false,
                    status: STATUS.NOT_FOUND,
                    message: 'URL not found',
                };
            }

            if (!url.isActive) {
                return {
                    success: false,
                    status: STATUS.GONE,
                    message: 'This URL has been deactivated',
                };
            }

            if (url.isExpired) {
                return {
                    success: false,
                    status: STATUS.GONE,
                    message: 'This URL has expired',
                };
            }

            // Extract all metadata from the request
            const clickData = this._extractClickData(req, url);

            // Save click and increment count in parallel
            await Promise.all([redirectRepo.saveClick(clickData), redirectRepo.incrementClicks(url._id)]);

            return {
                success: true,
                status: STATUS.OK,
                data: { longUrl: url.longUrl },
            };
        } catch (error) {
            return {
                success: false,
                status: STATUS.INTERNAL_ERROR,
                message: 'Error processing redirect',
                error: error.message,
            };
        }
    }

    // Extract all click metadata from the HTTP request
    _extractClickData(req, url) {
        const ipAddress = this._getIpAddress(req);
        const userAgent = req.headers['user-agent'] || '';
        const referrer = req.headers['referer'] || req.headers['referrer'] || 'direct';

        // Parse device info
        const parser = new UAParser(userAgent);
        const uaResult = parser.getResult();
        const deviceType = this._getDeviceType(uaResult.device?.type);
        const browser = uaResult.browser?.name || 'unknown';
        const os = uaResult.os?.name || 'unknown';

        // Get geo location from IP
        const geo = geoip.lookup(ipAddress);
        const country = geo?.country || '';
        const region = geo?.region || '';
        const city = geo?.city || '';

        // Generate session hash: sha256(ip + userAgent)
        const sessionHash = crypto
            .createHash('sha256')
            .update(ipAddress + userAgent)
            .digest('hex');

        return {
            urlId: url._id,
            userId: url.userId,
            ipAddress,
            country,
            region,
            city,
            deviceType,
            browser,
            os,
            userAgent,
            referrer,
            sessionHash,
            clickedAt: new Date(),
        };
    }

    // Get client IP from proxy headers or socket
    _getIpAddress(req) {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            // Take the first IP in the comma-separated list
            return forwarded.split(',')[0].trim();
        }
        return req.socket?.remoteAddress || '';
    }

    // Map ua-parser-js device type to model enum
    _getDeviceType(type) {
        if (!type) return 'desktop'; // ua-parser-js returns undefined for desktop
        const mapping = {
            mobile: 'mobile',
            tablet: 'tablet',
        };
        return mapping[type] || 'unknown';
    }
}
