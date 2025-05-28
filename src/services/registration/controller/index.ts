import { Response } from "express";
import { StatusCodes as status } from "http-status-codes";
import { CustomRequest, Email, eventRegistrationTemplate, sendError } from "../../../library";
import { RegistrationService, registrationService } from "../service";
import { UserService, userService } from "../../user";
import { EventService, eventService } from "../../event";

class RegisterController {
  protected service: RegistrationService;
  protected userService: UserService;
  protected eventService: EventService;
  protected mail: Email;

  constructor() {
    this.userService = userService;
    this.eventService = eventService;
    this.service = registrationService;
    this.mail = new Email();
  }

  /**
   *  Handle create a new event request
   * @route {POST} /api/v1/register/:eventId
   * @access public
   */
  public registerForEvent = async (req: CustomRequest, res: Response) => {
    const userId = req.user?.id as string;

    const eventId = req.params.eventId as string;

    const user: any = await this.userService.findUserById(userId);

    const event: any = await this.eventService.findEventById(eventId);

    if (!event) sendError.notfoundError("Event is not found");

    if (event.date > new Date()) sendError.badrequestError("This event has already been closed");

    if (event._count.registrations >= event.capacity) sendError.badrequestError("Event is fully booked");

    const registerEvent = await this.service.registerForEvent(userId, eventId);

    const mailOptions = eventRegistrationTemplate(user.name, event.title, event.date);

    await this.mail.viaNodemailer({ ...mailOptions, to: user.email });

    res.status(status.CREATED).json({
      success: true,
      message: "User Register for an Event Successsfully",
      data: registerEvent,
    });
  };

  /**
   * Handle all registered event user request
   * @route {GET} /api/v1/register/:userId
   * @access public
   */
  public getRegisterEvents = async (req: CustomRequest, res: Response) => {
    const userId = req.params.userId as string;

    const user = await this.service.findEventsRegisterByUser(userId);

    res.status(status.OK).json({ success: true, message: "Fetch Registerted Event Successfully", data: user });
  };

  /**
   * Handle registered event for user request
   * @route {GET} /api/v1/register/:userId
   * @access public
   */
  public getRegisterEvent = async (req: CustomRequest, res: Response) => {
    const userId = req.params.userId as string;

    const user = await this.service.findEventRegisterByUser(userId);

    res.status(status.OK).json({ success: true, message: "Fetch Registerted Event Successfully", data: user });
  };

  /**
   *  Handle create a new event request
   * @route {DELETE} /api/v1/unregister/:eventId
   * @access public
   */
  public unregisterEvent = async (req: CustomRequest, res: Response) => {
    const registerId = req.params.registerId as string;

    if (!registerId) sendError.badrequestError("Missing event registerId");

    const registeredEvent = await this.service.findReigsterEventById(registerId);

    if (!registeredEvent) sendError.notfoundError("Register Event not found");

    const delEvent = await this.service.unregisterEvent(registerId);

    res.status(status.OK).json(delEvent);
  };
}

/** Register route handlers */
export const registerController = new RegisterController();
