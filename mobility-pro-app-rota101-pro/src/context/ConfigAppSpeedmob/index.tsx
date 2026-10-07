import { ReactNode, createContext, useState, useContext } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

interface ConfigAppContextSpeedmobProviderProps{
    children: ReactNode
}

interface ConfigAppContextSpeedmob{
    getConfigApp: () => void;
    setConfigApp: (datasApp: DatasAppProps) => void;
    datasApp: DatasAppProps;
    setDatasApp: (data: DatasAppProps) => void;
    getConfigAppCurrentSpeedmob: () => void;
}

interface DatasAppProps {
    app_type_id: number;
    name: string;
    primary_color: string;
    secondary_color: string;
    text_color: string;
    logo: string;
}

export const ConfigAppContextSpeedmob = createContext<ConfigAppContextSpeedmob | undefined>(undefined);

export const ConfigAppContextSpeedmobProvider = ({ children }: ConfigAppContextSpeedmobProviderProps) => {

    const [datasApp, setDatasApp] = useState<DatasAppProps>();

    const setConfigApp = async (datasApplication:DatasAppProps) => {
        try{
            await AsyncStorage.setItem('@speedmob:datasApplication', JSON.stringify(datasApplication));
        }catch(error){
            console.log(error);
            alert('Erro na requisição');
        }
    }

    const getConfigApp = async () => {
        try{
            const responseConfigApp = await AsyncStorage.getItem('@speedmob:datasApplication')
            setDatasApp(JSON.parse(responseConfigApp));
        }catch(error){
            console.log(error);
            alert('Erro na requisição');
        }
    }

    const getConfigAppCurrentSpeedmob = async () => {
        try{
            const response = await AsyncStorage.getItem("@speedmob:CurrentAppConfig");
            if(response){
                setDatasApp(JSON.parse(response));
            }
        }catch(error){
            console.log(error);
            alert('Erro na requisição');
        }
    }

    return(
        <ConfigAppContextSpeedmob.Provider value={{getConfigApp, setConfigApp, datasApp, setDatasApp, getConfigAppCurrentSpeedmob}}> 
            {children}
        </ConfigAppContextSpeedmob.Provider>
    )
}

export const useConfigAppContextSpeedmob = () => {
    const response = useContext(ConfigAppContextSpeedmob);

    if(response === undefined){
        throw new Error('useConfigAppContextSpeedmob precisa ser usado dento do ConfigAppContextSpeedmobProvider');
    }

    return response;
}