import { Prisma } from "@prisma/client";
import { sendError } from "../../../library";
import { prisma } from "../../../prisma/client";

/** Event service class. */
export class EventService {
  constructor(private eventModel = prisma.event) {}

  /** Create an event
   * @returns Event Document */
  public async createEvent(data: any) {
    return await this.eventModel.create({ data });
  }

  /** Find all events by id
   * @returns Event Document */

  public async findAllEvents(query?: Record<string, any>) {
    const { sort, title, description, startDate, endDate, minCapacity, includeRegistrations = false, maxCapacity } = query || {};

    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;

    if (query?.page < 1 || query?.limit < 1) sendError.BadRequestError("'limit' or 'page' query params must be positive numbers");

    const skip = (page - 1) * limit;

    // Sorting
    let orderBy: Prisma.EventOrderByWithRelationInput = { createdAt: "desc" };

    if (sort) {
      const [field, direction] = sort.split(":");
      orderBy = { [field]: direction === "asc" ? "asc" : "desc" };
    }

    const where: Prisma.EventWhereInput = {};

    // String search (case-insensitive partial matches)
    if (title) {
      where.title = {
        contains: String(title),
        mode: "insensitive",
      };
    }
    if (description) {
      where.description = {
        contains: String(description),
        mode: "insensitive",
      };
    }

    // Date range filter
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(String(startDate));
      }
      if (endDate) {
        where.date.lte = new Date(String(endDate));
      }
    }

    // Capacity range filter
    if (minCapacity || maxCapacity) {
      where.capacity = {};
      if (minCapacity) {
        where.capacity.gte = Number(minCapacity);
      }
      if (maxCapacity) {
        where.capacity.lte = Number(maxCapacity);
      }
    }

    // Execute Prisma query
    const events = await prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }, // Sort by newest first
      include: includeRegistrations ? { registrations: { include: { user: true } } } : undefined,
    });

    const total = await this.eventModel.count({ where });

    return {
      data: events,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /** Find an event by id
   * @returns Event Document */
  public async findEventById(id: string) {
    return await this.eventModel.findUnique({ where: { id } });
  }

  /** Updates an event
   * @returns Event Document */
  public async updateEvent(id: string, payload: any) {
    return await this.eventModel.update({
      where: { id },
      data: {
        ...payload,
      },
    });
  }

  /** Delete an event by id */
  public async delEvent(id: string) {
    await this.eventModel.delete({ where: { id } });
  }
}

/**
 * Instance of the EventService class used to handle user-related database queries
 * @instance {EventService} */
export const eventService = new EventService();
