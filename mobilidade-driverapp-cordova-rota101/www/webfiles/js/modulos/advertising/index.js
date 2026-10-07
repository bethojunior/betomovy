function showAdvertising(position){
    AdvertisingController.findByCoordinate(position.lat,position.lng).then(({data})=>{
        if(data){
            viewController.elementProperty.getElement(".container-advertising-banner",element=>{
                element.style.backgroundImage = `url(${data.banner})`;
                setTimeout(()=>{
                    element.classList.add("active");
                },2000)
            });
            viewController.elementProperty.addEventInElement(".container-advertising-banner","onclick",function(){
                document.querySelector(".advertising-image").style.backgroundImage = `url(${data.thumbnail})`;
                document.querySelector("#advertisingDescription").innerHTML = data.description;
                Route.startClassesInComponent([{ component: ".container-advertising-modal", class: "active"}], ()=>{
                    viewController.elementProperty.removeClass(".container-advertising-modal","active");
                });
                viewController.elementProperty.addEventInElement(".go-back","onclick",()=>{
                    Route.backPage();
                });
                viewController.elementProperty.addEventInElement("#openWebAdvertising","onclick",()=>{
                    cordova.InAppBrowser.open(data.link, '_system');
                    AppController.insertCountAds(null, data.id).then(() => {});
                });
                viewController.elementProperty.addEventInElement("#shareAdvertising","onclick",()=>{
                    window.plugins.socialsharing.shareWithOptions({
                        message: `${data.description}\n`,
                        url: data.link,
                    }, (result) => {
                    }, (error) => {
                    });
                });
            });
        }else{
            viewController.elementProperty.removeClass(".container-advertising-banner","active");
        }
    })
}