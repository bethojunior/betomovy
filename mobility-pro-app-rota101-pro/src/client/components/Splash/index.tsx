import { useEffect } from 'react';
import { Container, Logo } from './styles';

import { Animated } from 'react-native';

import { useNavigation } from '@react-navigation/native';

interface SplashProps{
    route?: any;
    type: 'client' | 'driver'
}

const Splash = ({ route, type }: SplashProps) => {
    
    const opacity = new Animated.Value(0);

    const navigate = useNavigation();


    {/* EFEITO FADE NA IMAGEM */}

    const fadeIn = () => {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
    };  

    useEffect(() => {
        fadeIn();
        
        {/* QUANDO SE PASSAR 1 SEGUNDO REDIRECIONA PARA SIGN IN */}
        setTimeout(() => {
            navigate.navigate(type === 'client' ? 'SignIn' : 'Home');
        }, 1000);
    }, []);

    return (
        <Container>
            <Animated.View style={[{ opacity }]}>
                <Logo source={route} />
            </Animated.View>
        </Container>
    );
};

export default Splash;
