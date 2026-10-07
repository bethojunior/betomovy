import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Modal} from 'react-native';
import Preload from '../../components/Preload';
import {DeliveryServiceList} from './DeliveryService';
import {Container} from './styles';
import {DeliveryCard} from '../../components/DeliveryCard';
import {PaginationSelect} from '../../components/PaginationSelect';
import {DeliveryModal} from './Modal/DeliveryModal';

export const ListDelivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [dataPage, setDataPage] = useState<any>({});
  const [selectedValue, setSelectedValue] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        const {response} = await DeliveryServiceList.getDeliveries(page);
        const data = response?.data;
        setDataPage({
          currentPage: response?.current_page,
          lastPage: response?.last_page,
        });
        setDeliveries(data);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [page]);

  return (
    <Container>
      <Preload visible={loading} />
      <ScrollView>
        {deliveries.map((delivery, index) => (
          <DeliveryCard
            key={index}
            delivery={delivery}
            onPress={() => setSelectedDelivery(delivery)}
          />
        ))}
      </ScrollView>
      <PaginationSelect
        page={page}
        setPage={setPage}
        dataPage={dataPage || 2}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />
      {selectedDelivery && (
        <DeliveryModal
          selectedDelivery={selectedDelivery}
          onRequestClose={() => setSelectedDelivery(null)}
        />
      )}
    </Container>
  );
};
