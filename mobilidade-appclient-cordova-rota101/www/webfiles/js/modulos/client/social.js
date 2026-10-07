Route.waitView().then(() => {

    checkExistPhotoSocial();

    function checkExistPhotoSocial() {
        if (!Array.isArray(Session.get("picture_social"))) {
            const userLogged = Session.get("user");
            const url = getImageByUrl(Session.get("picture_social"));

            if(!url)
                return;

            fetch(url).then(r => r.blob()).then((file) => {
                file.lastModifiedDate = new Date();
                file.name = "image.jpg";

                CustomerController.updatePhotoSocial(userLogged.idCustomer, file).then(({status, data, message}) => {
                    if (!status)
                        return;

                    Session.delete("picture_social");

                    const config = Session.get("configGeneral");
                    const picturesLink = config.find(item => {
                        return item.key === 'link_storage_pictures';
                    });
            
                    const finalLink = `${picturesLink.value}customer/profile/compressed/`;

                    // userLogged.profileImage = `${PATH_IMAGE_PROFILE}${data}`;
                    userLogged.profileImage = `${finalLink}${data}`;

                    Session.set('user', userLogged);

                    updateDataUserMenu();
                });
            });
        }
    }

    function getImageByUrl(object) {
        switch (object.type) {
            case "facebook" : {
                return object.data.data.url;
            }
            case "google":{
                return object.data;
            }
            default: {
                return false;
            }
        }
    }

});
