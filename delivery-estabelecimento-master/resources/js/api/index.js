import axios from 'axios';

const headers = {};

if (document.getElementById('header-api_token')) {
    headers.token = document.getElementById('header-api_token').value;
    headers.userid = document.getElementById('header-user_id').value;
}

const api = axios.create({
    baseURL: '/api/',
    headers: headers
});

export default api;
