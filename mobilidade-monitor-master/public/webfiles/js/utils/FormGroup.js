class FormGroup {
    constructor(name) {
        this.elementProperty = new ElementProperty();
        this.step = 0;
        this.groups = this.elementProperty.getElements(name);
        this.validate = {};
        this.screens = [];
        this.callbackIgnore = () => {
        };
    }

    initGroup() {
        this.hideAllGroups();
        return this.showGroupSelected();
    }

    nextGroup() {
        const screen = this.screens.find(item => {
            return item.validated === false;
        });

        screen.validated = true;

        this.step += 1;
        this.hideAllGroups();
        return this.showGroupSelected();
    }

    beforeGroup() {
        const screenValidate = this.screens.filter(item => {
            return item.validated === true;
        });

        const screen = screenValidate[screenValidate.length - 1];

        if (screen == null)
            return false;

        screen.validated = false;

        this.hideAllGroups();
        //this.resetValidate();
        return this.showGroupSelected();
    }

    hideAllGroups() {
        this.screens.map(item => {
            const element = document.querySelector(item.selectors);
            if (element != null)
                element.classList.remove("active");
        });
    }

    ignoreGroup(element) {
        return this.callbackIgnore(element);
    }

    showGroupSelected() {
        const screen = this.screens.find(item => {
            return item.validated === false;
        });

        if (screen == null)
            return false;

        const element = document.querySelector(screen.selectors);

        if (element == null) {
            screen.validated = true;
            return this.showGroupSelected();
        }

        element.classList.add("active");

        return true;
    }

    resetValidate() {
        /*Object.keys(this.validate).map((key, index) => {
            if (this.validate[key] instanceof Object)
                this.validate[key].wasValidated = (index < this.step);
            else
                this.validate[key] = (index < this.step);
        });*/
        const element = this.groups[this.step];

        const type = element.getAttribute("value");

        this.validate[type].wasValidated = false;
    }
}