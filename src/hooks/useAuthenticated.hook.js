import {  getUserLocal } from "../utils/localStorage.util";

export const useAuthenticated = () => {
  const user = getUserLocal();
  if (user) {
    return true;
  } else {
    return false;
  }
};
