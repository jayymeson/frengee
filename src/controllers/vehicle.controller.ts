import { Request, Response } from "express";
import admin from "../config/firebase";
import { ListVehiclesUseCase } from "../usecase/listVehicle-usecase";
import { GetVehicleUseCase } from "../usecase/getVeichicle-usecase";
import { UpdateVehicleUseCase } from "../usecase/updateVechicle-usecase";
import { DeleteVehicleUseCase } from "../usecase/deleteVehicle-usecase";
import { VehicleRepository } from "../repositories/vehicle.repository";

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management
 */

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Retrieve a list of vehicles
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: A list of vehicles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 */

export class VehicleController {
  private listVehiclesUseCase: ListVehiclesUseCase;
  private getVehicleUseCase: GetVehicleUseCase;
  private updateVehicleUseCase: UpdateVehicleUseCase;
  private deleteVehicleUseCase: DeleteVehicleUseCase;

  constructor() {
    const vehicleRepository = new VehicleRepository();
    this.listVehiclesUseCase = new ListVehiclesUseCase(vehicleRepository);
    this.getVehicleUseCase = new GetVehicleUseCase(vehicleRepository);
    this.updateVehicleUseCase = new UpdateVehicleUseCase(vehicleRepository);
    this.deleteVehicleUseCase = new DeleteVehicleUseCase(vehicleRepository);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const vehicles = await this.listVehiclesUseCase.execute();
    res.json(vehicles);
  }

  /**
   * @swagger
   * /vehicles/{id}:
   *   get:
   *     summary: Get a vehicle by ID
   *     tags: [Vehicles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The vehicle ID
   *     responses:
   *       200:
   *         description: The vehicle description by ID.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Vehicle'
   *       404:
   *         description: Vehicle not found
   */

  async getById(req: Request, res: Response): Promise<void> {
    const vehicle = await this.getVehicleUseCase.execute(req.params.id);
    res.json(vehicle);
  }

  /**
   * @swagger
   * /vehicles:
   *   post:
   *     summary: Create a new vehicle
   *     tags: [Vehicles]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Vehicle'
   *     responses:
   *       201:
   *         description: The vehicle was successfully created.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Vehicle'
   *       400:
   *         description: Bad request
   */

  async create(req: Request, res: Response): Promise<void> {
    const vehicle = req.body;
    const newVehicle = await this.getVehicleUseCase.execute(vehicle);
    res.status(201).json(newVehicle);
  }

  /**
   * @swagger
   * /vehicles/{id}:
   *   put:
   *     summary: Update a vehicle by ID
   *     tags: [Vehicles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The vehicle ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Vehicle'
   *     responses:
   *       204:
   *         description: The vehicle was successfully updated.
   *       400:
   *         description: Bad request
   *       404:
   *         description: Vehicle not found
   */

  async update(req: Request, res: Response): Promise<void> {
    const vehicle = req.body;
    await this.updateVehicleUseCase.execute(req.params.id, vehicle);
    res.sendStatus(204);
  }

  /**
   * @swagger
   * /vehicles/{id}:
   *   delete:
   *     summary: Delete a vehicle by ID
   *     tags: [Vehicles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The vehicle ID
   *     responses:
   *       204:
   *         description: The vehicle was successfully deleted.
   *       404:
   *         description: Vehicle not found
   */

  async delete(req: Request, res: Response): Promise<void> {
    await this.deleteVehicleUseCase.execute(req.params.id);
    res.sendStatus(204);
  }

  /**
   * @swagger
   * /vehicles/upload:
   *   post:
   *     summary: Upload a vehicle file
   *     tags: [Vehicles]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: File uploaded successfully
   *       400:
   *         description: No file uploaded
   */

  async uploadFile(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    const bucket = admin.storage().bucket();
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res
        .status(200)
        .send({ fileName: req.file!.originalname, fileLocation: publicUrl });
    });

    blobStream.end(req.file.buffer);
  }
}
