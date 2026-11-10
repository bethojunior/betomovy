import axios from 'axios'

const apiWhatsappMobilidade = axios.create({
  baseURL:
    import.meta.env.API_WHATSAPP_MOBILIDADE || 'https://api.movymob.com/whatsapp-mobilidade/'
})

export default apiWhatsappMobilidade
