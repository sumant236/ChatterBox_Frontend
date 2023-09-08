import { Chip } from "@mui/material";
import React from "react";

const UserTagItem = ({ user, handleFunction }) => {
  return (
    <Chip
      color="secondary"
      onDelete={handleFunction}
      label={user.name}
      sx={{ m: "5px 3px" }}
    />
  );
};

export default UserTagItem;
