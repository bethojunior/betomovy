import api from "../services/api";
import swal from "sweetalert";
import { ActiveCustomerProps, CustomerAreaHeatMapProps } from "../@types";
import Session from "@/utils/Session";
import Utils from "../utils/Utils";

export const useHeatMap = () => {

    const citySelected = Session.getLocal("citySelected");
    const isPointInPolygon = (
        point: [number, number],
        polygon: number[][]
    ): boolean => {
        const [lat, lng] = point;
        let inside = false;

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const [polyLatI, polyLngI] = polygon[i];
            const [polyLatJ, polyLngJ] = polygon[j];

            const intersect =
                polyLngI > lng !== polyLngJ > lng &&
                lat < ((polyLatJ - polyLatI) * (lng - polyLngI)) / (polyLngJ - polyLngI) + polyLatI;
            if (intersect) inside = !inside;
        }

        return inside;
    };

    const getFilteredCustomers = async (): Promise<ActiveCustomerProps[]> => {
        try {
            const response = await api.get("dashboard/activeCustomersLast10Minutes");

            if (response.status && response.data.response) {
                const cityPolygon = Utils.TransformCoordinates(citySelected.polygon);

                const filteredCustomers = response.data.response.filter(
                    (customer: ActiveCustomerProps) => {
                        if (customer.cityId !== citySelected.cityId) {
                            return false;
                        }

                        const point: [number, number] = [
                            Number(customer.latitude),
                            Number(customer.longitude),
                        ];

                        return isPointInPolygon(point, cityPolygon);
                    }
                );

                return filteredCustomers;
            }
            return [];
        } catch (error) {
            console.error(error);
            swal({
                title: "Erro ao pegar os dados dos clientes",
                icon: "error",
            });
            return [];
        }
    };

    const getAllCustomers = async (): Promise<ActiveCustomerProps[]> => {
        try {
            const response = await api.get("dashboard/activeCustomersAllTime");

            if (response.status && response.data.response) {
                const cityPolygon = Utils.TransformCoordinates(citySelected.polygon);

                const filteredCustomers = response.data.response.filter(
                    (customer: ActiveCustomerProps) => {
                        if (customer.cityId !== citySelected.cityId) {
                            return false;
                        }

                        const point: [number, number] = [
                            Number(customer.latitude),
                            Number(customer.longitude),
                        ];

                        return isPointInPolygon(point, cityPolygon);
                    }
                );

                return filteredCustomers;
            }
            return [];
        } catch (error) {
            console.error(error);
            swal({
                title: "Erro ao pegar os dados dos clientes",
                icon: "error",
            });
            return [];
        }
    };

    const getCustomerArea = async (): Promise<CustomerAreaHeatMapProps> => {
        try {
            const responseLocations = await api.get(
                `customer/${citySelected.cityId}/locations`
            );

            return responseLocations.data.response;
        } catch (error) {
            console.error(error);
            swal({
                title: "Erro ao pegar os dados dos clientes",
                icon: "error",
            });
            return [];
        }
    };

    const getLastDynamicsPlaces = async (): Promise<CustomerAreaHeatMapProps> => {
        try {
            const responseLocations = await api.get(
                "dashboard/lastDynamicsPlaces?limit=30&cityId=" + citySelected.cityId
            );

            return responseLocations.data.response;
        } catch (error) {
            console.error(error);
            swal({
                title: "Erro ao pegar os dados dos clientes",
                icon: "error",
            });
            return [];
        }
    };

    const getExpensiveDynamicsPlaces = async (): Promise<CustomerAreaHeatMapProps> => {
        try {
            const responseLocations = await api.get(
                "dashboard/expensiveDynamicsPlaces?limit=30&cityId=" + citySelected.cityId
            );

            return responseLocations.data.response;
        } catch (error) {
            console.error(error);
            swal({
                title: "Erro ao pegar os dados dos clientes",
                icon: "error",
            });
            return [];
        }
    };

    const getNotAnsweredToday = async (): Promise<CustomerAreaHeatMapProps> => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        try {
            const responseLocations = await api.get(
                `dashboard/tripsByStatus?status=not_answered&dateStart=${formattedDate}&dateEnd=${formattedDate}`
            );

            return responseLocations.data.response;
        } catch (error) {
            console.error(error);
            swal({
                title: "Erro ao pegar os dados dos clientes",
                icon: "error",
            });
            return [];
        }
    };

    const getNotAnsweredYesterday = async (): Promise<CustomerAreaHeatMapProps> => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yyyy = yesterday.getFullYear();
        const mm = String(yesterday.getMonth() + 1).padStart(2, "0");
        const dd = String(yesterday.getDate()).padStart(2, "0");
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        try {
            const responseLocations = await api.get(
                `dashboard/tripsByStatus?status=not_answered&dateStart=${formattedDate}&dateEnd=${formattedDate}`
            );

            return responseLocations.data.response;
        } catch (error) {
            console.error(error);
            swal({
                title: "Erro ao pegar os dados dos clientes",
                icon: "error",
            });
            return [];
        }
    };

    const getNotAnsweredLastWeek = async (): Promise<CustomerAreaHeatMapProps> => {

        const dateStart = new Date();
        dateStart.setDate(dateStart.getDate() - 6);

        const dateEnd = new Date(); // hoje

        const formatDate = (date: Date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        const formattedDateStart = formatDate(dateStart);
        const formattedDateEnd = formatDate(dateEnd);
        try {
            const responseNotAnswered = await api.get(
                `dashboard/tripsByStatus?status=not_answered&dateStart=${formattedDateStart}&dateEnd=${formattedDateEnd}`
            );

            return responseNotAnswered.data.response;
        } catch (error) {
            console.error(error);
            swal({
                title: "Erro ao pegar os dados dos clientes",
                icon: "error",
            });
            return [];
        }
    };

    const getPlacesMoreTripWeekAgo = async (): Promise<CustomerAreaHeatMapProps> => {
        try {
            const responseMoreTripsWeekAgo = await api.get(
                "dashboard/placesMoreTripsWeekAgo?limit=30"
            );
            return responseMoreTripsWeekAgo.data.response;
        } catch (error) {
            console.error(error);
            swal({
                title: "Erro ao pegar os dados dos clientes",
                icon: "error",
            });
            return [];
        }

    };


        return {
            getFilteredCustomers,
            getAllCustomers,
            getCustomerArea,
            getLastDynamicsPlaces,
            getExpensiveDynamicsPlaces,
            getNotAnsweredToday,
            getNotAnsweredYesterday,
            getNotAnsweredLastWeek,
            getPlacesMoreTripWeekAgo
        };
    }