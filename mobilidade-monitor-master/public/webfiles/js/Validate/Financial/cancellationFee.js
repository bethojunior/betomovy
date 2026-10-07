class ValidateCancellation extends ValidateController{
z
    constructor(data) {
        super().verify(data);
    }

    static verify(data)
    {
        return this.validateFields(data);
    }

    static init(data , nulo = true)
    {
        if(nulo)
            return this.addParameters(data);

        return this.addParametersIsNull(data);
    }

}