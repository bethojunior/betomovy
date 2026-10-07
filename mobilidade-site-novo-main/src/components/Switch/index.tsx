import { Switch as SwitchMaterial } from '@mui/material'

import { Container } from "./styles";

interface SwitchProps {
    value: 'allocated' | 'not-allocated';
    setValue: (data: 'allocated' | 'not-allocated') => void;
}

const Switch = ({ value, setValue }: SwitchProps) => {

    const handleChangeSwitch = () => {
        if(value === 'allocated'){
            setValue('not-allocated');
        }else{
            setValue('allocated');
        }
    }

    return (
        <Container>
            <SwitchMaterial value={value} onChange={handleChangeSwitch} />
        </Container>
    )
}

export default Switch;