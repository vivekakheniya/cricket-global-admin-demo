import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import ticketsInstance from "apis/tickets.api";

export default function EventAttendeesList() {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-us", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Step 1: Fetch all events for dropdown
  const getAllEvents = useCallback(async () => {
    try {
      const response = await ticketsInstance.GetAllTicketsForEvent({
        page: 1,
        limit: 100,
      });

      if (response?.data?.status === "Success") {
        const data = response?.data?.data || [];
        setEvents(data);
      } else {
        toast.error("Failed to load events");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Error fetching events");
    }
  }, []);

  // Step 2: Fetch attendees for selected event
  const getEventAttendees = useCallback(async () => {
    if (!selectedEvent) return;

    try {
      setIsLoading(true);
      const response = await ticketsInstance.GetAttendeesForEvent({
        eventId: selectedEvent,
        page: page + 1,
        limit: rowsPerPage,
        search: search || "",
      });

      console.log("🎟️ Event Attendees Response:", response?.data);

      if (response?.data?.status === "Success") {
        const attendeesData = response?.data?.data || [];
        const pagination = response?.data?.pagination;

        // Make sure it sets properly
        setAttendees(attendeesData);
        setTotalCount(pagination?.totalRecords || attendeesData.length);
      } else {
        toast.error("Failed to fetch event attendees");
        setAttendees([]);
      }
    } catch (error) {
      console.error("🔥 Error fetching attendees:", error);
      toast.error("Something went wrong while fetching attendees");
      setAttendees([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEvent, page, rowsPerPage]);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  useEffect(() => {
    getEventAttendees();
  }, [getEventAttendees]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <MainCard
      title={
        <Grid container alignItems="center" spacing={gridSpacing}>
          {/* Event Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Select Event</InputLabel>
              <Select
                value={selectedEvent}
                label="Select Event"
                onChange={(e) => {
                  setSelectedEvent(e.target.value);
                  setPage(0);
                }}
              >
                {events.map((event) => (
                  <MenuItem key={event._id} value={event._id}>
                    {event.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Search Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search Attendees"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
        </Grid>
      }
      content={false}
    >
      <Card>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 540 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center">S No.</TableCell>
                  <TableCell align="center">Full Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Total Amount</TableCell>
                  <TableCell align="center">Purchased Tickets</TableCell>
                  <TableCell align="center">Purchased Date</TableCell>
                  {/* <TableCell align="center">Registration Date</TableCell> */}
                  <TableCell align="center">Payment Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell align="center" colSpan={8}>
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : selectedEvent ? (
                  (() => {
                    const filteredAttendees = attendees.filter((user) => {
                      const q = search.toLowerCase();
                      return (
                        user.userFirstName?.toLowerCase().includes(q) ||
                        user.userLastName?.toLowerCase().includes(q) ||
                        user.userEmail?.toLowerCase().includes(q)
                      );
                    });

                    if (filteredAttendees.length === 0) {
                      return (
                        <TableRow>
                          <TableCell align="center" colSpan={8}>
                            <Typography>No results found</Typography>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    return filteredAttendees
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((user, index) => (
                        <TableRow key={user._id}>
                          <TableCell align="center">
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell align="center">
                            {`${user.userFirstName || ""} ${
                              user.userLastName || ""
                            }`.trim() || "—"}
                          </TableCell>
                          <TableCell align="center">
                            {user.userEmail || "—"}
                          </TableCell>
                          <TableCell align="center">
                            {user.totalAmount || "—"}
                          </TableCell>
                          <TableCell align="center">
                            {user.totalTicketPurchased || "—"}
                          </TableCell>
                          <TableCell align="center">
                            {user.purchasedDate
                              ? formatDate(user.purchasedDate)
                              : "—"}
                          </TableCell>
                          <TableCell align="center">
                            {user.paymentStatus?.toLowerCase() === "paid" ? (
                              <Typography color="green" fontWeight={500}>
                                Paid
                              </Typography>
                            ) : (
                              <Typography
                                color={theme.palette.error.main}
                                fontWeight={500}
                              >
                                Pending
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ));
                  })()
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={8}>
                      Select an event to view attendees
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Card>
    </MainCard>
  );
}
