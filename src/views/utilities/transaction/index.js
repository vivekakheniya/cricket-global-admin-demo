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
import UsersApi from "apis/users.api";

export default function TransactionHistory() {
   const userApi = useMemo(() => new UsersApi(), []);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getTransactionHistory({
        page: page + 1,
        limit: rowsPerPage,
      });

      if (response?.data?.status === "Success") {
        const data = response?.data?.data || [];
        const pagination = response?.data?.pagination;
        setTransactions(data);
        // setTotalCount(pagination?.totalRecords || data.length);
      } else {
        toast.error("Failed to fetch transactions");
        setTransactions([]);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast.error("Something went wrong while fetching transactions");
      setTransactions([]);
    } finally {
      setIsLoading(false);

    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Local search on fetched data
  const filteredTransactions = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter(
      (txn) =>
        txn.userEmail?.toLowerCase().includes(q) ||
        txn.eventName?.toLowerCase().includes(q) ||
        txn.planName?.toLowerCase().includes(q) ||
        txn.transactionId?.toLowerCase().includes(q)
    );
  }, [transactions, search]);

  return (
    <MainCard
      title={
        <Grid container alignItems="center" spacing={gridSpacing}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search Transactions"
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
                  <TableCell align="center">Transaction ID</TableCell>
                  <TableCell align="center">User Email</TableCell>
                  <TableCell align="center">Payment For</TableCell>
                  {/* <TableCell align="center">Event / Plan</TableCell> */}
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Payment Method</TableCell>
                  <TableCell align="center">Payment Status</TableCell>
                  <TableCell align="center">Transaction Date</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell align="center" colSpan={9}>
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((txn, index) => (
                      <TableRow key={txn._id}>
                        <TableCell align="center">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="center">{txn.transactionId}</TableCell>
                        <TableCell align="center">{txn.userEmail}</TableCell>
                        <TableCell align="center">
                          {txn.paymentFor === "event"
                            ? "Event"
                            : txn.paymentFor === "membership"
                            ? "Membership"
                            : txn.paymentFor || "—"}
                        </TableCell>
                        {/* <TableCell align="center"> */}
                          {/* {txn.eventName || txn.planName || "—"} */}
                        {/* </TableCell> */}
                        <TableCell align="center">
                          ₹{txn.amount?.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          {txn.paymentMethod || "—"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color:
                              txn.paymentStatus?.toLowerCase() === "paid"
                                ? "green"
                                : "red",
                            fontWeight: 500,
                            textTransform: "capitalize",
                          }}
                        >
                          {txn.paymentStatus}
                        </TableCell>
                        <TableCell align="center">{txn.purchasedDate}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={9}>
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filteredTransactions.length}
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
