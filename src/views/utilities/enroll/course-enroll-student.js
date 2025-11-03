import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Card,
  TablePagination,
  InputLabel,
  IconButton,
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import EnrollApi from "apis/enroll.api";
import CourseApi from "apis/course.api";
import { toast } from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function CourseEnrollStudents() {
  const enrollApi = new EnrollApi();
  const courseApi = new CourseApi();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseApi.getAllCourse();
        if (response?.data) {
          setCourses(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await enrollApi.allStudentsByCourse({
          courseId: selectedCourse,
        });
        if (response?.data) {
          setStudents(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
      setLoading(false);
    };
    fetchStudents();
  }, [selectedCourse]);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleDelete = async (courseId) => {
    if (!courseId) return;

    try {
      const response = await enrollApi.deleteEnroll({
        studentCourseId: courseId,
      });

      if (response?.status === 200) {
        toast.success("Course enrollment deleted successfully");

        // Update the students state to remove the deleted entry
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student._id !== courseId)
        );
      } else {
        toast.error("Failed to delete course enrollment");
      }
    } catch (error) {
      toast.error("Error deleting course enrollment");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <MainCard
      title={
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <InputLabel
              sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}
            >
              Course's Students:
            </InputLabel>
          </Grid>
          <Grid item>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={12}>
                <Select
                  fullWidth
                  displayEmpty
                  value={selectedCourse}
                  onChange={handleCourseChange}
                >
                  <MenuItem value="" disabled>
                    Select a course to view enrolled students...
                  </MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      content={false}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px" // Adjust height as needed
          p={3} // Adds padding
        >
          <h6>Loading...</h6>
        </Box>
      ) : (
        <Card>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 540 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">S No.</TableCell>
                    <TableCell align="center">Student Name</TableCell>
                    <TableCell align="center">Contact</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!selectedCourse ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Select a course to view students
                      </TableCell>
                    </TableRow>
                  ) : students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No students found for this course
                      </TableCell>
                    </TableRow>
                  ) : (
                    students
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .filter((student) => student.studentId)
                      .map((student, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            {student.studentId?.name}
                          </TableCell>
                          <TableCell align="center">
                            {student.studentId?.contact}
                          </TableCell>
                          <TableCell align="center">
                            {student.studentId?.email}
                          </TableCell>
                          <TableCell align="center">
                            {/* <Link to={`/edit-course/${row._id}`}>
                                                        <IconButton color="primary">
                                                          <EditIcon sx={{ fontSize: "1.1rem" }} />
                                                        </IconButton>
                                                      </Link> */}
                            <IconButton
                              color="primary"
                              onClick={() => handleDelete(student._id)}
                            >
                              <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20, 100]}
              component="div"
              count={students.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Card>
      )}
    </MainCard>
  );
}

export default CourseEnrollStudents;
