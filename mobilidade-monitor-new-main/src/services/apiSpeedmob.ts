import axios from 'axios';

const apiSpeedmob = axios.create({
	baseURL: import.meta.env.SPEEDMOB,
});
export default apiSpeedmob;
