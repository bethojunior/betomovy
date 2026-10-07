class AuthenticateController {
    static authenticate(email, password) {
        return ConnectionServer.sendRequestV2("companyLogin", "POST", {
                email,
                password
            });
    }
}