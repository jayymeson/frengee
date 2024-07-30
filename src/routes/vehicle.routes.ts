import { Router } from "express";
import multer from "multer";
import { VehicleController } from "../controllers/vehicle.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const vehicleController = new VehicleController();

router.get("/vehicles", (req, res) => vehicleController.getAll(req, res));
router.get("/vehicles/:id", (req, res) => vehicleController.getById(req, res));
router.post("/vehicles", upload.single("imageUrl"), (req, res) =>
  vehicleController.create(req, res)
);
router.put("/vehicles/:id", upload.single("imageUrl"), (req, res) =>
  vehicleController.update(req, res)
);
router.delete("/vehicles/:id", (req, res) =>
  vehicleController.delete(req, res)
);
router.post("/vehicles/upload", upload.single("file"), (req, res) =>
  vehicleController.uploadFile(req, res)
);

export default router;
