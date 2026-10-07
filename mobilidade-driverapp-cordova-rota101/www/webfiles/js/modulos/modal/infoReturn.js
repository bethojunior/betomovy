Route.waitView().then(function(){
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement("#infoUseReturn","onclick",function(){
        elementProperty.addClass(".container-info-use-return","active");
    });

    elementProperty.addEventInElement(".close-modal-info-return","onclick",function(){
        elementProperty.removeClass(".container-info-use-return","active");
    });
});