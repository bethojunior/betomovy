const IS_PRODUCTION = true;

const environment = getEnvironment(IS_PRODUCTION);

const appId = 4;

var consoleHolder = console;
function debug(bool){
    if(!bool){
        consoleHolder = console;
        console = {};
        Object.keys(consoleHolder).forEach(function(key){
            console[key] = function(){};
        })
    }else{
        console = consoleHolder;
    }
}

debug(true);

const PATH_IMAGE_PROFILE  = environment.hosts.profileImage;
const PATH_PROFILE_DRIVER = environment.hosts.hostProfileDriver;
const HOST                = environment.hosts.local;
const HOST_PWA            = environment.hosts.hostPwa;
const HOST_SITE           = environment.hosts.hostSite;

const NAME_APP = "rota101";

const LINK_SHARE = `https://rota101.prod.704apps.com.br/app/share/customer/`;
/**
 *
 * @param production {boolean}
 * @returns {*}
 */
function getEnvironment(production){
    const environments = [
        {
            name  : "test",
            hosts : {
                local: "",
                hostPwa : "https://localhost/taxireturnpwa",
                hostRequest: "https://apiteste.taxireturn.com.br/",
                hostSite: "https://beta.taxireturn.com.br/",
                idFacebook : "707301642965848",
                hostImage : "https://s3-sa-east-1.amazonaws.com/taxireturnteste/establishment/compressed/",
                hostImageDefault: "https://s3-sa-east-1.amazonaws.com/taxireturn/default.jpg",
                hostProfileDriver: "https://s3-sa-east-1.amazonaws.com/taxireturnteste/driver/profile/compressed/",
                profileImage : "https://s3-sa-east-1.amazonaws.com/taxireturnteste/customer/profile/",
                hostAudioMessage: "https://s3-sa-east-1.amazonaws.com/taxireturnteste/chat/trip/",
                hostSocket: "http://apiteste.taxireturn.com.br"
            },
            socket : {
                test    : true,
                keyTrip : "55d92b9e36d1bd828212",
                keyChat : "d972017e7893eac71c31"
            }
        },{
            name  : "production",
            hosts : {
                local: "",
                hostPwa : "https://pwa.taxireturn.com.br/",
                hostRequest: "https://mobilidade-api-php-rota101.prod.704apps.com.br/",
                hostSite: "https://rota101.prod.704apps.com.br/",
                idFacebook : "559943727752617",
                hostImage : "https://storage.704apps.com.br:9000/rota101fb704/establishment/compressed/",
                hostImageDefault: "https://storage.704apps.com.br:9000/rota101fb704/default.jpg",
                hostProfileDriver: "https://storage.704apps.com.br:9000/rota101fb704/driver/profile/compressed/",
                profileImage : "https://storage.704apps.com.br:9000/rota101fb704/customer/profile/compressed/",
                hostAudioMessage: "https://storage.704apps.com.br:9000/rota101fb704/chat/trip/",
                hostSocket: "https://mobilidade-api-node-rota101.prod.704apps.com.br/"
            },
            socket : {
                test    : false,
                keyTrip : "d18413a6f1df893db951",
                keyChat : "dda2d265e1ce9b51048f"
            }
        }
    ];

    return environments.filter(environment=>{
        return "production".includes(environment.name) === production;
    })[0];
}