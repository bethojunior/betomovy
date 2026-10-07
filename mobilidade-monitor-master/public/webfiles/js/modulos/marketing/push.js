setTimeout(()=>{
    preload(false);
},1000)
const objectPush = {
    "cities": [],
    "userTypes": [],
    "title": "",
    "message": ""
};

elementProperty.getElement('#city',element=>{
    element.innerHTML = "<option disabled selected>Selecione a cidade</option>"

    element.innerHTML += Session.getLocal64("cities").map(city=>{
        return `<option value='${JSON.stringify(city)}'>${city.nome}</option>`
    }).join("")
});

jQuery
$('#button').click(function(){
    var textAdd = $('#city').val();

    if(textAdd == null)
        return;

    const city = JSON.parse(textAdd);

    if(objectPush.cities.includes(city.cityId))
        return;

    objectPush.cities.push(city.cityId);

    var x = "X";
    $('.campo-city-select').append(
        '<div class="addCidade" id="item-city-'+city.cityId+'" style="background-color:#ececec; display: flex; margin-bottom: 0.3vw ;">'
        +'<div class="cidade-add" style="width: 60vw; ">'+ city.nome +'</div>'
        +'<div class="x" style=" text-align: right" value="'+city.cityId+'">'+x+'</div>'
        +'</div>');
});

jQuery
$(document).on('click', '.x', function(){
    const idCity = this.getAttribute("value");

    document.getElementById("item-city-"+idCity).remove();

    objectPush.cities = objectPush.cities.filter((value)=>{
        return value !== idCity;
    })
});

elementProperty.addEventInElement("#btmPush","onclick",function(){
    objectPush.userTypes = [];


    elementProperty.getElement(".userTypes",element=>{
        if(element.checked){
            objectPush.userTypes.push(element.value)
        }
    });

    objectPush.title = document.getElementById("titulo-msm").value;
    objectPush.message = document.getElementById("conteudo-msm").value;

    if(objectPush.cities.length === 0){
        SwalCustom.messageDialog("Selecione a(s) cidade(s)","Atenção","info");
        return;
    }
    if(objectPush.userTypes.length === 0){
        SwalCustom.messageDialog("Selecione o(s) Tipos(s)","Atenção","info");
        return;
    }
    if(objectPush.title.length === 0){
        SwalCustom.messageDialog("Informe o título de sua mensagem","Atenção","info");
        return;
    }
    if(objectPush.message.length === 0){
        SwalCustom.messageDialog("Informe o conteúdo de sua mensagem","Atenção","info");
        return;
    }

    SwalCustom.dialogInfo("Sua mensagem foi enviada");
    NotificationController.push(objectPush).then((result)=>{
        // SwalCustom.dialogInfo("Sua mensagem foi enviada");
    }).catch((err)=>{
        console.log(err)
    });

    return false;

});


if(document.getElementById("thumbnail") !== null) {
    document.getElementById("thumbnail").onchange = function() {
        if (this.files && this.files[0]) {
            let reader = new FileReader();

            reader.onload = function(e) {
                document.getElementById("image-upload-thumbnail").setAttribute('src', e.target.result);
                imageOne = e.target.result;
            };

            reader.readAsDataURL(this.files[0]);

        }
    };
}
