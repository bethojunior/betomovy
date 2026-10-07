const elementProperty = new ElementProperty();

const manager = {
    user: null,
    data: {
        nameEstablishment: null,
        addressEstablishment: null,
        latitude: null,
        longitude: null,
        function: null,
        userId: null
    }
};

initSearchBox();

function showInfoUser(user) {
    elementProperty.getElement(".name-user", element => {
        element.innerHTML = user.nameUser;
    });
    elementProperty.getElement(".phone-user", element => {
        element.innerHTML = user.phone;
    });
    elementProperty.getElement(".email-user", element => {
        element.innerHTML = user.email;
    });

    manager.data.userId = user.idUser;
    manager.user = user;
}

function initSearchBox() {
    new MapService().importScriptWithPlaces(true).then(() => {
        elementProperty.getElement("#address", element => {
            const searchBox = new google.maps.places.SearchBox(element);
            searchBox.addListener('places_changed', function () {
                const places = searchBox.getPlaces();

                if (places[0]) {
                    const place = places[0];
                    manager.data.latitude = place.geometry.location.lat();
                    manager.data.longitude = place.geometry.location.lng()
                    return;
                }

                manager.data.latitude = null;
                manager.data.longitude = null;

            });

        })
    });
}

elementProperty.addEventInElement("#formPartner", "onsubmit", (event) => {
    event.preventDefault();

    manager.data.nameEstablishment = document.getElementById("nameEstablishment").value;
    manager.data.addressEstablishment =
        document.getElementById("address").value;
    manager.data.function = document.getElementById("function").value;

    if (manager.data.latitude == null || manager.data.longitude == null) {
        SimpleSwall.modalError("Informe o local do estabelecimento");
        return;
    }

    if (!document.getElementById("confirmation").checked) {
        SimpleSwall.modalError("Aceite o termos !");
        return;
    }

    elementProperty.getElement("#btnSubmit",element=>{
        element.disabled = true;
    });

    PartnerController.requestPartnership(manager.data).then(({status}) => {
        if(!status){
            SimpleSwall.modalError("Ocorreu um erro na solicitação!");
            elementProperty.getElement("#btnSubmit",element=>{
                element.disabled = false;
            });
            return;
        }
        elementProperty.getElement("#formPartner", element => {
            element.classList.add("active");
        });

        elementProperty.getElement(".success-partner", element => {
            element.classList.add("active");
        });
    }).catch(()=>{
        elementProperty.getElement("#btnSubmit",element=>{
            element.disabled = false;
        });
    });

});

elementProperty.addEventInElement("#modalTerms","onclick",function(){
   elementProperty.getElement(".modal-terms-partner",element=>{
       element.classList.add("active");
   });
});

elementProperty.addEventInElement(".option-term","onclick",function(){
    document.getElementById("confirmation").checked = this.getAttribute("value") === "1";
    elementProperty.getElement(".modal-terms-partner",element=>{
        element.classList.remove("active");
    });
});

elementProperty.addEventInElement("#address", "onfocus", () => {
    setTimeout(() => {
        window.scrollTo(0, 100);
    }, 500);
});
elementProperty.addEventInElement("#done", "onclick", () => {
    location.href = location.href + "/?exit";
});