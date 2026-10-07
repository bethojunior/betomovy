class EmployeeController{

    register(employee){
        return new Promise((resolve)=>{
            ConnectionServer.sendRequest("Customer/RegisterPartner","POST",employee,resolve)
        });
    }
}