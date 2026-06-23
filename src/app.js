import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { applySecurityMiddleware } from './middleware/Security.middleware.js';



const app = express();
app.set("trust proxy", 1);

const buildCookieVariants = () => {
  const variants = [];

  if (process.env.COOKIE_DOMAIN) {
    variants.push({
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
    });
    variants.push({
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
    });
  }

  return variants;
};

app.locals.cookieVariants = buildCookieVariants();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "https://varnikaorganics.com",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked origin: " + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
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
