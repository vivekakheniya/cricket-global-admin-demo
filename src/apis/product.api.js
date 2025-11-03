import { getTokenLocal } from "utils/localStorage.util";
import ApiRoutes from "../configs/endpoints.config";
import HttpClient from "./index.api";
const baseURL = process.env.REACT_APP_API_URL;

class ProductApi extends HttpClient {
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

  AllProductConfig = ApiRoutes.Product.AllProduct;
  ProductByIdConfig = ApiRoutes.Product.ProductById;
  EditProductConfig = ApiRoutes.Product.EditProduct;
  AddProductConfig = ApiRoutes.Product.AddProduct;
  DeleteProductConfig = ApiRoutes.Product.DeleteProduct;
  ProductsByCourseConfig = ApiRoutes.Product.ProductsByCourse;

  getAllProduct = async (data) => {
    return this.instance({
      method: this.AllProductConfig.Method,
      url: this.AllProductConfig.Endpoint(data),
      headers: {},
      data: data,
    });
  };
  getProductById = async (data) => {
    return this.instance({
      method: this.ProductByIdConfig.Method,
      url: this.ProductByIdConfig.Endpoint(data),
      headers: {},
      data: data,
    });
  };
  getProductByCourse = async (data) => {
    return this.instance({
      method: this.ProductsByCourseConfig.Method,
      url: this.ProductsByCourseConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  createProduct = async (data) => {
    return this.instance({
      method: this.AddProductConfig.Method,
      url: this.AddProductConfig.Endpoint,
      headers: {},
      data: data,
    });
  };
  editProduct = async (id, data) => {
    console.log("Editing product with ID:", id, "and data:", data);
    return this.instance({
      method: this.EditProductConfig.Method,
      url: this.EditProductConfig.Endpoint(id),
      headers: {},
      data: data,
    });
  };
  deleteProduct = async (data) => {
    return this.instance({
      method: this.DeleteProductConfig.Method,
      url: this.DeleteProductConfig.Endpoint(data),
      headers: {},
      data: data,
    });
  };
}

export default ProductApi;
