import { Request, Response } from "express";
import admin from "../config/firebase";
import { ListVehiclesUseCase } from "../usecase/listVehicle-usecase";
import { GetVehicleUseCase } from "../usecase/getVeichicle-usecase";
import { UpdateVehicleUseCase } from "../usecase/updateVechicle-usecase";
import { DeleteVehicleUseCase } from "../usecase/deleteVehicle-usecase";
import { CreateVehicleUseCase } from "../usecase/createVehicle-usecase";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { CreateVehicleDTO } from "../dto/createVehicle.dto";
import { vehicleSchema } from "../schema/vehicle.schema";

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management
 */

export class VehicleController {
  private listVehiclesUseCase: ListVehiclesUseCase;
  private getVehicleUseCase: GetVehicleUseCase;
  private updateVehicleUseCase: UpdateVehicleUseCase;
  private deleteVehicleUseCase: DeleteVehicleUseCase;
  private createVehicleUseCase: CreateVehicleUseCase;

  constructor() {
    const vehicleRepository = new VehicleRepository();
    this.listVehiclesUseCase = new ListVehiclesUseCase(vehicleRepository);
    this.getVehicleUseCase = new GetVehicleUseCase(vehicleRepository);
    this.updateVehicleUseCase = new UpdateVehicleUseCase(vehicleRepository);
    this.deleteVehicleUseCase = new DeleteVehicleUseCase(vehicleRepository);
    this.createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
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
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               make:
   *                 type: string
   *               model:
   *                 type: string
   *               year:
   *                 type: number
   *               imageUrl:
   *                 type: string
   *                 format: binary
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

  public async create(req: Request, res: Response): Promise<void> {
    const { error } = vehicleSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res
        .status(400)
        .json({ errors: error.details.map((detail) => detail.message) });
      return;
    }

    const vehicleDTO: CreateVehicleDTO = {
      make: req.body.make,
      model: req.body.model,
      year: Number(req.body.year),
      imageUrl: "",
    };

    try {
      if (!req.file) {
        throw new Error("No file uploaded.");
      }

      const newVehicle = await this.createVehicleUseCase.execute(
        vehicleDTO,
        req.file
      );
      res.status(201).json(newVehicle);
    } catch (err: any) {
      console.error("Error creating vehicle:", err);
      res.status(400).send({ message: err.message });
    }
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
    // Validate request body using Joi schema
    const { error } = vehicleSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res
        .status(400)
        .json({ errors: error.details.map((detail) => detail.message) });
      return;
    }

    const vehicleData = req.body;
    await this.updateVehicleUseCase.execute(req.params.id, vehicleData);
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
