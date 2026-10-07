import CircularProgress from "@mui/material/CircularProgress";
import { Backdrop } from "@mui/material";

import { Container } from "./styles";

interface LoadingBackdropProps {
  loading: boolean;
}

export default function LoadingBackdrop({ loading }: LoadingBackdropProps) {
  return (
    <Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Container>
  );
}
