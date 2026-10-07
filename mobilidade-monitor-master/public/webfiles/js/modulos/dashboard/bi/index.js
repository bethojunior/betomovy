document.addEventListener("DOMContentLoaded", () => {
    const elementProperty = new ElementProperty();

    elementProperty.getElement("#iframe-powerbi", element => {
        const powerBiUrl = Session.get("power_bi_url");

        element.innerHTML += `
            <iframe src="${powerBiUrl}" width="100%" height="100%" frameborder="0" allowFullScreen="true"></iframe>
        `;
    });
});