import axios from "axios";

const apiWhatsapp = axios.create({
  baseURL: import.meta.env.API_WHATSAPP || 'https://api.movymob.com/whatsapp',
});


export default apiWhatsapp;