viewController.setObserver("list-indication", () => {
    const {
        referralMonetization
    } = Session.get("user");

    viewController.elementProperty.addEventInElement(".go-back", "onclick", () => Route.backPage());

    viewController.elementProperty.getElement("#aboutMonetizationUser",element=>{
        element.innerHTML = `<span>${referralMonetization.userIndications} ${getTextTranslate("indication","text")}</span> <span>${getTextTranslate("indication","level")} ${referralMonetization.label}</span>`;
    });

    let page = 1;

    UserIndicationController.getIndicated().then((response) => createListIndications(response));

    function createListIndications({status, data: {data}, showEndButton}, isJoin = false) {
        viewController.elementProperty.getElement("#listIndications", element => {
            const list = data.map(item => {
                return `<li>
                       <div>${new Date(item.created_at).toLocaleDateString()}</div> 
                       <div>${item.indicated_name}</div> 
                       <div>${item.indicated_type}</div> 
                    </li>`;
            }).join("");

            element.innerHTML = !isJoin ? list : element.innerHTML + list;

            if (showEndButton)
                element.innerHTML += `<button type="button" id="showMoreIndications">MOSTRAR MAIS</button>`;

            viewController.elementProperty.addEventInElement("#showMoreIndications", "onclick", function () {
                this.remove();

                page++;

                UserIndicationController.getIndicated(page).then((response) => createListIndications(response, true));
            })

        });
    }

});
