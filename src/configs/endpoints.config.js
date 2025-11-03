export const HttpMethod = {
  Get: "GET",
  Post: "POST",
  Put: "PUT",
  Patch: "PATCH",
  Delete: "DELETE",
};

const ApiRoutes = {
  Dashboard: {
    Data: {
      Endpoint: "/admin/dashboard",
      Method: HttpMethod.Get,
    },
  },
  Auth: {
    Login: {
      Endpoint: "/auth/login",
      Method: HttpMethod.Post,
    },
  },
  Upload: {
    UploadMedia: {
      Endpoint: "upload",
      Method: HttpMethod.Post,
    },
  },
  Users: {
    AllUsers: {
      Endpoint: "/admin/get-user-list",
      Method: HttpMethod.Get,
    },
    GetTransactionHistory: {
      Endpoint: "/admin/transaction-history",
      Method: HttpMethod.Get,
    },
  },
  Membership: {
    CreateMemberShip: {
      Endpoint: "/plan/create-membership-plan",
      Method: HttpMethod.Post,
    },
    GetAllMemberShip: {
      Endpoint: "/plan/get-all-membership-plans",
      Method: HttpMethod.Get,
    },
    DeleteMembership: {
      Endpoint: `/plan/delete-membership-plan`,
      Method: HttpMethod.Delete,
    },
    GetMemberShipById: {
      Endpoint: `/plan/get-membership-plan`,
      Method: HttpMethod.Get,
    },
    UpdateMembershipById: {
      Endpoint: `/plan/update-membership-plan`,
      Method: HttpMethod.Patch,
    },
  },
  TicketsForEvent: {
    CreateTicketsForEvent: {
      Endpoint: "/event/create-event",
      Method: HttpMethod.Post,
    },
    DeleteEvent: {
      Endpoint:(id)=> `/event/delete-event/${id}`,
      Method: HttpMethod.Delete,
    },
    GetAttendeesForEvent: {
      Endpoint:(id)=> `/admin/get-event-attendees-list/${id}`,
      Method: HttpMethod.Get,
    },
    GetAllTicketsForEvent: {
      Endpoint: "/event/get-all-events",
      Method: HttpMethod.Get,
    },
    GetTicketEventById: {
      Endpoint: "/event/get-event",
      Method: HttpMethod.Get,
    },
    UpdateEventById: {
      Endpoint:(eventId) => `/event/update-event/${eventId}`,
      Method: HttpMethod.Patch,
    },
  },

  // Course: {
  //   AllCourse: {
  //     Endpoint: "course/get-all-course",
  //     Method: HttpMethod.Post,
  //   },
  //   CourseById: {
  //     Endpoint: "course/get-course",
  //     Method: HttpMethod.Post,
  //   },
  //   AddCourse: {
  //     Endpoint: "course/create-course",
  //     Method: HttpMethod.Post,
  //   },
  //   EditCourse: {
  //     Endpoint: "course/update-course",
  //     Method: HttpMethod.Post,
  //   },
  //   DeleteCourse: {
  //     Endpoint: "course/delete-course",
  //     Method: HttpMethod.Post,
  //   },
  // },
  Product: {
    AllProduct: {
      Endpoint:(data)=> `/product/get-all-products`,
      Method: HttpMethod.Get,
    },
    ProductById: {
      Endpoint:(productId)=> `/product/get-product/${productId}`,
      Method: HttpMethod.Get,
    },
    ProductsByCourse: {
      Endpoint: "Product/get-course-all-Product",
      Method: HttpMethod.Post,
    },
    AddProduct: {
      Endpoint: "/product/create-product",
      Method: HttpMethod.Post,
    },
    EditProduct: {
      Endpoint:(productId)=> `/product/update-product/${productId}`,
      Method: HttpMethod.Patch,
    },
    DeleteProduct: {
      Endpoint:(productId)=> `/product/delete-product/${productId}`,
      Method: HttpMethod.Delete,
    },
  },
  // Student: {
  //   AllStudent: {
  //     Endpoint: "student/get-all-student",
  //     Method: HttpMethod.Post,
  //   },
  //   StudentById: {
  //     Endpoint: "student/get-student",
  //     Method: HttpMethod.Post,
  //   },
  //   AddStudent: {
  //     Endpoint: "student/create-student",
  //     Method: HttpMethod.Post,
  //   },
  //   EditStudent: {
  //     Endpoint: "student/update-student",
  //     Method: HttpMethod.Post,
  //   },
  //   DeleteStudent: {
  //     Endpoint: "student/delete-student",
  //     Method: HttpMethod.Post,
  //   },
  // },
  // Enroll: {
  //   AllEnroll: {
  //     Endpoint: "enroll/get-all-enroll",
  //     Method: HttpMethod.Post,
  //   },
  //   EnrollById: {
  //     Endpoint: "enroll/get-enroll",
  //     Method: HttpMethod.Post,
  //   },
  //   AddEnroll: {
  //     Endpoint: "student/assign-course",
  //     Method: HttpMethod.Post,
  //   },
  //   CoursesByStudent: {
  //     Endpoint: "student/get-all-courses-in-student",
  //     Method: HttpMethod.Post,
  //   },
  //   StudentsByCourse: {
  //     Endpoint: "student/get-all-student-in-course",
  //     Method: HttpMethod.Post,
  //   },
  //   EditEnroll: {
  //     Endpoint: "enroll/update-enroll",
  //     Method: HttpMethod.Post,
  //   },
  //   DeleteEnroll: {
  //     Endpoint: "student/remove-student-from-course",
  //     Method: HttpMethod.Post,
  //   },
  // },
  // StudentDash: {
  //   // For Student Section
  //   CreateProduct: {
  //     Endpoint: "student/create-complete-Product",
  //     Method: HttpMethod.Post,
  //   },
  //   AllCompletedProduct: {
  //     Endpoint: "student/get-All-complete-Product",
  //     Method: HttpMethod.Post,
  //   },
  // },
};

export default ApiRoutes;
