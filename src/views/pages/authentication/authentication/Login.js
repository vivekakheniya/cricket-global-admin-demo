import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  InputAdornment,
  IconButton
} from "@mui/material";
import toast from "react-hot-toast";

// project imports
import AuthWrapper1 from "../AuthWrapper1";
import AuthCardWrapper from "../AuthCardWrapper";
import Logo1 from "../../../../assets/images/cricket-logo.webp";
import authInstance from "../../../../apis/auth/auth.api"; // <-- adjust path
import { useDispatch } from "react-redux";
import { updateToken, updateUser } from "redux/redux-slice/user.slice";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // basic validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      console.log("formData--------------", formData);
      const response = await authInstance.login(formData);
      console.log("Login response:", response);
      if (response?.status == 200) {
        toast.success("Login successful!");
        dispatch(updateUser(response?.data?.data?.user));
        dispatch(updateToken(response?.data?.data?.token));
        navigate("/dashboard", { replace: true });
      }
      else if (response?.status == 401) {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error?.response?.data?.message || "Invalid credentials or server error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper1>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "calc(100vh - 68px)" }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <form onSubmit={handleSubmit}>
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item sx={{ mb: 2 }}>
                      <Link to="#">
                        <img src={Logo1} width={120} height={100} />
                      </Link>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        color={theme.palette.secondary.main}
                        gutterBottom
                        variant={matchDownSM ? "h3" : "h2"}
                        align="center"
                      >
                        Hi, Welcome Back
                      </Typography>
                    </Grid>

                    {/* Email Field */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{
                          "& .MuiInputBase-root": {
                            backgroundColor: "#f9fbff", // default background
                          },
                          "& .MuiInputBase-root.Mui-focused": {
                            backgroundColor: "#eaf3ff", // same as password focus color
                          },
                        }}
                      />
                    </Grid>

                    {/* Password Field */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                                aria-label="toggle password visibility"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{
                          paddingY: "0.6rem",
                          backgroundColor: theme.palette.secondary.main,
                          "&:hover": {
                            backgroundColor: theme.palette.secondary.dark,
                          },
                        }}
                        disabled={loading}
                      >
                        {loading ? "Logging in..." : "Login"}
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Grid>
                </form>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
