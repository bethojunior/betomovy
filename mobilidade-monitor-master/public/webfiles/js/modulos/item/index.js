preload(false);
let elementProperty = new ElementProperty();
document.getElementById("fileUpload").onchange = function() {
    if (this.files && this.files[0]) {
        let reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById("image-product").setAttribute('src', e.target.result);
        };

        reader.readAsDataURL(this.files[0]);
    }
};

elementProperty.addEventInElement('#value-name-item','onkeyup',function(){
    _that = this;
    elementProperty.getElement('#repeat-name',here => {
        here.innerHTML = _that.value;
    });
});


elementProperty.addEventInElement('#send-item','onclick',function(){
    let description = document.getElementById('value-description-item').value.length;
    elementProperty.getElement('#fileUpload',image =>{
        if(document.getElementById('weight').value  === '' ||
            document.getElementById('height').value === '' ||
            document.getElementById('width').value  === '' ||
            document.getElementById('depth').value  === '' ||
            document.getElementById('value-description-item').value === ''
        ){
            return swal('Preencha todos os campos','','info');
        }
        if(description < 3){
            return swal('A descrição do item precisa ser maior que 3 caracteres','','info');
        }
        if(image.files[0] === undefined){
            return swal('Por favor insira uma imagem','','info');
        }
        preload(true);
        var form = new FormData();
        let weight = document.getElementById('weight').value;
        let height = document.getElementById('height').value;
        let depth = document.getElementById('depth').value;
        let width = document.getElementById('width').value;

        weight = weight.replace(',', '.');
        depth  = depth.replace(',', '.');
        height = height.replace(',', '.');
        width  = width.replace(',', '.');

        form.append("weight", weight);
        form.append("height", height);
        form.append("width", width );
        form.append("depth",  depth);
        form.append('picture', image.files[0]);
        form.append('description', document.getElementById('value-description-item').value);
        SettingsController.insertItem(form).then(callback => {
            preload(false);
            if(callback.status){
                swal('Inserido com sucesso','','success');
                document.getElementById("image-product").setAttribute('src', '/webfiles/img/icon/default.png');
                document.getElementById('value-description-item').value = ' ';
                return;
            }
            return swal('Erro ao inserir item','Contate o suporte','error');
        });
    })
});
