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
import useAlert from "../Alert/useAlert";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [img, setImg] = useState();
  const [hidePassword, setHidePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showAlert, AlertComponent } = useAlert();
  const navigate = useNavigate();

  const handleHidePassword = () => setHidePassword((hide) => !hide);

  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      showAlert("warning", "Please Select an Image to Upload");
      setLoading(false);
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "ChatterBox");
      data.append("cloud_name", "sumant236");
      axios("https://api.cloudinary.com/v1_1/sumant236/image/upload", {
        method: "post",
        data: data,
      })
        .then((res) => {
          setImg(res.data.url);
          setLoading(false);
        })
        .catch((err) => {
          showAlert("error", "Error Occured while Uploading Image");
        });
    } else {
      showAlert("warning", "Selected image type should be jpeg/png only");
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      showAlert("warning", "Please Fill all the Required Fields");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      showAlert("warning", "Password Do Not Match");
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { "Content-type": "application/json" } };
      const { data } = await axios.post(
        "https://chatterbox-backend-5x94.onrender.com/api/user",
        {
          name: name,
          email: email,
          password: password,
          pic: img,
        },
        config
      );
      showAlert("success", "Registration Successfully");
      localStorage.setItem("info", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      showAlert("error", "Error Occured while creating New Account");
      setLoading(false);
    }
  };

  return (
    <Box>
      <InputLabel htmlFor="name" required>
        Name
      </InputLabel>
      <TextField
        fullWidth
        onChange={(e) => setName(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ mb: 1 }}
        value={name}
      />
      <InputLabel htmlFor="email" required>
        Email
      </InputLabel>
      <TextField
        fullWidth
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ mb: 1 }}
        type="email"
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
        sx={{ mb: 1 }}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputLabel htmlFor="password" required>
        Confirm Password
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
        sx={{ mb: 1 }}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <InputLabel htmlFor="picture">Upload your Picture</InputLabel>
      <TextField
        fullWidth
        onChange={(e) => postDetails(e.target.files[0])}
        id="picture"
        size="small"
        sx={{ mb: 1 }}
        type="file"
        accept="image/*"
        disabled={loading}
      />
      <LoadingButton
        variant="contained"
        sx={{ width: "100%", background: "#323289", mt: 3 }}
        onClick={submitHandler}
        loading={loading}
      >
        Sign Up
      </LoadingButton>
      {AlertComponent}
    </Box>
  );
};

export default Signup;
