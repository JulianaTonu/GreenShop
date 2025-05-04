import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';

import userRouter from './routes/userRouter.js';
import dotenv from 'dotenv';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
dotenv.config()

const app = express();
const port = process.env.PORT || 4000;

await connectDB()
await connectCloudinary()

//allow multipleOrigins
const allowedOrigins = ['http://localhost:5173']

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))

app.get('/', (req, res) =>
    res.send("API is working")
)
app.use((req, res, next) => {
    console.log("Received cookies:", req.cookies);
    next();
  });
  
app.use('/api/user',userRouter)
app.use('api/seller',sellerRouter)
app.use('api/product',productRouter)

app.listen(port, () => {
    console.log(`server is running on Port ${port}`)
})