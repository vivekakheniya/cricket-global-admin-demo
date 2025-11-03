import { getTokenLocal } from "utils/localStorage.util";
import ApiRoutes from "../configs/endpoints.config";
import HttpClient from "./index.api";
const baseURL = process.env.REACT_APP_API_URL;

class MembershipApi extends HttpClient {
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

    CreateMembershipConfig = ApiRoutes.Membership.CreateMemberShip;
      AllMembershipConfig = ApiRoutes.Membership.GetAllMemberShip;
    //   MembershipByIdConfig = ApiRoutes.Membership.MembershipById;
      UpdateMembershipByIdConfig = ApiRoutes.Membership.UpdateMembershipById;
      DeleteMembershipConfig = ApiRoutes.Membership.DeleteMembership;
      GetMemberShipByIdConfig = ApiRoutes.Membership.GetMemberShipById;

    CreateMembership = async (data) => {
        return this.instance({
            method: this.CreateMembershipConfig.Method,
            url: this.CreateMembershipConfig.Endpoint,
            headers: {},
            data: data,
        });
    };
    allMembership = async () => {
        return this.instance({
            method: this.AllMembershipConfig.Method,
            url: this.AllMembershipConfig.Endpoint,
            headers: {},
            data: null,
        });
    };
    MembershipById = async (data) => {
        return this.instance({
            method: this.MembershipByIdConfig.Method,
            url: this.MembershipByIdConfig.Endpoint,
            headers: {},
            data: data,
        });
    };

    editMembership = async (data) => {
        return this.instance({
            method: this.EditMembershipConfig.Method,
            url: this.EditMembershipConfig.Endpoint,
            headers: {},
            data: data,
        });
    };
    DeleteMembership = async (data) => {
        return this.instance({
            method: this.DeleteMembershipConfig.Method,
            url: `${this.DeleteMembershipConfig.Endpoint}/${data?.id}`,
            headers: {},
            // data: data,
        });
    };
    GetMembershipById = async (id) => {
        // console.log("data -------", data)
        return this.instance({
            method: this.GetMemberShipByIdConfig.Method,
            url: `${this.GetMemberShipByIdConfig.Endpoint}/${id}`,
            headers: {},
            // data: data,
        });
    };
    UpdateMembershipById= async ({id,data}) => {
        console.log("UpdateMembershipById--------------",id, data)
        return this.instance({
            method: this.UpdateMembershipByIdConfig.Method,
            url: `${this.UpdateMembershipByIdConfig.Endpoint}/${id}`,
            headers: {},
            data: data,
        });
    }
}
const membershipInstance = new MembershipApi();
export default membershipInstance;
