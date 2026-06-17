import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { applySecurityMiddleware } from './middleware/Security.middleware.js';



const app = express();
app.set("trust proxy", 1);

const allowedOrigins = [
  "https://varnikaorganics.com",
  "https://www.varnikaorganics.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
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
