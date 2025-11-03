import React, { useState, useEffect } from "react";
import MainCard from "ui-component/cards/MainCard";
import InputLabel from "ui-component/extended/Form/InputLabel";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button, Grid, Stack, TextField, Box } from "@mui/material";
import StudentApi from "apis/users.api"; // Replace with actual API

function AddStudent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const studentApi = new StudentApi();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch existing student details if updating
  useEffect(() => {
    if (id) {
      const fetchStudentData = async () => {
        try {
          const response = await studentApi.studentById({ studentId: id });
          if (response?.data?.data) {
            setFormData({
              name: response.data.data.name,
              email: response.data.data.email,
              contact: response.data.data.contact,
              password: "", // Don't pre-fill password for security reasons
            });
          }
        } catch (error) {
          toast.error("Failed to fetch student details.");
        }
      };
      fetchStudentData();
    }
  }, [id]);

  // Validation Function
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.contact) newErrors.contact = "Contact is required";

    // Password validation
    if (!formData.password && !id) {
      newErrors.password = "Password is required";
    } else if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Must contain at least one lowercase letter";
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "Must contain at least one number";
      } else if (!/[!@#$%^&*]/.test(formData.password)) {
        newErrors.password =
          "Must contain at least one special character (!@#$%^&*)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle Form Submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      let response;
      if (id) {
        console.log("Updating student with ID:", id);
        response = await studentApi.editStudent({ studentId: id, ...formData });
      } else {
        response = await studentApi.addStudent(formData);
      }

      toast.success(
        id ? "Student updated successfully!" : "Student added successfully!"
      );
      navigate("/student-list", { replace: true });
    } catch (error) {
      toast.error("Failed to save student.");
    }
  };

  return (
    <MainCard>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} direction="column">
          <Grid item xs={12}>
            <Stack>
              <InputLabel required>Name</InputLabel>
              <TextField
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack>
              <InputLabel required>Email</InputLabel>
              <TextField
                fullWidth
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack>
              <InputLabel required>Contact</InputLabel>
              <TextField
                fullWidth
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                error={!!errors.contact}
                helperText={errors.contact}
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack>
              <InputLabel required>Password</InputLabel>
              <TextField
                fullWidth
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <center>
              <Button variant="contained" type="submit">
                {id ? "Update Student" : "Add Student"}
              </Button>
            </center>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}

export default AddStudent;
