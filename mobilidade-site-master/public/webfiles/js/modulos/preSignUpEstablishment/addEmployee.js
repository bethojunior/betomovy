function addEmployee() {
    elementProperty
        .addEventInElement('#btn-employee-info','onclick', () => {

            const employee = {}

            employee.name       =  document.getElementById('name-employee').value
            employee.nickname   =  document.getElementById('nickname-employee').value
            employee.document   =  document.getElementById('cpf-employee').value
            employee.phone      =  document.getElementById('phone-employee').value
            employee.email      =  document.getElementById('email-employee').value

            const userTypeId    =  document.getElementById('occupation-type')
            employee.userTypeId =  userTypeId.options[userTypeId.selectedIndex].getAttribute('value')

            employee.occupation =  document.getElementById('occupation').value

            // const comission     =  document.getElementById('percent-employee').value
            // employee.commission =  parseFloat(comission.replace(',','.'))

            employee.password   =  document.getElementById('password-employee').value

            validateAddEmployee(employee)
        })
}

function validateAddEmployee(employee) {

    if(employee.name === '' || employee.name === null) {
        swal('Nome do colaborador é obrigatório','','warning')
            .then(() => document.getElementById('name-employee').focus())
        return
    }

    if(employee.nickname === '' || employee.nickname === null) {
        swal('Apelido do colaborador é obrigatório','','warning')
            .then(() => document.getElementById('nickname-employee').focus())
        return
    }

    if(employee.document === '' || employee.document === null) {
        swal('CPF do colaborador é obrigatório','','warning')
            .then(() => document.getElementById('cpf-employee').focus())
        return
    }

    if(employee.phone === '' || employee.phone === null) {
        swal('Telefone do colaborador é obrigatório','','warning')
            .then(() => document.getElementById('phone-employee').focus())
        return
    }

    if(employee.occupation === '' || employee.occupation === null) {
        swal('Cargo do colaborador é obrigatório','','warning')
            .then(() => document.getElementById('occupation').focus())
        return
    }

    // if(employee.occupation === '' || employee.occupation === null) {
    //     swal('Porcentagem de comissão do colaborador é obrigatório','','warning')
    //         .then(() => document.getElementById('percent-employee').focus())
    //     return
    // }

    if(!checkCPF(employee.document)){
        swal('CPF inválido','','warning')
            .then(() => document.getElementById('cpf-employee').focus())
        return
    }

    swal("Colaborador adicionado ","","success");

    establishment.employees.push(employee)

    clearForm()


    if(establishment.employees.length > 0 ) {
        document.getElementById('btn-employees-info').classList.remove('hide-element')
        seeEmployees()
    }
}

function clearForm() {
    document.getElementById('name-employee').value = ''
    document.getElementById('nickname-employee').value = ''
    document.getElementById('cpf-employee').value = ''
    document.getElementById('phone-employee').value = ''
    document.getElementById('email-employee').value = ''

    const userTypeId    =  document.getElementById('occupation-type')
    userTypeId.selectedIndex = 0

    document.getElementById('occupation').value = ''

    document.getElementById('password-employee').value = ''
}

function seeEmployees() {
    elementProperty
        .addEventInElement('#btn-employees-info','onclick', () => {
            if(establishment.employees.length > 0 ) {
                renderEmployees()
            }
        })
}