import React, { createContext, useContext, useState, useMemo } from 'react';
import { TabBarContextType, TabType, TabBarProviderProps } from './types';

const TabBarContext = createContext<TabBarContextType>({} as TabBarContextType);

export const TabBarProvider = ({ children }: TabBarProviderProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('inicio');

    const value = useMemo(
        () => ({
            activeTab,
            setActiveTab,
        }),
        [activeTab],
    );

    return (
        <TabBarContext.Provider value={value}>{children}</TabBarContext.Provider>
    );
};

export const useTabBarMobility = () => {
    const context = useContext(TabBarContext);

    if (!context) {
        throw new Error('useTabBarMobility must be used within a TabBarProvider');
    }

    return context;
};

