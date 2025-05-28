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

    if (event.date > new Date()) sendError.badrequestError("This event has already been closed");

    if (event._count.registrations >= event.capacity) sendError.badrequestError("Event is fully booked");

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

  /** Updates user password
   * @returns User Document */
  //   public async updateUserPassword(id: string, val: string) {
  //     return this.registrationModel.update({
  //       where: { id },
  //       data: {
  //         password: val,
  //       },
  //     });
  //   }

  /** Updates user email status
   * @returns User Document */
  //   public async updateEmailStatus(email: string, val: boolean) {
  //     return this.registrationModel.update({
  //       where: { email },
  //       data: {
  //         isEmailVerified: val,
  //       },
  //     });
  //   }

  // public async delUser(id: string) {
  //   return this.registrationModel.delete({ where: { id } });
  // }
}

/**
 * Instance of the RegistrationService class used to handle user-related database queries
 * @instance {RegistrationService} */
export const registrationService = new RegistrationService();
