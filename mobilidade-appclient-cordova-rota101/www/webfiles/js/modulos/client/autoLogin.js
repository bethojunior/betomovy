viewController.setObserver("autoLogin", data => {
    pages = [];

    let push = new Push();

    setTimeout(() => {
        CustomerController.autoLogin(data.userId, push.token).then((result) => {
            if (!result.status)
                return swal("ops", result.message, "info").then(() => location.reload());
            Session.set('user', result.data);
            window.location = HOST;
        });
    }, 500);
});