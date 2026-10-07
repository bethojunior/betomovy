Route.waitView().then(function(){
    const elementProperty = new ElementProperty();

    /**
     * Retirar quando valida uma versão de produção !
     */
    elementProperty.addEventInElement(".title-menu","onclick",() => {
/*        elementProperty.getElement(".custom", element=>{
            switch(element.getAttribute("type")){
                case "email":
                    element.value = "betho@gmail.com";
                    break;
                case "password":
                    element.value = "123";
                    break;

            }
        });*/
    });
});