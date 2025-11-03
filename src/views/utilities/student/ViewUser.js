import React ,{ useState, useEffect } from "react";
// material-ui
import { Card, Grid, Button, Typography, Chip } from "@mui/material";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
// project imports
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useParams } from "react-router-dom";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Token = localStorage.getItem("tokenkey");
function App() {
  const params = useParams();
  const [count, setCount] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [qrArr, setQrArr] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  var myHeaders = new Headers();
  myHeaders.append("authkey", process.env.REACT_APP_AUTH_KEY);
  myHeaders.append("token", localStorage.getItem("token"));
  myHeaders.append("Content-Type", "application/json");

  function getQRApplyByUserId() {
    var raw = JSON.stringify({
      adminId: localStorage.getItem("userId"),
      userId: params.id,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(`${process.env.REACT_APP_API_URL}getQRApplyByUserId`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        var arr = [];
        setCount(result.count);
        setRows(result.data);
        Promise.all(result.data.Coupon.map(qr=>{
          arr.push(qr.QR)
        }))
        setQrArr(arr);
        console.log(arr)
      })
      .catch((error) => console.log("error", error));
  }

  useEffect(() => {
    getQRApplyByUserId();
  }, []);



   const downloadImagesAsZip = async (qrArr) => {
    try {
        const zip = new JSZip();
        // Loop through each image URL
        for (let i = 0; i < qrArr.length; i++) {
            const response = await fetch(`${process.env.REACT_APP_IMAGE_URL}${qrArr[i]}`);
            const imageBlob = await response.blob();
            // Add the image to the zip file
            zip.file(`image_${i}.jpg`, imageBlob);
        }
        // Generate the zip file
        const zipBlob = await zip.generateAsync({ type: 'blob' });

        // Save and download the zip file
        saveAs(zipBlob, 'images.zip');
    } catch (error) {
        console.error('Error creating zip file:', error);
    }
};

function formatDate(date) {
  return new Date(date).toLocaleString("en-us", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

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
            <Grid item>
              <Typography variant="h3">User QR Details</Typography>
            </Grid>
            &nbsp; &nbsp;
          </Grid>
          }
          >
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={gridSpacing}
          >
            <Grid item>
              <Typography variant="b">Count :- {count}</Typography>&nbsp;&nbsp;&nbsp;
            </Grid>
          </Grid>
        {rows ? (
          <Card>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 540 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ pl: 3 }}>S No.</TableCell>
                      <TableCell>QRID</TableCell>
                      <TableCell>Coupon Id</TableCell>
                      <TableCell>Coins</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    .map((row, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                          >
                            <TableCell align="start">{index + 1}</TableCell>
                            <TableCell align="start">{row.QRID}</TableCell>
                            <TableCell align="start">{row.CouponID}</TableCell>
                            <TableCell align="start">{row.Coins}</TableCell>
                            <TableCell align="start">{formatDate(row.createdAt)}</TableCell>
                          </TableRow>
                        );
                      })}
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
    </>
  );
}

export default App;
