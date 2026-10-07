import { Container, LabelSelect, Content } from "./styles";

import { Picker } from '@react-native-picker/picker';
import { Platform } from "react-native";

interface SelectProps {
    label?: string;
    value: string;
    setValue: (data: string) => void;
    datasList: any;
    typeSelect?: string;
    valueInitial?: string;
}

export default function Select({ label, value, setValue, datasList, typeSelect, valueInitial }: SelectProps) {

    return (
        <Container>
            {label &&
                <LabelSelect>{label}</LabelSelect>
            }
            <Content
                style={Platform.OS === 'ios' && {
                    height:50,
                    position:'relative',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                <Picker
                    selectedValue={value}
                    style={Platform.OS === 'ios' && {width: '100%', position:'absolute'}}
                    onValueChange={(itemValue) => {
                        setValue(itemValue);
                    }}
                >
                    {valueInitial && <Picker.Item label={valueInitial} value="" />}

                    {datasList && datasList.map((value) => {
                        return <Picker.Item key={typeSelect === 'franchise' ? value.franchise.franchise_name : value.name} label={typeSelect === 'franchise' ? value.franchise.franchise_name : value.name} value={typeSelect === 'franchise' ? value.franchise.franchise_id : value.id} />
                    })}
                </Picker>
            </Content>
        </Container>
    )
}