import { useEffect, useState } from "react";
import swal from "sweetalert";

import api from "../../../../../../services/api";
import { ListPricesProps, TypesTravelsProps } from "../types";

// Reordenação manual (drag-like via ↑/↓) dos cards de tipo de viagem,
// persistida em `price/update-order`. Só fica ativa quando a cidade tem
// `enableCustomOrderTripType` habilitado (ver useCustomOrderConfig).
export const useCustomOrderList = (
  cityId: number,
  listPrices: ListPricesProps[],
  customOrderConfig: boolean,
  getPrices: (useCustomOrderParam?: boolean) => Promise<void>,
  getTypesTravels: () => Promise<void>,
  setLoading: (loading: boolean) => void
) => {
  const [customOrderList, setCustomOrderList] = useState<TypesTravelsProps[]>(
    []
  );

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newList = [...customOrderList];
      [newList[index - 1], newList[index]] = [
        newList[index],
        newList[index - 1],
      ];
      setCustomOrderList(newList);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < customOrderList.length - 1) {
      const newList = [...customOrderList];
      [newList[index], newList[index + 1]] = [
        newList[index + 1],
        newList[index],
      ];
      setCustomOrderList(newList);
    }
  };

  const handleSaveCustomOrder = async () => {
    setLoading(true);
    try {
      const priceIdMap = new Map(
        listPrices.map((price) => [price.tripTypeId, price.id])
      );
      const orderUpdates = customOrderList
        .map((item, index) => {
          const mappedId =
            item.idTripType != null
              ? priceIdMap.get(item.idTripType)
              : undefined;
          return {
            id: mappedId,
            order: index + 1,
          };
        })
        .filter((entry) => entry.id != null);

      if (orderUpdates.length === 0) {
        swal({
          title: "Nenhum preço encontrado para ordenar",
          icon: "warning",
        });
        return;
      }

      const response = await api.put("price/update-order", {
        cityId: cityId,
        orders: orderUpdates,
      });

      if (response.data?.status !== false && (response.data?.status || response.status === 200)) {
        swal({
          title: "Ordem personalizada salva com sucesso!",
          icon: "success",
        });

        await getPrices(customOrderConfig);
        await getTypesTravels();
      } else {
        swal({
          title: response.data?.message || "Erro ao salvar ordem personalizada",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
      swal({
        title: "Erro ao salvar ordem personalizada",
        icon: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (customOrderConfig && listPrices.length > 0) {
      const configuredTypes = listPrices.map((price) => price.trip_type);
      setCustomOrderList(configuredTypes);
    }
  }, [customOrderConfig, listPrices]);

  return {
    customOrderList,
    handleMoveUp,
    handleMoveDown,
    handleSaveCustomOrder,
  };
};
