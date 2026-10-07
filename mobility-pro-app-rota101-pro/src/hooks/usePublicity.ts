import { useEffect, useState } from 'react';
import apiMain from '~/client/api/apiMain';
import { Position } from '~/context/auth/types';
import { ApiResponse } from '~/interfaces/api';
import { Publicity } from '~/interfaces/publicity';

type PublicityParams = {
  position: Position | null | undefined;
  typeConst?: number | null;
  advertisingAppSiteId?: number | null;
  genderId?: number | null;
};

export function usePublicity(params: PublicityParams) {
  const [data, setData] = useState<Publicity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicity = async (params: PublicityParams) => {
    const { position, typeConst = null, advertisingAppSiteId = null, genderId = null } = params;

    if (!position?.latitude || !position?.longitude) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await apiMain.get<ApiResponse<Publicity[]>>('advertising/list', {
        params: {
          lat: position.latitude,
          lng: position.longitude,
          appId: typeConst,
          advertisingAppSiteId,
          genderId,
        },
      });

      if (response.data.status && response.data.data !== null) {
        if (error) setError(null);
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (err) {
      setError((err as any)?.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const reload = () => fetchPublicity(params);

  useEffect(() => {
    fetchPublicity(params);
  }, [params.position?.latitude, params.position?.longitude, params.typeConst]);

  return { data, loading, error, reload };
}
