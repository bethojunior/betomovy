Route.waitView().then(() => {
    const userLogged = Session.get("user");

    let ws = null;

    let timeout = null;


    if (!IS_HOST_ENVIRONMENT_TEST)
        connect();

    function connect() {
        ws = new WebSocket(`${SOCKET_HOST}?driverId=${userLogged.idDriver}`);

        ws.onclose = (event) => {
            clearTimeout(timeout);
            setTimeout(connect, 3000);
        };

        ws.onmessage = (event) => {
        };

        ws.onerror = (event) => {
            ws.close();
        };

        ws.onopen = (event) => {
            ping();
        };
    }


    function ping() {
        clearTimeout(timeout);

        timeout = setTimeout(function () {
            if (ws !== null)
                ws.send(JSON.stringify({driverId: userLogged.idDriver}));

            ping();
        }, 5000);
    }

});