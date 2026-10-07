document.addEventListener("DOMContentLoaded", function () {
  const elementProperty = new ElementProperty();

  init();

  function init() {
    preload(true);
    DeliveryController.getConfigs().then(({ response, status }) => {
      preload(false);
      if (!status) {
        return SwalCustom.messageDialog(
          "Tente novamente",
          "Ocorreu um erro ao buscar as informações",
          "error"
        );
      } else {
        document
          .querySelector(".androidInput")
          .setAttribute("value", response[0].linkAndroid);
        document
          .querySelector(".iosInput")
          .setAttribute("value", response[0].linkIos);
        document.querySelector(".cityInput").innerHTML = response[0].cities;
      }
    });
  }

  function edit(data) {
    preload(true);
    DeliveryController.editConfigs(data).then(({ status }) => {
      preload(false);
      if (status) {
        return SwalCustom.messageDialog(
          "",
          "Informações enviadas com sucesso",
          "success"
        );
      }
    });
  }

  elementProperty.addEventInElement(".saveButton", "onclick", () => {
    const data = (img) => {
      return {
        linkAndroid: document.querySelector(".androidInput").value,
        linkIos: document.querySelector(".iosInput").value,
        cities: document.querySelector(".cityInput").value,
        image: img,
      };
    };

    const linkAndroidValue = document.querySelector(".androidInput").value;
    const linkIosValue = document.querySelector(".iosInput").value;
    const citiesValue = document.querySelector(".cityInput").value;

    if (linkAndroidValue === "" || linkIosValue === "" || citiesValue === "") {
      return SwalCustom.messageDialog(
        "Preencha todos os campos",
        "Os campos não podem estar vazios",
        "warning"
      );
    }

    if (document.querySelector(".image").value !== "") {
      const reader = new FileReader();
      reader.readAsDataURL(document.querySelector(".image").files[0]);

      reader.addEventListener("load", (e) => {
        return edit(data(e.target.result));
      });
    } else {
      edit(data(""));
    }
  });
});
