import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux-slice/user.slice";
import customizationReducer from "store/customizationReducer";
import lessonListReducer from "../redux-slice/lesson.slice";
import courseListReducer from "../redux-slice/course.slice";
import studentListReducer from "../redux-slice/student.slice";
import enrollListReducer from "../redux-slice/enroll.slice";
import completedResponseReducer from "redux/redux-slice/completed-response.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    customization: customizationReducer,
    lesson: lessonListReducer,
    course: courseListReducer,
    student: studentListReducer,
    enroll: enrollListReducer,
    completedResponse: completedResponseReducer,
  },
});
