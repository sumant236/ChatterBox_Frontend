import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const ProfileModal = ({ open, handleClose, user }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: "16px 32px 32px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 1,
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ cursor: "pointer", width: "100%", textAlign: "right" }}>
            <CloseIcon onClick={handleClose} color="disabled" />
          </Box>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            {user.name}
          </Typography>
          <img
            style={{ borderRadius: "80px" }}
            src={user.pic}
            alt={user.name}
            width="150px"
            height="150px"
          />
          <Typography id="modal-modal-description" variant="h6">
            <strong>Email:</strong> {user.email}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default ProfileModal;
