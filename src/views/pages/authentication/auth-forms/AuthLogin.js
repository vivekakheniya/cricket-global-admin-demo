import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AnimateButton from "ui-component/extended/AnimateButton";
import useScriptRef from "hooks/useScriptRef";
import AuthApi from "../../../../apis/auth/auth.api";
import { useAuthenticated } from "../../../../hooks/useAuthenticated.hook";
import { getUserLocal } from "../../../../utils/localStorage.util";
import { useDispatch } from "react-redux";
import { updateUser, updateToken } from "../../../../redux/redux-slice/user.slice";
import { toast } from "react-hot-toast";

const FirebaseLogin = ({ ...others }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authApi = new AuthApi();
  const isAuth = useAuthenticated();
  const theme = useTheme();
  const scriptedRef = useScriptRef();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validate = () => {
    const errors = {};
    if (!formValues.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Enter a valid email";
    }

    if (!formValues.password) {
      errors.password = "Password is required";
    } else if (formValues.password.length < 4) {
      errors.password = "Password must be at least 4 characters";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;
    
    try {
      setIsSubmitting(true);
      const loginResponse = await authApi.login({
        email: formValues.email,
        password: formValues.password,
        // type: "admin",
      });
console.log("loginResponse-----------", loginResponse);
      if (loginResponse?.data?.code === 200) {
        dispatch(updateToken(loginResponse.data.token));
        dispatch(updateUser(loginResponse.data.data));
        toast.success("Login successfully");
        navigate("/dashboard", { replace: true });
      } else {
        toast.error("Invalid credentials or server error");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      if (scriptedRef.current) setIsSubmitting(false);
    }
  };

  if (isAuth) return <Navigate to="/dashboard" />;

  return (
    <form noValidate onSubmit={handleSubmit} {...others}>
      {/* Email Field */}
      <FormControl
        fullWidth
        error={Boolean(formErrors.email)}
        sx={{ ...theme.typography.customInput }}
      >
        <InputLabel htmlFor="email">Email</InputLabel>
        <OutlinedInput
          id="email"
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          label="Email"
        />
        {formErrors.email && (
          <FormHelperText error>{formErrors.email}</FormHelperText>
        )}
      </FormControl>

      {/* Password Field */}
      <FormControl
        fullWidth
        error={Boolean(formErrors.password)}
        sx={{ ...theme.typography.customInput }}
      >
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          id="password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formValues.password}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        {formErrors.password && (
          <FormHelperText error>{formErrors.password}</FormHelperText>
        )}
      </FormControl>

      {/* Remember Me */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              name="checked"
              color="primary"
            />
          }
          label="Remember me"
        />
      </Stack>

      {/* Submit Button */}
      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            disableElevation
            disabled={isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="secondary"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
};

export default FirebaseLogin;
