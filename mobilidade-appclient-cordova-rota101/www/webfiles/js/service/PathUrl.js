class Route {

    static getClassAndAction(url) {
        if (url === undefined)
            url = window.location.href;

        url = url.toString();
        let length = (url.split("/").length - 1);
        url = url.split("/");

        let path = url[length - 1] + '/' + url[length];

        path = path.split("?");

        if (path[1] === undefined) {
            if (!Array.isArray(Session.get("user")))
                if (Session.get("user").idUser !== undefined) {
                    return {
                        className: 'Client',
                        classView: 'ClientView',
                        actionName: 'actionSplash'
                    }
                }

            return {
                className: 'Main',
                classView: 'MainView',
                actionName: 'actionLogin'
            }
        }

        let route = path[1].split("&");

        let action = 'actionIndex';

        if (route[1] !== undefined) {
            action = "action" + route[1];
        }

        return {
            className: route[0],
            classView: route[0] + 'View',
            actionName: action
        }
    }

    static importScriptByName(className, callback = function () {
    }) {

        const nameComponent = className.replace(/\//g, "-");

        if (document.getElementsByClassName(nameComponent).length > 0)
            return;

        const my_awesome_script = document.createElement('script');

        my_awesome_script.setAttribute('src', `webfiles/js/${className}.js`);

        my_awesome_script.setAttribute('class', `${nameComponent}`);

        my_awesome_script.async = true;

        my_awesome_script.defer = true;

        document.body.appendChild(my_awesome_script);

        my_awesome_script.addEventListener('load', callback);

    }


    static importScriptByUrl(url, id) {
        return new Promise(resolve => {
            if (document.getElementById(id) !== null) {
                resolve();
                return;
            }


            const my_awesome_script = document.createElement('script');

            my_awesome_script.setAttribute('src', url);

            my_awesome_script.setAttribute('id', id);

            my_awesome_script.async = true;

            my_awesome_script.defer = true;

            document.body.appendChild(my_awesome_script);


            my_awesome_script.addEventListener('load', resolve);
        });

    }

    static importStyleByName(className) {
        const my_awesome_script = document.createElement('link');

        my_awesome_script.setAttribute('rel', `stylesheet`);

        my_awesome_script.setAttribute('href', `webfiles/css/${className}.css`);

        my_awesome_script.setAttribute('id', `css${className}`);

        if (document.getElementById(`css${className}`) !== null)
            return;

        document.head.appendChild(my_awesome_script);
    }

    static redirect(className, actionName = '') {
        if (actionName !== '') {
            actionName = "&" + actionName
        }

        window.location = `?${className}${actionName}`;
    }

    static startView(className, actionName) {
        if (actionName !== '') {
            actionName = "&" + actionName
        }

        webview.Show(`index.html?${className}${actionName}`);
    }

    static waitView() {
        return new Promise(resolve => {
            setTimeout(function () {
                resolve();
            }, 300);
        })
    }

    static pageDynamic(ativeBack = false) {

        const elementProperty = new ElementProperty();

        elementProperty.getElement("a", element => {
            if (element.getAttribute("href") === null)
                return;
            element.onclick = function (event) {
                event.preventDefault();

                Route.renderViewDynamic(this.getAttribute("href"));

            };
        });

        if (ativeBack) {
            document.addEventListener("backbutton", onBackKeyDown, false);
        }

        function onBackKeyDown(e) {
            e.preventDefault();
            Route.backPage();
        }
    }

    static defaultStatusBar() {
        if (cordova.platformId === 'android') {
            //StatusBar.overlaysWebView(false);
            StatusBar.backgroundColorByHexString("#1d4873");
        }

        if (cordova.platformId === "ios") {
            StatusBar.styleDefault();
        }
    }

    static renderViewDynamic(url) {

        Route.defaultStatusBar();

        const elementProperty = new ElementProperty();
        elementProperty.getElement(".menu-close", menuClose => {
            elementProperty.getElement(".container-menu-options", menuOptions => {
                if (menuOptions.classList.contains("active")) {
                    Route.backPage();
                }
            });

            // menuClose.classList.remove("open");
        });

        elementProperty.getElement(".views-dynamic", view => {
            view.style.display = "none";
        });
        elementProperty.getElement(".status-running", view => {
            view.style.display = "none";
        });

        const route = Route.getClassAndAction(url);
        ManagerView[route.classView][route.actionName]();
    }

    static hiddenScreen() {
        const elementProperty = new ElementProperty();
        elementProperty.getElement(".menu-close", menuClose => {
            elementProperty.getElement(".container-menu-options", menuOptions => {
                /* menuOptions.classList.remove("active");*/
                if (menuOptions.classList.contains("active")) {
                    Route.backPage();
                }
            });

            menuClose.classList.remove("open");
        });

        elementProperty.getElement(".views-dynamic", view => {
            view.style.display = "none";
        });
        elementProperty.getElement(".status-running", view => {
            view.style.display = "none";
        });
    }

    static redirectDynamic(className, actionName = '') {
        if (actionName !== '') {
            actionName = "&" + actionName
        }

        Route.renderViewDynamic(`/index.html?${className}${actionName}`);
    }

    static redirectDynamicMain(className, actionName = '') {
        if (actionName !== '') {
            actionName = "&" + actionName
        }

        pages.splice(0, pages.length);

        document.querySelector("#containerViews").innerHTML = "";

        Route.renderViewDynamic(`/index.html?${className}${actionName}`);
    }

    static backPage() {
        const elementProperty = new ElementProperty();

        if (pages.length - 1 === 1) {
            elementProperty.getElement(".status-running", view => {
                view.style.display = "block";
            });
        }

        if (pages.length === 1) {
            window.plugins.appMinimize.minimize();
            return;
        }

        const amount = pages.length - 1;

        const lastPage = pages.splice(amount, 1);

        if (lastPage[0]) {
            if (lastPage[0].component) {
                lastPage[0].callback();
                return;
            }
        }


        if (pages.length === 0) {
            window.plugins.appMinimize.minimize();
            return;
        }

        const page = Route.getSelectCurrentView();

        elementProperty.getElement(".views-dynamic", view => {
            view.style.display = "none";
        });

        viewController.goBack();

        layoutBuild(page.views, page.js, page.css, true);

    }

    static getSelectCurrentView() {
        let index = 1;

        let page = null;

        while (pages.length >= index) {
            page = pages[pages.length - index];

            if (page.views)
                break;

            index++;
        }

        return page;
    }

    static goHomeBack() {
        const elementProperty = new ElementProperty();

        const page = pages[0];

        pages = [page];

        elementProperty.getElement(".views-dynamic", view => {
            view.style.display = "none";
        });

        layoutBuild(page.views, page.js, page.css, true);
    }

    /**
     *
     * @param elementInClass[{component : String ,class:  String}]
     * @param callback
     * @param group
     */
    static startClassesInComponent(elementInClass = [], callback, group = "status-default") {
        pages.push({component: elementInClass, callback, group});

        elementInClass.map(object => {
            viewController.elementProperty.addClass(object.component, object.class)
        });
    }


    static removeGroupComponent(group) {
        const pageByGroupSelect = [];

        pages = pages.filter((page) => {
            if (page.component) {
                if (page.group === group) {
                    pageByGroupSelect.push(page);
                    return false;
                }
            }

            return true;
        });

        /*pageByGroupSelect.map((page) => {
            page.component.map((object) => {
                viewController.elementProperty.removeClass(object.component, object.class)
            });
        });*/
    }

    static isGroupComponentActive(group) {
        return pages.filter((page) => {
            if (page.component) {
                if (page.group === group)
                    return true;
            }

            return false;
        }).length > 0;

    }
}
