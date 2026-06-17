import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { applySecurityMiddleware } from './middleware/Security.middleware.js';



const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
applySecurityMiddleware(app);


app.get('/', (req ,res)=>{
    res.status(200).json({
        message: "Cart services is Running"
    })
})


import cartRoutes from './routes/cart.route.js'
import { globalErrorHandler } from './utils/error.utils.js';
app.use('/api/cart', cartRoutes)

app.use(globalErrorHandler);

export default app;
