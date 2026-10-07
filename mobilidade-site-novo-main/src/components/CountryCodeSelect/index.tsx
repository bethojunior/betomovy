import { COUNTRY_CODES, CountryCode } from "../../utils/countryCodes";
import { Select } from "./styles";

interface CountryCodeSelectProps {
  value: CountryCode;
  onChange: (country: CountryCode) => void;
}

// Seletor de DDI pro campo de telefone — fica ao lado esquerdo do input.
export default function CountryCodeSelect({ value, onChange }: CountryCodeSelectProps) {
  return (
    <Select
      value={value.iso2}
      onChange={event => {
        const selected = COUNTRY_CODES.find(c => c.iso2 === event.target.value);
        if (selected) onChange(selected);
      }}
    >
      {COUNTRY_CODES.map(country => (
        <option key={country.iso2} value={country.iso2}>
          {country.flag} +{country.dialCode}
        </option>
      ))}
    </Select>
  );
}
