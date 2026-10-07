import FirebaseChat from "../firebase/ChatCollection";

export const ChatRealtime = () => {
  const firebaseChat = new FirebaseChat();

  const getCurrentMessages = (tripReference: string, callback: any) => {
    firebaseChat.getCurrentMessages(tripReference, callback);
  };

  const getLastMessageUnread = (tripReference: string, callback: any) => {
    firebaseChat.getLastMessageUnread(tripReference, callback);
  };

  const setViewMessage = (id: number, tripReference?: string) => {
    firebaseChat.setViewMessage(id);
  };

  return {
    getCurrentMessages,
    getLastMessageUnread,
    setViewMessage,
  };
};
