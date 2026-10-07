import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

import { Container, Button, Logo } from "./styles";
import { useEffect } from 'react';

import AnimationBell from '../../../../../client/components/AnimationBell';

import { useAuth } from '../../../../../context/auth';
import theme from '../../../styles/theme';
  
export default function HomeHeaderTopSpeedMob() {
    const { notification } = useAuth();

    const navigation = useNavigation();

    const haveNotification = () => {
        if (
          notification.length !== 0 &&
          notification.some((item: any) => item.viewed === '0')
        ) {
          return true;
        }
        return false;
    };

    useEffect(() => {
        haveNotification;
    }, [Notifications, notification]);

    return (
        <Container>
            <Button onPress={() => navigation.navigate('MenuSpeedMob')}>
                <Ionicons name="menu" color={theme.colors.primary} size={35} />
            </Button>
            <Logo
                source={{ uri: theme.images.logo }}
            />
            <AnimationBell colorBadge={theme.colors.primary} isBadge startAnimation={haveNotification()}>
                <Button onPress={() => navigation.navigate('NotificationUserSpeedMob')}>
                    <Ionicons name='notifications' color={theme.colors.primary} size={35} />
                </Button>
            </AnimationBell>
        </Container>
    )
}