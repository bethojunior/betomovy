class FormGroup {
    constructor(name) {
        this.elementProperty = new ElementProperty();
        this.step = 0;
        this.groups = this.elementProperty.getElements(name);
        this.validate = {};
        this.callbackIgnore = () => {
        };
    }

    nextGroup() {
        this.step += 1;
        this.hideAllGroups();
        return this.showGroupSelected();
    }

    beforeGroup() {
        this.step -= 1;

        /*if (this.step === 1)
            this.step = 0;*/

        const element = this.groups[this.step];

        if(element == null)
            return false;

        if (this.ignoreGroup(element)) {
            return this.beforeGroup();
        }

        this.hideAllGroups();
        this.resetValidate();
        return this.showGroupSelected();
    }

    hideAllGroups() {
        this.groups.map(group => {
            group.classList.remove("active");
        });
    }

    ignoreGroup(element) {
        return this.callbackIgnore(element);
    }

    showGroupSelected() {
        if (this.groups.length <= this.step || this.step < 0)
            return false;

        const element = this.groups[this.step];

        if (this.ignoreGroup(element)) {
            this.step += 1;
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