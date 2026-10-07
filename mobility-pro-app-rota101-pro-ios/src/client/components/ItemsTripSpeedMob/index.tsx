import { ReactNode } from "react"
import { Container, Text, ContentIcon } from "./styles"

interface ItemsTripSpeedMobProps {
    icon: ReactNode;
    name: string;
    onPress?: () => void;
}

export default function ItemsTripSpeedMob({ icon, name, onPress }: ItemsTripSpeedMobProps) {
    return (
        <Container onPress={onPress}>
            <ContentIcon>
                {icon}
            </ContentIcon>
            <Text>{name}</Text>
        </Container>
    )
}