import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {FlatList} from 'react-native';

import {useState, useEffect} from 'react';

import {translate} from '../../../../../client/locales';

import {useUserDriver} from '../../../context/userDriver';

import {FavoritesProps, Pagination} from '../../../context/userDriver/types';

import Preload from '../../../components/Preload';
import {ItemFavoriteClient} from '../../../components/itemFavoriteClient';
import {Dialog} from '../../../components/Dialog';

import {
  Container,
  Header,
  Body,
  ButtonBack,
  TitleHeader,
  ContentList,
  ContentQntClients,
  ContainerQntClients,
  TextQntClients,
  TextClients,
} from './styles';

import theme from '../../../styles/theme';

export default function ListClientSpeedMob() {
  const {listClientFavorites, deleteFavorite} = useUserDriver();
  const [favorites, setFavorites] = useState<FavoritesProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dataPage, setDataPage] = useState<Pagination>({} as Pagination);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState<FavoritesProps>(
    {} as FavoritesProps,
  );

  const navigate = useNavigation();

  const onInit = async () => {
    setLoading(true);
    const response = await listClientFavorites(page);

    if (response) {
      setFavorites(response.favorites);
      setDataPage(response.paginate);

      setLoading(false);
    }

    setLoading(false);
  };

  const handleDialog = (favorite: FavoritesProps) => {
    setSelectedFavorite(favorite);
    setVisibleDialog(true);
  };

  const handleDeleteFavorite = async (id: string) => {
    await deleteFavorite(id);
    setVisibleDialog(false);
    onInit();
  };

  useEffect(() => {
    onInit();
  }, [page]);

  return (
    <Container>
      <Preload visible={loading} />
      <Header backgroundColor={theme.colors.primary}>
        <ButtonBack onPress={() => navigate.goBack()}>
          <Ionicons
            name="arrow-back"
            size={30}
            color={theme.colors.background_global}
          />
        </ButtonBack>
        <TitleHeader colorText={theme.colors.background_global}>
          {translate('routes.list_client')}
        </TitleHeader>
      </Header>

      <Body>
        <ContainerQntClients>
          <ContentQntClients backgroundColor={theme.colors.primary}>
            <TextQntClients colorText={theme.colors.background_global}>
              {favorites.length}
            </TextQntClients>
            <TextClients colorText={theme.colors.background_global}>
              {translate('list_client.title_favorite')}S
            </TextClients>
          </ContentQntClients>
        </ContainerQntClients>
        <ContentList>
          <FlatList
            data={favorites}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <ItemFavoriteClient
                image={item.profileImage}
                name={item.name}
                onPress={() => handleDialog(item)}
              />
            )}
          />
        </ContentList>

        <Dialog
          visibleDialog={visibleDialog}
          title={translate('list_client.delete_favorite')}
          paragraph={translate('list_client.text_delete_favorite')}
          onCancel={() => setVisibleDialog(false)}
          onConfirm={() => handleDeleteFavorite(selectedFavorite.idFavorite)}
        />
      </Body>
    </Container>
  );
}
