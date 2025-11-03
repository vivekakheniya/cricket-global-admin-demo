import React, { useCallback, useState, useEffect } from "react";
import {
  Card,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import StudentApi from "apis/users.api";
import { updateAllStudents } from "redux/redux-slice/student.slice";

export default function Students() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const studentApi = new StudentApi();

  const rows = useSelector((state) => state.student.Student);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = async (studentId) => {
    try {
      console.log("Deleting Student with ID: ", studentId);

      const response = await studentApi.deleteStudent({ studentId });

      if (response && response.data.code === 200) {
        toast.success("Student deleted successfully");
        await getAllStudents();
      } else {
        toast.error(`Failed to delete student`);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    }
  };

  const getAllStudents = useCallback(async () => {
    try {
      const response = await studentApi.allStudent();
      console.log("API response: ", response);

      if (response && response.data.code === 200) {
        dispatch(updateAllStudents(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Something went wrong while fetching students");
    }
  }, []);

  useEffect(() => {
    getAllStudents();
  }, [getAllStudents]);

  function formatDate(date) {
    return new Date(date).toLocaleString("en-us", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <MainCard
      title={
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={gridSpacing}
        >
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label="Search"
              type="search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
        </Grid>
      }
      content={false}
    >
      {rows ? (
        <Card>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 540 }}>
              <Table stickyHeader aria-label="students table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">S No.</TableCell>
                    <TableCell align="center">Student Name</TableCell>
                    <TableCell align="center">Contact</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Enrollment Date</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .filter((row) =>
                      search.toLowerCase() === ""
                        ? row
                        : (row.name || "").toLowerCase().includes(search)
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">{row.contact}</TableCell>
                        <TableCell align="center">{row.email}</TableCell>
                        <TableCell align="center">
                          {formatDate(row.createdAt)}
                        </TableCell>
                        <TableCell align="center">
                          <Link to={`/edit-student/${row._id}`}>
                            <IconButton color="primary">
                              <EditIcon sx={{ fontSize: "1.1rem" }} />
                            </IconButton>
                          </Link>
                          <IconButton
                            onClick={() => handleDelete(row._id)}
                            color="primary"
                          >
                            <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Card>
      ) : (
        <h6>Loading...</h6>
      )}
    </MainCard>
  );
}
