import Cookies from "js-cookie";
// import { useState } from "react";
// const [isLoggedIn, setIsLoggedIn] = useState(false);

export const getTokenLocal = () => {
  console.log(Cookies?.get("x_auth_token"));
  return Cookies?.get("x_auth_token");
};

export const getUserLocal = () => {
  const user = Cookies.get("x_ufo");

  if (user !== null && user !== undefined) {
    return JSON.parse(user);
    // setIsLoggedIn(true);
  } else {
    return null;
    // setIsLoggedIn(false);
  }
};

export const setTokenLocal = (token) => {
  Cookies.set("x_auth_token", token, { expires: 30 });
  // console.log(Cookies.set("x_auth_token", token, { expires: 30 }));
};

export const setUserLocal = (user) => {
  Cookies.set("x_ufo", JSON.stringify(user), { expires: 30 });
};