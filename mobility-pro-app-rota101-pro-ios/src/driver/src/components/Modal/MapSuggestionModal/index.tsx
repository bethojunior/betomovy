import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTripProvider } from '../../../context/Trip';
import { NavigationAppCard } from '../../NavigationAppCard';
import ModalFrame from '../ModalFrame';
import { translate } from '../../../../../client/locales';
import theme from '../../../styles/theme';
import {
    STATUS_ACCEPTED,
    STATUS_BOARDING,
    STATUS_IN_PROGRESS,
} from '../../../constants/trip';
import {
    Header,
    HeaderIconBadge,
    HeaderSubtitle,
    HeaderTextContent,
    HeaderTitle,
} from './styles';
import { MapSuggestionModalProps } from './types';

export const MapSuggestionModal = ({ visible, setVisible }: MapSuggestionModalProps) => {
    const [loading, setLoading] = useState(true);

    const tripAccepted: any = useTripProvider(
        (context: any) => context.stateTrip.tripAccepted,
    );

    const hasActiveTrip =
        !!tripAccepted?.tripReference &&
        [STATUS_ACCEPTED, STATUS_BOARDING, STATUS_IN_PROGRESS].includes(
            tripAccepted?.status,
        );

    const waypoints = tripAccepted?.tripWayPoints?.filter(waypoint => {
        return waypoint?.confirmed === '0';
    });

    const switchCaseSearchNative = (
        status,
        origin,
        destination,
        waypoints,
        dir = 'latitude',
    ) => {
        switch (status) {
            case STATUS_ACCEPTED:
                return origin[dir];
            case STATUS_BOARDING:
                return origin[dir];
            case STATUS_IN_PROGRESS:
                return waypoints && waypoints.length > 0
                    ? waypoints[0][dir]
                    : destination[dir];
            default:
                return destination[dir];
        }
    };

    const openNavigation = (url: string, params: string = '') => {
        if (!tripAccepted?.destination) {
            setVisible(false);
            return;
        }
        Linking.openURL(
            `${url}${switchCaseSearchNative(
                tripAccepted?.status,
                tripAccepted.origin,
                tripAccepted.destination,
                waypoints,
                'latitude',
            )},${switchCaseSearchNative(
                tripAccepted?.status,
                tripAccepted.origin,
                tripAccepted.destination,
                waypoints,
                'longitude',
            )}${params}`,
        );
        setVisible(false);
    };

    const getLastNavigation = async () => {
        setLoading(true);
        const lastNavigation = await AsyncStorage.getItem('lastGps');
        if (lastNavigation && lastNavigation === 'waze') {
            openNavigation('https://waze.com/ul?ll=', '&navigate=yes');
            setLoading(false);
        } else if (lastNavigation && lastNavigation === 'google') {
            openNavigation('https://www.google.com/maps/dir/?api=1&destination=');
            setLoading(false);
        } else {
            // Se não há preferência salva, mostra o modal de escolha
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!visible) return;

        // Flag pode ficar presa como true após a viagem encerrar (timer dispara
        // com a Home fora de foco); sem viagem ativa, consome e não exibe.
        if (!hasActiveTrip) {
            setVisible(false);
            return;
        }

        getLastNavigation();
    }, [visible, hasActiveTrip]);

    return (
        <>
            <ModalFrame
                visible={visible && !loading && hasActiveTrip}
                setVisible={setVisible}
                hideConfirm
                hideCancel
                closeIcon={true}
                closeIconColor={theme.colors.red}
                onClose={() => {
                    setVisible(false);
                }}
            >
                <Header>
                    <HeaderIconBadge>
                        <FontAwesome5
                            name="route"
                            size={RFValue(20)}
                            color={theme.colors.yellowStrong}
                        />
                    </HeaderIconBadge>
                    <HeaderTextContent>
                        <HeaderTitle>
                            {translate('driverTrip.text_map_suggestion_title')}
                        </HeaderTitle>
                        <HeaderSubtitle>
                            {translate('driverTrip.text_map_suggestion_subtitle')}
                        </HeaderSubtitle>
                    </HeaderTextContent>
                </Header>

                <NavigationAppCard
                    appType="waze"
                    title="Waze"
                    description={translate(
                        'driverTrip.text_map_suggestion_waze_description',
                    )}
                    onPress={async () => {
                        openNavigation('https://waze.com/ul?ll=', '&navigate=yes');
                        await AsyncStorage.setItem('lastGps', 'waze');
                        setVisible(false);
                    }}
                />
                <NavigationAppCard
                    appType="google"
                    title="Maps"
                    description={translate(
                        'driverTrip.text_map_suggestion_maps_description',
                    )}
                    onPress={async () => {
                        openNavigation('https://www.google.com/maps/dir/?api=1&destination=');
                        await AsyncStorage.setItem('lastGps', 'google');
                        setVisible(false);
                    }}
                />
            </ModalFrame>
        </>
    );
};
