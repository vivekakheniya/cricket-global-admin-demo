import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Typography, Paper, Stack, IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import MainCard from "ui-component/cards/MainCard";
import { toast } from "react-hot-toast";
import LessonApi from "apis/lesson.api";
import StudentDashApi from "apis/student-dashboard.api";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { updateAllCompletedResponse } from "redux/redux-slice/completed-response.slice";

export default function StudentLessonList() {
  const lessonApi = new LessonApi();
  const studentDashApi = new StudentDashApi();
  const { id } = useParams(); // Get courseId from URL
  const [lessons, setLessons] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [audioURL, setAudioURL] = useState("");
  const [lessonAudio, setLessonAudio] = useState({});
  const [recordingTime, setRecordingTime] = useState(0);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const completeLesson = useSelector(
    (state) => state.completedResponse.CompletedResponse
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Fetch Lessons by Course
  const getLessonByCourse = useCallback(async () => {
    try {
      setLoading(true);
      const response = await lessonApi.getLessonByCourse({ courseId: id });
      if (response && response.data.code === 200) {
        const data = response.data.data;
        setLessons(Array.isArray(data) ? data : data ? [data] : []);
        // console.log("Lessons Data: ", response.data.data);
        toast.success("Lessons fetched successfully!");
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("Something went wrong while fetching lessons");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getLessonByCourse();
  }, [getLessonByCourse]);

  const fetchCompletedLessons = async () => {
    try {
      const response = await studentDashApi.allCompletedLesson();
      if (response.status === 200) {
        dispatch(updateAllCompletedResponse(response.data.data));
      } else {
        console.error("Failed to fetch responses:", response);
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
    }
  };
  useEffect(() => {
    fetchCompletedLessons();
  }, []);

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const handleUploadAudio = (e, lessonId) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith("audio") &&
      file.size <= 100 * 1024 * 1024
    ) {
      console.log("Uploaded File:", file);
      const url = URL.createObjectURL(file);
      setLessonAudio((prev) => ({
        ...prev,
        [lessonId]: { file, url, recording: null },
      }));
      setErrors((prevErrors) => ({ ...prevErrors, [lessonId]: "" }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [lessonId]: "Please upload a valid audio file (max 100MB)",
      }));
    }
  };

  // Handle Removing Audio
  const handleRemoveAudio = (lessonId) => {
    setLessonAudio((prev) => ({
      ...prev,
      [lessonId]: { file: null, url: "", recording: null },
    }));
  };

  // Start Recording
  const startRecording = async (lessonId) => {
    try {
      // console.log("Recording Started for:", lessonId);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/mp3" });
        const url = URL.createObjectURL(audioBlob);

        setLessonAudio((prev) => ({
          ...prev,
          [lessonId]: { file: audioBlob, url, recording: null },
        }));
      };
      // Set recorder state before starting to ensure it's stored properly
      setLessonAudio((prev) => ({
        ...prev,
        [lessonId]: { recording: mediaRecorder, file: null, url: "" },
      }));
      mediaRecorder.start();
      let time = 0;
      const timer = setInterval(() => {
        time++;
        setRecordingTime(time);
      }, 1000);
      // Ensure timer is stopped properly when recording stops
      mediaRecorder.onstop = () => {
        clearInterval(timer);
        const audioBlob = new Blob(chunks, { type: "audio/mp3" });
        const url = URL.createObjectURL(audioBlob);

        setLessonAudio((prev) => ({
          ...prev,
          [lessonId]: { file: audioBlob, url, recording: null },
        }));
      };
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [lessonId]: "Recording is not supported on your device",
      }));
    }
  };
  
  const stopRecording = (lessonId) => {
    try {
      if (!lessonAudio[lessonId]?.recording) return;

      const mediaRecorder = lessonAudio[lessonId].recording;
      mediaRecorder.stop(); // Stop recording
      mediaRecorder.stream.getTracks().forEach((track) => track.stop()); // Stop microphone access

      setLessonAudio((prev) => ({
        ...prev,
        [lessonId]: { ...prev[lessonId], recording: null },
      }));
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };
  // Submit Response to Backend
  const handleSubmitResponse = async (event, lessonId, courseId) => {
    event.preventDefault();
    // Ensure each lesson manages its own audio file
    if (!lessonAudio[lessonId]?.file) {
      toast.error("Please record or upload an audio file before submitting.");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("lessonId", lessonId);
    formDataToSend.append("courseId", courseId);

    const selectedFile = lessonAudio[lessonId]?.file;

    if (!(selectedFile instanceof Blob || selectedFile instanceof File)) {
      console.error(
        "Selected file is not a valid File or Blob object!",
        selectedFile
      );
      toast.error("Invalid audio file. Please try again.");
      return;
    }

    formDataToSend.append("file", selectedFile);

    // // ✅ Log FormData Correctly
    // for (let [key, value] of formDataToSend.entries()) {
    //   console.log(`${key}:`, value);
    // }

    try {
      // console.log("🟡 FormData inside try block:", formDataToSend);
      const response = await studentDashApi.createLesson(formDataToSend);
      // console.log("Response:", response);

      if (response.status === 200) {
        toast.success("Response submitted successfully!");

        // ✅ Reset only the current lesson's audio
        setLessonAudio((prev) => ({
          ...prev,
          [lessonId]: { file: null, url: "", recording: null },
        }));

        fetchCompletedLessons();
      } else {
        toast.error(`Failed to submit response. `);
      }
    } catch (error) {
      console.error("Failed to submit response", error);
      toast.error("Failed to submit response. Please try again.");
    }
  };

  return (
    // <MainCard title="Lessons List" content={false}>
    //   {loading ? (
    //     <Typography sx={{ p: 3, textAlign: "center" }}>Loading...</Typography>
    //   ) : (
    //     <Card>
    //       <Paper sx={{ width: "100%", overflow: "hidden" }}>
    //         <TableContainer sx={{ maxHeight: 540 }}>
    //           <Table stickyHeader aria-label="sticky table">
    //             <TableHead>
    //               <TableRow>
    //                 <TableCell align="center">S No.</TableCell>
    //                 <TableCell align="center">Lesson Name</TableCell>
    //                 <TableCell align="center">Audio</TableCell>
    //                 <TableCell align="center">Status</TableCell>
    //                 <TableCell align="center">Your Response</TableCell>
    //               </TableRow>
    //             </TableHead>
    //             <TableBody>
    //               {lessons
    //                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    //                 .map((lesson, index) => (
    //                   <TableRow
    //                     hover
    //                     role="checkbox"
    //                     tabIndex={-1}
    //                     key={lesson._id}
    //                   >
    //                     <TableCell align="center">{index + 1}</TableCell>
    //                     <TableCell align="center">{lesson.title}</TableCell>
    //                     <TableCell align="center">
    //                       {lesson.videoUrl ? (
    //                         <audio controls>
    //                           <source src={lesson.videoUrl} type="audio/mp3" />
    //                           Your browser does not support the audio element.
    //                         </audio>
    //                       ) : (
    //                         "No Audio"
    //                       )}
    //                     </TableCell>
    //                     <TableCell align="center">{lesson.status}</TableCell>
    //                   </TableRow>
    //                 ))}
    //             </TableBody>
    //           </Table>
    //         </TableContainer>
    //         <TablePagination
    //           rowsPerPageOptions={[10, 20, 100]}
    //           component="div"
    //           count={lessons.length}
    //           rowsPerPage={rowsPerPage}
    //           page={page}
    //           onPageChange={handleChangePage}
    //           onRowsPerPageChange={handleChangeRowsPerPage}
    //         />
    //       </Paper>
    //     </Card>
    //   )}
    // </MainCard>
    <MainCard title="Lessons List" content={false}>
      {loading ? (
        <Typography sx={{ p: 3, textAlign: "center" }}>Loading...</Typography>
      ) : (
        <Card>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 540 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">S No.</TableCell>
                    <TableCell align="center">Lesson Name</TableCell>
                    <TableCell align="center">Audio</TableCell>
                    <TableCell align="center">Progress</TableCell>
                    <TableCell align="center">Your Response</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lessons
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((lesson, index) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={lesson._id}
                      >
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{lesson.title}</TableCell>
                        <TableCell align="center">
                          {lesson.videoUrl ? (
                            <audio controls controlsList="nodownload">
                              <source src={lesson.videoUrl} type="audio/mp3" />
                              Your browser does not support the audio element.
                            </audio>
                          ) : (
                            "No Audio"
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {completeLesson.some(
                            (completed) => completed.lessonId._id === lesson._id
                          ) ? (
                            <Typography color="success.main">
                              Submitted
                            </Typography>
                          ) : (
                            <Typography color="error.main">
                              Not Submitted
                            </Typography>
                          )}
                        </TableCell>
                        {/* ✅ Response Column (Shows Preview of Uploaded/Recorded Audio) */}
                        <TableCell align="center">
                          {completeLesson.find(
                            (completed) => completed.lessonId._id === lesson._id
                          ) ? (
                            // Show API Response if submitted
                            <audio controls controlsList="nodownload">
                              <source
                                src={
                                  completeLesson.find(
                                    (completed) =>
                                      completed.lessonId._id === lesson._id
                                  )?.url
                                }
                                type="audio/mp3"
                              />
                              Your browser does not support the audio element.
                            </audio>
                          ) : lessonAudio[lesson._id]?.url ? (
                            // Show locally uploaded/recorded preview if NOT submitted
                            <audio controls controlsList="nodownload">
                              <source
                                src={lessonAudio[lesson._id]?.url}
                                type="audio/mp3"
                              />
                              Your browser does not support the audio element.
                            </audio>
                          ) : (
                            // If neither uploaded nor submitted
                            "No Response"
                          )}
                        </TableCell>

                        {/* ✅ Actions Column */}
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            {/* Record Button */}
                            {!lessonAudio[lesson._id]?.recording &&
                              !lessonAudio[lesson._id]?.file && (
                                <IconButton
                                  color="primary"
                                  onClick={() => startRecording(lesson._id)}
                                >
                                  <MicIcon />
                                </IconButton>
                              )}

                            {/* Stop Recording Button */}
                            {lessonAudio[lesson._id]?.recording && (
                              <IconButton
                                color="error"
                                onClick={() => stopRecording(lesson._id)}
                              >
                                <MicOffIcon />
                              </IconButton>
                            )}

                            {/* Upload Button */}
                            <IconButton color="secondary" component="label">
                              <AttachFileIcon />
                              <input
                                type="file"
                                hidden
                                accept="audio/*"
                                onChange={(e) =>
                                  handleUploadAudio(e, lesson._id)
                                }
                              />
                            </IconButton>

                            {/* Remove Audio Button */}
                            {lessonAudio[lesson._id]?.file && (
                              <IconButton
                                color="warning"
                                onClick={() => handleRemoveAudio(lesson._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}

                            {/* Submit Button (Only Enabled if Audio Exists) */}
                            <IconButton
                              color="success"
                              onClick={(event) =>
                                handleSubmitResponse(
                                  event,
                                  lesson._id,
                                  lesson.courseId?._id
                                )
                              }
                              disabled={!lessonAudio[lesson._id]?.file}
                            >
                              <SendIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20, 100]}
              component="div"
              count={lessons.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Card>
      )}
    </MainCard>
  );
}
