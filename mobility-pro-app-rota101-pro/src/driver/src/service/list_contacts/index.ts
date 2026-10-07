import {buildApp} from '~/constantBuild/config';
import apiMain from '~/client/api/apiMain';

import {IRequestContactsProps} from './types';

export class ListContactsServices {
  static async saveContactsDevice(data: IRequestContactsProps[]) {
    try {
      const payload = {
        stdObject: data,
      };
      const responseListContacts = await apiMain.post(
        'listcontacts/savelistcontactgeneral',
        payload,
        {
          headers: {
            token: buildApp().TOKEN_HEADER,
          },
        },
      );

      if (responseListContacts.status) {
        return responseListContacts.data.data.response.data;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
