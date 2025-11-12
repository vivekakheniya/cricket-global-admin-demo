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
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import ticketsInstance from "apis/tickets.api";
// Dummy data
const dummyEvents = [
  {
    eventName: "IND vs ENG (M) T20 International",
    teamA: "IND",
    teamB: "ENG",
    category: "M T20 International",
    price: 75,
    venue: "Wankhede Stadium, Mumbai, India",
    startDate: "2025-11-15T19:00",
    endDate: "2025-11-15T23:00",
    description: "Exciting T20 International match between India and England.",
  },
  {
    eventName: "AUS vs NZ (M) ODI",
    teamA: "AUS",
    teamB: "NZ",
    category: "M ODI",
    price: 65,
    venue: "Sydney Cricket Ground, Australia",
    startDate: "2025-12-05T14:00",
    endDate: "2025-12-05T22:00",
    description:
      "Men’s One Day International clash between Australia and New Zealand.",
  },
  {
    eventName: "ENG vs SA (W) T20 International",
    teamA: "ENG",
    teamB: "SA",
    category: "W T20 International",
    price: 40,
    venue: "The Oval, London, UK",
    startDate: "2025-11-22T18:00",
    endDate: "2025-11-22T21:30",
    description: "Women’s T20 International between England and South Africa.",
  },
  {
    eventName: "IND vs AUS Test Match",
    teamA: "IND",
    teamB: "AUS",
    category: "Test Match",
    price: 120,
    venue: "Eden Gardens, Kolkata, India",
    startDate: "2025-12-10T10:00",
    endDate: "2025-12-14T17:00",
    description: "Five-day Test Match between India and Australia.",
  },
  {
    eventName: "NZ vs ENG (M) ODI",
    teamA: "NZ",
    teamB: "ENG",
    category: "M ODI",
    price: 55,
    venue: "Eden Park, Auckland, New Zealand",
    startDate: "2025-12-20T13:30",
    endDate: "2025-12-20T21:00",
    description: "Men’s One Day International between New Zealand and England.",
  },
];

export default function TicketList() {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-us", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  const getAllTicketsForEvent = useCallback(async () => {
    try {
      const response = await ticketsInstance.GetAllTicketsForEvent({
        page: page + 1, // backend is 1-indexed
        limit: rowsPerPage,
        search: search || "",
      });

      console.log("Tickets response:", response?.data);

      if (response && response?.data?.status === "Success") {
        const tickets = response?.data?.data || [];
        const pagination = response?.data?.data?.pagination;

        setRows(tickets);
        setTotalCount(pagination?.total || tickets.length);
      } else {
        toast.error("Failed to fetch event tickets");
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Something went wrong while fetching tickets");
      setRows([]);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    getAllTicketsForEvent();
  }, [getAllTicketsForEvent]);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      );
      if (!confirmDelete) return;

      const response = await ticketsInstance.deleteEvent(id);
      console.log("Delete event response:", response);

      if (response?.status === 200 || response?.data?.status === "Success") {
        toast.success("Event deleted successfully!");
        // Refresh the list
        getAllTicketsForEvent();
      } else {
        toast.error(response?.data?.message || "Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      const message =
        error?.response?.data?.message ||
        "Something went wrong while deleting.";
      toast.error(message);
    }
  };

  // console.log("rows------------", rows)
  return (
    <MainCard
      title={
        <Grid container alignItems="center" spacing={gridSpacing}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search Events"
              type="search"
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
                  <TableCell align="center">Event Name</TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">Venue</TableCell>
                  <TableCell align="center">Start</TableCell>
                  <TableCell align="center">End</TableCell>
                  <TableCell align="center">Event Type (€)</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(() => {
                  const query = search.toLowerCase().trim();

                  // Filter rows safely
                  const filteredRows =
                    rows?.filter((row) => {
                      if (!row) return false;

                      const titleMatch = row.title
                        ?.toLowerCase()
                        .includes(query);
                      const categoryMatch = row.category
                        ?.toLowerCase()
                        .includes(query);
                      const venueMatch = row.venue
                        ?.toLowerCase()
                        .includes(query);

                      const priceMatch = Array.isArray(row.tickets)
                        ? row.tickets.some((t) =>
                          t?.price?.toString()?.toLowerCase()?.includes(query)
                        )
                        : false;

                      return (
                        !query ||
                        titleMatch ||
                        categoryMatch ||
                        venueMatch ||
                        priceMatch
                      );
                    }) || [];

                  if (isNaN(page) || page < 0) setPage(0); // Just a sanity check

                  if (filteredRows.length === 0) {
                    return (
                      <TableRow>
                        <TableCell align="center" colSpan={8}>
                          No Data Available
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row._id || index}>
                        <TableCell align="center">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="center">{row.title}</TableCell>
                        <TableCell align="center">{row.category}</TableCell>
                        <TableCell align="center">{row.venue}</TableCell>
                        <TableCell align="center">
                          {formatDate(row.startDate)}
                        </TableCell>
                        <TableCell align="center">
                          {formatDate(row.endDate)}
                        </TableCell>
                        <TableCell align="center">{row.eventType}</TableCell>
                        <TableCell align="center">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "8px",
                            }}
                          >
                            <Link to={`/edit-event-tickets/${row._id}`}>
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

                            <IconButton
                              color="primary"
                              onClick={() => handleDelete(row._id)}
                            >
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ));
                })()}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={rows.length}
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
