elementProperty
    .addEventInElement('.btn-submit-add-parceiro','onclick', () => {

        const employee = {}

        employee.name       =  document.getElementById('nome-colaborador').value
        employee.nickname   =  document.getElementById('apelido-colaborador').value
        employee.document   =  document.getElementById('cpf-colaborador').value
        employee.phone      =  document.getElementById('celular-colaborador').value
        employee.email      =  document.getElementById('email-colaborador').value

        const userTypeId    =  document.getElementById('user-type')
        employee.userTypeId =  userTypeId.options[userTypeId.selectedIndex].getAttribute('value')

        employee.occupation =  document.getElementById('occupation').value
        employee.password   =  document.getElementById('senha-colaborador').value

        if(!checkEmptyFieldsEmployee(employee)) {

            if(!checkEmail(employee.email)) {
                swal('Email do colaborador está inválido !','','warning')
                return
            }

            if(!checkCPF(employee.document)) {
                swal('CPF do colaborador está inválido !','','warning')
                return
            }

            establishment.employees.push(employee)
            renderEmploye()
            clearfields()
            return
        }

        swal('Todos os campos do colaborador devem ser preenchidos','','warning')

    })


function checkEmptyFieldsEmployee(employee) {
    let isEmpty = false

    Object.keys(employee).map(index => {
        if(employee[index] === ''){
           isEmpty = true
        }
    })

    return isEmpty
}

function renderEmploye() {

    let list = ''

    establishment.employees.map((item,index) => {
        list += `
            <tr>
                <td>${index + 1}</td>    
                <td>${item.name}</td>    
                <td>${item.occupation}</td>    
                <td>
                    <a class="edit-employee"   value='${index}'><i class="fas fa-pencil-alt"></i></a>
                    <a class='remove-employee' value='${index}'><i class="far fa-trash-alt"></i></a>
                </td>
            </tr>        
        `
    })

    elementProperty
        .getElement('#list-manager', element => {
            element.innerHTML = ''
            element.innerHTML += list
        } )


    removeEmployee()
    editEmployee()
}

function editEmployee() {
    elementProperty
        .addEventInElement('.edit-employee','onclick', element => {
            const index = element.srcElement.closest('A').getAttribute('value')

            document.getElementById('nome-colaborador').value    = establishment.employees[index].name
            document.getElementById('apelido-colaborador').value = establishment.employees[index].nickname
            document.getElementById('cpf-colaborador').value     = establishment.employees[index].document
            document.getElementById('celular-colaborador').value = establishment.employees[index].phone
            document.getElementById('email-colaborador').value   = establishment.employees[index].email
            document.getElementById('senha-colaborador').value   = establishment.employees[index].password
            document.getElementById('occupation').value          = establishment.employees[index].occupation

            document.getElementById('add-manager').classList.add('hide-element')
            document.getElementById('edit-manager').classList.remove('hide-element')

            const userType = document.getElementById('user-type')
            userType.value = establishment.employees[index].userTypeId

            changeDataEmployee(index)
        })
}

function changeDataEmployee(index) {
    elementProperty
        .addEventInElement('#edit-manager', 'onclick', () => {
            establishment.employees[index].name = document.getElementById('nome-colaborador').value
            establishment.employees[index].nickname = document.getElementById('apelido-colaborador').value
            establishment.employees[index].document = document.getElementById('cpf-colaborador').value
            establishment.employees[index].phone = document.getElementById('celular-colaborador').value
            establishment.employees[index].email = document.getElementById('email-colaborador').value
            establishment.employees[index].password = document.getElementById('senha-colaborador').value
            establishment.employees[index].occupation = document.getElementById('occupation').value

            const userType = document.getElementById('user-type')
            establishment.employees[index].userTypeId = parseInt(userType.options[userType.selectedIndex].getAttribute('value'))


            if(!checkEmptyFieldsEmployee(establishment.employees[index])) {

                if(!checkEmail(establishment.employees[index].email)) {
                    swal('Email do colaborador está inválido !','','warning')
                    return
                }

                if(!checkCPF(establishment.employees[index].document)) {
                    swal('CPF do colaborador está inválido !','','warning')
                    return
                }

                renderEmploye()
                clearfields()
                document.getElementById('add-manager').classList.remove('hide-element')
                document.getElementById('edit-manager').classList.add('hide-element')
                return
            }

            swal('Todos os campos do colaborador devem ser preenchidos','','warning')

        })
}

function removeEmployee() {
    elementProperty
        .addEventInElement('.remove-employee','onclick', element => {
            element.srcElement.closest('TR').remove()
            console.log(element.srcElement)
            const index = element.srcElement.closest('A').getAttribute('value')
            establishment.employees.splice(index, 1)
        })
}

function clearfields() {
    document.getElementById('nome-colaborador').value = ''
    document.getElementById('apelido-colaborador').value = ''
    document.getElementById('cpf-colaborador').value = ''
    document.getElementById('celular-colaborador').value = ''
    document.getElementById('email-colaborador').value = ''

    const userTypeId    = document.getElementById('user-type')

    userTypeId.selectedIndex = 0

    document.getElementById('occupation').value = ''
    document.getElementById('senha-colaborador').value = ''
    // document.getElementById('comissao-colaborador').value = ''
}