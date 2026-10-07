const api = axios.create({
    baseURL: HOST_API
});

const bankGetAll = ()=> api.get('Bank/GetAll')
const stateGetAll = ()=> api.get('Estate/GetAll')
const cityGetAll = (id)=> api.get("City/GetAll?estado="+ id)
 
const apis = {
    bankGetAll, 
    stateGetAll,
    cityGetAll
};
 