viewController.setObserver("menu-title",function(){
    viewController.elementProperty.addEventInElement(".back-to","onclick",function(){
        location.href = "index.html"
    });

    viewController.elementProperty.getElement("#termsOfUse", element=>{
        const config = Session.get("configGeneral");

        if (config.length === 0)
            return;

        const term = config.find(item => {
            return item.key === 'driver_terms_of_use';
        });

        element.src = (!term.value.includes(".pdf")) ?
            term.value :
            encodeURI(`https://docs.google.com/gview?url=${term.value}&embedded=true`);
    });
});