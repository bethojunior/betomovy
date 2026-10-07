import { Container, CustomScrollView, TextTerms } from "./styles";

interface TermsBoxProps {
  contentTerms: string;
}

export default function TermsBox({ contentTerms }: TermsBoxProps) {
  return (
    <TextTerms>{contentTerms}</TextTerms>
  )
}
