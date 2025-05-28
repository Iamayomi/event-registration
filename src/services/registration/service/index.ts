import { EventService, eventService } from "../../event";
import { sendError } from "../../../library";
import { prisma } from "../../../prisma/client";

/** Registration service class. */
export class RegistrationService {
  protected eventService: EventService;

  constructor(private registrationModel = prisma.registration) {
    this.eventService = eventService;
  }

  /**
   * Register for an event
   * @returns Registration Document */
  public async registerForEvent(userId: string, eventId: string) {
    const event: any = await this.eventService.findEventById(eventId);

    const userEvent = await this.registrationModel.findFirst({ where: { eventId: event?.id, userId } });

    if (userEvent) sendError.badrequestError("This event has already been register by user");

    return await this.registrationModel.create({ data: { userId, eventId } });
  }

  /** Find all event register by user
   * @returns Register Document */
  public async findEventsRegisterByUser(id: string) {
    const registerEvent = await this.registrationModel.findMany({
      where: { userId: id },
      include: { event: true },
    });

    if (!registerEvent) sendError.notfoundError("User Register Event was not found");

    if (registerEvent.length < 0) sendError.badrequestError("Oops! It seems like User has not register for an event");

    return registerEvent;
  }

  /** Find Register event by id
   * @returns Register Document */
  public async findReigsterEventById(id: string) {
    return await this.registrationModel.findUnique({
      where: { id },
    });
  }

  /** Find event register by user
   * @returns Register Document */
  public async findEventRegisterByUser(id: string) {
    const registerEvent = await this.registrationModel.findFirst({
      where: { userId: id },
      include: { event: true },
    });

    if (!registerEvent) sendError.notfoundError("User Register Event was not found");

    return registerEvent;
  }

  /** Unregister Event user
   * @returns Register Document */
  public async unregisterEvent(registerId: string) {
    await this.registrationModel.delete({ where: { id: registerId } });

    return { success: true, message: "User unregister Event Successfully" };
  }
}
/**
 * Instance of the RegistrationService class used to handle user-related database queries
 * @instance {RegistrationService} */
export const registrationService = new RegistrationService();
