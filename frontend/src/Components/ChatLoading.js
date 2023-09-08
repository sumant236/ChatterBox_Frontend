import { CircularProgress, Stack } from "@mui/material";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack sx={{ alignItems: "center" }}>
      <CircularProgress />
    </Stack>
  );
};

export default ChatLoading;
