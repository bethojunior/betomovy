import axios from 'axios';
import { applyPulseInterceptors } from '../../../lib/middleware/AxiosInterceptor';

const apiMapBox = axios.create({
  baseURL: 'https://api.mapbox.com',
});

applyPulseInterceptors(apiMapBox, 'api-map-box');

export default apiMapBox;
