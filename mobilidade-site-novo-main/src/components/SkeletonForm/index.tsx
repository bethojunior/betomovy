import { Skeleton } from "@mui/material";

import { Container } from "./styles";

const SkeletonForm = () => {
    return (
        <Container>
            <div className="content-inputs">
                <Skeleton variant="rectangular" width={400} height={40} />
                <Skeleton variant="rectangular" width={400} height={40} />
                <Skeleton variant="rectangular" width={400} height={40} />
                <Skeleton variant="rectangular" width={400} height={40} />
                <Skeleton variant="rectangular" width={400} height={40} />
                <Skeleton variant="rectangular" width={400} height={40} />
            </div>

            <div className="content-buttons">
                <Skeleton variant="rectangular" width={200} height={40} />
                <Skeleton variant="rectangular" width={200} height={40} />
            </div>
        </Container>
    )
}

export default SkeletonForm;