import React, { useState } from "react";
import {
  Button,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import InputLabel from "ui-component/extended/Form/InputLabel";
import MainCard from "ui-component/cards/MainCard";
import { Add, Remove } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import ticketsInstance from "apis/tickets.api";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Upload from "apis/upload.api";

function AddEventTickets() {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const uploadApi = new Upload();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    bannerImage: "",
    startDate: "",
    endDate: "",
    venue: "Wankhede Stadium, Mumbai",
    locality: "",
    city: "",
    state: "",
    tickets: [{ type: "", price: 0, quantity: 0 }],
    maxParticipants: 0,
    eventType: "paid",
  });
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: "Sports", label: "Sports" },
    { value: "Music", label: "Music" },
    { value: "Technology", label: "Technology" },
    { value: "Education", label: "Education" },
    { value: "Culture", label: "Culture" },
    { value: "Other", label: "Other" },
  ];
  const eventtypes = [
    { value: "paid", label: "Paid" },
    { value: "free", label: "Free" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...formData.tickets];
    updatedTickets[index][field] =
      field === "price" || field === "quantity"
        ? parseFloat(value) || 0
        : value;
    setFormData((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const addTicket = () => {
    setFormData((prev) => ({
      ...prev,
      tickets: [...prev.tickets, { name: "", price: 0, quantity: 0 }],
    }));
  };

  const removeTicket = (index) => {
    if (formData.tickets.length === 1) return; // must keep one minimum
    const updatedTickets = [...formData.tickets];
    updatedTickets.splice(index, 1);
    setFormData((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataToSend = new FormData();

      const res = await uploadApi.upload({ folderName: "event", file });
      console.log("Image upload response:", res);

      if (res?.data) {
        setFormData((prev) => ({ ...prev, bannerImage: res?.data?.data }));
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Event title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.bannerImage)
      newErrors.bannerImage = "Banner image is required";
    if (!formData.venue) newErrors.venue = "Venue is required";
    if (!formData.locality) newErrors.locality = "Address is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      if (id) {
        // Update existing event
        const response = await ticketsInstance.UpdateEventById({
          id,
          data: formData,
        });
        console.log("UpdateEventById response:", response);

        if (response?.status === 200) {
          toast.success("Event updated successfully!");
          navigate("/event-list", { replace: true });
        }
      } else {
        // Create new event
        const response = await ticketsInstance.CreateTicketsForEvent(formData);
        console.log("CreateTicketsForEvent response:", response);

        if (response?.status === 200) {
          toast.success("Event ticket added successfully!");
          navigate("/event-list", { replace: true });
        } else if (response?.status === 401) {
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      console.error("Error creating/updating event:", error);
      const errorMessage =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(errorMessage);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return new Date(dateString).toLocaleString("en-US", options);
  };

  // Convert ISO date to local input format
  const toLocalDateTime = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  // Example:
  const formattedDate = formatDateForInput("2026-11-02T13:30:00.000Z");
  console.log(formattedDate); // "11/02/2026, 01:30 PM" (depending on timezone)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        const response = await ticketsInstance.GetTicketEventById(id);
        console.log(
          "GetTicketEventById response:",
          formatDateForInput(response.data?.data?.startDate),
          response,
          response.data?.data?.startDate,
          response?.data?.data
        );
        const startdate = formatDateForInput(response.data?.data?.startDate);
        const enddate = formatDateForInput(response.data?.data?.endDate);
        if (response?.data?.status === "Success") {
          const data = response.data?.data; // adjust based on API response
          setFormData({
            title: data.title || "",
            description: data.description || "",
            category: data.category || "",
            venue: data.venue || "",
            city: data.city || "",
            state: data.state || "",
            locality: data.locality || "",
            startDate: toLocalDateTime(startdate) || "",
            endDate: toLocalDateTime(enddate) || "",
            eventType: data.eventType.toLowerCase() || "paid",
            maxParticipants: data.maxParticipants || "",
            isActive: data.isActive || false,
            tickets: data.tickets || [],
            bannerImage: data.bannerImage || "",
          });
        } else {
          toast.error("Failed to fetch event details");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Something went wrong while fetching event data");
      }
    };

    fetchEvent();
  }, [id]);

  const inputStyle = {
    "& input[type=number]": { MozAppearance: "textfield" },
    "& input[type=number]::-webkit-outer-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
  };

  return (
    <MainCard title={id ? "Edit Event Ticket" : "Add Event Ticket"}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12} sm={6} md={6}>
            <InputLabel required>Event Title</InputLabel>
            <TextField
              fullWidth
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6} md={6}>
            <InputLabel required>Category</InputLabel>
            <TextField
              select
              fullWidth
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Select category"
              error={!!errors.category}
              helperText={errors.category}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6} md={6}>
            <InputLabel required>Event Type</InputLabel>
            <TextField
              select
              fullWidth
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              placeholder="Select eventType"
              error={!!errors.eventType}
              helperText={errors.eventType}
            >
              {eventtypes.map((eventtype) => (
                <MenuItem key={eventtype.value} value={eventtype.value}>
                  {eventtype.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* Max Participants */}
          <Grid item xs={12} sm={6} md={6}>
            <InputLabel>No. of Seats</InputLabel>
            <TextField
              fullWidth
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              placeholder="Enter max event's seat"
            />
          </Grid>

          {/* Venue Info */}
          <Grid item xs={12} md={6}>
            <InputLabel required>Venue</InputLabel>
            <TextField
              fullWidth
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Venue name"
              error={!!errors.venue}
              helperText={errors.venue}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel required>Address</InputLabel>
            <TextField
              fullWidth
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              placeholder="Address"
              error={!!errors.locality}
              helperText={errors.locality}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <InputLabel>City</InputLabel>
            <TextField
              fullWidth
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <InputLabel>State</InputLabel>
            <TextField
              fullWidth
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
            />
          </Grid>

          {/* Dates */}
          <Grid item xs={12} md={6}>
            <InputLabel required>Start Date & Time</InputLabel>
            <TextField
              fullWidth
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              error={!!errors.startDate}
              helperText={errors.startDate}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InputLabel required>End Date & Time</InputLabel>
            <TextField
              fullWidth
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              error={!!errors.endDate}
              helperText={errors.endDate}
            />
          </Grid>

          {/* Tickets */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Tickets
            </Typography>

            {formData.tickets.map((ticket, idx) => (
              <Grid
                container
                spacing={2}
                key={idx}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Grid item xs={12} sm={4} md={3}>
                  <TextField
                    fullWidth
                    value={ticket.type}
                    onChange={(e) =>
                      handleTicketChange(idx, "name", e.target.value)
                    }
                    placeholder="Ticket name"
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    value={ticket.price}
                    placeholder="Price (€)"
                    onChange={(e) =>
                      handleTicketChange(idx, "price", e.target.value)
                    }
                    sx={inputStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">€</InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    value={ticket.quantity}
                    placeholder="No. of Seats"
                    onChange={(e) =>
                      handleTicketChange(idx, "quantity", e.target.value)
                    }
                    sx={inputStyle}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={3}
                  display="flex"
                  alignItems="center"
                >
                  {formData.tickets.length > 1 && (
                    <IconButton color="error" onClick={() => removeTicket(idx)}>
                      <Remove />
                    </IconButton>
                  )}
                  {idx === formData.tickets.length - 1 && (
                    <IconButton color="primary" onClick={addTicket}>
                      <Add />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>

          {/* Banner Image */}
          <Grid item xs={12} md={6}>
            <InputLabel required>Banner Image</InputLabel>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 90,
                border: "1px solid #c4c4c4",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fafafa",
                cursor: "pointer",
                overflow: "hidden",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
              onClick={() =>
                document.getElementById("bannerImageInput")?.click()
              }
            >
              {formData.bannerImage ? (
                <img
                  src={formData.bannerImage}
                  alt="Banner Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography color="textSecondary">
                  {uploading ? "Uploading..." : "Click to upload banner image"}
                </Typography>
              )}
              <input
                id="bannerImageInput"
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Box>
            {errors.bannerImage && (
              <Typography color="error" variant="caption">
                {errors.bannerImage}
              </Typography>
            )}
          </Grid>

          {/* Description */}
          <Grid item xs={12} md={6}>
            <InputLabel required>Description</InputLabel>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add short event details"
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          {/* Submit */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  px: 6,
                  py: 1.2,
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": { backgroundColor: theme.palette.secondary.dark },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}

export default AddEventTickets;
