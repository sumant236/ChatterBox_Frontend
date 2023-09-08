import {
  Box,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAlert from "../Alert/useAlert";
import { LoadingButton } from "@mui/lab";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(false);
  const { showAlert, AlertComponent } = useAlert();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      showAlert("warning", "Please fill all the required fields!");
      setLoading(false);
      return;
    }

    const config = { headers: { "Content-type": "application/json" } };
    await axios
      .post(
        "https://chatterbox-backend-5x94.onrender.com/api/user/login",
        {
          email,
          password,
        },
        config
      )
      .then((res) => {
        localStorage.setItem("info", JSON.stringify(res.data));
        setLoading(false);
        navigate("/chats");
      })
      .catch((err) => {
        showAlert("error", "Invalid Email or Password");
        setLoading(false);
      });
  };

  const handleHidePassword = () => setHidePassword((hide) => !hide);

  return (
    <Box>
      <InputLabel htmlFor="email" required>
        Email
      </InputLabel>
      <TextField
        fullWidth
        onChange={(e) => setEmail(e.target.value)}
        id="email"
        size="small"
        sx={{ mb: 3 }}
        value={email}
      />
      <InputLabel htmlFor="password" required>
        Password
      </InputLabel>
      <OutlinedInput
        id="password"
        type={hidePassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={handleHidePassword} edge="end">
              {hidePassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        fullWidth
        size="small"
        onChange={(e) => setPassword(e.target.value)}
      />
      <LoadingButton
        variant="contained"
        sx={{ width: "100%", background: "#323289", mt: 3 }}
        onClick={submitHandler}
        loading={loading}
      >
        Login
      </LoadingButton>
      {AlertComponent}
    </Box>
  );
};

export default Login;
