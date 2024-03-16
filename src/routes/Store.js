import express from "express";
import {
	addStore,
	getStore,
	removeStore,
	updateStore,
} from "../controllers/Store.js";
import { MulterSetup } from "../helper/Multer.js";

const router = express.Router();

router.get("/:storeid", getStore);
router.post("/add", MulterSetup.single("file"), addStore);
router.post("/update/:storeid", MulterSetup.single("file"), updateStore);
router.post("/remove", removeStore);

export { router as StoreRouter };
