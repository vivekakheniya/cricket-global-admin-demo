import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem, InputAdornment
} from "@mui/material";
import InputLabel from "ui-component/extended/Form/InputLabel";
import MainCard from "ui-component/cards/MainCard";
import { Add, Remove } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import membershipInstance from "apis/membership.api";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";

function AddMembership() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationValue: "",
    durationUnit: "days",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      // Allow only digits, no negative or exponential input
      if (value === "" || /^[0-9\b]+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
    else if (name === "durationInDays") {
      // Allow: number + optional space + unit (day(s), month(s), year(s))
      if (/^\d*\s*(day|days|month|months|year|years)?$/i.test(value) || value === "") {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
    else {
      // Normal text fields
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear field-specific error if user types again
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Membership name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.durationInDays)
      newErrors.durationInDays = "Duration is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Update existing membership
        const response = await membershipInstance.UpdateMembershipById({id:id, data:formData});
        console.log("UpdateMembershipById--------------", response)
        if (response?.status === 200) {
          toast.success("Membership updated successfully!");
          navigate("/membership-list", { replace: true });
        }
      } else {
        // Create new membership
        const response = await membershipInstance.CreateMembership(formData);
        if (response?.status === 200) {
          toast.success("Membership added successfully!");
          navigate("/membership-list", { replace: true });
        }
      }
    } catch (error) {
      console.error("Error creating/updating membership:", error);
      const errorMessage =
        error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchMembership = async () => {
      if (!id) return;

      try {
        const response = await membershipInstance.GetMembershipById(id);
        console.log("response id--------------", response, response?.data?.data)

        if (response?.data?.status === "Success") {
          const data = response.data?.data; // adjust based on API response
          setFormData({
            name: data.name || "",
            description: data.description || "",
            price: data.price || "",
            durationValue: data.durationValue || "",
            durationUnit: data.durationUnit || "",
            isActive: data.isActive || false,
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
              sx={{
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                ),
              }}
            />
          </Grid>


          <Grid item xs={4}>
            <InputLabel required>Duration</InputLabel>
            <TextField
              fullWidth
              type="number"
              name="durationValue"
              value={formData.durationValue}
              onChange={handleChange}
              error={!!errors.durationValue}
              helperText={errors.durationValue}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <TextField
                      select
                      name="durationUnit"
                      value={formData.durationUnit}
                      onChange={handleChange}
                      variant="standard"
                      sx={{
                        minWidth: 80,
                        "& .MuiInputBase-input": { padding: "4px 8px" },
                      }}
                    >
                      <MenuItem value="days">Days</MenuItem>
                      <MenuItem value="months">Months</MenuItem>
                      <MenuItem value="years">Years</MenuItem>
                    </TextField>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
            />
          </Grid>
         {id && <Grid item xs={4}>
            <InputLabel required>Status</InputLabel>
            <TextField
              select
              fullWidth
              name="isActive"
              value={formData.isActive ? "Active" : "Inactive"} // show Active/Inactive
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.value === "Active", // convert back to boolean
                }))
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Grid>}


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

          <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
            <Grid xs={4}>
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

{/* <TextField
              fullWidth
              type="text"
              name="durationInDays"
              value={formData.durationInDays}
              onChange={handleChange}
              placeholder="e.g. 30 days or 1 year"
              error={!!errors.durationInDays}
              helperText={errors.durationInDays}
            /> */}