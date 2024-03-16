import { VendorModel } from "../models/Vendor.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import EmailSender from "../helper/EmailSender.js";

import {
	VerificationTokenModel,
	ResetPassTokenModel,
} from "../models/Token.js";

export const addVendor = async (req, res) => {
	try {
		const { email, password } = req.body;

		let vendor = await VendorModel.findOne({
			storeid: req.params.storeid,
			email,
		});
		if (vendor) {
			return res.json({
				responsecode: "402",
				message: "This email is already registered.",
			});
		}

		const hashPassword = await bcrypt.hash(
			password,
			parseInt(process.env.SALT)
		);
		vendor = await new VendorModel({
			storeID: req.params.storeid,
			email,
			password: hashPassword,
		}).save();
		const token = await new VerificationTokenModel({
			userID: vendor._id,
			token: jwt.sign({ id: vendor._id }, process.env.SECRET_KEY),
		}).save();

		const emailURL = `${process.env.CLIENT_URL}/auth/${vendor._id}/verify/${token.token}`;
		await EmailSender(
			vendor.email,
			"Email Verification",
			`Hi there, \n You have set ${vendor.email} as your registered email. Please click the link to verify your email: ` +
				emailURL
		);
		return res.json({
			responsecode: "200",
			message: "Successfully registered.",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};

export const verifyEmail = async (req, res) => {
	try {
		let vendorID = "";
		let vendor = await VendorModel.findOne({ _id: req.params.id });
		if (!vendor) return res.json({ message: "Invalid link." });

		let token = await VerificationTokenModel.findOne({
			userID: vendor._id,
			token: req.params.token,
		});

		if (!token) return res.json({ message: "Invalid link." });
		vendorID = vendor._id;
		vendor = await VendorModel.updateOne(
			{ _id: vendor._id },
			{ $set: { verified: true } }
		);

		await VerificationTokenModel.deleteMany({ userID: vendorID });

		res.json({ message: "Email successfully verified." });
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.send({ message: "Please contact technical support." });
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		let vendor = await VendorModel.findOne({ email });

		if (!vendor) {
			return res.json({
				responsecode: "402",
				message: "This email is not registered.",
			});
		}

		let checkToken = await ResetPassTokenModel.findOne({ userID: vendor._id });
		if (checkToken) {
			return res.json({
				responsecode: "402",
				message: "Please check your email.",
			});
		}

		const token = await new ResetPassTokenModel({
			userID: vendor._id,
			token: jwt.sign({ id: vendor._id }, process.env.SECRET_KEY),
		}).save();

		const emailURL = `${process.env.CLIENT_URL}/${vendor._id}/reset/${token.token}`;
		await EmailSender(
			vendor.email,
			"Reset Password",
			`Hi there, \n We've received your request to reset your password. Please click the link to verify your email: ` +
				emailURL
		);
		return res.json({
			responsecode: "200",
			message: "Reset password request sent.",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { password } = req.body;
		const hashPassword = await bcrypt.hash(
			password,
			parseInt(process.env.SALT)
		);

		const vendor = await VendorModel.findOne({ _id: req.params.id });
		if (!vendor)
			return res.json({ responsecode: "402", message: "Invalid link." });

		const token = await ResetPassTokenModel.findOne({
			userID: vendor._id,
			token: req.params.token,
		});

		if (!token)
			return res.json({ responsecode: "402", message: "Invalid link." });

		await VendorModel.updateOne({
			_id: vendor._id,
			password: hashPassword,
		});
		await ResetPassTokenModel.deleteMany({ userID: vendor._id });

		res.json({
			responsecode: "200",
			message: "Password successfully changed.",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const vendor = await VendorModel.findOne({ email });

		if (!vendor) {
			return res.json({
				message: "This vendor is not registered.",
				responsecode: "402",
			});
		}

		const isValidatePassword = await bcrypt.compare(password, vendor.password);

		if (!isValidatePassword) {
			return res.json({
				message: "Incorrect email or password. Please try again.",
				responsecode: "402",
			});
		}

		const token = jwt.sign({ id: vendor._id }, process.env.SECRET_KEY);
		res.json({
			responsecode: "200",
			message: "Successfully Login!",
			token,
			userID: vendor._id,
			storeID: vendor.storeID,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};
