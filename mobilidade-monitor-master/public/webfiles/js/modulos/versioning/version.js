function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

elementProperty.addEventInElement("#btn-status","onclick",function(){
    SwalCustom.dialogConfirm("Deseja efetuar a ação");
});