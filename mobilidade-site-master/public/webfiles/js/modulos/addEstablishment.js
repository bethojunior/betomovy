const btnStar = document.getElementsByClassName("start")

const MOBILE = screen.width;
const DISABLE = "none"
const SHOW = "block"
const Element = new ElementProperty

let STAR = 0;
let imagens = []
let employees = []

const Users = new UserController

    Users.getAllUserTypes()
        .then(res => {
            fillUsersTypes(res.data)
        })
        .catch(error => console.log('error ' + error))

    if (document.getElementById("add-manager") !== null) {
        document.getElementById("add-manager").onclick = addEmployees
    }

    document.getElementById("brand-menu").src = CURRENT_HOST + 'webfiles/img/logo/logo.webp';

    const BTN_SUBMIT = document.getElementById("btn-salva-submit")

    BTN_SUBMIT.onclick = () => {
        insertNewEstablishment()
    }
    document.getElementById('btn-step-7').onclick = () => {
        insertNewEstablishment()
    }

//Mobile
    if (MOBILE <= 992) {

        Element.addEventInElement('#btn-step-1', 'onclick', () => goToTheSecondStep())

        Element.addEventInElement('#btn-step-2', 'onclick', () => goToTheThirdStep())

        Element.addEventInElement('#btn-step-3', 'onclick', () => goToThefourthStep())

        Element.addEventInElement('#btn-step-4', 'onclick', () => goToTheFivethStep())

        Element.addEventInElement('#btn-step-5', 'onclick', () => goToTheSixthStep())

        Element.addEventInElement('#btn-step-6', 'onclick', () => goToTheSeventhStep())

    }

// Fotos
    if (document.getElementById("clickPreviewImageLange") !== null) {

        document.getElementById("clickPreviewImageLange").onclick = function () {

            $("#inputPreviewImageLange").trigger('click');

            document.getElementById("inputPreviewImageLange").addEventListener("change", function () {
                let img;

                let input = this;
                if (input.files && input.files[0]) {
                    imagens.push(input.files[0])
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        img = new FormData(input);
                        document.getElementsByClassName("img-picture")[0].style.display = DISABLE
                        document.getElementsByClassName("image-lange")[0].style.backgroundSize = "100% 100%"
                        document.getElementsByClassName("image-lange")[0].style.backgroundImage = "url(" + e.target.result + ")";
                        // imageSeleted.src =  e.target.result;
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            })
        }
    }

    let btnPreview = document.getElementsByClassName("clickPreviewImageSmall");
    for (let i = 0; i < btnPreview.length; i++) {
        btnPreview[i].onclick = function () {
            $(".inputImageIcon" + i).trigger('click');
            document.getElementsByClassName("inputImageIcon" + i)[0].addEventListener("change", function () {
                let img;
                let input = this;
                if (input.files && input.files[0]) {
                    imagens.push(input.files[0])
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        img = new FormData(input);
                        // document.getElementsByClassName("img-picture")[0].style.display = DISABLE
                        document.getElementsByClassName("imagem-disable")[i].style.display = "none"
                        document.getElementsByClassName("icon-item")[i].style.backgroundSize = "100% 100%"
                        document.getElementsByClassName("icon-item")[i].style.backgroundImage = "url(" + e.target.result + ")";
                        // imageSeleted.src =  e.target.result;
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            })
        }
    }



    for (let i = 0; i < btnStar.length; i++) {
        btnStar[i].onclick = function () {
            clearStars();
            STAR = parseInt(this.getAttribute("value")) + 1
            this.style.color = "rgb(233, 153, 26)";
            let btnStarAtual = parseInt(this.getAttribute("value"));
            for (let i = 0; i < btnStarAtual; i++) {
                document.getElementsByClassName("fa-star")[i].style.color = this.style.color;
            }
        }
    }

    $(".mask-money").change(function () {
        calcDailyAverage();
    });

// Passos
function goToTheSecondStep() {

    // validate required fields
    console.log(LAT,LNG,document.getElementById("inf-cnpj").value)
    if(LAT !== null && LNG !== null && document.getElementById("inf-cnpj").value !== '') {

        // increase size of progess bar
        document.getElementsByClassName("progress-width")[0].style.width = "25%"

        // hide elements from step 1
        document.getElementsByClassName('step-1')[0].style.display =  'none'
        document.getElementById('btn-step-1').style.display = 'none'

        // show elements step 2
        document.getElementsByClassName('step-2')[0].style.display =  'block'
        document.getElementById('btn-step-2').style.display = 'block'

    }
}

function goToTheThirdStep() {

    // validate required fields
    // if(LAT !== null && LNG !== null && document.getElementById("inf-cnpj").value !== '') {

    // increase size of progess bar
    document.getElementsByClassName("progress-width")[0].style.width = "37.5%"

    // hide elements from step 1
    document.getElementsByClassName('step-2')[0].style.display =  'none'
    document.getElementById('btn-step-2').style.display = 'none'

    // show elements step 2
    document.getElementsByClassName('step-3')[0].style.display =  'block'
    document.getElementById('btn-step-3').style.display = 'block'

    // }
}

function goToThefourthStep(){

    // validate required fields
    // if(LAT !== null && LNG !== null && document.getElementById("inf-cnpj").value !== '') {

    // increase size of progess bar
    document.getElementsByClassName("progress-width")[0].style.width = "50%"

    // hide elements from step 1
    document.getElementsByClassName('step-3')[0].style.display =  'none'
    document.getElementById('btn-step-3').style.display = 'none'

    // show elements step 2
    document.getElementsByClassName('step-4')[0].style.display =  'block'
    document.getElementById('btn-step-4').style.display = 'block'

    // }

}

function goToTheFivethStep() {
    // validate required fields
    // if(LAT !== null && LNG !== null && document.getElementById("inf-cnpj").value !== '') {

    // increase size of progess bar
    document.getElementsByClassName("progress-width")[0].style.width = "60%"

    // hide elements from step 1
    document.getElementsByClassName('step-4')[0].style.display =  'none'
    document.getElementById('btn-step-4').style.display = 'none'

    // show elements step 2
    document.getElementsByClassName('step-5')[0].style.display =  'block'
    document.getElementById('btn-step-5').style.display = 'block'
}

function goToTheSixthStep() {

    // validate required fields
    // if(LAT !== null && LNG !== null && document.getElementById("inf-cnpj").value !== '') {

    // increase size of progess bar
    document.getElementsByClassName("progress-width")[0].style.width = "72.5%"

    // hide elements from step 1
    document.getElementsByClassName('step-5')[0].style.display =  'none'
    document.getElementById('btn-step-5').style.display = 'none'

    // show elements step 2
    document.getElementsByClassName('step-6')[0].style.display =  'block'
    document.getElementById('btn-step-6').style.display = 'block'

    // document.getElementById("colaboradores-cadastrados").style.display = SHOW
    // document.getElementById("dados-bancario").style.display = DISABLE
    // document.getElementsByClassName("progress-width")[0].style.width = "85%"
}

function goToTheSeventhStep() {
    // validate required fields
    // if(LAT !== null && LNG !== null && document.getElementById("inf-cnpj").value !== '') {

    // increase size of progess bar
    document.getElementsByClassName("progress-width")[0].style.width = "92.5%"

    // hide elements from step 1
    document.getElementsByClassName('step-6')[0].style.display =  'none'
    document.getElementById('btn-step-6').style.display = 'none'

    // show elements step 2
    document.getElementsByClassName('step-7')[0].style.display =  'block'
    document.getElementById('btn-step-7').style.display = 'block'

}


function insertNewEstablishment() {

    const data = new Date()
    const dataAtual  = data.getFullYear() + "-" + parseInt(data.getMonth() + 1)  + "-" + data.getDate() + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();

    const selectEstate = document.getElementById("inf-uf")
    const selectCity   = document.getElementById('inf-cidade')
    const idEstate     = selectEstate.options[selectEstate.selectedIndex].getAttribute('idEstate')
    const idCity       = selectCity.options[selectCity.selectedIndex].getAttribute('idCity')

    const sendObjectApi = {
        "establishment": {
            "fantasyName": document.getElementById("inf-name").value,
            "document": document.getElementById("inf-cnpj").value,
            "address": document.getElementById("inf-rua").value,
            "number": document.getElementById("inf-numero").value,
            "zipcode": document.getElementById("inf-cep").value,
            "neighborhood": document.getElementById("inf-bairro").value,
            "cityId": idCity,
            "estateId": idEstate,
            "rating": String(STAR),
            "minDailyRate": document.getElementById("num1").value,
            "maxDailyRate": document.getElementById("num2").value,
            "averageValue": document.getElementById("resultado").value,
            "commercialEmail": document.getElementById("email-comercial").value,
            "administratorEmail": document.getElementById("email-adm").value,
            "commercialPhone": document.getElementById("fone-comercial").value,
            "administratorPhone": document.getElementById("fone-adm").value,
            "created_at": dataAtual ,
            "latitude": LAT,
            "longitude": LNG,
            "bankAccount": {
                "bankId": document.getElementById("bankName").value,
                "typeAccount": document.getElementById("bankOp").value,
                "agency": document.getElementById("bankAgencia").value,
                "numberAccount": document.getElementById("bankConta").value,
                "date": dataAtual
            }
        },
        // "manager": {
        //     "name": document.getElementById("name-manager").value,
        //     "nickname": document.getElementById("apelido-manager").value,
        //     "document": document.getElementById("cpf-manager").value,
        //     "phone": document.getElementById("phone-manager").value,
        //     "email": document.getElementById("email-manager").value,
        //     "occupation": document.getElementById("cargo-manager").value,
        //     "commission": document.getElementById("commission-manager").value,
        //     "password": document.getElementById("password-manager").value,
        //     "created_at": dataAtual,
        //     "bankAccount": {
        //         "bankId": document.getElementById("bankManager").value,
        //         "typeAccount": document.getElementById("conta-manager").value,
        //         "agency": document.getElementById("agencia-manager").value,
        //         "op": document.getElementById("op-manager").value,
        //         "numberAccount": document.getElementById("conta-manager").value,
        //         "date": dataAtual
        //     }
        // },
        "employees":  employees
    }
    if(STAR == 0) {
        // swal('Informe as estrelas','','warning')
        alert('Informe as estrelas do hotel')
        return
    }
    if(imagens.length == 0) {
        alert('Adicione fotos')
        // swal('Adicione fotos','','warning')
        return
    }
    if(!Validation.checkObjectFilled(sendObjectApi)){
        // swal('Preencha todos os campos')
        alert('Preencha todos os campos')
        return
    }

    // console.log(sendObjectApi)
    EstablishmentController.insertEstablishment(sendObjectApi,imagens,function(response){

        if(response['status']) {
            // swal('Estabelecimento cadastrado com sucesso','','success')
            alert('estabelecimento cadastrado com sucesso')
            window.location.reload()
            return
        }

        // swal('Erro ao cadastrar o estabelecimento','','error')
        swal('Erro ao cadastrar o estabelecimento')
    });

}

function calcDailyAverage() {

    let num1 = document.getElementById("num1").value.replace(".","")
    num1 = num1.replace(",",".")
    num1 = parseFloat(num1)

    let num2 = document.getElementById("num2").value.replace(",",".")
    num2 = num2.replace(",",".")
    num2 = parseFloat(num2)

    let elemResult = document.getElementById("resultado")
    let res =  (num1 + num2) / 2;
    res = res.toFixed(2)
    if(!isNaN(res)) {
        elemResult.value = "R$ "  + res.replace(",",".");
        return
    }
    elemResult.value = "";
}

function clearStars(){
    for (let i = 0; i < btnStar.length; i++) {
        btnStar[i].style = '';
    }

}

function addEmployees(){
    const data = new Date()
    let listEmployees = ''

    let selectUserType = document.getElementById("user-type")

    const dataAtual  = data.getFullYear() + "-" + parseInt(data.getMonth() + 1)  + "-" + data.getDate() + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
    addEmployees = {}
    addEmployees.name = document.getElementById("nome-colaborador").value,
        addEmployees.nickname = document.getElementById("apelido-colaborador").value,
        addEmployees.document = document.getElementById("cpf-colaborador").value,
        addEmployees.phone = document.getElementById("celular-colaborador").value,
        addEmployees.email = document.getElementById("email-colaborador").value,
        addEmployees.userTypeId = document.getElementById("user-type").value,
        addEmployees.occupation = document.getElementById("occupation").value,
        addEmployees.password = document.getElementById("senha-colaborador").value,
        addEmployees.created_at = dataAtual

    if(!Validation.checkObjectFilled(addEmployees)){
        // swal('Informe pelo menos um COLABORADOR','','warning')
        alert('Informe pelo menos um colaborador')
        return
    }
    employees.push(addEmployees)
    document.getElementById("nome-colaborador").value = ''
    document.getElementById("apelido-colaborador").value = ''
    document.getElementById("cpf-colaborador").value = ''
    document.getElementById("celular-colaborador").value = ''
    document.getElementById("email-colaborador").value = ''
    selectUserType.options[selectUserType.selectedIndex].value = 1
    document.getElementById("occupation").value = ''
    document.getElementById("senha-colaborador").value = ''

    for (i = 0; i < employees.length; i++) {
        listEmployees += `
        <tr>
            <td>${i}</td> 
            <td>${employees[i]['name']}</td>
            <td>${employees[i]['occupation']}</td> 
            <td><a class="remove-employee"'><i class="far fa-trash-alt"></i></a></td>
      
        </tr>  
    `
    }
    document.getElementById('list-manager').innerHTML = listEmployees
}

function fillUsersTypes(userTypes) {

    const userTypesSelect =  document.getElementById('user-type')

    userTypes.map(item => {

        userTypesSelect.innerHTML += `<option value="${item.idUserType}">${item.name}</option>`
    })
}
