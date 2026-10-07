document.addEventListener("DOMContentLoaded", function () {

    preload(true);

    CityController.getActives().then(({data}) => {
        document.querySelector("#listCityRules").innerHTML = data.map(city => {
            return `<li class="list-group-item">
                        <div class="form-group form-check m-0">
                            <input type="checkbox" class="form-check-input input-check-city" 
                                id="city${city.cityId}"
                                 value="${city.cityId}">
                            <label class="form-check-label" 
                            for="city${city.cityId}">
                                ${city.shortName}</label>
                        </div>
                    </li>`;
        }).join("");
    }).finally(() => {
        preload(false);
    });


    RulesController.actionPermissions().then(({response}) => {
        document.querySelector("#listOptionRules").innerHTML = response.map(item => {
            return `<li class="list-group-item active">${item.name}</li>
                ${item.user_group_permissions.map(permission => {
                return `  <li class="list-group-item">
                                    <div class="form-group form-check m-0">
                                        <input type="checkbox" class="form-check-input input-check-permission" 
                                            id="permission_${permission.userGroupId}_${permission.id}"
                                             value="${permission.id}">
                                        <label class="form-check-label" 
                                        for="permission_${permission.userGroupId}_${permission.id}">
                                            ${permission.description}</label>
                                    </div>
                                </li>
                     `;
            }).join("")}
            `
        }).join("");
    });

    elementProperty.addEventInElement("#btnSaveRule", "onclick", () => {
        const cities = elementProperty.getElements(".input-check-city").filter(element => element.checked).map(element => element.value);

        const permissions = elementProperty.getElements(".input-check-permission").filter(element => element.checked).map(element => element.value);

        const elementName = document.querySelector("#nameRule");

        if (elementName.value.length === 0) {
            alert("Informe a descrição da regra");
            return elementName.focus();
        }

        if (cities.length === 0)
            return alert("Selecione pelo menos uma cidade");

        if (permissions.length === 0)
            return alert("Selecione pelo menos uma permissão");

        preload(true);
        RulesController.actionRole(elementName.value,cities,permissions,document.querySelector("#isSupport").checked).then((result)=>{
            SwalCustom.messageDialog("",result.message,"success").then(()=>{
                location.href = '/setting/profile'
            })
        }).finally(()=>{
            preload(false);
        });
    });
});