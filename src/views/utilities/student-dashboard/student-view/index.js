// import React, { useState, useEffect } from "react";

// const RandomTextDisplay = () => {
//   const texts = [
//     "Keep pushing forward! 🚀",
//     "You're doing great! 🌟",
//     "Stay positive and keep learning! 📚",
//     "Success is just around the corner! 🎯",
//     "Every day is a new opportunity! 💡",
//   ];

//   const [randomText, setRandomText] = useState("");
//   const [visible, setVisible] = useState(true);

//   useEffect(() => {
//     // Pick a random text
//     setRandomText(texts[Math.floor(Math.random() * texts.length)]);

//     // Hide after 3 seconds
//     const timer = setTimeout(() => setVisible(false), 3000);

//     return () => clearTimeout(timer);
//   }, []);

//   return visible ? (
//     <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{randomText}</div>
//   ) : null;
// };

// export default RandomTextDisplay;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Grid,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Card,
//   TablePagination,
//   InputLabel,
// } from "@mui/material";
// import { useSelector } from "react-redux"; // Import Redux hook

// import MainCard from "ui-component/cards/MainCard";
// import EnrollApi from "apis/enroll.api"; // Assuming the new API for students
// import { toast } from "react-hot-toast";

// function StudentEnrolledCourses() {
//   const enrollApi = new EnrollApi();
//   const  user  = useSelector((state) => state.user.v_user_info); // Get student info from Redux
//   console.log("Logged-in User Details:", user);
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   useEffect(() => {
//     if (!user || !user._id) return; // Ensure student ID is available

//     const fetchCourses = async () => {
//       setLoading(true);
//       try {
//         const response = await enrollApi.allCoursesByStudent({
//           studentId: user._id, // Fetch courses for logged-in student
//         });
//         if (response?.data) {
//           setRows(response.data.data);
//         }
//       } catch (error) {
//         toast.error("Error fetching courses");
//       }
//       setLoading(false);
//     };

//     fetchCourses();
//   }, [user]);

//   return (
//     <MainCard
//       title={
//         <Grid container direction="column" spacing={1}>
//           <Grid item>
//             <InputLabel
//               sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}
//             >
//               Enrolled Courses for {user?.name}
//             </InputLabel>
//           </Grid>
//         </Grid>
//       }
//       content={false}
//     >
//       {loading ? (
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           minHeight="200px"
//           p={3}
//         >
//           <h6>Loading...</h6>
//         </Box>
//       ) : (
//         <Card>
//           <Paper sx={{ width: "100%", overflow: "hidden" }}>
//             <TableContainer sx={{ maxHeight: 540 }}>
//               <Table stickyHeader>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell align="center">S No.</TableCell>
//                     <TableCell align="center">Course Name</TableCell>
//                     <TableCell align="center">Course Type</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {rows.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={3} align="center">
//                         No courses found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     rows
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage
//                       )
//                       .map((row, index) => (
//                         <TableRow key={index}>
//                           <TableCell align="center">{index + 1}</TableCell>
//                           <TableCell align="center">
//                             {row.courseId.name}
//                           </TableCell>
//                           <TableCell align="center">
//                             {row.courseId.courseType}
//                           </TableCell>
//                         </TableRow>
//                       ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <TablePagination
//               rowsPerPageOptions={[10, 20, 100]}
//               component="div"
//               count={rows.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={(event, newPage) => setPage(newPage)}
//               onRowsPerPageChange={(event) =>
//                 setRowsPerPage(parseInt(event.target.value, 10))
//               }
//             />
//           </Paper>
//         </Card>
//       )}
//     </MainCard>
//   );
// }

// export default StudentEnrolledCourses;
// ---->

import { useState, useEffect } from "react";
import { Box, Card, Grid, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainCard from "ui-component/cards/MainCard";
import EnrollApi from "apis/enroll.api"; // Import your API class
import { toast } from "react-toastify";
import musicImg from "../../../../assets/images/img/song-img.jpg";

const ViewCourses = () => {
  const navigate = useNavigate();
  const enrollApi = new EnrollApi();

  // Get student details from Redux
  const user = useSelector((state) => state.user.v_user_info);
  console.log("Logged-in User Details:", user);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !user._id) return; // Ensure student ID exists

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await enrollApi.allCoursesByStudent({
          studentId: user._id, // Fetch courses for the logged-in student
        });
        if (response?.data) {
          setCourses(response.data.data);
        }
      } catch (error) {
        toast.error("Error fetching courses");
      }
      setLoading(false);
    };

    fetchCourses();
  }, [user]);

  return (
    <MainCard>
      {/* Student Name */}
      <Typography sx={{ fontSize: "22px", fontWeight: 600 }}>
        Student: {user?.name || "Unknown"}
      </Typography>

      {/* Loading Indicator */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Course Cards */}
          <Typography sx={{ fontSize: "20px", fontWeight: 500, mt: 4 }}>
            Available Courses
          </Typography>

          <Grid container spacing={2} pt={2}>
            {courses?.length > 0 ? (
              courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                  <Card
                    sx={{
                      textAlign: "center",
                      boxShadow: "0px 0px 5px 0px lightgrey",
                    }}
                  >
                    <Box
                      width="100%"
                      height="200px"
                      position="relative"
                      overflow="hidden"
                    >
                      {/* Blurred Image */}
                      <Box
                        component="img"
                        src={musicImg}
                        alt="Course Cover"
                        width="100%"
                        height="100%"
                        sx={{
                          filter: "blur(2px)",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          zIndex: 1,
                          objectFit: "cover",
                        }}
                      />

                      {/* Overlay with Blur Color */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(rgb(0 0 0 / 45%), rgb(0 0 0 / 50%))",
                          zIndex: 2,
                        }}
                      />

                      {/* Batch Title */}
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 600,
                          p: 2,
                          position: "absolute",
                          bottom: 2,
                          color: "white",
                          zIndex: 3,
                        }}
                      >
                        {course.courseId.name}
                      </Typography>
                    </Box>

                    {/* Enroll Now Text */}
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 500,
                        p: 2,
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate(`/view-lessons/${course.courseId._id}`)
                      }
                    >
                      View Lessons
                    </Typography>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography sx={{ mt: 3, fontSize: "18px", color: "gray" }}>
                No courses found for this student.
              </Typography>
            )}
          </Grid>
        </>
      )}
    </MainCard>
  );
};

export default ViewCourses;

{/* <Card
  sx={{
    textAlign: "center",
    boxShadow: "0px 0px 5px 0px lightgrey",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* Static Cover Image with Overlay 
  <Box width="100%" height="200px" position="relative">
    <Box
      component="img"
      src={musicImg} // Static image
      alt={course.courseId.name}
      width="100%"
      height="100%"
      sx={{ objectFit: "cover", filter: "blur(3px)" }} // Apply blur effect
    />

    {/* Course Name Overlay 
    <Box
      position="absolute"
      bottom={0}
      width="100%"
      bgcolor="rgba(0, 0, 0, 0.6)" // Semi-transparent background
      color="white"
      p={1}
      textAlign="center"
    >
      <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
        {course.courseId.name}
      </Typography>
    </Box>
  </Box>

  {/* View Lessons Button 
  <Typography
    sx={{
      fontSize: "16px",
      fontWeight: 500,
      p: 2,
      textTransform: "uppercase",
      cursor: "pointer",
      color: "blue",
    }}
    onClick={() => navigate(`/view-lessons/${course.courseId._id}`)}
  >
    View Lessons
  </Typography>
</Card>; */}
