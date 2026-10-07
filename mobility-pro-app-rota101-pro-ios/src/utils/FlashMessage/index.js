import {showMessage} from 'react-native-flash-message';
import theme from '../../client/styles/theme';
import {translate} from '../../client/locales';
import {Platform} from 'react-native';

export function customToast(message, type, time) {
  switch (type) {
    case 'success':
      showMessage({
        type: 'success',
        message: translate('service.text_sucess'),
        description: message,
        hideOnPress: true,
        titleStyle: {
          color: theme.colors.secondary,
          fontSize: theme.fontSizes.large,
          fontFamily: 'MavenPro_500Medium',
          marginTop: -10,
        },
        textStyle: {
          color: theme.colors.secondary,
          fontSize: theme.fontSizes.medium,
          fontFamily: 'MavenPro_400Regular',
          marginRight: 15,
          marginBottom: -10,
        },
        style: {
          backgroundColor: theme.colors.white,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-end',
          borderRadius: 5,
          borderLeftWidth: 7,
          borderRightWidth: 1,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: theme.colors.serene_green,
          padding: 0,
          margin: 0,
        },
        icon: {
          icon: 'success',
          position: 'left',
        },
        iconProps: {
          width: Platform.OS === 'ios' ? 20 : 50,
          height: Platform.OS === 'ios' ? 20 : 50,
          borderRadius: 50,
          backgroundColor: theme.colors.serene_green,
        },
        duration: time || 4000,
        floating: true,
      });
      break;
    case 'danger':
      showMessage({
        type: 'danger',
        message: 'Erro',
        description: message,
        hideOnPress: true,
        titleStyle: {
          color: theme.colors.secondary,
          fontSize: theme.fontSizes.large,
          fontFamily: 'MavenPro_500Medium',
          marginTop: -10,
        },
        textStyle: {
          color: theme.colors.secondary,
          fontSize: theme.fontSizes.medium,
          fontFamily: 'MavenPro_400Regular',
          marginRight: 15,
          marginBottom: -10,
        },
        style: {
          backgroundColor: theme.colors.background_global,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-end',
          borderRadius: 5,
          borderLeftWidth: 7,
          borderRightWidth: 1,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: theme.colors.coral_rose,
        },
        icon: {
          icon: 'danger',
          position: 'left',
        },
        iconProps: {
          width: Platform.OS === 'ios' ? 20 : 50,
          height: Platform.OS === 'ios' ? 20 : 50,
          borderRadius: 50,
          backgroundColor: theme.colors.coral_rose,
        },
        duration: 4000,
        floating: true,
      });
      break;
    case 'error':
      showMessage({
        type: 'danger',
        message: 'Erro',
        description: message,
        hideOnPress: true,
        titleStyle: {
          color: theme.colors.secondary,
          fontSize: theme.fontSizes.large,
          fontFamily: 'MavenPro_500Medium',
          marginTop: -10,
        },
        textStyle: {
          color: theme.colors.secondary,
          fontSize: theme.fontSizes.medium,
          fontFamily: 'MavenPro_400Regular',
          marginRight: 15,
          marginBottom: -10,
        },
        style: {
          backgroundColor: theme.colors.background_global,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-end',
          borderRadius: 5,
          borderLeftWidth: 7,
          borderRightWidth: 1,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: theme.colors.coral_rose,
        },
        icon: {
          icon: 'danger',
          position: 'left',
        },
        iconProps: {
          width: Platform.OS === 'ios' ? 20 : 50,
          height: Platform.OS === 'ios' ? 20 : 50,
          borderRadius: 50,
          backgroundColor: theme.colors.coral_rose,
        },
        duration: 4000,
        floating: true,
      });
      break;
    case 'warning':
      showMessage({
        type: 'warning',
        message: translate('schedule.toast_alert'),
        description: message,
        hideOnPress: true,
        titleStyle: {
          color: theme.colors.secondary,
          fontSize: theme.fontSizes.large,
          fontFamily: 'MavenPro_500Medium',
          marginTop: -10,
        },
        textStyle: {
          color: theme.colors.secondary,
          fontSize: theme.fontSizes.medium,
          fontFamily: 'MavenPro_400Regular',
          marginRight: 15,
          marginBottom: -10,
        },
        style: {
          backgroundColor: theme.colors.background_global,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-end',
          borderRadius: 5,
          borderLeftWidth: 7,
          borderRightWidth: 1,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: theme.colors.yellowStrong,
        },
        icon: {
          icon: 'warning',
          position: 'left',
        },
        iconProps: {
          width: Platform.OS === 'ios' ? 20 : 50,
          height: Platform.OS === 'ios' ? 20 : 50,
          borderRadius: 50,
          backgroundColor: theme.colors.yellowLight,
        },
        duration: 4000,
        floating: true,
      });
      break;
    default:
      showMessage({
        type: 'danger',
        message: 'Erro',
        description: message,
        hideOnPress: true,
        titleStyle: {
          color: theme.colors.secondary,
          fontSize: theme.fontSizes.large,
          fontFamily: 'MavenPro_500Medium',
          marginTop: -10,
        },
        textStyle: {
          color: theme.colors.secondary,
          fontSize: theme.fontSizes.medium,
          fontFamily: 'MavenPro_400Regular',
          marginRight: 15,
          marginBottom: -10,
        },
        style: {
          backgroundColor: theme.colors.background_global,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-end',
          borderRadius: 5,
          borderLeftWidth: 7,
          borderRightWidth: 1,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: theme.colors.coral_rose,
        },
        icon: {
          icon: 'danger',
          position: 'left',
        },
        iconProps: {
          width: Platform.OS === 'ios' ? 20 : 50,
          height: Platform.OS === 'ios' ? 20 : 50,
          borderRadius: 50,
          backgroundColor: theme.colors.coral_rose,
        },
        duration: 4000,
        floating: true,
      });
      break;
  }
}

export function customErrorMessage({message, description, statusCode}) {
  if (!description)
    if (statusCode)
      switch (statusCode) {
        case 401:
          description = 'usuário não permitido';
          break;
        case 404:
          description = 'recurso não encontrado';
          break;
        case 409:
          description = 'recurso já existente.';
          break;
        case 500:
          description = 'erro interno do servidor.';
          break;
        default:
          description = 'erro inesperado.';
          break;
      }
    else description = 'falha na comunicação com servidor';

  customToast(`${message}: ${description}`, 'danger');
}
