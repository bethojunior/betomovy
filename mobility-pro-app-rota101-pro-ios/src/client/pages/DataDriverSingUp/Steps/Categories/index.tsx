import {useEffect, useState} from 'react';
import {useAuth} from '../../../../../context/auth';
import {CategoryDriver} from '../../../../../context/auth/types';
import {If} from '../../../../components/If';
import {ItemCategory} from '../../../../components/ItemCategory';
import {NavRegister} from '../../../../components/NavRegister';

import {CategoryList, Container} from './styles';

export function Categories() {
  const [categories, setCategories] = useState<CategoryDriver[]>([]);
  const {listCategories} = useAuth();

  const getCategories = async () => {
    const response = await listCategories();

    setCategories(response);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Container>
      <NavRegister />

      <If condition={categories.length > 0}>
        <CategoryList
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <ItemCategory
              name={item.name}
              picture={item.picture}
              onPress={() => {}}
            />
          )}
        />
      </If>
    </Container>
  );
}
