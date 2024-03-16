import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import { UsersRouter } from "./src/routes/Users.js";
import { StoreRouter } from "./src/routes/Store.js";
import { VendorsRouter } from "./src/routes/Vendor.js";

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use(express.json());
app.use("/user", UsersRouter);
app.use("/store", StoreRouter);
app.use("/vendor", VendorsRouter);

mongoose.connect(process.env.CONNECTION_STRING);

app.listen(process.env.PORT, () => {
	console.log("Server is running on port: " + process.env.PORT);
});
