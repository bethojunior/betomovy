import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Select, { StylesConfig } from "react-select";
import { Container } from "./styles";
import { useEffect, useState } from "react";
import { FormActions, useDriverDatasContext } from "../../../../contexts/DriverDatasContext";
import api from "../../../../api/apiAxios";
import { useTranslation } from "react-i18next";
import { formatCityName } from "../../../../utils/CityFormatter";

interface SelectCityProps {
  step: number;
  setStep: (data: number) => void;
}

interface IInputsProps {
  cities: string;
}

interface OptionType {
  label: string;
  value: string;
}



const schema = yup.object({
  cities: yup.string().required('Este campo é obrigatório'),
});

const customStyles: StylesConfig<OptionType> = {
  control: (provided) => ({
    ...provided,
    borderRadius: 'none',
    color: 'black',
    border: '1px solid black',
    boxShadow: 'none',
    height: '50px',
    padding: '0 1rem',
    fontSize: '18px',
    paddingRight: '3rem',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#757575',
    fontSize: '18px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: '0',
    color: 'black',
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1rem',
    height: '1rem',
    '&:hover': {
      color: 'black',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'black',
    fontSize: '18px',
  }),
};

const SelectCity = ({ step, setStep }: SelectCityProps) => {

  const [activeCities, setActiveCities] = useState<ActiveCitiesProps[]>([]);

  const { control, handleSubmit, setValue } = useForm<IInputsProps>({
    resolver: yupResolver(schema),
  });

  const { state, dispatch } = useDriverDatasContext();

  const { t } = useTranslation();

  const TranslationErrors = (message: string) => {
    let value;

    switch (message) {
        case 'Este campo é obrigatório':
            value = t('message-error-form-input-mandatory');
            break;
        case 'Este campo é do tipo email':
            value = t('message-error-form-input-type-email');
            break;
        case 'O mínimo é 14 caracteres':
            value = t('message-error-form-minimun-char14');
            break;
        case 'O máximo é 18 caracteres':
            value = t('message-error-form-maximun-char18');
            break;
    }

    return value;
}

  const handleSubmitDatas = (datas: IInputsProps) => {
    const datasSend = {
        city: datas.cities
    };

    dispatch({
        type: FormActions.setSelectCity,
        payload: datasSend
    });

    setStep(step + 1);
}

const handleBackStep = () => {
    setStep(step - 1);
}

const handleGetActiveCities = async () => {
    const responseActiveCities = await api.get('City/getActives')
    setActiveCities(responseActiveCities.data.data);
}


  useEffect(() => {
    handleGetActiveCities();
  }, []);

  useEffect(() => {
    if (state.stepSelectCity.city) {
      setValue('cities', state.stepSelectCity.city);
    }
  }, []);

  return (
    <Container>
      <h1>{t('register-driver-step-2-title-card')}</h1>
      <form onSubmit={handleSubmit(handleSubmitDatas)} className="content-data-select-city">
        <Controller
          control={control}
          name="cities"
          render={({ field: { onChange, value, name }, fieldState: { error } }) => (
            <div>
              <Select
                options={activeCities.map((city) => ({
                  label: formatCityName(city),
                  value: city.id,
                }))}
                onChange={(selectedOption) => onChange((selectedOption as OptionType)?.value)}
                value={activeCities.find(city => city.id === value) ? { label: formatCityName(activeCities.find(city => city.id === value)!), value } : null}
                name={name}
                styles={customStyles}
                placeholder={t('register-driver-select-step-2-city-default')}
              />
              {error && <span className="errors-input">{TranslationErrors(error.message as string)}</span>}
            </div>
          )}
        />
        
        <div className="content-button">
          <button type="button" onClick={handleBackStep}>{t('register-driver-steps-buttons-back')}</button>
          <button type="submit">{t('register-driver-steps-buttons-next')}</button>
        </div>
      </form>
    </Container>
  );
};

export default SelectCity;