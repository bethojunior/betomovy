class ValidateIndication extends ValidateController{

    constructor(data) {
        super().verify(data);
    }

    static verify(data)
    {
        return this.validateFields(data);
    }

    static init(data)
    {
        return this.addParameters(data);
    }

}