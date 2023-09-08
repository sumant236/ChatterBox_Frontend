import React, { useState, useCallback } from "react";
import AlertBox from "./AlertBox";

const useAlert = () => {
  const [alertData, setAlertData] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  const showAlert = useCallback((severity, message) => {
    setAlertData({ open: true, severity, message });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertData({ ...alertData, open: false });
  }, [alertData]);

  return {
    showAlert,
    closeAlert,
    AlertComponent: (
      <AlertBox
        open={alertData.open}
        severity={alertData.severity}
        message={alertData.message}
        onClose={closeAlert}
      />
    ),
  };
};

export default useAlert;
