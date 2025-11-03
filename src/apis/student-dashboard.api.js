import { getTokenLocal } from "utils/localStorage.util";
import ApiRoutes from "../configs/endpoints.config";
import HttpClient from "./index.api";
const baseURL = process.env.REACT_APP_API_URL;

class StudentDashboard extends HttpClient {
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

  CreateLessonConfig = ApiRoutes.StudentDash.CreateLesson;
  AllCompletedLessonConfig = ApiRoutes.StudentDash.AllCompletedLesson;
  // For Student Section
  createLesson = async (data) => {
    // console.log("Request Body: ", data);
    // if (!data || !(data instanceof FormData)) {
    //   console.error("❌ Invalid FormData", data);
    //   throw new Error("Invalid FormData passed to API.");
    // }

    // console.log(
    //   "🟡 FormData before sending (debugging)",
    //   Object.fromEntries(data.entries())
    // );
    return this.instance({
      method: this.CreateLessonConfig.Method,
      url: this.CreateLessonConfig.Endpoint,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: data,
    });
  };
  allCompletedLesson = async (data) => {
    return this.instance({
      method: this.AllCompletedLessonConfig.Method,
      url: this.AllCompletedLessonConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
}

export default StudentDashboard;
