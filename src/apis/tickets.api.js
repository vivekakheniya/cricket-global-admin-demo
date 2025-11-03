import { getTokenLocal } from "utils/localStorage.util";
import ApiRoutes from "../configs/endpoints.config";
import HttpClient from "./index.api";
const baseURL = process.env.REACT_APP_API_URL;

class TicketsForEvent extends HttpClient {
  constructor() {
    super(baseURL);
    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${getTokenLocal()}`;
      return config;
    });
  };

  _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (response) => {
        return Promise.resolve(response);
      }
    );
  };

  CreateTicketsForEventConfig = ApiRoutes.TicketsForEvent.CreateTicketsForEvent;
  uploadSingleImageUrlConfig = ApiRoutes.TicketsForEvent.uploadSingleImageUrl;
  GetAllTicketsForEventConfig = ApiRoutes.TicketsForEvent.GetAllTicketsForEvent;
  GetTicketEventByIdConfig = ApiRoutes.TicketsForEvent.GetTicketEventById;
  GetAttendeesForEventConfig = ApiRoutes.TicketsForEvent.GetAttendeesForEvent;
  UpdateEventByIdConfig = ApiRoutes.TicketsForEvent.UpdateEventById;
  DeleteTicketsForEventConfig = ApiRoutes.TicketsForEvent.DeleteEvent;

  CreateTicketsForEvent = async (data) => {
    return this.instance({
      method: this.CreateTicketsForEventConfig.Method,
      url: this.CreateTicketsForEventConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  GetAllTicketsForEvent = async () => {
    return this.instance({
      method: this.GetAllTicketsForEventConfig.Method,
      url: this.GetAllTicketsForEventConfig.Endpoint,
      headers: {},
      data: null,
    });
  };
  GetTicketEventById = async (id) => {
    console.log("GetTicketEventById----------------", id);
    return this.instance({
      method: this.GetTicketEventByIdConfig.Method,
      url: `${this.GetTicketEventByIdConfig.Endpoint}/${id}`,
      headers: {},
      // data: data,
    });
  };
  UpdateEventById = async (data) => {
    return this.instance({
      method: this.UpdateEventByIdConfig.Method,
      url: this.UpdateEventByIdConfig.Endpoint(data?.id),
      headers: {},
      data: data?.data,
    });
  };
  GetAttendeesForEvent = async (data) => {
    console.log("GetAttendeesForEvent data----------------", data);
    return this.instance({
      method: this.GetAttendeesForEventConfig.Method,
      url: this.GetAttendeesForEventConfig.Endpoint(data?.eventId),
      headers: {},
      data: data,
    });
  };
  deleteEvent = async (data) => {
    return this.instance({
      method: this.DeleteTicketsForEventConfig.Method,
      url: this.DeleteTicketsForEventConfig.Endpoint(data),
      headers: {},
      data: data,
    });
  };
}
const ticketsInstance = new TicketsForEvent();
export default ticketsInstance;
