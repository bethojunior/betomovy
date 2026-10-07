document.addEventListener("DOMContentLoaded", () => {
    const elementProperty = new ElementProperty();
   getConfigs()

   function getConfigs() {
       preload(true);
       MapSettingController.getConfigDelivery().then((result) => {
           preload(false);
           document.querySelector(`input[name='radio'][value='${result.response}']`).checked = true;
       });

       MapSettingController.getNameEstablishmentDelivery().then((result) => {
           preload(false);
           document.querySelector(`#nameEstablishmentDelivery`).value = result.response || "";
       });

       MapSettingController.getConfigDeliveryConfirmationCodeRegisterCustomer().then((result) => {
           preload(false);
           document.querySelector(`input[name='radioCodeConfirm'][value='${result.response}']`).checked = true;
       });
   }

   elementProperty.addEventInElement("#btnUpdateNameEstablishment","onclick",function(){
       preload(true);
       const name_establishment_delivery = document.querySelector(`#nameEstablishmentDelivery`).value;
       MapSettingController.update({name_establishment_delivery}).then(({status}) => {
           preload(false);
           if(!status){
               return SwalCustom.messageDialog('Tente novamente', 'Ocorreu um erro ao atualizar sua configuração', 'error');
           }

           SwalCustom.messageDialog('', 'Configuração atualizada com sucesso!', 'success');
       });
   });

   elementProperty.addEventInElement('#btnUpdateConfig', 'onclick', function () {
       preload(true);
       const type_of_delivery_area = document.querySelector("input[name='radio']:checked").value;

       MapSettingController.update({type_of_delivery_area}).then(({status}) => {
           preload(false);
           if(!status){
               return SwalCustom.messageDialog('Tente novamente', 'Ocorreu um erro ao atualizar sua configuração', 'error');
           }

           SwalCustom.messageDialog('', 'Configuração atualizada com sucesso!', 'success');
       });
   })

    elementProperty.addEventInElement('#btnUpdateConfirmationCode', 'onclick', function () {
        preload(true);
        const customer_register_sms_confirmation_code = document.querySelector("input[name='radioCodeConfirm']:checked").value;

        MapSettingController.update({customer_register_sms_confirmation_code}).then(({status}) => {
            preload(false);
            if(!status){
                return SwalCustom.messageDialog('Tente novamente', 'Ocorreu um erro ao atualizar sua configuração', 'error');
            }

            SwalCustom.messageDialog('', 'Configuração atualizada com sucesso!', 'success');
        });
    })
});