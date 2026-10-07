viewController.setObserver("list-customers", () => {

    const manager = {
        page: 1,
        driverId: Session.getValueInSession("user", "idDriver"),
        paginate: {},
        lastPageList:null
    };

    const elementProperty = new ElementProperty();

    getListCustomer();

    function getListCustomer(concat = false) {
        FavoriteDriverController.listCustomer(manager.driverId, manager.page)
            .then(({status, data}) => {
                if (!status)
                    return;
                manager.paginate = data.paginate;

                elementProperty.getElement(".total-customer", element => {
                    element.innerHTML = manager.paginate.totalRows;
                });

                showListCustomer(data.favorites,concat)
            });
    }

    function showListCustomer(customers,concat) {        
        elementProperty.getElement("#listCustomerFavorite", element => {
            let list = customers.map(customer => {
                const config = Session.get("configGeneral");
                const picturesLink = config.find(item => {
                    return item.key === 'link_storage_pictures';
                });

                const profileImage = customer.profileImage;
                const finalLink = `${picturesLink.value}customer/profile/compressed/${profileImage}`;

                return `<li>
                            <div class="image-customer"
                             style="background-image: url('${finalLink}')"></div>
                            <span>${customer.name}</span>
                            <i class="material-icons remove-customer-favorite"
                             value='${JSON.stringify(customer)}'>close</i>
                        </li>`;
            }).join("");

            element.innerHTML = concat ? element.innerHTML + list : list;

            elementProperty.addEventInElement(".remove-customer-favorite", "onclick",
                ({srcElement: element}) => {
                const {idFavorite} = JSON.parse(element.getAttribute("value"));

                SwalCustom.dialogConfirm(getTextTranslate("list-customers","title-remove-client"),
                    getTextTranslate("list-customers","message-remove-client"),(status)=>{
                    if(status)
                        FavoriteDriverController.delete(idFavorite).finally(getListCustomer);
                });
            });
        });
    }

    elementProperty.addEventInElement(".go-back","onclick",()=>{
        Route.backPage();
    });

    elementProperty.addEventInElement("#listCustomerFavorite", "onscroll", function () {
        if ((this.scrollHeight - this.scrollTop -  this.clientHeight <= 10) &&
            manager.page !== manager.paginate.nextPage) {
            if (manager.page >= manager.paginate.lastPage)
                return;

            manager.page++;

            getListCustomer(true)

        }
    });
});
