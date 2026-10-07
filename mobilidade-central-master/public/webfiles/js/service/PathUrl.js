class Route {

    static getClassAndAction() {

        let url = window.location.href;
        url = url.toString();
        let length = (url.split("/").length - 1);
        url = url.split("/");

        let path =  url[length - 1] + '/' + url[length];

        path = path.split("?");

        if(path[1] === undefined){
            if(Session.get("user").idUser !== undefined) {
                return {
                    className: 'Driver',
                    classView: 'DriverView',
                    actionName: 'actionIndex'
                }
            }
            return {
                className: 'Login',
                classView: 'LoginView',
                actionName: 'actionIndex'
            }
        }

        let route = path[1].split("&");

        let action = 'actionIndex';

        if (route[1] !== undefined){
            action = "action"+route[1];
        }

        return {
            className: route[0],
            classView : route[0]+'View',
            actionName: action
        }
    }

    static importScriptByName(className,callback = function(){}){
        const my_awesome_script = document.createElement('script');

        my_awesome_script.setAttribute('src',`webfiles/js/${className}.js`);

        my_awesome_script.async = true;

        document.head.appendChild(my_awesome_script);

        my_awesome_script.addEventListener('load',callback);

    }

    static importStyleByName(className){
        const my_awesome_script = document.createElement('link');

        my_awesome_script.setAttribute('rel',`stylesheet`);

        my_awesome_script.setAttribute('href',`webfiles/css/${className}.css`);

        document.head.appendChild(my_awesome_script);
    }

    static redirect(className,actionName = ''){
        if(actionName !== ''){
            actionName = "&"+actionName
        }

        window.location = `?${className}${actionName}`;
    }

    static startView(className,actionName){
        if(actionName !== ''){
            actionName = "&"+actionName
        }

        webview.Show(`index.html?${className}${actionName}`);
    }
}