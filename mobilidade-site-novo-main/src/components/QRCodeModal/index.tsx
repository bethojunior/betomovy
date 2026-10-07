import { QRCodeSVG } from "qrcode.react";
import { Button, Modal, Box, Typography } from "@mui/material";
import { QRCodeModalProps } from "./types";
import { useRef } from "react";

const QRCodeModal = ({
  link,
  visible,
  setVisible,
  callback,
}: QRCodeModalProps) => {
  const handleClose = () => {
    setVisible(false);
    callback();
  };
  return (
    <Modal
      open={visible}
      onClose={() => handleClose()}
      aria-labelledby="qr-code-modal"
      aria-describedby="qr-code-instructions"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography
          id="qr-code-modal"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          Leia o QR Code para acompanhar a viagem
        </Typography>

        <QRCodeSVG value={link} size={200} />

        <Button
          onClick={() => handleClose()}
          variant="outlined"
          sx={{
            textTransform: "none",
            fontSize: "1rem",
            padding: "5px 16px",
            mt: 3,
            borderColor: "#000",
            color: "#000",
            "&:hover": {
              borderColor: "#333",
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Fechar
        </Button>
      </Box>
    </Modal>
  );
};

export default QRCodeModal;
