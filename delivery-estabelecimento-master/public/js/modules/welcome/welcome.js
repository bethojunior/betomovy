document.addEventListener("DOMContentLoaded", function () {

    getConfig();
    
    async function getConfig() {
        const now = new Date()
        const storage = JSON.parse(localStorage.getItem('configLayout'));
    
        if(!storage || storage.expiry < now.getTime()) {
            await fetch('api/configLayout')
            .then(response => response.json())
            .then(({response, status}) => {
                if(!status){
                    return;
                }
                const thirtySeconds = 30000
                const item = {
                    value: response,
                    expiry: now.getTime() + thirtySeconds,
                }
    
                localStorage.setItem('configLayout', JSON.stringify(item));
            })
        }
        const layout =  JSON.parse(localStorage.getItem('configLayout'));
        const citiesElements = document.querySelector('.deliveryCities')
        const cities = layout?.value?.cities.split(',');
        citiesElements.innerHTML = ''
    
        document.querySelector('.deliveryImage').src = layout?.value?.image ? layout.value.image : '../../../assets/images/icons/mobi1.png';
        document.querySelector('.linkIos').href = layout?.value?.linkIos;
        document.querySelector('.linkAndroid').href = layout?.value?.linkAndroid;
        cities.map((res) => 
        citiesElements.innerHTML += `<li>${res}</li>`
        );
    }
    });
    