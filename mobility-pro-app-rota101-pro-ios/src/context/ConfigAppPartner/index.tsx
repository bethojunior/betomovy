import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { IConfigAppPartnerContextProps, IConfigAppPartnerProviderProps } from "./types";
import { ObjectThemeAppPartnerProps } from "../../client/pages/SelectAppPartners/types";

export const ConfigAppPartnerContext = createContext<IConfigAppPartnerContextProps | undefined>(undefined);

export const ConfigAppPartnerProvider = ({ children }: IConfigAppPartnerProviderProps) => {
    const [isModuleAppPartnerActive, setIsModuleAppPartnerActive] = useState<boolean>(false);
    const [appPartnerSelected, setAppPartnerSelected] = useState<ObjectThemeAppPartnerProps | null>(null);

    const handleCheckAppPartnerSelected = async () => {
        const configAppPartnerSelected = await AsyncStorage.getItem("@mobilitypro:theme_app_partner_selected");
        const parsedPartner = configAppPartnerSelected
            ? JSON.parse(configAppPartnerSelected)
            : null;

        setAppPartnerSelected(parsedPartner);
        setIsModuleAppPartnerActive(Boolean(parsedPartner));
    };

    useEffect(() => {
        handleCheckAppPartnerSelected();
    }, []);

    return (
        <ConfigAppPartnerContext.Provider value={{
            isModuleAppPartnerActive,
            setIsModuleAppPartnerActive,
            handleCheckAppPartnerSelected,
            appPartnerSelected,
        }}>
            {children}
        </ConfigAppPartnerContext.Provider>
    )
}
