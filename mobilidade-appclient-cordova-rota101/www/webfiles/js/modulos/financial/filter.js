viewController.setObserver("account-filter",function(){
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement(".item-extract-filter","onclick",function(){
        viewController.addParams("filter-extract",this.getAttribute("value"));

        Route.redirectDynamic('Financial','FilterExtract');
    });


    Route.pageDynamic();
});