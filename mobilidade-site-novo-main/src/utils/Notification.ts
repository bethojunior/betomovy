import apiMilto from "../api/apiMilto";

export const Notification = {
  SMS: (phone: string, message: string) => {
    try {
      apiMilto.post("notifications/sms", {
        phone,
        message,
      });
    } catch (error) {
      console.error(error);
    }
  },
  Email: (recipient: string, title: string, message: string) => {
    // message tem que ser um html (ex: <h1>Bom dia!</h1>)
    try {
      apiMilto.post("notifications/email", {
        recipient,
        title,
        message,
      });
    } catch (error) {
      console.log(error);
    }
  },
  Whatsapp: (phone: string, message: string) => {
    try {
      apiMilto.post("notifications/whatsapp", {
        phone,
        message,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
