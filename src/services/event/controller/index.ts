import { Response } from "express";
import { StatusCodes as status } from "http-status-codes";
import { CustomRequest } from "../../../library";
import { EventService, eventService } from "../service";

class EventController {
  protected service: EventService;

  constructor() {
    this.service = eventService;
  }

  /**
   *  Handle Create a new event request
   * @route {POST} /api/v1/event
   * @access public
   */
  public newEvent = async (req: CustomRequest, res: Response) => {
    const data = req.body;

    const newEvent = await this.service.createEvent(data);

    res.status(status.CREATED).json({
      success: true,
      message: "Event Created Successsfully",
      data: newEvent,
    });
  };

  /**
   * Handle Fetch an event request
   * @route {GET} /api/v1/event/:eventId
   * @access public
   */
  public getEvent = async (req: CustomRequest, res: Response) => {
    const eventId = req.params.eventId as string;

    const event = await this.service.findEventById(eventId);

    res.status(status.OK).json({
      success: true,
      message: "Fetch a Event Successfully",
      data: event,
    });
  };

  /**
   * Handle search events request
   * @route {GET} /api/v1/events/search
   * @access public
   */
  public searchEvents = async (req: CustomRequest, res: Response) => {
    const query = req.query;

    const events = await this.service.findAllEvents(query);

    res.status(status.OK).json({ success: true, message: "Fetch Events Successfully", ...events });
  };

  /**
   * Handle update an event request
   * @route {UPDATE} /api/v1/event/:eventId
   * @access public
   */
  public updateEvent = async (req: CustomRequest, res: Response) => {
    const eventId = req.params.eventId as string;

    const event = await this.service.updateEvent(eventId, req.body);

    res.status(status.OK).json({
      success: true,
      message: "Event Update Successfully",
      data: event,
    });
  };

  /**
   * Handle delete an event request
   * @route {DELETE} /api/v1/event/:eventId
   * @access public
   */
  public delEvent = async (req: CustomRequest, res: Response) => {
    const eventId = req.params.eventId as string;

    await this.service.delEvent(eventId);

    res.status(status.NO_CONTENT).json({ success: true, message: "Event Deleted Successfully" });
  };
}

/** Event route handlers */
export const eventController = new EventController();
