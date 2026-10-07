import { Skeleton } from "antd";
import { Wrapper, StyledCard, QRImageSkeleton, SkeletonContent } from "./styles";

export const WhatsAppSkeleton: React.FC = () => {
  return (
    <Wrapper>
      <StyledCard>
        <SkeletonContent >
          <QRImageSkeleton active />
          <Skeleton.Input active size="large" />
        </SkeletonContent>
      </StyledCard>
    </Wrapper>
  );
};
