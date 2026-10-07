import { useEffect, useState } from "react";
import swal from "sweetalert";

import api from "../../../../../../services/api";
import Utils from "../../../../../../utils/Utils";
import { PriceRangeProps } from "../types";

export const usePriceRange = (
  cityId: number,
  tripTypeId: number | null | undefined,
  setLoading: (loading: boolean) => void
) => {
  const [datasPriceRange, setDatasPriceRange] = useState<PriceRangeProps[]>([]);
  const [minValue, setMinValue] = useState<string>("0,00");
  const [maxValue, setMaxValue] = useState<string>("0,00");
  const [newValue, setNewValue] = useState<string>("0,00");
  const [descriptionPriceRange, setDescritpionPriceRange] = useState<string>("");

  const getPricesRange = async () => {
    setLoading(true);
    try {
      const responsePricesRange = await api.get(
        `price/range?cityId=${cityId}&tripTypeId=${tripTypeId}`
      );
      setDatasPriceRange(responsePricesRange.data.response);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleAddRangePrice = async () => {
    if (
      Utils.BrlToNumber(minValue, "positive") >
      Utils.BrlToNumber(maxValue, "positive")
    ) {
      swal({
        title: "O preço menor não pode ser maior que o maior",
        icon: "warning",
      });
      return;
    }

    if (descriptionPriceRange.length <= 0) {
      swal({
        title: "Descrição é obrigatória",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const objectSend = {
        cityId: cityId,
        description: descriptionPriceRange,
        max_value: Utils.BrlToNumber(maxValue, "positive"),
        min_value: Utils.BrlToNumber(minValue, "positive"),
        new_value: Utils.BrlToNumber(newValue, "positive"),
        tripTypeId: tripTypeId,
      };
      const responseRangePrice = await api.post("price/range", objectSend);
      if (responseRangePrice.status) {
        swal({
          title: "Atualizado com sucesso",
          icon: "success",
        });
        setDescritpionPriceRange("");
        setMaxValue("0,00");
        setMinValue("0,00");
        setNewValue("0,00");
        getPricesRange();
      } else {
        swal({
          title: "Erro ao inserir faixa de preço",
          text: "Certifique que não existe uma faixa com os mesmos valores",
          icon: "info",
        });
      }
    } catch (error) {
      console.log(error);
      swal({
        title: "Erro ao salvar faixa de preço",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleDeletePriceRange = (id: number) => {
    swal({
      title: "Deseja deletar essa faixa de preço?",
      text: "Esta ação é irreversível",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      setLoading(true);
      if (isAccept) {
        setLoading(false);
        api
          .delete(`price/range/${id}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Preço apagado com sucesso",
                icon: "success",
              });
              getPricesRange();
            }
          })
          .catch((error) => {
            console.log(error);
            swal({
              title: "Erro ao deletar faixa de preço",
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  useEffect(() => {
    getPricesRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripTypeId]);

  return {
    datasPriceRange,
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    newValue,
    setNewValue,
    descriptionPriceRange,
    setDescritpionPriceRange,
    handleAddRangePrice,
    handleDeletePriceRange,
  };
};
