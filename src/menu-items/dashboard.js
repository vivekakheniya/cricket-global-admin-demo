// assets
import { IconDashboard, IconAlignBoxBottomLeft } from "@tabler/icons";

// constant
const icons = { IconDashboard, IconAlignBoxBottomLeft };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "default",
      title: "Dashboard",
      type: "item",
      url: "/dashboard",
      icon: icons.IconDashboard,
      breadcrumbs: false,
    }
  ],
};

export default dashboard;
