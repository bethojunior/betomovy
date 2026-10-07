import { Container, TextTerms } from "./styles";

import { ScrollView } from "react-native";

interface TermsBoxProps {
    contentTerms: string;
}

export default function TermsBox({ contentTerms }: TermsBoxProps) {
    return (
        <Container>
            <ScrollView>
                <TextTerms>
                    {contentTerms}
                </TextTerms>
            </ScrollView>
        </Container>
    )
}