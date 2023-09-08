import React, { useEffect, useState } from "react";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
import { Box, Container, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const Homepage = () => {
  const [value, setValue] = useState("1");

  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ fontFamily: "work sans, sans-serif" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 2,
          background: "white",
          w: "100%",
          m: "15px 0px",
          borderRadius: "10px",
          borderWidth: "1px",
        }}
      >
        <Typography variant="h4" sx={{ fontFamily: "work sans, sans-serif" }}>
          Chatter-Box
        </Typography>
      </Box>
      <Box
        sx={{
          background: "white",
          w: "100%",
          p: 3,
          borderRadius: "10px",
          borderWidth: "1px",
        }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Login" value="1" sx={{ width: "50%" }} />
              <Tab label="Sign Up" value="2" sx={{ width: "50%" }} />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Login />
          </TabPanel>
          <TabPanel value="2">
            <Signup />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
};

export default Homepage;
