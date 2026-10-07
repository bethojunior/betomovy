class EstablishmentController{
    static insertEstablishment(params, photos, callback)
    {   
        let form = new FormData();
        photos.map((item,index) => {
            form.append(`photos ${index + 1}`,item);
        })

        form.append(`stdObject`,JSON.stringify(params));

        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                callback(JSON.parse(request.responseText));
               
            }
        };
        request.open("POST", HOST_API+ "Establishment/Insert", true); 
        request.send(form);
    }       
}