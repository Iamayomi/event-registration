import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getAllEvents = async (req: Request, res: Response) => {
  const events = await prisma.event.findMany();
  res.json(events);
};

export const getEventById = async (req: Request, res: Response) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
};

export const createEvent = async (req: Request, res: Response) => {
  const { title, desc, date, capacity } = req.body;
  const event = await prisma.event.create({ data: { title, desc, date: new Date(date), capacity } });
  res.status(201).json(event);
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, desc, date, capacity } = req.body;
  const event = await prisma.event.update({ where: { id }, data: { title, desc, date: new Date(date), capacity } });
  res.json(event);
};

export const deleteEvent = async (req: Request, res: Response) => {
  await prisma.event.delete({ where: { id: req.params.id } });
  res.status(204).send();
};
