// assets
// import { IconUsers, IconAlignBoxLeftBottom, IconVideo } from "@tabler/icons";
import {
  IconBook,
  IconClipboardList,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";

// constant
const icons = {
  IconBook,
  IconClipboardList,
  IconUser,
  IconUserPlus,
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: "utilities",
  title: "Membership plan",
  type: "group",
  children: [
    {
      id: "tickets",
      title: "Events",
      icon: icons.IconBook,
      type: "collapse",
      children: [
        {
          id: "event-attendees",
          title: "Event Attendees",
          type: "item",
          url: "/event-attendees",
          breadcrumbs: true,
        },
        {
          id: "ticket-list",
          title: "Event List",
          type: "item",
          url: "/event-list",
          breadcrumbs: true,
        },
        {
          id: "create-ticket",
          title: "Create Event Ticket",
          type: "item",
          url: "/create-event-ticket",
          breadcrumbs: true,
        },
      ],
    },
    {
      id: "membership",
      title: "Membership",
      icon: icons.IconClipboardList,
      type: "collapse",
      children: [
        {
          id: "membership-list",
          title: "Membership-list",
          type: "item",
          url: "/membership-list",
          breadcrumbs: true,
        },
        {
          id: "add-membership",
          title: "Add Membership",
          type: "item",
          url: "/add-membership",
          breadcrumbs: true,
        },
      ],
    },
    {
      id: "products",
      title: "Products",
      icon: icons.IconClipboardList,
      type: "collapse",
      children: [
        {
          id: "product-list",
          title: "Product List",
          type: "item",
          url: "/product-list",
          breadcrumbs: true,
        },
        {
          id: "add-product",
          title: "Add Product",
          type: "item",
          url: "/add-product",
          breadcrumbs: true,
        },
      ],
    },
    {
      id: "users",
      title: "Users",
      icon: icons.IconUserPlus,
      type: "collapse",
      children: [
        {
          id: "all-users",
          title: "Users List",
          type: "item",
          url: "/users-list",
          breadcrumbs: true,
        },
      ],
    },
    {
      id: "transactions",
      title: "Transactions",
      icon: icons.IconUserPlus,
      type: "collapse",
      children: [
        {
          id: "transaction-history",
          title: "Transaction History",
          type: "item",
          url: "/transaction-history",
          breadcrumbs: true,
        },
      ],
    },
  ],
};

export default utilities;
