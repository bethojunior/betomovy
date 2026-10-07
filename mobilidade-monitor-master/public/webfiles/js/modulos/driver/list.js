const paginate = {
    limitDefault : 15,
    page: 1,
    search: ""
};

function createListDriver(drivers){
    elementProperty.getElement("#listDriversCurrent",element=>{
        element.innerHTML += drivers.map((driver,index)=>{
            if(document.getElementById(`driver${driver.idDriver}`) !== null)
                return "";

            const style = (paginate.limitDefault * paginate.page) > index ? "" : "display:none";

            return `<li style="${style}" class="driver-item ${driver.status}" id="driver${driver.idDriver}">
                        <div style="background-image: url(${environment.hosts.hostImageDriver}${driver.profileImage})">
                        </div><p>
                        <span>${driver.name.toUpperCase()}</span>
                        <span>${driver.userType} - ${driver.driverRegisterStatus}</span></p></li>`;
        }).join("");
    });
}

elementProperty.addEventInElement("#listDriversCurrent","onscroll",function(event){
    const element = event.target;
    if ((element.offsetHeight + element.scrollTop).toString().split(".")[0]
            === element.scrollHeight.toString()){
        paginate.page += 1;
        showDrivers();
    }
});

elementProperty.addEventInElement("#searchDriverList","oninput",function(){
    paginate.search = this.value.toUpperCase();
    paginate.page = 1;
    showDrivers();
});

function showDrivers(){
    let count = 0;
    elementProperty.getElement(".driver-item",element=>{
        const display = (paginate.limitDefault * paginate.page) > count ? "" : "none";

        if(!element.innerHTML.toUpperCase().includes(paginate.search)){
            element.style.display = "none";
            return;
        }

        element.style.display = display;

        count += 1;

    })
}

elementProperty.addEventInElement(".close-modal-list-driver","onclick",function(){
    elementProperty.getElement(".container-list-driver", element => {
        element.classList.remove("active");
    });
});