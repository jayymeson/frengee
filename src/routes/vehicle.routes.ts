import { Router } from "express";
import multer from "multer";
import { VehicleController } from "../controllers/vehicle.controller";
import { authenticateJWT } from "../auth/auth.middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const vehicleController = new VehicleController();

router.get("/vehicles", authenticateJWT, (req, res) =>
  vehicleController.getAll(req, res)
);
router.get("/vehicles/:id", authenticateJWT, (req, res) =>
  vehicleController.getById(req, res)
);
router.post(
  "/vehicles",
  authenticateJWT,
  upload.single("imageUrl"),
  (req, res) => vehicleController.create(req, res)
);
router.put(
  "/vehicles/:id",
  authenticateJWT,
  upload.single("imageUrl"),
  (req, res) => vehicleController.update(req, res)
);
router.delete("/vehicles/:id", authenticateJWT, (req, res) =>
  vehicleController.delete(req, res)
);

export default router;
