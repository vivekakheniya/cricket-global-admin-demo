// assets
import { IconUsers, IconAlignBoxLeftBottom, IconVideo } from "@tabler/icons";

// constant
const icons = {
  IconUsers,
  IconAlignBoxLeftBottom,
  IconVideo,
};

// ==============================|| student MENU ITEMS ||============================== //

const student = {
  id: "student",
  title: "Student",
  type: "group",
  children: [
    {
      id: "student-view",
      icon: icons.IconAlignBoxLeftBottom,
      title: "View Courses",
      type: "item",
      url: "/view-courses",
      breadcrumbs: true,
    },
    // {
    //   id: "student-view-lesson",
    //   icon: icons.IconAlignBoxLeftBottom,
    //   title: "View Lessons",
    //   type: "item",
    //   url: "/view-lessons",
    //   breadcrumbs: true,
    // },
    // {
    //       id: "s-view",
    //       title: "SView",
    //       icon: icons.IconAlignBoxLeftBottom,
    //       type: "collapse",
    //       children: [
    //         {
    //           id: "course-list",
    //           title: "Courses List",
    //           type: "item",
    //           url: "/course",
    //           breadcrumbs: false,
    //         },
    //         {
    //           id: "add-course",
    //           title: "Add Course",
    //           type: "item",
    //           url: "/add-course",
    //           breadcrumbs: true,
    //         },
    //       ],
    //     },
  ],
};

export default student;
