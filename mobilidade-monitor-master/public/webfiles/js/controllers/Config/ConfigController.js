class ConfigController extends ConnectionServer{

    static Apps()
    {
        return new Promise(resolve => {
            this.sendRequest('app','GET','',resolve,false,true)
        })
    }
    static Gender()
    {
        return new Promise(resolve => {
            this.sendRequest('gender','GET','',resolve,false,true)
        })
    }
}