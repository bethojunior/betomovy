document.addEventListener("DOMContentLoaded", () => {
  listAll()

  async function update(id, payload){
    try {
      preload(true)
      const result = await RequiredFieldController.update(id, payload)
      preload(false)
      console.log(result)
      
      if(!result.status) return;
      SwalCustom.messageDialog('', 'Campo atualizado com sucesso!', 'success')
      return result.response
    } catch(error) {
      console.error(error)
      SwalCustom.messageDialog('', 'Erro ao tentar atualizar campo', 'error')
    }
  }

  function save(item) {
    const aliasValue = document.getElementById(`alias-${item.id}`).value;
    const requiredValue = document.getElementById(`switch-${item.id}`).checked;
    const compelFieldValue = document.getElementById(`compelField-${item.id}`).checked;

    const payload = {
      required: requiredValue ? 1 : 0,
      compelField: compelFieldValue ? 1 : 0,
      alias: aliasValue
    }

    if(payload.required && !payload.compelField) {
      return SwalCustom.messageDialog("", "Não é possível tornar algo obrigatório sem que seja visível.");
    }

    update(item.id, payload)
  }

  function mount(item) {
    const documentsApp = {
      driver: 4,
      client: 90
    }
    return `
      <tr>
        <th scope="row">${item.description}</th>
        <th scope="row">
          <div class="input-group mb-2">
            <input value="${item.alias || ""}" type="text" class="form-control alias-input" aria-describedby="inputGroup-sizing-default" id="alias-${item.id}">
          </div>
        </th>
        <th scope="row">${item.id == documentsApp.driver ? "Driver" : "Cliente"}</th>
        <td>
          <div class="custom-control custom-switch switch-require">
          <input ${item.required ? "checked" : ""} type="checkbox" class="custom-control-input" id="switch-${item.id}" />
          <label class="custom-control-label" for="switch-${item.id}"></label>
          </div>
        </td>
        <td>
          <div class="custom-control custom-switch switch-require">
          <input ${item.compelField ? "checked" : ""} type="checkbox" class="custom-control-input" id="compelField-${item.id}" />
          <label class="custom-control-label" for="compelField-${item.id}"></label>
          </div>
        </td>
        <td>
          <button class="btn btn-primary  btn-save-${item.id}">Salvar</button>
        </td>
      </tr>
    `
  }

  async function getAllrequiredFields() {
    try {
      preload(true)
      const result = await RequiredFieldController.get(5)
      preload(false)
  
      if(!result.status) return [];
      return result.response?.filter((item) => item?.field == "document")
    } catch(error) {
      console.error(error)
      SwalCustom.messageDialog('', 'Erro ao tentar listar campos', 'error')
    }
  }

  async function listAll() {
    const el = document.getElementById("list-required-fields");
    const requiredFields = await getAllrequiredFields();
  
    await requiredFields.map((item) => {
      const html = mount(item);
      el.innerHTML += html;
    })

    requiredFields.map((item) => {
      const btn = document.querySelector(`.btn-save-${item.id}`);
      btn.addEventListener("click", function() {save(item)});
    })
  }
});
