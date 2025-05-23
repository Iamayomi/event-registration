import { Request, Response } from "express";
import prisma from "../prisma/client";

export const registerForEvent = async (req: any, res: Response) => {
  const userId = req.user.id;
  const { eventId } = req.params;

  const existing = await prisma.registration.findFirst({ where: { userId, eventId } });
  if (existing) return res.status(400).json({ error: "Already registered" });

  const registration = await prisma.registration.create({ data: { userId, eventId } });
  res.status(201).json(registration);
};

export const unregisterFromEvent = async (req: any, res: Response) => {
  const userId = req.user.id;
  const { eventId } = req.params;

  await prisma.registration.deleteMany({ where: { userId, eventId } });
  res.status(204).send();
};

export const getUserRegistrations = async (req: any, res: Response) => {
  const registrations = await prisma.registration.findMany({
    where: { userId: req.user.id },
    include: { event: true },
  });
  res.json(registrations);
};
