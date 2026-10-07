import axios from 'axios'

const apiWhatsappMobilidade = axios.create({
  baseURL:
    import.meta.env.API_WHATSAPP_MOBILIDADE || 'https://api-whatsapp-mobilidade.704app.com.br/'
})

export default apiWhatsappMobilidade
