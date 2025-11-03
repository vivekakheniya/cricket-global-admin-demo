import { lazy } from "react";
// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
// dashboard routing
const Dashboard = Loadable(lazy(() => import("views/dashboard/Default")));

// membership route
const MembershipList = Loadable(lazy(() => import("views/utilities/membership/index")));

const AddEditMembership = Loadable(
  lazy(() => import("views/utilities/membership/add-edit-membership"))
);
const ProductList = Loadable(lazy(() => import("views/utilities/product/index")));

const AddEditProduct = Loadable(
  lazy(() => import("views/utilities/product/add-product"))
);
const AddEditEventTickets = Loadable(lazy(()=> import("views/utilities/tickets/add-edit-tickets")));
const EventTicketList = Loadable(lazy(()=> import("views/utilities/tickets/index")));
const EventAttendeesList = Loadable(lazy(()=> import("views/utilities/tickets/event-attendees")));

const UserList = Loadable(lazy(()=> import("views/utilities/users")));

const TransactionHistory = Loadable(lazy(()=> import("views/utilities/transaction")));


const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/users-list",
      element: <UserList />,
    },
    {
      path: "/transaction-history",
      element: <TransactionHistory />,
    },
    {
      children: [
        {
          path: "/membership-list",
          element: <MembershipList />,
        },
        {
          path: "/add-membership",
          element: <AddEditMembership />,
        },
        {
          path: "edit-membership/:id",
          element: <AddEditMembership />,
        },
      ],
    },
    {
      children: [
        {
          path: "/product-list",
          element: <ProductList />,
        },
        {
          path: "/add-product",
          element: <AddEditProduct />,
        },
        {
          path: "edit-product/:id",
          element: <AddEditProduct />,
        },
      ],
    },
    {
      children: [
        {
          path: "/event-list",
          element: <EventTicketList />,
        },
        {
          path: "/event-attendees",
          element: <EventAttendeesList />,
        },
        {
          path: "/create-event-ticket",
          element: <AddEditEventTickets />,
        },
        {
          path: "/edit-event-tickets/:id",
          element: <AddEditEventTickets />,
        },
      ],
    }
  ],
};

export default MainRoutes;
