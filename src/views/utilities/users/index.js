import { useEffect, useState, useCallback, useMemo } from "react";
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
} from "@mui/material";
import { toast } from "react-hot-toast";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import UserApi from "apis/users.api";

export default function UserList() {
  const userApi = new UserApi();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userApi.allUsers({
        page: page + 1,
        limit: rowsPerPage,
      });

      if (response?.data?.status === "Success") {
        const { data, pagination } = response?.data;
        // assuming data.users exists based on your API
        const usersList = data?.users || data || [];
        setUsers(usersList);
        setTotalCount(pagination?.totalUsers || usersList.length);
      } else {
        toast.error("Failed to fetch users");
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Something went wrong while fetching users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // filter client-side using useMemo for efficiency
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.contact?.includes(q)
    );
  }, [users, search]);

  return (
      <MainCard
      title={
        <Grid container alignItems="center" spacing={gridSpacing}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search Users"
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
                  <TableCell align="center">Membership No.</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Gender</TableCell>
                  <TableCell align="center">Country</TableCell>
                  <TableCell align="center">Active Membership</TableCell>
                  {/* <TableCell align="center">Latest Membership</TableCell> */}
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, index) => (
                      <TableRow key={user._id}>
                        <TableCell align="center">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                         <TableCell align="center">{user?.membershipNumber || "-"}</TableCell>
                        <TableCell align="center">
                          {user?.firstName + " " + user?.lastName}
                        </TableCell>
                        <TableCell align="center">{user?.email}</TableCell>
                        <TableCell align="center">{user?.gender}</TableCell>
                        <TableCell align="center">{user?.country}</TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: user.hasActiveMembership ? "green" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {user.hasActiveMembership ? "Yes" : "No"}
                        </TableCell>
                        {/* <TableCell align="center">
                          {user.latestMembership || "—"}
                        </TableCell> */}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filteredUsers.length}
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
