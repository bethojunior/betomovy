import apiMain from '../../api/apiMain';

export const modulesService = {
  get: () => {
    return apiMain.get('appactivemodule/getallactivemodules');
  },
};
