import React, { useState, useEffect } from "react";
import MainCard from "ui-component/cards/MainCard";
import InputLabel from "ui-component/extended/Form/InputLabel";
import { gridSpacing } from "store/constant";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Button,
  Grid,
  Stack,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";
import EnrollApi from "apis/enroll.api"; // API for enrollments
import CourseApi from "apis/course.api"; // API for courses
import StudentApi from "apis/users.api"; // API for students

function EnrollStudent() {
  const navigate = useNavigate();
  const enrollApi = new EnrollApi();
  const courseApi = new CourseApi();
  const studentApi = new StudentApi();

  // State to store courses, students, and selected enrollment details
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    courseIds: [], // Array to store multiple course selections
  });

  const [errors, setErrors] = useState({});

  // Fetch students and courses when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await courseApi.getAllCourse(); // Fetch all courses
        const studentsResponse = await studentApi.allStudent(); // Fetch all students

        if (coursesResponse?.data) setCourses(coursesResponse.data.data);
        if (studentsResponse?.data) setStudents(studentsResponse.data.data);
      } catch (error) {
        console.error("Error fetching courses or students:", error);
        toast.error("Failed to load courses or students.");
      }
    };

    fetchData();
  }, []);

  // Handle student selection
  const handleStudentChange = (event) => {
    setFormData({ ...formData, studentId: event.target.value });

    if (errors.studentId) {
      setErrors({ ...errors, studentId: "" });
    }
  };

  // Handle multiple course selection
  const handleCourseChange = (event, value) => {
    setFormData({ ...formData, courseIds: value.map((course) => course._id) });

    if (errors.courseIds) {
      setErrors({ ...errors, courseIds: "" });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    let newErrors = {};
    if (!formData.studentId) newErrors.studentId = "Student is required";
    if (formData.courseIds.length === 0)
      newErrors.courseIds = "At least one course must be selected";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit enrollment
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please select both a student and at least one course.");
      return;
    }

    try {
      let response = await enrollApi.addEnroll({
        studentId: formData.studentId,
        courseIds: formData.courseIds, // Send array of course IDs
      });
      // console.log(response);
      if (response?.status === 200) {
        toast.success(
          response.data.message || "Student enrolled successfully!"
        );
        navigate("/student-enrolled-courses", {
          replace: true,
          state: { studentId: formData.studentId },
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error enrolling student:", error);
      toast.error(
        error?.response?.data?.message || "Failed to enroll student."
      );
    }
  };

  return (
    <MainCard title="Enroll Student">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={12}>
            <Stack>
              <InputLabel required>Select Student</InputLabel>
              <Select
                name="studentId"
                value={formData.studentId}
                onChange={handleStudentChange}
                error={!!errors.studentId}
                fullWidth
              >
                <MenuItem value="" disabled>
                  Select a student...
                </MenuItem>
                {students.map((student) => (
                  <MenuItem key={student._id} value={student._id}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            {errors.studentId && (
              <p style={{ color: "red" }}>{errors.studentId}</p>
            )}
          </Grid>

          {/* Course Multi-Select */}
          <Grid item xs={12}>
            <Stack>
              <InputLabel required>Select Courses</InputLabel>
              <Autocomplete
                multiple
                options={courses}
                getOptionLabel={(course) => course.name}
                value={courses.filter((course) =>
                  formData.courseIds.includes(course._id)
                )}
                onChange={handleCourseChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors.courseIds}
                    helperText={errors.courseIds}
                    placeholder="Select courses..."
                    fullWidth
                  />
                )}
              />
            </Stack>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <center>
              <Button variant="contained" type="submit">
                Enroll Student
              </Button>
            </center>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}

export default EnrollStudent;
