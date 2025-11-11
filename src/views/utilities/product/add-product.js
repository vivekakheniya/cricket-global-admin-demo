import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useTheme } from "@mui/material/styles";
import InputLabel from "ui-component/extended/Form/InputLabel";
import MainCard from "ui-component/cards/MainCard";
import { AddPhotoAlternate, Delete } from "@mui/icons-material";
import ProductApi from "apis/product.api";
import Upload from "apis/upload.api";

export default function ProductForm() {
  const uploadApi = new Upload();
  const productApi = new ProductApi();
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    coverImage: "",
    images: [],
  });
  const [errors, setErrors] = useState({});

  // handle normal input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // upload cover image
  const handleCoverImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("folderName", "product");
      uploadData.append("file", file);
      const res = await uploadApi.upload(uploadData);

      if (res?.data) {
        setFormData((prev) => ({ ...prev, coverImage: res.data?.data }));
        toast.success("Cover image uploaded successfully!");
      } else throw new Error("Upload failed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload cover image");
    } finally {
      setUploading(false);
    }
  };

  // upload product image(s)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("folderName", "product");
      uploadData.append("file", file);
      const res = await uploadApi.upload(uploadData);

      if (res?.data) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, res.data?.data],
        }));
        toast.success("Image uploaded successfully!");
      } else throw new Error("Upload failed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = (index) => {
    const updated = [...formData.images];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.stock) newErrors.stock = "Stock is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.coverImage) newErrors.coverImage = "Cover image is required";
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
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        category: formData.category,
        coverImage: formData.coverImage,
        images: formData.images,
      };

      let response;
      if (id) {
        response = await productApi.editProduct(id, payload);
      } else {
        response = await productApi.createProduct(payload);
      }

      if (response?.status === 200 || response?.data?.status === "Success") {
        toast.success(
          id ? "Product updated successfully!" : "Product created successfully!"
        );
        navigate("/product-list", { replace: true });
      } else {
        toast.error("Failed to save product");
      }
    } catch (error) {
      console.error("Error creating/editing product:", error);
      toast.error("Something went wrong while saving product");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await productApi.getProductById(id);
        if (response?.data?.data) {
          const data = response.data.data;
          setFormData({
            name: data.name || "",
            description: data.description || "",
            price: data.price || "",
            stock: data.stock || "",
            category: data.category || "",
            coverImage: data.coverImage || "",
            images: data.images || [],
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details");
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <MainCard title={id ? "Edit Product" : "Add Product"}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* Product Name */}
          <Grid item xs={6}>
            <InputLabel required>Product Name</InputLabel>
            <TextField
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={6}>
            <InputLabel required>Category</InputLabel>
            <TextField
              fullWidth
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              error={!!errors.category}
              helperText={errors.category}
            />
          </Grid>

          {/* Price */}
          <Grid item xs={6}>
            <InputLabel required>Price (€)</InputLabel>
            <TextField
              fullWidth
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                ),
              }}
              placeholder="Enter price"
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>

          {/* Stock */}
          <Grid item xs={6}>
            <InputLabel required>Stock</InputLabel>
            <TextField
              fullWidth
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter available stock"
              error={!!errors.stock}
              helperText={errors.stock}
            />
          </Grid>

          {/* Cover Image */}
          <Grid item xs={6}>
            <InputLabel required>Cover Image</InputLabel>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 140,
                border: "1px solid #ccc",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: "pointer",
                cursor: "pointer",
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": { height: 4 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#bbb",
                  borderRadius: 3,
                },
                backgroundColor: "#f8fafc",
              }}
              onClick={() =>
                document.getElementById("coverImageInput")?.click()
              }
            >
              {formData.coverImage ? (
                <img
                  src={formData.coverImage}
                  alt="Cover Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography color="textSecondary">
                  {uploading ? "Uploading..." : "Click to upload cover image"}
                </Typography>
              )}
              <input
                id="coverImageInput"
                type="file"
                accept="image/*"
                hidden
                onChange={handleCoverImageUpload}
              />
            </Box>
            {errors.coverImage && (
              <Typography color="error" variant="caption">
                {errors.coverImage}
              </Typography>
            )}
          </Grid>

          {/* Product Images */}
          {/* <Grid item xs={6}>
            <InputLabel>Product Images</InputLabel>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {formData.images.map((img, index) => (
                <Box
                  key={index}
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
                  onClick={() => document.getElementById("productimages")?.click()}
                >
                  <img
                    src={img}
                    alt={`Product ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      background: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      "&:hover": { background: "rgba(0,0,0,0.7)" },
                    }}
                    onClick={() => handleImageRemove(index)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              <Box
                sx={{
                  width: 80,
                  height: 80,
                  border: "1px dashed #ccc",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backgroundColor: "#fafafa",
                }}
                onClick={() =>
                  document.getElementById("imageUploadInput")?.click()
                }
              >
                <AddPhotoAlternate color="action" />
              </Box>
              <input
                id="imageUploadInput"
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Box>
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <InputLabel required>Product Images</InputLabel>

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
              onClick={() => document.getElementById("productimages")?.click()}
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
                        handleImageRemove(idx);
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
                  {uploading ? "Uploading..." : "Click to upload Product images"}
                </Typography>
              )}

              {/* Hidden Input */}
              <input
                hidden
                id="productimages"
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
              placeholder="Enter product description"
              error={!!errors.description}
              helperText={errors.description}
               sx={{backgroundColor:"f8fafc"}}
            />
          </Grid>

          {/* Submit */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <Grid xs={4}>
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
                {id ? "Update Product" : "Create Product"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}
