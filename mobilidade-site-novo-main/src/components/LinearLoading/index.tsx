import { LinearProgress } from "@mui/material";

import { Container } from "./styles";

interface LoadingProps{
    loading: boolean;
}

const LinearLoading = ({ loading }: LoadingProps) => {

    return(
        <>
            {loading && 
                <Container>
                    <LinearProgress />
                </Container>
            }
        </>
    )
}

export default LinearLoading;