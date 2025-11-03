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
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

import MainCard from "ui-component/cards/MainCard";
import EnrollApi from "apis/enroll.api";
import StudentApi from "apis/users.api";
import { toast } from "react-hot-toast";

function EnrolledList() {
  const enrollApi = new EnrollApi();
  const studentApi = new StudentApi();
  const navigate = useNavigate();
  const location = useLocation(); // Get location for passed state

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await studentApi.allStudent();
        if (response?.data) {
          setStudents(response.data.data);
        }
      } catch (error) {
        toast.error("Error fetching students");
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (location.state?.studentId) {
      setSelectedStudent(location.state.studentId);
    }
  }, [location.state]); // Runs when page loads with new state

  useEffect(() => {
    if (!selectedStudent) {
      setRows([]);
      return;
    }

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await enrollApi.allCoursesByStudent({
          studentId: selectedStudent,
        });
        if (response?.data) {
          setRows(response.data.data);
        }
      } catch (error) {
        toast.error("Error fetching courses");
      }
      setLoading(false);
    };

    fetchCourses();
  }, [selectedStudent]);

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  return (
    <MainCard
      title={
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <InputLabel
              sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}
            >
              Student's Courses:
            </InputLabel>
          </Grid>
          <Grid item>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={12}>
                <Select
                  fullWidth
                  displayEmpty
                  value={selectedStudent}
                  onChange={handleStudentChange}
                >
                  <MenuItem value="" disabled>
                    Select a student to view their courses...
                  </MenuItem>
                  {students.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      {student.name}
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
                    <TableCell align="center">Course Name</TableCell>
                    <TableCell align="center">Course Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!selectedStudent ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Select a student to view courses
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No courses found for this student
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows
                      .filter((row) =>
                        search.toLowerCase() === ""
                          ? row
                          : (row.name || "").toLowerCase().includes(search)
                      )
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            {row.courseId.name}
                          </TableCell>
                          <TableCell align="center">
                            {row.courseId.courseType}
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
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) =>
                setRowsPerPage(parseInt(event.target.value, 10))
              }
            />
          </Paper>
        </Card>
      )}
    </MainCard>
  );
}

export default EnrolledList;
