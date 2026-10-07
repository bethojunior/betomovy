let maxValueLengthSms = 120;

$(document).ready(function() {
    $('.js-example-basic-multiple').select2();
});

if(document.getElementById("image-upload-item") !== null) {
    document.getElementById("image-upload-item").onchange = function() {
        if (this.files && this.files[0]) {
            let reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("thumbnail").setAttribute('src', e.target.result);
                imageOne = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
    };
}

elementProperty.addEventInElement('#by-sms','onclick',function () {
    elementProperty.getElement('#title-notification', that => {
        that.disabled = true;
    });
    elementProperty.getElement('#by-push',that => {
        that.checked = false;
    });
});

elementProperty.addEventInElement('#by-push','onclick',function () {
    elementProperty.getElement('#title-notification', that => {
        that.disabled = false;
    });
});

elementProperty.addEventInElement('#by-email','onclick',function () {
    elementProperty.getElement('#title-notification', that => {
        that.disabled = false;
    });
});

elementProperty.addEventInElement('#body-notification-sms','onkeydown',function () {
    let that = this;
    elementProperty.getElement('#caracteres-message',these => {
        maxValueLengthSms = maxValueLengthSms - 1;
        these.innerHTML = that.value.length + '/120';
        if(maxValueLengthSms === 0)
            SwalCustom.toast('Número máximo de caracteres atingido','warning')
    });
});

