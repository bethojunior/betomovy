document.addEventListener("DOMContentLoaded", function () {
    mountListPromotionalBanners();

    function mountListPromotionalBanners() {
        preload(true);
        RoutePromotionalBannerController.listAllRoutePromotionalBanner().then(({response}) => {
            document.querySelector("#listPromotionalBanners").innerHTML = response.map((item) => {
                return `
                    <div class="col-3 mb-2">
                        <div class="card">
                            <img src="${item.path}" class="card-img-top" alt="...">
                            <div class="card-body container-card-body">
                              <button type="button" class="btn btn-danger delete-banner" value="${item.id}">Excluir</button>
                            </div>
                        </div>
                    </div>
                `
            }).join("")
            elementProperty.addEventInElement("#promotionalBanner", "onchange", savePromotionalBanner);
            elementProperty.addEventInElement(".delete-banner", "onclick", deletePromotionalBanner);
        }).finally(() => {
            preload(false);
        });
    }

    function savePromotionalBanner() {
        const picture = document.getElementById('promotionalBanner').files[0];
        preload(true);
        RoutePromotionalBannerController.saveRoutePromotionalBanner(picture).then(() => {
            preload(false);
            SwalCustom.messageDialog("", "Banner adicionado com sucesso!", "success").then(() => mountListPromotionalBanners());
        });
    }

    function deletePromotionalBanner() {
        const pictureId = this.getAttribute("value");
        preload(true);
        RoutePromotionalBannerController.deleteRoutePromotionalBanner(pictureId).then(() => {
            preload(false);
            SwalCustom.messageDialog("", "Banner removido com sucesso!", "success").then(() => mountListPromotionalBanners());
        });
    }
});