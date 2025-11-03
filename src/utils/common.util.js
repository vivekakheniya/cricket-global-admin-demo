import Cookies from "js-cookie";
import {
  logoutUser,
  updateToken,
  updateUser,
} from "../redux/redux-slice/user.slice";

export const logout = (dispatch) => {
  // router,
  Cookies.remove("x_ufo");
  Cookies.remove("x_auth_token");
  dispatch(updateUser(null));
  dispatch(updateToken(null));
  dispatch(logoutUser(null));
  // if (router) return router.push("/");
};

