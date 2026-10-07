function setPreferredLanguage(value) {
    return new Promise(resolve => {
        $.ajax({
            dataType: "json",
            url: `i18n/${value}`,
            success: (result)=> {
                document.querySelector("#containerLanguage").innerHTML = btoa(JSON.stringify(result));
                resolve(result);
            }
        });
    });
}

function translateLanguage() {
    const data = JSON.parse(atob(document.querySelector("#containerLanguage").innerText));

    Object.keys(data).map((attribute) => {
        translate(data[attribute], attribute);
    });

    function translate(data, view) {
        Object.keys(data).map(attribute => {
            document.querySelectorAll(`*[data-i18n='${view}-${attribute}']`).forEach(element => {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.setAttribute("placeholder", data[attribute]);
                    return;
                }
                element.innerHTML = data[attribute];
            })
        });
    }
}

function getTextTranslate(page, id) {
    const data = JSON.parse(atob(document.querySelector("#containerLanguage").innerText));

    return data[page][id];
}

function verifyPreferredLanguage() {
    return new Promise((resolve, reject) => {
        navigator.globalization.getPreferredLanguage(({value}) => {
            switch (value) {
                case "pt-BR":
                    resolve("pt_br.json");
                    break;
                case "pt-PT":
                    resolve("pt_pt.json");
                    break;
                case "en-US":
                case "en-AU":
                case "en-IN":
                case "en-GB":
                    resolve("en_us.json");
                    break;
                case "es-ES":
                case "es-US":
                case "es-CL":
                    resolve("es_ch.json");
                    break;
                default :
                    resolve("pt_br.json");
                    break;
            }
        }, reject);
    })
}
