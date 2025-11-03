import { useSelector } from "react-redux";

export const useUser = () => {
  const { v_user_info } = useSelector((state) => state.user);
  const {x_auth_token} = useSelector((state)=>state.user);

  const userName = v_user_info?.firstName || v_user_info?.lastName
    ? `${v_user_info.firstName ?? ""} ${v_user_info.lastName ?? ""}`.trim()
    : "Guest";
  const email = v_user_info?.email || "Not Available";
  return { v_user_info, userName, email, token:x_auth_token};
};
