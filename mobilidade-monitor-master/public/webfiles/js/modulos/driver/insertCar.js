let idDriver;
let pathImage = environment.hosts.hostImageDriver;

setTimeout(() => {
    document.getElementById('name-driver').value  = '';
    document.getElementById('email-driver').value = '';
    document.getElementById('image-driver').src   = '/webfiles/img/icon/default.png';
},500);

$('#mount-drivers').select2({
    placeholder: 'Selecione o motorista',
    width: '100%',
    ajax: {
        url: `${ConnectionServer.Host()}driver`,
        headers: {
            'token': Session.getValueInSession('user', 'api_token'),
            'userid': Session.getValueInSession('user', 'idUser')
        },
        dataType: 'json',
        delay: 250,
        data: function (params) {
            return {
                'name': params.term,
            };
        },
        processResults: function (result, params) {
            params.page = params.page || 1;
            return {
                results: result.data.data.map(user => {
                    return {
                        id    : user.idDriver,
                        name  : user.name,
                        email : user.email,
                        phone : user.phone,
                        image : user.profileImage,
                    }
                }),
            };
        },
    },
    escapeMarkup: function (markup) {
        return markup;
    },
    minimumInputLength: 1,
    templateResult: formatSelecting,
    templateSelection: formatRepoSelection
});

function formatSelecting(result) {

    if (result.loading) {
        return "Buscando...";
    }

    return `<div class="item-select2" value="${result.id}">
                    <div>
                        ${result.name}
                    </div>
                    <div>
                        ${result.email}
                    </div>
                    <div>
                        ${result.phone}
                    </div>
                </div>`;
}

function formatRepoSelection(result) {
    document.getElementById('name-driver').value  = result.name;
    document.getElementById('email-driver').value = result.email;
    document.getElementById('image-driver').src   = environment.hosts.hostImageDriver+result.image;
    return result.email;
}



if(document.getElementById("crlv-image") !== null) {
    document.getElementById("crlv-image").onchange = function() {
        if (this.files && this.files[0]) {
            let reader = new FileReader();

            reader.onload = function(e) {
                document.getElementById("crlv-preview").setAttribute('src', e.target.result);
                imageOne = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
    };
}