import { getTokenLocal } from "utils/localStorage.util";
import ApiRoutes from "../configs/endpoints.config";
import HttpClient from "./index.api";
const baseURL = process.env.REACT_APP_API_URL;

class UserApi extends HttpClient {
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

  AllUsersConfig = ApiRoutes.Users.AllUsers;
  GetTransactionHistoryConfig = ApiRoutes.Users.GetTransactionHistory;
  // EditStudentConfig = ApiRoutes.Student.EditStudent;
  // AddStudentConfig = ApiRoutes.Student.AddStudent;
  // DeleteStudentConfig = ApiRoutes.Student.DeleteStudent;

  allUsers = async (data) => {
    return this.instance({
      method: this.AllUsersConfig.Method,
      url: this.AllUsersConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  getTransactionHistory = async (data) => {
    return this.instance({
      method: this.GetTransactionHistoryConfig.Method,
      url: this.GetTransactionHistoryConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  // addStudent = async (data) => {
  //   return this.instance({
  //     method: this.AddStudentConfig.Method,
  //     url: this.AddStudentConfig.Endpoint,
  //     headers: {},
  //     data: data,
  //   });
  // };
  // editStudent = async (data) => {
  //   return this.instance({
  //     method: this.EditStudentConfig.Method,
  //     url: this.EditStudentConfig.Endpoint,
  //     headers: {},
  //     data: data,
  //   });
  // };
  // deleteStudent = async (data) => {
  //   return this.instance({
  //     method: this.DeleteStudentConfig.Method,
  //     url: this.DeleteStudentConfig.Endpoint,
  //     headers: {},
  //     data: data,
  //   });
  // };
}

export default UserApi;
