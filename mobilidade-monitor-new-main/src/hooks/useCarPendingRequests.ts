import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import Session from '../utils/Session';
import {
	CarPendingRequestItem,
	PaginationMeta,
	UseCarPendingRequestsReturn,
} from '../pages/Driver/SolicitationChangeCar/types';

/** Lista, aprova e rejeita solicitações de troca de veículo pendentes. */
export function useCarPendingRequests(): UseCarPendingRequestsReturn {
	const [data, setData] = useState<CarPendingRequestItem[]>([]);
	const [pagination, setPagination] = useState<PaginationMeta>();
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [listAll, setListAll] = useState(false);

	const city = Session.getLocal('citySelected');

	const fetchList = useCallback(async () => {
		setLoading(true);
		try {
			const cityId = city?.cityId;
			const cityPath = listAll || !cityId ? '' : `/${cityId}`;
			const { data: responseData } = await api.get(
				`car/getPendingCars${cityPath}?page=${page}`,
			);
			const meta = responseData?.response || responseData?.data;
			if (meta && typeof meta === 'object' && Array.isArray(meta.data)) {
				setPagination(meta);
				setData(meta.data);
			} else if (Array.isArray(meta)) {
				setPagination(undefined);
				setData(meta);
			} else {
				setPagination(undefined);
				setData([]);
			}
		} catch (error) {
			console.error("Erro ao buscar carros pendentes:", error);
			setData([]);
			setPagination(undefined);
		} finally {
			setLoading(false);
		}
	}, [city?.cityId, listAll, page]);

	useEffect(() => {
		fetchList();
	}, [fetchList]);

	const approve = useCallback(
		async (idCar: number): Promise<boolean> => {
			setLoading(true);
			try {
				const { data: responseData } = await api.post('car/acceptCar', { id: idCar });
				if (responseData.status) await fetchList();
				return !!responseData.status;
			} finally {
				setLoading(false);
			}
		},
		[fetchList],
	);

	const reject = useCallback(
		async (idCar: number): Promise<boolean> => {
			setLoading(true);
			try {
				const { data: responseData } = await api.post('car/rejectCar', { id: idCar });
				if (responseData.status) await fetchList();
				return !!responseData.status;
			} finally {
				setLoading(false);
			}
		},
		[fetchList],
	);

	const goToPage = useCallback((newPage: number) => {
		setPage(newPage);
	}, []);

	const toggleListAll = useCallback(() => {
		setPage(1);
		setListAll((current) => !current);
	}, []);

	return { data, pagination, loading, page, goToPage, listAll, toggleListAll, approve, reject };
}
