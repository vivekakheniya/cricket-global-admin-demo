import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  FormControl,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import InputLabel from "ui-component/extended/Form/InputLabel";
import MainCard from "ui-component/cards/MainCard";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import membershipInstance from "apis/membership.api";
import { useTheme } from "@mui/material/styles";
import Upload from "apis/upload.api";
import { Box } from "@mui/system";

function AddMembership() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
   const uploadApi = new Upload();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationValue: "0",
    durationUnit: "lifetime",
    isActive: true,
    benefit: [""], // ✅ fixed from 'benefit' → 'benefit'
    coverImage: "",
  });

  const [errors, setErrors] = useState({});

  const [uploading, setUploading] = useState(false);
  // ✅ Handle array inputs (benefit)
  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayField = (field, index) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  // ✅ Dynamic array renderer
  const renderArrayInputs = (field, label) => (
    <FormControl fullWidth sx={{ mb: 2 }}>
      {/* Header with label and Add button */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Grid item>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={() => addArrayField(field)}
            startIcon={<Add />}
            variant="contained"
            color="primary"
            size="small"
          >
            Add
          </Button>
        </Grid>
      </Grid>

      {/* Dynamic Inputs */}
      <Grid container spacing={1}>
        {formData[field].map((val, index) => (
          <Grid
            item
            xs={12}
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              value={val}
              onChange={(e) =>
                handleArrayChange(field, index, e.target.value)
              }
              placeholder={`${label} ${index + 1}`}
            />
            <IconButton
              color="error"
              size="small"
              onClick={() => removeArrayField(field, index)}
            >
              <Close />
            </IconButton>
          </Grid>
        ))}
      </Grid>
    </FormControl>
  );


  const handleImageUpload = async (e, key) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      setUploading(true);
      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const res = await uploadApi.upload({ folderName: "membershipImages", file });
  
          if (res?.data?.data) {
            return res.data.data;
          } else {
            throw new Error("Upload failed");
          }
        });
  
        const uploadedUrls = await Promise.all(uploadPromises);
  
        setFormData((prev) => {
          if (key === "coverImage") {
            toast.success("Banner image uploaded successfully!");
            return { ...prev, coverImage: uploadedUrls[0] };
          }  else return prev;
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload images. Try again.");
      } finally {
        setUploading(false);
      }
    };
  // ✅ Handle basic field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      if (value === "" || /^[0-9\b]+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "durationUnit") {
      setFormData((prev) => ({
        ...prev,
        durationUnit: value,
        durationValue: value === "lifetime" ? "0" : prev.durationValue,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Membership name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.durationUnit)
      newErrors.durationUnit = "Duration unit is required";
    if (!formData.durationValue && formData.durationUnit !== "lifetime") {
      newErrors.durationValue = "Duration value is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      if (id) {
        const response = await membershipInstance.UpdateMembershipById({
          id,
          data: formData,
        });
        if (response?.status === 200) {
          toast.success("Membership updated successfully!");
          navigate("/membership-list", { replace: true });
        }
      } else {
        const response = await membershipInstance.CreateMembership(formData);
        if (response?.status === 200) {
          toast.success("Membership added successfully!");
          navigate("/membership-list", { replace: true });
        }
      }
    } catch (error) {
      console.error("Error creating/updating membership:", error);
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    }
  };

  // ✅ Fetch data if editing
  useEffect(() => {
    const fetchMembership = async () => {
      if (!id) return;

      try {
        const response = await membershipInstance.GetMembershipById(id);
        if (response?.data?.status === "Success") {
          const data = response.data.data;
          setFormData({
            name: data.name || "",
            description: data.description || "",
            price: data.price || "",
            durationValue: data.durationValue || "",
            durationUnit: data.durationUnit || "",
            isActive: data.isActive ?? true,
            benefit: data.benefit?.length ? data.benefit : [""],
          });
        } else {
          toast.error("Failed to fetch membership details");
        }
      } catch (error) {
        console.error("Error fetching membership:", error);
        toast.error("Something went wrong while fetching membership data");
      }
    };

    fetchMembership();
  }, [id]);

  // ✅ Render UI
  return (
    <MainCard title={id ? "Edit Membership Plan" : "Add Membership Plan"}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <InputLabel required>Membership Plan</InputLabel>
            <TextField
              fullWidth
              name="name"
              placeholder="Enter membership plan name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={4}>
            <InputLabel required>Price (€)</InputLabel>
            <TextField
              fullWidth
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              onWheel={(e) => e.target.blur()}
              placeholder="Enter amount in €"
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={2}>
            <InputLabel required>Duration (digit)</InputLabel>
            <TextField
              fullWidth
              type="number"
              name="durationValue"
              value={formData.durationValue}
              onChange={handleChange}
              placeholder="Enter duration"
              disabled={formData.durationUnit === "lifetime"}
              error={!!errors.durationValue}
              helperText={
                formData.durationUnit === "lifetime"
                  ? "auto set for lifetime"
                  : errors.durationValue
              }
            />
          </Grid>

          <Grid item xs={2}>
            <InputLabel required>Duration (Unit)</InputLabel>
            <TextField
              select
              fullWidth
              name="durationUnit"
              value={formData.durationUnit}
              onChange={handleChange}
              error={!!errors.durationUnit}
              helperText={errors.durationUnit}
            >
              <MenuItem value="days">Days</MenuItem>
              <MenuItem value="months">Months</MenuItem>
              <MenuItem value="years">Years</MenuItem>
              <MenuItem value="lifetime">Lifetime</MenuItem>
            </TextField>
          </Grid>

          {/* ✅ Dynamic Feature Inputs */}
          <Grid item xs={12}>
            {renderArrayInputs("benefit", "benefit")}
          </Grid>

          {id && (
            <Grid item xs={4}>
              <InputLabel required>Status</InputLabel>
              <TextField
                select
                fullWidth
                name="isActive"
                value={formData.isActive ? "Active" : "Inactive"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.value === "Active",
                  }))
                }
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          )}
          
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
                          document.getElementById("coverImageInput")?.click()
                        }
                      >
                        {formData.coverImage ? (
                          <img
                            src={formData.coverImage}
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
                          id="coverImageInput"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "coverImage")}
                        />
                      </Box>
          
                      {errors.coverImage && (
                        <Typography color="error" variant="caption">
                          {errors.coverImage}
                        </Typography>
                      )}
                    </Grid>

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
            />
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="center">
            <Grid item xs={4}>
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

export default AddMembership;
