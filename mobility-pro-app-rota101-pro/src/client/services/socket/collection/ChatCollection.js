import AppSocket from '../../socket';

class ChatCollection {
  lastMessages = [];

  onConnectWithQueryParams(query = {}) {
    return new AppSocket(null, {query});
  }

  getCurrentMessages(tripReference, callback) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: 'chat',
      type: 'get_by_trip_reference',
      tripReference,
    });

    socketConnected.onEvent(`chat_${tripReference}`, ({data, type}) => {
      callback(
        data.map((item, index) => {
          const date = new Date(item.date.date.replace(' ', 'T'));
          date.setHours(date.getHours() + item.date.timezone_type);

          return {
            messageData: {
              ...item,
              date: {
                ...item.date,
                seconds: date.getTime() / 1000,
              },
            },
            id: index,
            type: type,
          };
        }),
      );
    });
  }

  getLastMessageUnread(tripReference, callback) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: 'chat',
      type: 'get_last_message_by_trip_reference',
      tripReference,
    });

    socketConnected.onEvent(`chat_last_message_${tripReference}`, ({data, type}) =>
      callback({item: data, type}),
    );
  }

  setViewMessage(id, tripReference) {
    const socketConnected =this.onConnectWithQueryParams();

    socketConnected.onEmit("set_viewed_message", {id, tripReference});
  }
}

export default ChatCollection;
