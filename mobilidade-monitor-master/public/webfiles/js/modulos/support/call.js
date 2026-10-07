let id_control = 0;
let images = [];
let elementProperty = new ElementProperty();

document.getElementById("load-image-report").onchange = function() {
    if (this.files && this.files[0]) {
        let reader = new FileReader();
        images.push(this.files);
        reader.onload = function(e) {
            elementProperty.get('#mount-insert-images').then(these => {
                let content = '';
                content += `
                    <div class="col-lg-4">
                        <img width="100%" src="${e.target.result}">
                    </div>
                 `;
                these.innerHTML += content;
            });
        };
        reader.readAsDataURL(this.files[0]);
    }
};

elementProperty.addEventInElement('#send-support','onclick',function () {
    swal('Suporte Fabrica 704','Solicitação enviado com sucesso, em até 24hrs retornaremos','success');
});