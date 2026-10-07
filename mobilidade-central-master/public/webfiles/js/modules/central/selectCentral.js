document.addEventListener("DOMContentLoaded",function(){
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement(".central-select","onclick",function(){
        Session.set("centralSelected",JSON.parse(this.getAttribute("value")))
        location.reload(true);
    });
});