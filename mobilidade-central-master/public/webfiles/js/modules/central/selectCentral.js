document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement(".central-select", "onclick", function () {
        try {
            const central = JSON.parse(this.getAttribute("value"));
            Session.set("centralSelected", central);
            try {
                localStorage.setItem("centralSelected", JSON.stringify(central));
            } catch (e) {}
        } catch (e) {
            console.error("Erro ao selecionar central:", e);
        }
        location.reload(true);
    });
});