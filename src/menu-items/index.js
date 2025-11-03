import dashboard from './dashboard';
import student from './student-menu';
import utilities from './utilities';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [dashboard, utilities]
};

export default menuItems;
// ---
// import { useSelector } from "react-redux";
// import dashboard from "./dashboard";
// import student from "./student-menu";
// import utilities from "./utilities";

// const MenuItems = () => {
//   // Get user role from Redux state
//   const userRole = useSelector((state) => state.user.v_user_info?.role); // Adjust based on your Redux structure
//   console.log("User role", userRole);
//   // Filter menu items based on role
//   let allowedItems = [dashboard]; // Dashboard is common for all

//   if (userRole === "Admin") {
//     allowedItems.push(utilities); // Add teacher's menu
//   } else if (userRole === "Student") {
//     allowedItems.push(student); // Add student's menu
//   }

//   return { items: allowedItems };
// };

// export default MenuItems;

