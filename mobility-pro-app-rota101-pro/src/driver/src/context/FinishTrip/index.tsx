import React, { createContext, useContext, useState, useCallback } from 'react';
import { FinishedTripStorage } from '~/utils/Storage/finishedTripStorage';

interface FinishTripContextType {
    // Estado da seleção de preço
    priceSelected: boolean;
    selectedPrice: number | null;
    valueConfirmed: boolean;
    isFinishing: boolean;

    // Funções para controlar o estado
    resetPriceSelection: () => void;
    confirmPriceSelection: (price: number, isRecalculated?: boolean) => void;
    markTripAsFinishing: (tripReference: string) => Promise<void>;
    setIsFinishing: (value: boolean) => void;
}

const FinishTripContext = createContext<FinishTripContextType>({} as FinishTripContextType);

export const FinishTripProvider = ({ children }: { children: React.ReactNode }) => {
    const [priceSelected, setPriceSelected] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [valueConfirmed, setValueConfirmed] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);

    const resetPriceSelection = useCallback(() => {
        setPriceSelected(false);
        setSelectedPrice(null);
        setValueConfirmed(false);
    }, []);

    const confirmPriceSelection = useCallback((price: number, _isRecalculated?: boolean) => {
        setPriceSelected(true);
        setSelectedPrice(price);
        setValueConfirmed(true);
    }, []);

    const markTripAsFinishing = useCallback(async (tripReference: string) => {
        if (!tripReference) return;
        FinishedTripStorage.add(tripReference);
    }, []);

    const value = {
        priceSelected,
        selectedPrice,
        valueConfirmed,
        isFinishing,
        resetPriceSelection,
        confirmPriceSelection,
        markTripAsFinishing,
        setIsFinishing,
    };

    return (
        <FinishTripContext.Provider value={value}>
            {children}
        </FinishTripContext.Provider>
    );
};

export const useFinishTrip = () => {
    const context = useContext(FinishTripContext);
    if (!context) {
        throw new Error('useFinishTrip must be used within a FinishTripProvider');
    }
    return context;
};

