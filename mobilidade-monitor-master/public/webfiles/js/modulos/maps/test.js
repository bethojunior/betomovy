document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#btnCheck").onclick = function () {
        const value = document.querySelector("#typeSelect").value;
        if (value.length === 0)
            return alert("Selecione o tipo de mapa");

        preload(true);

        MapSettingController.test(value).then(({data:response}) => {
            preload(false);

            document.querySelector("#nameType").innerHTML = response.type;

            if(response.place === true){
                document.querySelector("#statusPlace").innerHTML = `<span class="badge badge-success">Disponível</span>`;
            }else{
                document.querySelector("#statusPlace").innerHTML = `
                <div class="d-flex flex-column align-items-end">
                    <span class="badge badge-danger">Indisponível</span>
                    <div class="card card-header mt-2 text-center">
                        <p>${response.place}</p>
                    </div>
                </div>
                `;
            }

            if(response.direction === true){
                document.querySelector("#statusDirection").innerHTML = `<span class="badge badge-success">Disponível</span>`;
            }else{
                document.querySelector("#statusDirection").innerHTML = `
                <div class="d-flex flex-column align-items-end">
                    <span class="badge badge-danger">Indisponível</span>
                    <div class="card card-header mt-2 text-center">
                        <p>${response.direction}</p>
                    </div>
                </div>
                `;
            }


            if(response.geocoding === true){
                document.querySelector("#statusGeocoding").innerHTML = `<span class="badge badge-success">Disponível</span>`;
            }else{
                document.querySelector("#statusGeocoding").innerHTML = `
                <div class="d-flex flex-column align-items-end">
                    <span class="badge badge-danger">Indisponível</span>
                    <div class="card card-header mt-2 text-center">
                        <p>${response.geocoding}</p>
                    </div>
                </div>
                `;
            }

            document.querySelector("#containerTest").hidden = false;
        })
    };
});