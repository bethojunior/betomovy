import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {useAuth} from '../../../../../context/auth';
import {CategoryDriver} from '../../../../../context/auth/types';
import {If} from '../../../../components/If';
import {ItemCategory} from '../../../../components/ItemCategory';
import {NavRegister} from '../../../../components/NavRegister';
import {translate} from '../../../../locales';

import {CategoryList, Container} from './styles';

const SELECTED_DRIVER_CATEGORY_KEY = 'selectedDriverCategoryId';

export function Categories() {
  const [categories, setCategories] = useState<CategoryDriver[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {listCategories} = useAuth();

  const getCategories = async () => {
    const response = await listCategories();
    setCategories(Array.isArray(response) ? response : []);

    try {
      const saved = await AsyncStorage.getItem(SELECTED_DRIVER_CATEGORY_KEY);
      if (saved) setSelectedId(saved);
    } catch {}
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleSelectCategory = async (item: CategoryDriver) => {
    const id = String(item.idUserType);
    setSelectedId(id);
    try {
      await AsyncStorage.setItem(SELECTED_DRIVER_CATEGORY_KEY, id);
      await AsyncStorage.setItem(
        'selectedDriverCategory',
        JSON.stringify(item),
      );
    } catch {}
    Alert.alert(
      translate('informChangeModal.title_alert_attention') || 'Categoria',
      item.name,
    );
  };

  return (
    <Container>
      <NavRegister />

      <If condition={categories.length > 0}>
        <CategoryList
          data={categories}
          keyExtractor={(item, index) =>
            String(item.idUserType || index)
          }
          extraData={selectedId}
          renderItem={({item}) => (
            <ItemCategory
              name={
                selectedId === String(item.idUserType)
                  ? `✓ ${item.name}`
                  : item.name
              }
              picture={item.picture}
              onPress={() => handleSelectCategory(item)}
            />
          )}
        />
      </If>
    </Container>
  );
}
