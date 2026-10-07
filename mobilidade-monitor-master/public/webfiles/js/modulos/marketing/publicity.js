preload(true);
elementProperty.getElement('.time-publicidade', (element) => {
   const date = new Date();
   element.value = DateCustom.getDateTimeInput(date);
});

$(document).ready(function () {
   $('.js-example-basic-single').select2();
});

let imageOne;

if (document.getElementById('thumbnail') !== null) {
   document.getElementById('thumbnail').onchange = function () {
      if (this.files && this.files[0]) {
         let reader = new FileReader();

         reader.onload = function (e) {
            document.getElementById('image-upload-item').setAttribute('src', e.target.result);
            imageOne = e.target.result;
         };

         reader.readAsDataURL(this.files[0]);
      }
   };
}
if (document.getElementById('banner') !== null) {
   document.getElementById('banner').onchange = function () {
      if (this.files && this.files[0]) {
         let reader = new FileReader();

         reader.onload = function (e) {
            document
               .getElementById('image-upload-item-banner')
               .setAttribute('src', e.target.result);
            imageOne = e.target.result;
         };

         reader.readAsDataURL(this.files[0]);
      }
   };
}

elementProperty.get('#mount-company').then((these) => {
   CompanyController.getAll().then(({ status, response }) => {
      if (!status) return swal('Erro ao listar empresas', 'Contate o suporte', 'error');

      let items = response
         .map((item) => {
            return `
                <option value="${item.id}">${item.fantasyName}</option>
            `;
         })
         .join('');
      these.innerHTML += items;
   });
});

elementProperty.get('#mount-apps').then((these) => {
   ConfigController.Apps().then(({ status, response }) => {
      if (!status) return swal('Erro ao listar aplicativos', 'Contate o suporte', 'error');

      let apps = response
          .map((app) => {
             return `
                <div class="form-check ml-2">
                    <input class="form-check-input" name="apps" type="radio" value="${app.idApp}" id="app-${app.idApp}">
                    <label class="form-check-label" for="app-${app.idApp}">
                        ${app.name}
                    </label>
                </div>
            `;
          })
          .join('');
      these.innerHTML += apps;
   });
});

elementProperty.get('#mount-were').then((these) => {
   MarketingController.wereAdvertising().then(({ status, response }) => {
      if (!status)
         return swal('Erro ao listar locais de publicidade', 'Contate o suporte', 'error');

      let apps = response
          .map((app) => {
             return `
                <div class="form-check ml-2">
                    <input name="advertisingAppSiteId" class="form-check-input" type="radio" value="${app.id}" id="where-${app.id}">
                    <label class="form-check-label" for="where-${app.id}">
                        ${app.name}
                    </label>
                </div>
            `;
          })
          .join('');
      these.innerHTML += apps;
   });
});


elementProperty.get('#mount-gender').then((these) => {
   ConfigController.Gender().then(({ status, response }) => {
      if (!status)
         return swal('Erro ao listar locais de publicidade', 'Contate o suporte', 'error');

      let apps = response
         .map((app) => {
            return `
            <div class="custom-control custom-radio ml-2">
                <input type="radio" id="customRadio-${app.id}" name="type-gender" class="custom-control-input" value="${app.id}">
                <label class="custom-control-label" for="customRadio-${app.id}">${app.name}</label>
            </div>
            `;
         })
         .join('');
      these.innerHTML += apps;
      preload(false);
   });
});

elementProperty.addEventInElement('#save-publicity', 'onclick', function () {
   let data = new FormData();

   if (document.getElementById('thumbnail') === '')
      return swal('Preencha todos os campos', '', 'error');

   if (document.getElementById('banner') === '')
      return swal('Preencha todos os campos', '', 'error');

   let thumbnail = document.getElementById('thumbnail').files[0];
   let banner = document.getElementById('banner').files[0];

   data.append('thumbnail', thumbnail);
   data.append('banner', banner);
   data.append('genderId', $("input[name='type-gender']:checked").val());
   data.append('appId', $("input[name='apps']:checked").val());
   data.append('dateStart', document.getElementById('dateStart').value);
   data.append('dateEnd', document.getElementById('dateEnd').value);
   data.append('amountOfTime', document.getElementById('amountOfTime').value);
   data.append('companyId', document.getElementById('mount-company').value);
   data.append('link', document.getElementById('link').value);
   data.append('emailInformation', document.getElementById('email-information').value);
   data.append('emailRedirect', document.getElementById('emailRedirect').value);
   data.append('description', document.getElementById('description').value);
   data.append('cityId', Session.getValueInSessionLocal('citySelected', 'cityId'));
   data.append('advertisingAppSiteId', $("input[name='advertisingAppSiteId']:checked").val());

   preload(true);

   MarketingController.insertAdvertising(data).then(({ status, response }) => {
      preload(false);

      if (!status) return swal('Erro ao inserir publicidade', response[0], 'info');

      swal('Publcidade inserida com sucesso', '', 'success');
      document.getElementById('dateStart').value = '';
      document.getElementById('dateEnd').value = '';
      document.getElementById('amountOfTime').value = '';
      document.getElementById('mount-company').value = '';
      document.getElementById('link').value = '';
      document.getElementById('email-information').value = '';
      document.getElementById('emailRedirect').value = '';
      document.getElementById('description').value = '';
      document.getElementById('thumbnail').src = '/webfiles/img/icon/default.png';
      document.getElementById('banner').src = '/webfiles/img/icon/default.png';
   });
});
