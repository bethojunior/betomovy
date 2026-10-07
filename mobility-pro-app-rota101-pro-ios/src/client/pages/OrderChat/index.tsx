/* eslint-disable eqeqeq */
// @ts-nocheck

import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Colors from '../../components/Colors';
import apiDelivery from '../../api/apiDelivery';
import LoadView from '../../components/LoadView';
import AppSocket from '../../services/socket';

import {translate} from '../../locales';
import {styles} from './styles';
import {useAuth} from '../../../context/auth';
import theme from '../../styles/theme';
import {buildApp} from '../../../constantBuild/config';

let socket = null;

export default function OrderChat() {
  const scroll = useRef(null);
  const {user} = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const routes = useRoute();
  const {order, type} = routes.params;

  useEffect(() => {
    async function getData() {
      await getMessages();
      setLoading(false);
    }

    async function openSocket() {
      socket = new AppSocket(buildApp().HOST_SOCKETV2);
      socket.onEvent(`deliveryChat_${order.id}`, () => {
        getMessages();
      });
    }

    openSocket();
    getData();

    return () => {
      if (socket) socket.close();
    };
  }, []);

  async function getMessages() {
    const {
      data: {response},
    } = await apiDelivery.get(`delivery/order/${order.id}/chat?type=${type}`);

    setMessages(response.reverse());
  }

  return (
    <View style={styles.container}>
      <NavBar order={order} type={type} />
      {!loading ? (
        <>
          <ScrollView
            ref={scroll}
            style={styles.content}
            onContentSizeChange={() =>
              scroll.current.scrollToEnd({animated: true})
            }
          >
            {messages.map(({message, userId, id, preview, driverId}) => {
              if (userId != null)
                return (
                  <MessageSent key={id} message={message} preview={preview} />
                );

              return <MessageReceived key={id} message={message} />;
            })}
          </ScrollView>
          <Footer order={order} type={type} />
        </>
      ) : (
        <LoadView />
      )}
    </View>
  );
}

function MessageSent({message, preview}) {
  return (
    <View
      style={[styles.containerMessageSent, {opacity: preview ? '0.75' : 1}]}
    >
      <View style={styles.contentMessage}>
        <Text>{message}</Text>
      </View>
    </View>
  );
}

function MessageReceived({message}) {
  return (
    <View
      style={[styles.containerMessageSent, styles.containerMessageReceived]}
    >
      <View
        style={[
          styles.contentMessage,
          {backgroundColor: theme.colors.border_white_light},
        ]}
      >
        <Text>{message}</Text>
      </View>
    </View>
  );
}

function NavBar({order, type}) {
  const navigation = useNavigation();
  return (
    <View style={styles.containerNav}>
      <TouchableOpacity
        style={styles.containerButtonNav}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name="ios-arrow-back" size={30} color={Colors.PRIMARY} />
      </TouchableOpacity>
      <View>
        <Text style={styles.titleNav}>
          {type == 'driver' ? order.driver.name : order.company.fantasyName}
        </Text>
        <Text style={styles.labelNav}>
          {type == 'driver'
            ? translate('orderChat.text_deliveryman')
            : translate('orderChat.text_establishment')}
        </Text>
      </View>
    </View>
  );
}

function Footer({order, type}) {
  const [value, setValue] = useState('');

  async function handleMessage() {
    if (value.trim().length > 0) {
      apiDelivery.post(`delivery/order/${order.id}/chat`, {
        message: value,
        sendTo: type,
      });
      setValue('');
    }
  }

  return (
    <View style={styles.containerFooter}>
      <TextInput
        value={value}
        onChangeText={setValue}
        multiline
        numberOfLines={2}
        placeholder={translate('orderChat.text_placeholder_type_something')}
        style={styles.inputFooter}
      />
      <TouchableOpacity
        onPress={() => {
          handleMessage();
        }}
      >
        <MaterialIcon name="send" size={30} color={Colors.PRIMARY} />
      </TouchableOpacity>
    </View>
  );
}
