import { Skeleton } from "antd";
import { CardDriver, CardDriverContainer, DriverImageContainer, TypeDriverContainer } from "./styles";

const DriverCardSkeleton = () => {
  return (
    <CardDriverContainer>
      {Array(4).fill('').map((_, index) => {
        return (
          <CardDriver key={index}>
            <DriverImageContainer>
              <Skeleton.Avatar active={true} size={100} shape={'circle'} />
            </DriverImageContainer>
            <TypeDriverContainer>
              <Skeleton active={true} />
            </TypeDriverContainer>
          </CardDriver>
        )
      })}
    </CardDriverContainer>
  )
}

export default DriverCardSkeleton;