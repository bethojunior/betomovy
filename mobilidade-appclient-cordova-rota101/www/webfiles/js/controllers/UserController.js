class UserController {
    static removeAccountRequest(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('user/removeaccountrequest', 'POST', data, resolve, reject);
        });
    }
}