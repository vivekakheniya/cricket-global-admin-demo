import React, { useCallback } from "react";
// material-ui
import { Card, Grid, Typography, Button, Chip } from "@mui/material";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
// project imports
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import LessonApi from "apis/lesson.api";
import { updateAllLesson } from "redux/redux-slice/lesson.slice";
import { useTheme } from "@mui/material/styles";
import membershipInstance from "apis/membership.api";

const dummyMemberships = [
  {
    _id: "1",
    title: "Beginner Cricket Plan",
    duration: "1 Month",
    price: 25,
  },
  {
    _id: "2",
    title: "Intermediate Cricket Plan",
    duration: "3 Months",
    price: 65,
  },
  {
    _id: "3",
    title: "Advanced Cricket Plan",
    duration: "6 Months",
    price: 120,
  },
  {
    _id: "4",
    title: "Elite Cricket Annual Plan",
    duration: "12 Months",
    price: 200,
  },
];

export default function Membership() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();


  const dummyMemberships = [
    { _id: "1", title: "Beginner Cricket Plan", duration: "1 Month", price: 25 },
    { _id: "2", title: "Intermediate Cricket Plan", duration: "3 Months", price: 65 },
    { _id: "3", title: "Advanced Cricket Plan", duration: "6 Months", price: 120 },
    { _id: "4", title: "Elite Cricket Annual Plan", duration: "12 Months", price: 200 },
  ];
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (membershipPlanId) => {
    try {
      console.log("membershipPlanId ---------------", membershipPlanId);
      const response = await membershipInstance.DeleteMembership({ id: membershipPlanId }); // pass id directly
      console.log("response to delete -----------", response);
      if (response && response.data.code === 200) {
        toast.success("Membership plan deleted successfully");
        await getAllMembershipPlan(); // refresh the list
      } else {
        const msg = response?.data?.message || "Failed to delete membership plan";
        toast.error(msg);
      }
    } catch (error) {
      console.error("Error deleting membership plan:", error);
      const msg =
        error?.response?.data?.message || "Something went wrong while deleting";
      toast.error(msg);
    }
  };


  const getAllMembershipPlan = useCallback(async () => {

    try {


      const response = await membershipInstance.allMembership(
        {
          page: page + 1, // backend is 1-indexed
          limit: rowsPerPage,
          search: search || "",
        }
      );
      console.log("response data-------------", response, response?.data?.data?.memberships);
      if (response && response?.data?.status === "Success") {
        const memberships = response?.data?.data?.memberships || [];
        const pagination = response?.data?.data?.pagination;

        setRows(memberships);
        setTotalCount(pagination?.total || memberships?.length);
      }
      else {
        toast.error("Failed to fetch membership plans");
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching:", error);
      setRows([]);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    getAllMembershipPlan();
  }, []);


  function formatDate(date) {
    return new Date(date).toLocaleString("en-us", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  console.log("get membership----------------", rows)

  return (
    <>
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
                id="outlined-search"
                label="Search by name, price, duration "
                type="search"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
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
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">S No.</TableCell>
                      <TableCell align="center">Membership Plan Name</TableCell>
                      <TableCell align="center">Duration</TableCell>
                      <TableCell align="center">Price (€)</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(() => {
                      const query = search.toLowerCase().trim();

                      // filter rows only if search exists
                      const filteredRows = query
                        ? rows?.filter((row) => {
                          const nameMatch = row.name?.toLowerCase().includes(query);
                          const durationMatch = `${row.durationValue} ${row.durationUnit}`
                            .toLowerCase()
                            .includes(query);
                          const priceMatch = row.price?.toString().includes(query);

                          return nameMatch || durationMatch || priceMatch;
                        }) || []
                        : rows || [];

                      // if search is active and no results found
                      if (query && filteredRows.length === 0) {
                        return (
                          <TableRow>
                            <TableCell align="center" colSpan={5}>
                              No Data Available
                            </TableCell>
                          </TableRow>
                        );
                      }

                      return filteredRows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="center">
                              {(row?.durationValue!= 0 ?  row.durationValue:"") + " " + row.durationUnit}
                            </TableCell>
                            <TableCell align="center">€{row.price}</TableCell>
                            <TableCell align="center">
                              {row.isActive ? "Active" : "Inactive"}
                            </TableCell>
                            <TableCell align="center">
                              <Link to={`/edit-membership/${row._id}`}>
                                <IconButton color="primary">
                                  <EditIcon
                                    sx={{
                                      fontSize: "1.1rem",
                                      color: theme.palette.secondary.main,
                                      "&:hover": {
                                        color: theme.palette.secondary.dark,
                                      },
                                    }}
                                  />
                                </IconButton>
                              </Link>
                              <IconButton color="primary" onClick={() => handleDelete(row._id)}>
                                <DeleteIcon
                                  sx={{
                                    fontSize: "1.1rem",
                                    color: theme.palette.secondary.main,
                                    "&:hover": {
                                      color: theme.palette.secondary.dark,
                                    },
                                  }}
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ));
                    })()}
                  </TableBody>

                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 20, 100]}
                component="div"
                count={totalCount}
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
    </>
  );
}
