import { getTokenLocal } from "utils/localStorage.util";
import ApiRoutes from "../configs/endpoints.config";
import HttpClient from "./index.api";
const baseURL = process.env.REACT_APP_API_URL;

class Lesson extends HttpClient {
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

  AllLessonConfig = ApiRoutes.Lesson.AllLesson;
  LessonByIdConfig = ApiRoutes.Lesson.LessonById;
  EditLessonConfig = ApiRoutes.Lesson.EditLesson;
  AddLessonConfig = ApiRoutes.Lesson.AddLesson;
  DeleteLessonConfig = ApiRoutes.Lesson.DeleteLesson;
  LessonsByCourseConfig = ApiRoutes.Lesson.LessonsByCourse;

  getAllLesson = async () => {
    return this.instance({
      method: this.AllLessonConfig.Method,
      url: this.AllLessonConfig.Endpoint,
      headers: {},
      data: null,
    });
  };
  getLessonById = async (data) => {
    return this.instance({
      method: this.LessonByIdConfig.Method,
      url: this.LessonByIdConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  getLessonByCourse = async (data) => {
    return this.instance({
      method: this.LessonsByCourseConfig.Method,
      url: this.LessonsByCourseConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  addLesson = async (data) => {
    return this.instance({
      method: this.AddLessonConfig.Method,
      url: this.AddLessonConfig.Endpoint,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: data,
    });
  };
  editLesson = async (data) => {
    return this.instance({
      method: this.EditLessonConfig.Method,
      url: this.EditLessonConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  deleteLesson = async (data) => {
    return this.instance({
      method: this.DeleteLessonConfig.Method,
      url: this.DeleteLessonConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
}

export default Lesson;
