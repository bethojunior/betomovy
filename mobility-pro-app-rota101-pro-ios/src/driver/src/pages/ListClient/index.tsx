import { useEffect, useState } from 'react';
import { translate } from '../../../../client/locales';
import { Dialog } from '../../components/Dialog';
import { If } from '../../components/If';
import { ItemFavoriteClient } from '../../components/itemFavoriteClient';
import Preload from '../../components/Preload';
import { useUserDriver } from '../../context/userDriver';
import { FavoritesProps, Pagination } from '../../context/userDriver/types';

import { Container, IndicatorListData, NotFavorites, Title } from './styles';

export function ListClient() {
  const { listClientFavorites, deleteFavorite } = useUserDriver();
  const [favorites, setFavorites] = useState<FavoritesProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dataPage, setDataPage] = useState<Pagination>({} as Pagination);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState<FavoritesProps>(
    {} as FavoritesProps,
  );

  const onInit = async (page = 1) => {
    setLoading(true);
    const response = await listClientFavorites(page);

    if (response) {
      setPage(page)
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

  const changePage = () => {
    if (page < dataPage.lastPage) {
      onInit(page + 1)
    }
  }

  useEffect(() => {
    onInit();
  }, []);

  return (
    <Container>
      <Preload visible={loading} />
      <If condition={favorites.length > 0}>
        <Title>Total {dataPage.totalRows}</Title>
        <IndicatorListData
          data={favorites}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={changePage}
          onEndReachedThreshold={0.1}
          renderItem={({ item }) => (
            <ItemFavoriteClient
              image={item.profileImage}
              name={item.name}
              onPress={() => handleDialog(item)}
            />
          )}
        />
      </If>

      <If condition={favorites.length === 0}>
        <NotFavorites>{translate('list_client.not_client')}</NotFavorites>
      </If>

      <Dialog
        visibleDialog={visibleDialog}
        title={translate('list_client.delete_favorite')}
        paragraph={translate('list_client.text_delete_favorite')}
        onCancel={() => setVisibleDialog(false)}
        onConfirm={() => handleDeleteFavorite(selectedFavorite.idFavorite)}
      />
    </Container>
  );
}
