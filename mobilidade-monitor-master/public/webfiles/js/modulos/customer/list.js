const searchListCustomer = {
    page: 1,
    name: "",
    phone: ""
};

const setting = {
    currentPage: null,
    data: null,
    lastPage: null,
    timeSearch: 0,
};

elementProperty.addEventInElement(".close-modal-list-customer","onclick",function(){
    elementProperty.getElement("#searchCustomerList",element=> element.value = "");

    clearSearch();

    elementProperty.getElement(".container-list-customer", element => {
        element.classList.remove("active");
    });
});

function getListCustomer() {
    const imageDefault = "/webfiles/img/icon/user.png";

    CustomerController.listCustomerBy(searchListCustomer).then((data) => {
        data = data.response;
        setting.currentPage = data.currentPage;
        setting.data = data.data;
        setting.lastPage = data.lastPage;

        if(setting.data.length === 0){
            elementProperty.getElement("#listCustomerCurrent",element=>{
                element.classList.add("empty")
            });
        }

        elementProperty.getElement("#listCustomerCurrent", element => {
            element.innerHTML += setting.data.map((customer) => {

                const img = customer.profileImage !== null ?
                    `${environment.hosts.hostImageClient}${customer.profileImage}` : imageDefault;

                const phone = customer.phone !== null ? customer.phone : "SEM TELEFONE";

                return `<li class="customer-item" value="${customer.idCustomer}">
                        <div style="background-image: url(${img})">
                        </div>
                            <p>
                                <span>${customer.name.toUpperCase()}</span>
                                <span>${customer.email}</span>
                                <span>${phone} - ${customer.status}</span>                              
                            </p>
                        </li>`;
            }).join("");

            elementProperty.addEventInElement(".customer-item","onclick",selectedCustomer);
        });
    })
}


elementProperty.addEventInElement("#listCustomerCurrent", "onscroll", function (event) {
    const element = event.target;
    if ((element.offsetHeight + element.scrollTop).toString().split(".")[0]
        === element.scrollHeight.toString()) {
        if (setting.currentPage >= setting.lastPage)
            return;


        searchListCustomer.page += 1;
        getListCustomer();
    }
});

let timeout = 0;

elementProperty.addEventInElement("#searchCustomerList", "oninput", function () {
    clearSearch();

    clearTimeout(timeout);
    setting.timeSearch = 0;

    (function waitAMoment() {
        if (setting.timeSearch > 1) {
            searchListCustomer.name = document.getElementById("searchCustomerList").value;

            getListCustomer();

            return;
        }

        timeout = setTimeout(function () {
            setting.timeSearch += 1;
            waitAMoment();
        }, 300)
    })();
});


elementProperty.addEventInElement("#searchCustomerList", "onkeyup", function (e) {
    if(e.keyCode === 27){
        this.value = "";
        clearSearch();
        getListCustomer();
    }
});


function clearSearch() {
    searchListCustomer.page = 1;
    searchListCustomer.name = "";
    searchListCustomer.phone = "";
    elementProperty.getElement("#listCustomerCurrent", element => {
        element.classList.remove("empty");
        element.innerHTML = "";
    });

}

function selectedCustomer(){
    window.open(`/customer/detail/${this.getAttribute("value")}`);
}