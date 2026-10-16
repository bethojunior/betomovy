// @ts-nocheck
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, BackHandler, Image} from 'react-native';
import {useAuth} from '../../../context/auth';
import {useNavigation} from '@react-navigation/native';
import icon from '../../assets/images/congratulations.gif';
import {styles} from './styles';
import apiMain from '../../api/apiMain';

export default function CongratulationSignUp({route}) {
  const {signIn} = useAuth();
  const {user} = route.params;
  const navigation = useNavigation();
  const [docs, setDocs] = useState([]);

  const checkDocuments = async (userData) => {
    try {
      let configuredDocIds = [];
      try {
        const configResponse = await apiMain.get('docusertype/findbyusertype?userTypeId=5');
        if (configResponse.data.status && configResponse.data.data) {
          configuredDocIds = configResponse.data.data.map(docConfig => docConfig.docId.toString());
        }
      } catch (configError) {
        configuredDocIds = ['8', '9'];
      }
      
      const {data} = await apiMain.post('Customer/Find', {idUser: userData.idUser});
      
      if (data.status && data.data?.docsUser) {
        const docsPending = data.data.docsUser.filter(doc => {
          const isConfigured = configuredDocIds.includes(doc.docId.toString());
          const isNotApproved = doc.docStatusId !== '1';
          return isConfigured && isNotApproved;
        });
        
        setDocs(docsPending);
        
        if (docsPending.length > 0) {
          setTimeout(() => {
            navigation.replace('DocumentPending', {docs: docsPending});
          }, 2000);
          return;
        }
      }
      
      setTimeout(() => {
        signIn(user);
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        signIn(user);
      }, 2000);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );

    checkDocuments(user);

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
    </View>
  );
}
