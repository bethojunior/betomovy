import axios from 'axios';

const apiMapBox = axios.create({
  baseURL: 'https://api.mapbox.com',
});

export default apiMapBox;
