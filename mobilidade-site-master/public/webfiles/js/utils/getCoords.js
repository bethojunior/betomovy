const apiKey = '&key=AIzaSyDzYKn0wp3Gl8dcoW3xhLNI7xtufpGIYXk'
const url = 'https://maps.google.com/maps/api/geocode/json?&sensor=false&address='

function getAddresInfo(cep) {

    return new Promise ((resolve,reject) => {

        let fullUrl = url + cep + apiKey

        fetch(fullUrl)
            .then(res => res.json())
            .then(data => resolve(data.results))
            .catch(err => reject(err))
    })
}

