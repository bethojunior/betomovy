elementProperty.addEventInElement('.open-ticket','onclick',function () {
    let data = JSON.parse(this.getAttribute('data'));

    $('#modal-info-ticket').modal('show');

    elementProperty.getElement('#title-ticket-modal', title => {
        title.innerHTML = data.enterprise_name;
    });

    elementProperty.getElement('#title-ticket', title => {
        title.value = data.title;
    });

    elementProperty.getElement('#app-type-ticket', app => {
        app.value = data.appname;
    });

    elementProperty.getElement('#description-ticket', description => {
        description.value = data.description;
    });

});
