import React, { useState } from "react";
import { Modal, FormControl, TextField, Button } from "@mui/material";
import { FormTripModalProps } from "./types";
import Helper from "../../../utils/Helper";

export const FormTripModal = ({
  visible,
  setVisible,
  callback,
}: FormTripModalProps) => {
  const [step, setStep] = useState<"form" | "verify">("form");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    document: "",
  });

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.document.trim()
    ) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    if (!Helper.emailValidation(formData.email.trim())) {
      alert("E-mail inválido!");
      return;
    }

    setStep("verify");
  };

  const clearForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      document: "",
    });
    setStep("form");
  };

  const handleConfirmPhone = () => {
    callback(formData);
    setVisible(false);
    clearForm();
  };

  const handleCloseModal = () => {
    setVisible(false);
    clearForm();
  };

  return (
    <>
      {/* Primeiro Modal: Formulário */}
      <Modal
        open={visible && step === "form"}
        onClose={() => handleCloseModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            height: "auto",
            width: 400,
            borderRadius: 18,
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
              textAlign: "center",
              color: "#333",
            }}
          >
            Preencha seus dados para continuar
          </h3>
          <form onSubmit={handleFormSubmit} style={{ marginTop: 20 }}>
            <FormControl fullWidth>
              <TextField
                size="small"
                label="Nome"
                name="name"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 1 }}
                autoFocus
                autoComplete="off"
                value={formData.name}
                onChange={handleFormChange}
              />
              <TextField
                size="small"
                label="CPF"
                name="document"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                sx={{ mb: 1 }}
                autoComplete="off"
                value={formData.document}
                onChange={handleFormChange}
              />
              <TextField
                size="small"
                label="Telefone"
                name="phone"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                sx={{ mb: 1 }}
                autoComplete="off"
                value={formData.phone}
                onChange={handleFormChange}
              />
              <TextField
                size="small"
                label="E-mail"
                name="email"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                sx={{ mb: 3 }}
                autoComplete="off"
                value={formData.email}
                onChange={handleFormChange}
              />
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  onClick={() => setVisible(false)}
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    fontSize: "1rem",
                    padding: "5px 16px",
                    flexGrow: 1,
                    borderColor: "#000",
                    color: "#000",
                    "&:hover": {
                      borderColor: "#333",
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontSize: "1rem",
                    padding: "5px 16px",
                    flexGrow: 1,
                    backgroundColor: "#000",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                  }}
                >
                  Enviar
                </Button>
              </div>
            </FormControl>
          </form>
        </div>
      </Modal>

      {/* Segundo Modal: Confirmação do Telefone */}
      <Modal
        open={visible && step === "verify"}
        onClose={() => handleCloseModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            height: "auto",
            width: 400,
            borderRadius: 18,
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
              textAlign: "center",
              color: "#333",
            }}
          >
            Confirme seu telefone
          </h3>
          <p style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            {`Seu telefone: ${Helper.phoneMask(formData.phone)}`}
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={() => setStep("form")}
              variant="outlined"
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                padding: "5px 16px",
                flexGrow: 1,
                borderColor: "#000",
                color: "#000",
                "&:hover": {
                  borderColor: "#333",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Editar
            </Button>
            <Button
              onClick={handleConfirmPhone}
              variant="contained"
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                padding: "5px 16px",
                flexGrow: 1,
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
