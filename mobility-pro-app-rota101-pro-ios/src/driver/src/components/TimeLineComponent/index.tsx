import {View} from 'react-native';
import {
  DetailsContainer,
  Line,
  Step,
  StepContainer,
  StepDetails,
  StepLabel,
  TimelineContainer,
} from './styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {OrderProps} from '../../../../context/DeliveryOrder/types';

interface TS {
  steps: string[];
  order: OrderProps;
  activeIndex: number;
}

export const TimeLineComponent = ({steps = [], order, activeIndex}: TS) => {
  return (
    <TimelineContainer>
      {steps.map((step, index) => (
        <StepContainer key={index}>
          {index < steps.length - 1 && <Line />}
          <Step isActive={index === activeIndex} passed={index < activeIndex}>
            {index < activeIndex && (
              <MaterialIcons name="check" size={25} color={'green'} />
            )}
          </Step>
          <DetailsContainer>
            <StepLabel>{step}</StepLabel>
            {index === activeIndex ||
              (activeIndex >= 1 && (
                <StepDetails>
                  {activeIndex >= 1
                    ? order?.company_address?.address
                    : order?.delivery_order_place?.place?.address}
                </StepDetails>
              ))}
          </DetailsContainer>
        </StepContainer>
      ))}
    </TimelineContainer>
  );
};
