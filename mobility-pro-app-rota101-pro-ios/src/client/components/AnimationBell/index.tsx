import { Container, PointBadge } from './styles';

import { Animated } from 'react-native';
import { useState, useEffect, ReactNode } from 'react';

interface AnimationBellProps{
    children: ReactNode;
    startAnimation: boolean;
    isBadge: boolean;
    colorBadge?: string;
}

export default function AnimationBell({ children, startAnimation, colorBadge, isBadge }: AnimationBellProps) {
    const [aminating, setAminating] = useState(new Animated.Value(0));

    const rotation = aminating.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-10deg', '10deg'],
    });

    useEffect(() => {
        const animationBell = Animated.loop(
            Animated.sequence([
                Animated.timing(aminating, {
                    toValue: 1,
                    duration: 100,
                    delay: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(aminating, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(aminating, {
                    toValue: -1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(aminating, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(aminating, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]),
        );

        startAnimation ? animationBell.start() : animationBell.stop();
    }, [startAnimation]);

    return (
        <Container>
            {isBadge && startAnimation && (
                <PointBadge
                    color={colorBadge}
                />
            )}
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                {children}
            </Animated.View>
        </Container>
    );
}