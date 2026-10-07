export interface PromotionTypes {
    id: number;
    cityId: number;
    cityName: string;
    label: string;
    quantity: number;
    type: string;
    limitedTo: string | number | null;
    startDay: string;
    endDay: string;
    status: number;
}
