import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';
import { corsOptions } from './config/corsOptions.js';
import authRoutes from './routes/auth.routes.js';
import { sendResponse } from './utils/response.js';
import { STATUS } from './constant/statusCodes.js';

const app = express();

app.use(express.json());
// Enable CORS
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  sendResponse(res, STATUS.OK, 'Server is healthy', {
    version: 'ClickTracker-1.0',
    ip: req.ip,
    healthy: true,
    requestedAt: new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
    }),
  });
});

app.use('/api/auth', authRoutes);

app.use(errorHandler);
export default app;
