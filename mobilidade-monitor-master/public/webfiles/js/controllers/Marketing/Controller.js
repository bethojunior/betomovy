class MarketingController extends ConnectionServer{
    /**
     *
     * @returns {Promise<unknown>}
     */
    static wereAdvertising(){
        return new Promise(resolve => {
            this.sendRequest('advertisingAppSite','GET','',resolve,false,true);
        })
    }
    /**
     *
     * @param data
     * @returns {Promise<any>}
     */
    static insertAdvertising(data)
    {
        return this.sendRequestWithFiles('advertising','POST',data,true);
    }

    /**
     *
     * @param params
     * @returns {Promise<any>}
     */
    static getAdvertising(params)
    {
        return new Promise(resolve => {
            this.sendRequest(
                'advertising?cityId='+Session.getValueInSessionLocal("citySelected","cityId")+params,
                'GET','',resolve,false,true);
        })
    }

    static showPublicity(id)
    {
        return new Promise(resolve => {
            this.sendRequest(
                'advertising/'+id+'/show',
                'GET','',resolve,false,true);
        })
    }

    static updateAdvertising(id,data)
    {
        return this.sendRequestWithFiles('advertising/'+id+'/update','POST',data,true);
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static deletePublicity(id)
    {
        return new Promise(resolve => {
            this.sendRequest(
                'advertising/'+id,
                'DELETE','',resolve,false,true);
        })
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static insertCupom(data)
    {
        return new Promise(resolve => {
            this.sendRequest('discountCoupon','POST',data,resolve,false,true);
        });
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static getCupons()
    {
        return new Promise(resolve => {
            this.sendRequest('discountCoupon','GET','',resolve,false,true);
        });
    }

    /**
     *
     * @param id
     * @param status
     * @returns {Promise<unknown>}
     */
    static releaseCupom(id,status)
    {
        return new Promise(resolve => {
            if(status)
                return this.sendRequest(`discountCoupon/${id}/enable`,'PUT','',resolve,false,true);

            this.sendRequest(`discountCoupon/${id}/disable`,'PUT','',resolve,false,true);
        });
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static deleteCupom(id)
    {
        return new Promise(resolve => {
            this.sendRequest('discountCoupon/'+id,'DELETE','',resolve,false,true);
        })
    }
}