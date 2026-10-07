import axios from 'axios';
import { buildApp } from '../../constantBuild/config';

const apiDelivery = axios.create({
  baseURL: buildApp().HOST_API_DELIVERY,
});

export default apiDelivery;
