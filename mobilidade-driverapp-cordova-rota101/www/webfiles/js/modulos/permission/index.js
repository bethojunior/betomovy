Route.waitView().then(() => {
    let isOpen = false;

    getPermission();

    document.addEventListener("resume", () => {
        getPermission();
    });


    function getPermission() {
        if (isOpen)
            return;

        isOpen = true;
        Position.getPermission().then((result) => {
            if(result != null) {
                isOpen = false;
            }
        });
    }
});
