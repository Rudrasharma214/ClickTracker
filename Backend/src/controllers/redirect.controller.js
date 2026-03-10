import { sendErrorResponse } from '../utils/response.js';
import { STATUS } from '../constant/statusCodes.js';

export class RedirectController {
    constructor(redirectService) {
        this.redirectService = redirectService;
        this.handleRedirect = this.handleRedirect.bind(this);
    }

    async handleRedirect(req, res, next) {
        try {
            const { shortCode } = req.params;

            if (!shortCode) {
                sendErrorResponse(res, STATUS.BAD_REQUEST, 'Short code is required');
                return;
            }

            const result = await this.redirectService.handleRedirect(shortCode, req);

            if (!result.success) {
                sendErrorResponse(res, result.status, result.message);
                return;
            }

            res.redirect(301, result.data.longUrl);
        } catch (error) {
            next(error);
        }
    }
}
