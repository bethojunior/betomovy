import {useEffect, useState} from 'react';
import {useUserDriver} from '../../context/userDriver';
import {
  ContentGraphics,
  Graphic,
  GraphicTitle,
  InfoData,
  InfoDataHeader,
  InfoDataItem,
  InfoDataItemNote,
  InfoDataItemNoteSubTitle,
  InfoDataItemNoteTitle,
  InfoDataItemSubTitle,
  InfoDataItemTitle,
  InfoDataSubTitle,
  InfoDataTitle,
  ViewInfoData,
} from './styles';
import {View} from 'react-native';
import {translate} from '../../../../client/locales';
import {useAuth} from '../../../../context/auth';
import {Ionicons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';
import {convertMoney} from '../../utils/money';
import {BarChart} from 'react-native-chart-kit';
import theme from '../../styles/theme';

export const InfoDataGraphic = () => {
  const {getWeeklyEarnings, userDriverFind} = useUserDriver();
  const [weeklyEarningsData, setWeeklyEarningsData] = useState([]);
  const [weeklyEarningsTotal, setWeeklyEarningsTotal] = useState('');

  const {cityConfig} = useAuth();

  const getEarningsFunction = async () => {
    const response = await getWeeklyEarnings();

    setWeeklyEarningsTotal(response.earningsTotal);

    if (response) {
      response.earnings.map(item => {
        return setWeeklyEarningsData(oldArray => [
          ...oldArray,
          {day: item.slug, earnings: item.total_day},
        ]);
      });
    }
  };

  const weeklyEarningsDefault = [
    {day: 'Dom', earnings: '0.00'},
    {day: 'Seg', earnings: '0.00'},
    {day: 'Ter', earnings: '0.00'},
    {day: 'Qua', earnings: '0.00'},
    {day: 'Qui', earnings: '0.00'},
    {day: 'Sex', earnings: '0.00'},
    {day: 'Sab', earnings: '0.00'},
  ];

  useEffect(() => {
    getEarningsFunction();
  }, []);

  const getEarnings =
    weeklyEarningsData.length > 0 ? weeklyEarningsData : weeklyEarningsDefault;

  return (
    <ContentGraphics>
      <InfoData>
        <InfoDataHeader>
          <InfoDataTitle>{translate('driverhome.my_day')}</InfoDataTitle>
          <InfoDataSubTitle>
            {cityConfig?.typeMoney}
            {userDriverFind?.statistics?.value_collected}
          </InfoDataSubTitle>
        </InfoDataHeader>

        <ViewInfoData>
          <View style={{width: '50%'}}>
            <InfoDataItem>
              <InfoDataItemTitle>
                {translate('driverhome.call')}
              </InfoDataItemTitle>
              <InfoDataItemSubTitle>
                {userDriverFind?.statistics?.quantity_calls}
              </InfoDataItemSubTitle>
            </InfoDataItem>

            <InfoDataItem>
              <InfoDataItemTitle>
                {translate('driverhome.accepted')}
              </InfoDataItemTitle>
              <InfoDataItemSubTitle>
                {userDriverFind?.statistics?.quantity_accepted_calls}
              </InfoDataItemSubTitle>
            </InfoDataItem>

            <InfoDataItem>
              <InfoDataItemTitle>
                {translate('driverhome.recused')}
              </InfoDataItemTitle>
              <InfoDataItemSubTitle>
                {userDriverFind?.statistics?.quantity_refused_calls}
              </InfoDataItemSubTitle>
            </InfoDataItem>

            <InfoDataItem>
              <InfoDataItemTitle>
                {translate('driverhome.canceled')}
              </InfoDataItemTitle>
              <InfoDataItemSubTitle>
                {userDriverFind?.statistics?.quantity_canceled_calls}
              </InfoDataItemSubTitle>
            </InfoDataItem>

            <InfoDataItem>
              <InfoDataItemTitle>
                {translate('driverhome.finished')}
              </InfoDataItemTitle>
              <InfoDataItemSubTitle>
                {userDriverFind?.statistics?.quantity_finished_calls}
              </InfoDataItemSubTitle>
            </InfoDataItem>
          </View>

          <InfoDataItemNote>
            <InfoDataItemNoteTitle>
              {translate('driverhome.note')}
            </InfoDataItemNoteTitle>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons
                name="star"
                size={17}
                color={theme.colors.background_white}
              />
              <InfoDataItemNoteSubTitle>
                {userDriverFind.rating
                  ? parseFloat(userDriverFind?.rating).toPrecision(2)
                  : '0.0'}
              </InfoDataItemNoteSubTitle>
            </View>
          </InfoDataItemNote>
        </ViewInfoData>
      </InfoData>

      <Graphic>
        <GraphicTitle>
          {translate('driverhome.week')}
          {'  '}
          {convertMoney(weeklyEarningsTotal)}
        </GraphicTitle>
        <BarChart
          data={{
            labels: getEarnings.map(item => item.day),
            datasets: [
              {
                data: getEarnings.map(item => item.earnings),
              },
            ],
          }}
          width={RFValue(300)}
          height={RFValue(200)}
          chartConfig={{
            backgroundGradientFrom: theme.colors.primary,
            backgroundGradientTo: theme.colors.primary,
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            barPercentage: 0.8,
          }}
          yAxisLabel={cityConfig?.typeMoney}
          yAxisSuffix=""
          showValuesOnTopOfBars
          style={{
            marginVertical: 8,
            borderRadius: 1,
          }}
        />
      </Graphic>
    </ContentGraphics>
  );
};
