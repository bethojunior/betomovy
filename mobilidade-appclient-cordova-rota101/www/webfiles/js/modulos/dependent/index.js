viewController.setObserver("list-dependent", () => {

    Mask.setMaskPhone("#phoneDependent");

    updateListDependents();

    viewController.elementProperty.addEventInElement(".back-dependent", "onclick", () => Route.backPage());

    viewController.elementProperty.addEventInElement(
        "#addDependent",
        "onclick",
        () => {
            Route.startClassesInComponent(
                [{component: ".modal-add-dependent", class: "active"}],
                () => {
                    updateListDependents();

                    viewController.elementProperty.removeClass(
                        ".modal-add-dependent",
                        "active"
                    );
                }
            );
        });

    function updateListDependents() {
        const listDependents = document.querySelector("#listDependents");

        listDependents.innerHTML = '';

        DependentUser.findByResponsible().then(({status, data}) => {
            if (!status)
                return listDependents.innerHTML = ' ';

            listDependents.innerHTML = ' ' + data.map(item => {
                return `<li>
                            <div class="image-profile"></div>
                            <span>${item.name}</span>
                            <i class="material-icons remove-dependent" value="${item.dependentUserId}">close</i>
                        </li>`
            }).join("");

            viewController.elementProperty.addEventInElement('.remove-dependent', "onclick", function () {
                SwalCustom.dialogConfirm("", "Deseja remover dependente ?").then(() => {
                    DependentUser.delete(this.getAttribute("value")).then(({status, message}) => {
                        if (!status)
                            return SwalCustom.messageDialog("", message);


                        SwalCustom.messageDialog("", message, updateListDependents,"success");
                    });
                })
            });
        });
    }

    viewController.elementProperty.addEventInElement("#btnAddDependent", "onclick", function () {
        try {
            const user = {
                name: document.querySelector("#nameDependent").value.trim(),
                email: document.querySelector("#emailDependent").value,
                phone: document.querySelector("#phoneDependent").value,
                password: document.querySelector("#passwordDependent").value,
                gender: document.querySelector("#genderDependent").value,
                relationship: document.querySelector("#relationshipDependent").value.trim(),
            };

            validateDependent(user);

            user.nickname = user.name.split(" ")[0];

            this.disabled = true;

            DependentUser.insert(user).then(({status, message}) => {
                if (!status)
                    return SwalCustom.messageDialog("", message, undefined);

                SwalCustom.messageDialog("", message, () => {
                    Route.backPage();
                }, "success");
            }).finally(() => {
                this.disabled = false;
            })

        } catch (error) {
            SwalCustom.messageDialog("", error, undefined, "info");
        }

    });


    function validateDependent(user) {
        if (user.name.split(" ").length < 2)
            throw "Informe o nome completo dependente";

        if (!ValidateForm.validateEmail(user.email))
            throw "E-mail informado está inválido";

        if (!ValidateForm.validatePhone(user.phone))
            throw "Telefone informado está inválido";

        if (user.relationship.length <= 0)
            throw "Informe o parentesco";

        if (user.gender.length <= 0)
            throw "Informe o gênero";

        if (user.password.length < 5)
            throw  "A senha deve contém pelo menos 5 digitos";

        if (user.password !== document.querySelector("#repasswordDependent").value)
            throw "Senha de confirmação não corresponde a senha";

    }
});
