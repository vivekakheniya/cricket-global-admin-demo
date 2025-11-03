import ApiRoutes from "../configs/endpoints.config";
import HttpClient from "./index.api";
import { getTokenLocal } from "utils/localStorage.util";
const baseURL = process.env.REACT_APP_API_URL;

class Enroll extends HttpClient {
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

  // AllEnrollConfig = ApiRoutes.Enroll.AllEnroll;
  // EnrollByIdConfig = ApiRoutes.Enroll.EnrollById;
  // AddEnrollConfig = ApiRoutes.Student.AddEnroll;
  AddEnrollConfig = ApiRoutes.Enroll.AddEnroll;
  AllCoursesByStudentConfig = ApiRoutes.Enroll.CoursesByStudent;
  AllStudentsByCourseConfig = ApiRoutes.Enroll.StudentsByCourse;
  DeleteEnrollConfig = ApiRoutes.Enroll.DeleteEnroll;

  // allEnroll = async () => {
  //   return this.instance({
  //     method: this.AllEnrollConfig.Method,
  //     url: this.AllEnrollConfig.Endpoint,
  //     headers: {},
  //     data: null,
  //   });
  // };
  // enrollById = async (data) => {
  //   return this.instance({
  //     method: this.EnrollByIdConfig.Method,
  //     url: this.EnrollByIdConfig.Endpoint,
  //     headers: {},
  //     data: data,
  //   });
  // };
  addEnroll = async (data) => {
    return this.instance({
      method: this.AddEnrollConfig.Method,
      url: this.AddEnrollConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  allCoursesByStudent = async (data) => {
    return this.instance({
      method: this.AllCoursesByStudentConfig.Method,
      url: this.AllCoursesByStudentConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  allStudentsByCourse = async (data) => {
    return this.instance({
      method: this.AllStudentsByCourseConfig.Method,
      url: this.AllStudentsByCourseConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  deleteEnroll = async (data) => {
    return this.instance({
      method: this.DeleteEnrollConfig.Method,
      url: this.DeleteEnrollConfig.Endpoint,
      headers: {},
      data: data,
    });
  }
}

export default Enroll;
