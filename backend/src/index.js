import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"
import { connectDB } from "./utils/db.js";
import cookieParser from "cookie-parser";
import hotelRoutes from "./routes/hotel.routes.js";
import roomRoutes from "./routes/room.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.set('trust proxy', 1);

app.use(cors({
  origin: ['http://localhost:3000','https://hotel-management-react.netlify.app'],
  credentials: true, // allow cookies/auth headers
}));

const PORT = process.env.PORT || 5001;

//routes

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/hotel',hotelRoutes);
app.use('/api/v1/room',roomRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/bookings',bookingRoutes)




connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to DB:', error);
  });