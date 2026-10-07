import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Alert, Modal } from 'react-native';
import { Fontisto, Ionicons } from '@expo/vector-icons';
import { subDays } from 'date-fns';
import { Chip, Divider } from 'react-native-paper';
import { CardTransfer } from '../../../components/CardTransfer';
import { If } from '../../../components/If';
import { PaginationTransferSelect } from '../../../components/PaginationTransferSelect';
import Preload from '../../../components/Preload';
import { useBank } from '../../../context/bank';
import {
    DriverInfoProps,
    LastTransactionProps,
    Pagination,
} from '../../../context/bank/types';

import {
    ButtonDate,
    ButtonDateText,
    ButtonExit,
    Container,
    ContainerCard,
    ContainerGraphic,
    ContainerValue,
    Content,
    ContentInfo,
    ContentModalDate,
    DateContainer,
    DateText,
    Exit,
    Filters,
    Info,
    InfoText,
    InfoValue,
    Text,
    TextExit,
    TextSize,
    Value,
    ButtonBack,
    Header,
    TitleHeader
} from './styles';
import { moneyMask } from '../../../utils/money';
import { convertDate, convertUSDate } from '../../../utils/FormatDate';
import { Calendar } from '../../../components/Calendar';
import { translate } from '../../../../../client/locales';

import theme from '../../../styles/theme';

export function ExtractSpeedMob() {
    const { getTransactions } = useBank();
    const { colors } = useTheme();
    const [transactions, setLastTransactions] = useState([]);
    const [balance, setBalance] = useState({} as DriverInfoProps);
    const [page, setPage] = useState(1);
    const [selectedValue, setSelectedValue] = useState('');
    const [dataPage, setDataPage] = useState<Pagination>({} as Pagination);
    const [loading, setLoading] = useState(true);
    const [endDate, setEndDate] = useState(convertUSDate(new Date()));
    const [startDate, setStartDate] = useState(
        convertUSDate(subDays(Date.now(), 30)),
    );
    const [modalVisible, setModalVisible] = useState(false);
    const [modalEnd, setModalEnd] = useState(false);

    const navigate = useNavigation();

    const getTransactionsAsync = async () => {
        setLoading(true);
        const response = await getTransactions(
            page,
            selectedValue,
            startDate,
            endDate,
        );

        if (!response) {
            setLoading(false);
            return;
        }

        setLastTransactions(response.transactions);
        setDataPage(response.paginate);
        setBalance(response.driverInfo);

        setLoading(false);
    };

    function handleDateSelect(day) {
        if (new Date(day).getTime() > new Date(endDate).getTime()) {
            return Alert.alert(
                'Data inválida',
                'A data inicial não pode ser maior que a data final.',
            );
        }

        if (
            (new Date(endDate).getTime() - new Date(day).getTime()) /
            (1000 * 60 * 60 * 24) >
            60
        ) {
            setStartDate(endDate);

            return Alert.alert(
                'Data inválida',
                'O período não pode ser maior que 60 dias, selecione outra data.',
            );
        }

        setStartDate(day);
        setModalVisible(false);

        return true;
    }

    function handleDateSelectEnd(day) {
        if (new Date(day).getTime() < new Date(startDate).getTime()) {
            return Alert.alert(
                'Data inválida',
                'A data inicial não pode ser maior que a data final.',
            );
        }

        if (
            (new Date(day).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24) >
            60
        ) {
            return Alert.alert(
                'Data inválida',
                'O período não pode ser maior que 60 dias, selecione outra data.',
            );
        }

        setEndDate(day);
        setModalEnd(false);

        return true;
    }

    const handleDays = (days: number) => {
        setStartDate(convertUSDate(subDays(Date.now(), days)));
        setEndDate(convertUSDate(new Date()));
    };

    useEffect(() => {
        getTransactionsAsync();
    }, [page, selectedValue, startDate, endDate]);
    
    return (
        <Container>
            <Preload visible={loading} />
            <Header backgroundColor={theme.colors.primary}>
                <ButtonBack onPress={() => navigate.goBack()}>
                    <Ionicons name='arrow-back' size={30} color={theme.colors.background_global} />
                </ButtonBack>
                <TitleHeader backgroundColor={theme.colors.secondary}>{translate('routes.extract')}</TitleHeader>
            </Header>
            <ContainerGraphic>
                <ContainerValue>
                    <Text style={{ textAlign: 'center' }}>{translate('driver_extract.subTitle')}</Text>
                    <Value>R$ {moneyMask(parseFloat(balance?.balance || '0'))}</Value>
                </ContainerValue>
            </ContainerGraphic>
            <ContentInfo>
                <Info>
                    <FontAwesome
                        name="circle"
                        size={12}
                        color={theme.colors.border_green}
                        style={{
                            marginRight: 8,
                        }}
                    />
                    <InfoText>{translate('driver_extract.entries')} </InfoText>
                    <InfoValue>
                        R$ {moneyMask(parseFloat(balance?.total_credit || '0'))}
                    </InfoValue>
                </Info>

                <Info>
                    <FontAwesome
                        name="circle"
                        size={12}
                        color={theme.colors.red}
                        style={{
                            marginRight: 8,
                        }}
                    />
                    <InfoText>{translate('driver_extract.outings')} </InfoText>
                    <InfoValue>
                        R$ {moneyMask(parseFloat(balance?.total_debit || '0'))}
                    </InfoValue>
                </Info>
            </ContentInfo>

            <Divider />

            <DateText>{translate('driver_extract.select_preiod')}</DateText>

            <DateContainer>
                <ButtonDate borderColor={theme.colors.primary} onPress={() => setModalVisible(true)}>
                    <ButtonDateText>{convertDate(startDate)}</ButtonDateText>
                    <Fontisto name="calendar" size={12} color={colors.secondary} />
                </ButtonDate>

                <Fontisto name="arrow-right-l" size={12} color={colors.secondary} />

                <ButtonDate borderColor={theme.colors.primary} onPress={() => setModalEnd(true)}>
                    <ButtonDateText>{convertDate(endDate)}</ButtonDateText>
                    <Fontisto name="calendar" size={12} color={colors.secondary} />
                </ButtonDate>
            </DateContainer>

            <Filters>
                <Chip
                    onPress={() => handleDays(7)}
                    style={{ backgroundColor: colors.primary }}
                    textStyle={{ color: colors.white, fontWeight: 'bold' }}
                >
                    7 {translate('driver_extract.days')}
                </Chip>

                <Chip
                    onPress={() => handleDays(15)}
                    style={{ backgroundColor: colors.primary }}
                    textStyle={{ color: colors.white, fontWeight: 'bold' }}
                >
                    15 {translate('driver_extract.days')}
                </Chip>

                <Chip
                    onPress={() => handleDays(30)}
                    style={{ backgroundColor: colors.primary }}
                    textStyle={{ color: colors.white, fontWeight: 'bold' }}
                >
                    30 {translate('driver_extract.days')}
                </Chip>
            </Filters>

            <Divider />

            <Content>
                <ContainerCard>
                    {transactions.length > 0 &&
                        !loading &&
                        transactions.map((item: LastTransactionProps, index) => (
                            <CardTransfer data={item} key={index} color={item.color} />
                        ))}
                    <If condition={transactions.length === 0 && !loading}>
                        <TextSize>Nenhuma movimentação realizada</TextSize>
                    </If>
                </ContainerCard>
            </Content>

            <PaginationTransferSelect
                colorPages={theme.colors.primary}
                dataPage={dataPage}
                page={page}
                setPage={setPage}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
            />

            <Modal visible={modalVisible}>
                <ContentModalDate>
                    <Exit>
                        <ButtonExit
                            activeOpacity={0.7}
                            onPress={() => setModalVisible(false)}
                        >
                            <MaterialIcons
                                name="arrow-back-ios"
                                size={20}
                                color={colors.primary}
                            />

                            <TextExit>VOLTAR</TextExit>
                        </ButtonExit>
                    </Exit>

                    <Calendar
                        dateSelected={startDate}
                        onDaySelected={day => {
                            handleDateSelect(day);
                        }}
                    />
                </ContentModalDate>
            </Modal>

            <Modal visible={modalEnd}>
                <Exit>
                    <ButtonExit activeOpacity={0.7} onPress={() => setModalEnd(false)}>
                        <MaterialIcons
                            name="arrow-back-ios"
                            size={20}
                            color={colors.primary}
                        />

                        <TextExit>VOLTAR</TextExit>
                    </ButtonExit>
                </Exit>
                <ContentModalDate>
                    <Calendar
                        dateSelected={endDate}
                        onDaySelected={day => {
                            handleDateSelectEnd(day);
                        }}
                    />
                </ContentModalDate>
            </Modal>
        </Container>
    );
}
