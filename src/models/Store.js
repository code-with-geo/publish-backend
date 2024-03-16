import mongoose from "mongoose";

const StoreSchema = mongoose.Schema({
	storeID: { type: String, required: true, unique: true },
	name: { type: String, required: true, unique: true },
	description: { type: String, required: true },
	image: { type: String, default: "" },
	price: { type: Number, default: 0 },
	units: { type: Number, default: 0 },
});

StoreSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

StoreSchema.set("toJSON", {
	virtual: true,
});

export const StoreModel = mongoose.model("stores", StoreSchema);
