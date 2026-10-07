import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import theme from '../../styles/theme';
import { translate } from '../../../../client/locales';
import apiMainDriver from '../../api/apiMain';
import { useUserDriver } from '../../context/userDriver';

export default function TempoAoVolante() {
    const navigation = useNavigation();
    const { userDriverFind } = useUserDriver();

    const [driverHours, setDriverHours] = useState(null);
    const [loadingHours, setLoadingHours] = useState(true);
    const [error, setError] = useState(false);

    const formatTimeFromMinutes = (minutes: number) => {
        if (!minutes || minutes === 0) return '0h 0m';

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) {
            return `${remainingMinutes}m`;
        } else if (remainingMinutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${remainingMinutes}m`;
        }
    };

    const GetDriverHours = async () => {
        try {
            setLoadingHours(true);
            setError(false);
            const response = await apiMainDriver.post('driver/GetDriverHours', {
                stdObject: [
                    {
                        driverId: userDriverFind?.idDriver
                    }
                ]
            });
            if (response.data?.status && response.data?.data) {
                setDriverHours(response.data.data);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error('Erro ao buscar horas dirigidas:', error);
            setError(true);
        } finally {
            setLoadingHours(false);
        }
    };

    useEffect(() => {
        GetDriverHours();
    }, []);

    return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.colors.secondary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{translate('menu.tempo_ao_volante')}</Text>
                    <TouchableOpacity
                        onPress={GetDriverHours}
                        style={styles.refreshButton}
                        disabled={loadingHours}
                    >
                        <Ionicons
                            name="refresh"
                            size={24}
                            color={loadingHours ? theme.colors.border : theme.colors.secondary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Resumo */}
                <View style={styles.summaryContainer}>
                    {loadingHours ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={styles.loadingText}>Carregando horas...</Text>
                        </View>
                    ) : (
                        <View style={styles.summaryCard}>
                            <View style={styles.summarySection}>
                                <View style={styles.summaryLine}>
                                    <MaterialIcons
                                        name="directions-car"
                                        size={30}
                                        color={theme.colors.primary}
                                    />
                                    <View style={styles.summaryContent}>
                                        <Text style={styles.summaryTitle}>{translate('menu.tempo_ao_volante')}</Text>
                                        <Text style={styles.summaryValue}>
                                            {driverHours ?
                                                formatTimeFromMinutes(parseFloat(driverHours?.hours_worked || 0)) :
                                                '0h 0m'
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.border} />

                            <View style={styles.summarySection}>
                                <View style={styles.summaryLine}>
                                    <MaterialIcons
                                        name="schedule"
                                        size={30}
                                        color={theme.colors.primary}
                                    />
                                    <View style={styles.summaryContent}>
                                        <Text style={styles.summaryTitle}>Tempo Máximo</Text>
                                        <Text style={styles.summaryValue}>
                                            {driverHours ?
                                                formatTimeFromMinutes(parseFloat(driverHours?.hours_open || 0)) :
                                                '0h 0m'
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
                {!loadingHours && (
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryCard}>
                            <Text style={styles.infoTitle}>Tempo máximo ao volante</Text>
                            <Text style={styles.infoText}>
                                Para sua saúde e segurança, o app ficará disponível para você dirigir por {driverHours ? formatTimeFromMinutes(parseFloat(driverHours?.hours_open || 0)) : '0h 0m'} consecutivas.
                            </Text>
                            <Text style={styles.infoText}>
                                O tempo em que você fica offline ou faz uma pausa entre viagens não conta para o limite de horas.
                            </Text>
                            <View style={styles.divider}>
                                <Text style={styles.infoTitle}>Dicas importantes</Text>
                                <Text style={styles.infoText}>
                                    • Faça pausas regulares durante o dia para descansar
                                </Text>
                                <Text style={styles.infoText}>
                                    • Mantenha-se hidratado e alimentado adequadamente
                                </Text>
                                <Text style={styles.infoText}>
                                    • Se sentir cansaço, pare imediatamente e descanse
                                </Text>
                                <Text style={styles.infoText}>
                                    • Respeite sempre os limites de velocidade e as leis de trânsito
                                </Text>
                            </View>
                        </View>

                    </View>
                )}

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background_global,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: theme.colors.background_global,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.secondary,
    },
    placeholder: {
        width: 34,
    },
    refreshButton: {
        padding: 5,
    },
    summaryContainer: {
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 20,
        alignItems: 'center',
    },
    border: {
        width: '100%',
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 15,
    },
    summaryCard: {
        width: '100%',
        maxWidth: 350,
        backgroundColor: '#fff',
        alignSelf: 'center',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    summarySection: {
        width: '100%',
        minHeight: 80,
        justifyContent: 'center',
    },
    summaryContent: {
        flex: 1,
        marginLeft: 15,
    },
    summaryLine: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
    },
    summaryTitle: {
        fontSize: 14,
        color: theme.colors.secondary,
        marginBottom: 4,
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.secondary,
        marginBottom: 2,
    },
    summarySubtitle: {
        fontSize: 12,
        color: theme.colors.secondary,
        marginTop: 2,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        width: '100%',
        maxWidth: 350,
        backgroundColor: '#fff',
        alignSelf: 'center',
        padding: 40,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: theme.colors.secondary,
        marginTop: 15,
        textAlign: 'center',
        fontWeight: '500',
    },
    errorContainer: {
        width: '100%',
        maxWidth: 350,
        backgroundColor: '#fff',
        alignSelf: 'center',
        padding: 40,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.secondary,
        marginTop: 15,
        marginBottom: 10,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 14,
        color: theme.colors.secondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primaryText,
        marginBottom: 15,
    },

    tempoCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tempoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    tempoData: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.primaryText,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    tempoDetails: {
        gap: 8,
    },
    tempoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tempoLabel: {
        fontSize: 14,
        color: theme.colors.secondary,
    },
    tempoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.primaryText,
    },
    tempoTotal: {
        color: theme.colors.primary,
        fontSize: 16,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.secondary,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: theme.colors.secondary,
        marginBottom: 5,
        lineHeight: 22,
    },
    infoSubtitle: {
        fontSize: 12,
        color: theme.colors.secondary,
        marginTop: 5,
        marginBottom: 8,
    },
    learnMoreButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    divider: {
        marginVertical: 12,
    },
    learnMoreText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    testButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    testButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    hoursContainer: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    hoursTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.secondary,
        marginBottom: 15,
        textAlign: 'center',
    },
    hoursItem: {
        backgroundColor: theme.colors.background_global,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    hoursLabel: {
        fontSize: 14,
        color: theme.colors.secondary,
        marginBottom: 5,
    },
});
