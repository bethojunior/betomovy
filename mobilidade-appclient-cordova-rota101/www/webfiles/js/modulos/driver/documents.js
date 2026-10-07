$(document).ready(function(){
    $('.collapsible').collapsible();
});

const driverId = $('#driverId').val();

loadDependencies(driverId);

function loadDependencies(driverId){

    let list = "";

    DriverController.FindWithPendencies(driverId).then(res=>{

        reasons = res.data.reasons;
        reasons.map(res => {
            list += `
                <li class='divReason col s12'>
                
                    <div class="collapsible-header">
                        <span id="nameReason">${res.type}</span>   
                        <i class="material-icons">arrow_drop_down</i>
                    </div> 
                    
                    <div class="collapsible-body">
                        <span class="descriptionLabel">Certifique-se que a imagem do ${res.type} esteja legível e de boa qualidade.</span>
                        <ul class="ulList">
                            <li>Tire uma foto legível e nítida</li>
                            <li>Documento inteiro</li>
                        </ul>
                        <br>
                        <div class="file-field input-field">
                          <div class="btn col s12 colorGray">
                            <i class="material-icons left3">camera_alt</i>
                            <span>Tirar foto</span>
                            <input id="${res.type}" name="${res.type}" class="input-files-send" type="file">
                          </div>
                          <div class="file-path-wrapper">
                            <input class="file-path validate" type="text">
                          </div>
                        </div>
                    </div>
                    
                </li>
            `;
        });

        document.getElementById("mountReasons").innerHTML = list;

    })
}

function sendDocuments(){

    document.getElementById("imgReturn").src = HOST+"webfiles/img/logo/pre-load.gif";
    document.getElementById("generalDocument").style.display = "none";

    let data = document.getElementById("reasonsDriver");
    let formD = new FormData();

    formD = checkImages(formD);

    formD.append("stdObject",JSON.stringify({driverId: driverId}));

    DriverController.sendDataDriver(formD).then(result => {

        if(result.status){
            swal("Seus dados foram enviados para análise" , "Aguarde sua aprovação" , "success");
            setTimeout(function(){
                window.location.href = HOST_PWA;
            },3000);
        }
    });

}

function checkImages(form){

    new ElementProperty().getElement(".input-files-send",element=>{
        if(document.getElementById(element.getAttribute("id")).files.length > 0){
            form.append(element.getAttribute("id"),element.files[0]);
        }
    });
    return form;
}