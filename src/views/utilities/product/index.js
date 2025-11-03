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
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import ProductApi from "apis/product.api";

export default function ProductList() {
  const productApi = new ProductApi();
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await productApi.getAllProduct();
      if (response?.data?.status === "Success") {
        const data = response?.data?.data || [];
        setProducts(data);
        setTotalCount(response?.data?.pagination?.totalItems || data.length);
      } else {
        toast.error("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Something went wrong while fetching products.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmDelete) return;

      const response = await productApi.deleteProduct(id);
      if (response?.status === 200 || response?.data?.status === "Success") {
        toast.success("Product deleted successfully!");
        fetchProducts();
      } else {
        toast.error(response?.data?.message || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while deleting the product."
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase().trim();
    return (
      product.name?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  return (
    <MainCard
      title={
        <Grid container alignItems="center" spacing={gridSpacing}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search Products"
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
                  <TableCell align="center">Image</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">Price ($)</TableCell>
                  <TableCell align="center">Stock</TableCell>
                  <TableCell align="center">Created At</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell align="center" colSpan={8}>
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell align="center" colSpan={8}>
                      <Typography>No Products Found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product, index) => (
                      <TableRow key={product._id}>
                        <TableCell align="center">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="center">
                          <img
                            src={product.coverImage || "/placeholder.jpg"}
                            alt={product.name}
                            style={{
                              width: 180,
                              height: 110,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">{product.name}</TableCell>
                        <TableCell align="center">
                          {product.category || "Uncategorized"}
                        </TableCell>
                        <TableCell align="center">
                          ${product.price?.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">{product.stock}</TableCell>
                        <TableCell align="center">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "8px",
                            }}
                          >
                            <Link to={`/edit-product/${product._id}`}>
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
                              onClick={() => handleDelete(product._id)}
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
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filteredProducts.length}
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
