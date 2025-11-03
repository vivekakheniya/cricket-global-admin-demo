import ApiRoutes from "../configs/endpoints.config";
import HttpClient from "./index.api";
import { getTokenLocal } from "utils/localStorage.util";
const baseURL = process.env.REACT_APP_API_URL;

class Course extends HttpClient {
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

  AllCourseConfig = ApiRoutes.Course.AllCourse;
  CourseByIdConfig = ApiRoutes.Course.CourseById;
  AddCourseConfig = ApiRoutes.Course.AddCourse;
  EditCourseConfig = ApiRoutes.Course.EditCourse;
  DeleteCourseConfig = ApiRoutes.Course.DeleteCourse;

  getAllCourse = async () => {
    return this.instance({
      method: this.AllCourseConfig.Method,
      url: this.AllCourseConfig.Endpoint,
      headers: {},
      data: null,
    });
  };
  getCourseById = async (data) => {
    return this.instance({
      method: this.CourseByIdConfig.Method,
      url: this.CourseByIdConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  addCourse = async (data) => {
    return this.instance({
      method: this.AddCourseConfig.Method,
      url: this.AddCourseConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  editCourse = async (data) => {
    return this.instance({
      method: this.EditCourseConfig.Method,
      url: this.EditCourseConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  deleteCourse = async (data) => {
    return this.instance({
      method: this.DeleteCourseConfig.Method,
      url: this.DeleteCourseConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
}

export default Course;
