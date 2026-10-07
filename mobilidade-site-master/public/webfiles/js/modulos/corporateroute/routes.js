document.addEventListener("DOMContentLoaded", () => {
    const user = Session.get("user");

    document.querySelector("#date").valueAsDate  = new Date();
    updateListByDate();

    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement("#btnFilter","onclick",function(){
        const date = document.querySelector("#date").value;
        if(date === '')
            return alert("Data inválida");

        updateListByDate();
    });

    function updateListByDate(){
        preload(true);
        ScheduleCorporateRouteController.activeByDate(user.company_worker.companyId,document.querySelector("#date").value).then(({response})=>{
            preload(false);
            document.querySelector("#listCorporateRoute").innerHTML = response.map(item=>{
                return `<tr>
                            <td>${item.title}</td>
                            <td>${item.corporate_route.route.name}</td>
                            <td>${item.schedule}</td>
                            <td>${item.vacancies}</td>
                            <td>${item.isConfirm == true ? "Confirmado" : "Não confirmado"}</td>
                    </tr>`
            }).join("");
        });
    }
});