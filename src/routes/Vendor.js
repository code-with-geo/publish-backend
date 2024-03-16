import express from "express";
import {
	addVendor,
	forgotPassword,
	resetPassword,
	verifyEmail,
	login,
} from "../controllers/Vendor.js";

const router = express.Router();

router.post("/add/:storeid", addVendor);
router.get("/:id/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/:id/reset/:token", resetPassword);

export { router as VendorsRouter };
