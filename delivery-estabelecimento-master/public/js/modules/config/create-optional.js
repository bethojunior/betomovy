let product = {};

if(document.getElementById("image-product") !== null) {
    document.getElementById("image-product").onchange = function() {
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

elementProperty.addEventInElement('.edit-this-product','onclick',function () {
    $('#collapseOne').collapse('show');
    let object = {
        'name' : 'Borda recheada',
        'timeRead' : 20,
        'description' : 'Borda recheada de catypiry para pizza',
        'priceSale' : '5.00',
        'priceCost' : '2.00',
        'imageProduct' : 'https://www.meubarato.com/image/d2lkdGg9NjYwJmZvcmNlPTEmcmVmcmVzaD0xNTAzMDU2Mjk0JnE9OTgmc3JjPWltZy9vZmVydGFzL29mZXJ0YV8yXzM4ODcuanBnJnNlY3VyZT17YnVybn0=.jpg'
    };
    document.getElementById('name-product').value = object.name;
    document.getElementById('time-read').value = object.timeRead;
    document.getElementById('description').value = object.description;
    document.getElementById('price-sale').value = object.priceCost;
    document.getElementById('real-price').value = object.priceSale;
    document.getElementById('thumbnail').src = object.imageProduct;
});

elementProperty.addEventInElement('.delete-this-product','onclick',function () {
    SwalCustom.dialogConfirm('Deseje apagar esse produto?','Essa ação é irreversivel',status => {
       if(status)
           return swal('Produto deletado','','success')

    });
});
