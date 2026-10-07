function openAddressWithoutDestination() {
    if (trip.origin == null)
        return SwalCustom.messageDialog("", "Informe o endereço de origem").then(() => {
            document.querySelector("#origin").focus();
        });
    document.getElementById("destination").value =  document.getElementById("origin").value;

    trip.destination = trip.origin;

    calculatePriceCustomer("forMe", true);
}
