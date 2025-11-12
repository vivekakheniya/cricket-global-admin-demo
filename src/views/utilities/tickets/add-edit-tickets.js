import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Typography,
  FormControl,
  Select,
} from "@mui/material";
import InputLabel from "ui-component/extended/Form/InputLabel";
import MainCard from "ui-component/cards/MainCard";
import { Add, Remove, Delete } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import ticketsInstance from "apis/tickets.api";
import { Box } from "@mui/system";
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
    venue: "",
    locality: "",
    city: "",
    state: "",
    tickets: [{ type: "adult", price: "", quantity: "" },
    { type: "child", price: "", quantity: "" }
    ],
    maxParticipants: "",
    eventType: "",//paid
    images: [],
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [ticketErrors, setTicketErrors] = useState({});

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

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle Tickets
  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...formData.tickets];
    updatedTickets[index][field] =
      value;
    console.log("Updating tickets:", updatedTickets);
    const totalSeats = updatedTickets.reduce(
      (sum, ticket) => sum + (Number(ticket.quantity) || 0),
      0
    );

    //  Live validation
    if (
      formData.maxParticipants &&
      totalSeats > Number(formData.maxParticipants)
    ) {
      setTicketErrors({
        [index]: `Total seats (${totalSeats}) exceed max participants (${formData.maxParticipants}).`,
      });
    } else {
      setTicketErrors({});
    }

    //  field === "price" || field === "quantity" ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const addTicket = () =>
    setFormData((prev) => ({
      ...prev,
      tickets: [...prev.tickets, { type: "", price: 0, quantity: 0 }],
    }));

  const removeTicket = (index) => {
    if (formData.tickets.length === 1) return;
    const updatedTickets = [...formData.tickets];
    updatedTickets.splice(index, 1);
    setFormData((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  // Handle File Uploads
  const handleImageUpload = async (e, key) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const res = await uploadApi.upload({ folderName: "event", file });

        if (res?.data?.data) {
          return res.data.data;
        } else {
          throw new Error("Upload failed");
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setFormData((prev) => {
        if (key === "bannerImage") {
          toast.success("Banner image uploaded successfully!");
          return { ...prev, bannerImage: uploadedUrls[0] };
        } else if (key === "images") {
          toast.success("Images uploaded successfully!");
          return { ...prev, images: [...(prev.images || []), ...uploadedUrls] };
        } else return prev;
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload images. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updated = [...formData.images];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: updated }));
  };


  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "Event title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.bannerImage) newErrors.bannerImage = "Banner image is required";
    if (!formData.venue) newErrors.venue = "Venue is required";
    if (!formData.locality) newErrors.locality = "Address is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.images || formData.images.length === 0)
      newErrors.images = "Please upload at least one event image";

    // 🧮 Calculate total seats from tickets
    const totalSeats = formData.tickets.reduce(
      (sum, ticket) => sum + (Number(ticket.quantity) || 0),
      0
    );

    // Validation for total seats
    if (formData.maxParticipants && totalSeats > Number(formData.maxParticipants)) {
      newErrors.maxParticipants = `Total seats from tickets (${totalSeats}) cannot exceed maximum participants (${formData.maxParticipants}).`;
      // toast.error(
      //   `Total seats (${totalSeats}) exceed max participants (${formData.maxParticipants}).`
      // );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      console.log("Submitting formData:", formData);
      const response = id
        ? await ticketsInstance.UpdateEventById({ id, data: formData })
        : await ticketsInstance.CreateTicketsForEvent(formData);

      if (response?.status === 200) {
        toast.success(
          id ? "Event updated successfully!" : "Event ticket added successfully!"
        );
        navigate("/event-list", { replace: true });
      } else if (response?.status === 401) {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Error creating/updating event:", error);
      const msg = error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(msg);
    }
  };

  // Fetch Existing Event if Editing
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const response = await ticketsInstance.GetTicketEventById(id);
        if (response?.data?.status === "Success") {
          const data = response.data.data;
          setFormData({
            ...data,
            startDate: new Date(data.startDate).toISOString().slice(0, 16),
            endDate: new Date(data.endDate).toISOString().slice(0, 16),
          });
        }
      } catch (error) {
        toast.error("Error fetching event data");
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
          {/* Event Title */}
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <InputLabel required>Category</InputLabel>
            <TextField
              select
              fullWidth
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={!!errors.category}
              helperText={errors.category}
              SelectProps={{
                displayEmpty: true, // 👈 enables showing placeholder when value is ""
              }}
            >
              <MenuItem value="" disabled>
                <span style={{ color: 'rgb(187 194 202)' }}>Select Event Category</span>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Event Type */}
          <Grid item xs={12} sm={6}>
            <InputLabel required>Event Type</InputLabel>
            <TextField
              select
              fullWidth
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              error={!!errors.eventType}
              helperText={errors.eventType}
              SelectProps={{
                displayEmpty: true, // 👈 enables showing placeholder when value is ""
              }}
            >
              <MenuItem value="" disabled>
                <span style={{ color: 'rgb(187 194 202)' }}>Select event type</span>
              </MenuItem>

              {eventtypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>

          </Grid>

          {/* Max Participants */}
          <Grid item xs={12} sm={6}>
            <InputLabel>No. of Seats</InputLabel>
            <TextField
              fullWidth
              type="text"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={(e) => {
                const value = e.target.value;

                // ✅ Allow only digits (no spaces, no letters)
                if (/^\d*$/.test(value)) {
                  handleChange(e);
                }
              }}
              placeholder="Enter max seats"
              error={!!errors.maxParticipants}
              helperText={errors.maxParticipants}
              inputProps={{
                inputMode: "numeric", // shows numeric keyboard on mobile
                pattern: "[0-9]*",
              }}
            />

            {/* <TextField
              fullWidth
              type="text"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              placeholder="Enter max seats"
              error={!!errors.maxParticipants}
              helperText={errors.maxParticipants}
            />  */}

          </Grid>

          {/* Venue Details */}
          <Grid item xs={12} sm={6}>
            <InputLabel required>Venue</InputLabel>
            <TextField
              fullWidth
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              error={!!errors.venue}
              helperText={errors.venue}
              placeholder="Enter event venue"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel required>Address</InputLabel>
            <TextField
              fullWidth
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              error={!!errors.locality}
              helperText={errors.locality}
              placeholder="Enter event address"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel>City</InputLabel>
            <TextField
              fullWidth
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter event city"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel>State</InputLabel>
            <TextField
              fullWidth
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter event state"
            />
          </Grid>

          {/* Dates */}
          <Grid item xs={12} sm={6}>
            <InputLabel required>Start Date & Time</InputLabel>
            <TextField
              fullWidth
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              error={!!errors.startDate}
              helperText={errors.startDate}
              placeholder="Select start date"
              InputLabelProps={{
                shrink: true, //keeps label from overlapping
              }}
              inputProps={{
                //  Disable all past dates AND past times today
                min: new Date().toISOString().slice(0, 16),
                style: { color: '#000' }, // text color
              }}
              sx={{
                '& input::placeholder': {
                  color: 'rgb(187, 194, 202)', //  placeholder color
                  opacity: 1,
                },
              }}
            />



          </Grid>

          <Grid item xs={12} sm={6}>
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
          {/* Tickets Section */}
          <Grid item xs={12}>
            <InputLabel variant="h6" sx={{ mb: 1 }}>
              Ticket Details
            </InputLabel>

            {formData.tickets.map((ticket, idx) => (
              <Grid
                container
                spacing={2}
                key={idx}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  // background: "#f8fafc",
                }}
              >
                <Grid item xs={12}>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    {ticket?.type === "adult" ? "Adult Ticket" : "Child Ticket"}
                  </Typography>
                </Grid>
                {/* Ticket Seats */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Seats"
                    value={ticket.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      // ✅ Allow only digits or empty string
                      if (value === "" || /^[0-9\b]+$/.test(value)) {
                        handleTicketChange(idx, "quantity", value);
                      }
                    }}
                    onKeyDown={(e) => {
                      // 🚫 Prevent unwanted characters
                      if (["e", "E", "+", "-", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter seats"
                    InputProps={{
                      inputMode: "numeric",
                    }}
                  />
                </Grid>

                {/* Ticket Price */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Price (€)"
                    value={ticket.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^[0-9\b]+$/.test(value)) {
                        handleTicketChange(idx, "price", value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter ticket price"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">€</InputAdornment>
                      ),
                      inputMode: "numeric",
                    }}
                  />
                </Grid>


                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Price (€)"
                    value={ticket.price}
                    onChange={(e) =>
                      handleTicketChange(idx, "price", Number(e.target.value))
                    }
                    
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">€</InputAdornment>
                      ),
                    }}
                  />
                </Grid> */}

                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Seats"
                    value={ticket.quantity}
                    onChange={(e) =>
                      handleTicketChange(idx, "quantity", Number(e.target.value))
                    }
                  />
                 

                </Grid> */}
              </Grid>
            ))}
          </Grid>
          {/* Banner Image */}
          <Grid item xs={12} sm={6}>
            <InputLabel required>Banner Image</InputLabel>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 140,
                border: "1px solid #ccc",
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8fafc",
              }}
              onClick={() =>
                document.getElementById("bannerImageInput")?.click()
              }
            >
              {formData.bannerImage ? (
                <img
                  src={formData.bannerImage}
                  alt="Banner"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              ) : (
                <Typography
                  color="textSecondary"
                  sx={{
                    textAlign: "center",
                    fontSize: "0.95rem",
                  }}
                >
                  {uploading ? "Uploading..." : "Click to upload banner image"}
                </Typography>
              )}

              <input
                hidden
                id="bannerImageInput"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "bannerImage")}
              />
            </Box>

            {errors.bannerImage && (
              <Typography color="error" variant="caption">
                {errors.bannerImage}
              </Typography>
            )}
          </Grid>


          {/*Multiple Images:  Event Gallery Images */}
          <Grid item xs={12} sm={6}>
            <InputLabel required>Event Gallery Images</InputLabel>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 140,
                border: "1px solid #ccc",
                borderRadius: 2,
                overflowX: "auto",
                overflowY: "hidden",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1,
                cursor: "pointer",
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": { height: 4 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#bbb",
                  borderRadius: 3,
                },
                backgroundColor: "#f8fafc",
              }}
              onClick={() => document.getElementById("eventGalleryInput")?.click()}
            >
              {/* Uploaded Images */}
              {formData.images?.length > 0 ? (
                formData.images.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      position: "relative",
                      minWidth: 120,
                      height: 120,
                      flexShrink: 0,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Event ${idx}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        background: "#fff",
                        "&:hover": { background: "#f8d7da" },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <Typography
                  color="textSecondary"
                  sx={{
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {uploading ? "Uploading..." : "Click to upload event images"}
                </Typography>
              )}

              {/* Hidden Input */}
              <input
                hidden
                id="eventGalleryInput"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "images")}
              />
            </Box>

            {errors.images && (
              <Typography color="error" variant="caption">
                {errors.images}
              </Typography>
            )}
          </Grid>


          {/* Description */}
          <Grid item xs={12}>
            <InputLabel required>Description</InputLabel>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              sx={{ backgroundColor: "f8fafc" }}
              placeholder="Enter event description"
            />
          </Grid>

          {/* Submit */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  px: 6,
                  py: 1.2,
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                  },
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
