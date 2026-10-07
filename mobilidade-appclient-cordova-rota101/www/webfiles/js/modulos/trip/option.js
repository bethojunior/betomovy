Route.waitView().then(()=>{
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement("#optionTrip","onclick",function(){
        const _that = this;

        elementProperty.getElement(".options-trip",element=>{
            if(!element.classList.contains("active")){
                _that.innerHTML = "arrow_drop_up";
                element.classList.add("active");
                return;
            }
            _that.innerHTML = "arrow_drop_down";
            element.classList.remove("active");
        });
    });
});