import axios from "axios";

const apiWhatsapp = axios.create({
  baseURL: import.meta.env.API_WHATSAPP || 'https://api-notifier.704app.com.br/whatsapp',
});


export default apiWhatsapp;