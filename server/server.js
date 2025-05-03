import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';

import userRouter from './routes/userRouter.js';
import dotenv from 'dotenv';
dotenv.config()

const app = express();
const port = process.env.PORT || 4000;

await connectDB()

//allow multipleOrigins
const allowedOrigins = ['http://localhost:5173']

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))

app.get('/', (req, res) =>
    res.send("API is working")
)

app.use('/api/user',userRouter)

app.listen(port, () => {
    console.log(`server is running on Port ${port}`)
})