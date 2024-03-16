import { StoreModel } from "../models/Store.js";

export const getStore = async (req, res) => {
	try {
		let store = await StoreModel.findOne({ _id: req.params.storeid });
		return res.json({
			responsecode: "200",
			result: store,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};
export const addStore = async (req, res) => {
	try {
		const { name, description } = req.body;
		let store = await StoreModel.findOne({ name });

		let fileName = "";
		if (req.file != null) {
			fileName = req.file.filename;
		}

		if (store) {
			return res.json({
				responsecode: "402",
				message: "This store is already added.",
			});
		}

		store = await new StoreModel({
			name,
			description,
			image: fileName,
		}).save();

		return res.json({
			responsecode: "200",
			message: "Store is successfully added.",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};

export const updateStore = async (req, res) => {
	try {
		const { name, description } = req.body;

		let fileName = "";
		if (req.file != null) {
			fileName = req.file.filename;
		}

		await StoreModel.updateOne(
			{ _id: req.params.storeid },
			{ $set: { name, description, image: fileName } }
		);

		return res.json({
			responsecode: "200",
			message: "Store is successfully updated.",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};

export const removeStore = async (req, res) => {
	try {
		const { storeid } = req.body;

		await StoreModel.deleteOne({ _id: storeid });

		return res.json({
			responsecode: "200",
			message: "Store is successfully remove.",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};
