class ConnectionServer {
  static Host() {
    return environment.hosts.hostRequest;
  }

  static setAuthHeaders(request, headers = {}) {
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    const token = Session.getValueInSession("user", "api_token");
    const userId = Session.getValueInSession("user", "idUser");
    let cityId = Session.getValueInSessionLocal("citySelected", "cityId")
      || Session.getLocal("city-origin")
      || Session.get("city-origin")
      || Session.getLocal("city-destination")
      || Session.get("city-destination")
      || Session.getValueInSessionLocal("cityConfig", "cityId")
      || Session.getValueInSessionLocal("cityConfig", "id");

    if (!cityId) {
      try {
        const stored = JSON.parse(localStorage.getItem("cityConfig"));
        if (stored?.cityId || stored?.id) cityId = stored.cityId || stored.id;
      } catch (e) {}
    }

    if (token && token !== "undefined" && token !== "null") {
      request.setRequestHeader("token", token);
    }
    if (userId && userId !== "undefined" && userId !== "null") {
      request.setRequestHeader("userid", userId);
    }
    if (cityId && cityId !== "undefined" && cityId !== "null") {
      request.setRequestHeader("cityid", cityId);
    }

    if (headers && typeof headers === "object") {
      Object.keys(headers).forEach((key) => {
        request.setRequestHeader(key, headers[key]);
      });
    }
  }

  /**
   *
   * @param url
   * @param method
   * @param formData
   * @returns {Promise<any>}
   */

  static sendRequestWithFilesCentral(url, method = "GET", formData) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          console.log('Response status:', request.status);
          console.log('Response text:', this.responseText);
          
          try {
            let responseData;
            if (this.responseText && this.responseText.trim() !== '') {
              responseData = JSON.parse(this.responseText);
            } else {
              responseData = { message: 'Resposta vazia do servidor' };
            }
            
            console.log('Parsed response data:', responseData);
            
            switch (request.status) {
              case 200:
              case 201: {
                resolve(responseData);
                break;
              }
              default: {
                reject(responseData);
              }
            }
          } catch (error) {
            console.error('JSON Parse Error:', error);
            console.error('Response text that failed to parse:', this.responseText);
            reject({
              status: false,
              message: 'Erro ao processar resposta do servidor',
              error: error.message,
              responseText: this.responseText
            });
          }
        }
      };
      const fullUrl = environment.hosts.hostRequest + url;
      console.log('Full URL:', fullUrl);
      console.log('Method:', method);
      request.open(method, fullUrl, true);
      
      const token = Session.getValueInSession("user", "api_token");
      const userId = Session.getValueInSession("user", "idUser");
      
      console.log('Token:', token);
      console.log('User ID:', userId);
      
      if (token && token !== "undefined" && token !== "null") {
        request.setRequestHeader("token", token);
      }
      if (userId && userId !== "undefined" && userId !== "null") {
        request.setRequestHeader("userid", userId);
      }
      request.send(formData);
    });
  }

  /**
   *
   * @param url
   * @param method
   * @param formData
   * @returns {Promise<any>}
   */

  static sendRequestWithFiles(url, method = "GET", formData) {
    return new Promise((resolve) => {
      const request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          resolve(JSON.parse(this.responseText));
        }
      };
      request.open(method, environment.hosts.hostRequestApi + url, true);
      const token = Session.getValueInSession("user", "api_token");
      const userId = Session.getValueInSession("user", "idUser");
      if (token && token !== "undefined" && token !== "null") {
        request.setRequestHeader("token", token);
      }
      if (userId && userId !== "undefined" && userId !== "null") {
        request.setRequestHeader("userid", userId);
      }
      request.send(formData);
    });
  }

  static createRequest(callback, reject, timeout = 30000) {
    const request = new XMLHttpRequest();

    request.timeout = timeout;

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        //console.log(request);
        switch (request.status) {
          case 404:
          case 500:
          case 405: {
            reject(JSON.parse(this.responseText));
            break;
          }
          case 400:
          case 422: {
            callback(JSON.parse(this.responseText));
            break;
          }

          case 401: {
            ConnectionServer.sessionExpired();
            break;
          }
          case 201:
          case 200: {
            if (callback) callback(JSON.parse(this.responseText));
            break;
          }
          default: {
            let errorPayload = null;
            try {
              if (this.responseText) {
                errorPayload = JSON.parse(this.responseText);
              }
            } catch (e) {
              errorPayload = this.responseText;
            }
            if (reject) {
              if (errorPayload) {
                reject(errorPayload);
              } else if (request.status === 0) {
                reject("problemas com internet");
              } else {
                reject("Erro no servidor (" + request.status + ")");
              }
            }
          }
        }
      }
    };

    return request;
  }

  /**
   *
   * @param url
   * @param method
   * @param params
   * @param callback
   * @param reject
   * @param isStdObject
   */
  static sendRequestMain(
    url,
    method = "GET",
    params = null,
    callback = undefined,
    reject = undefined,
    isStdObject = true,
    headers = {}
  ) {
    const request = ConnectionServer.createRequest(callback, reject);

    request.open(method, environment.hosts.hostRequestApi + url);

    ConnectionServer.setAuthHeaders(request, headers);

    request.send(ConnectionServer.prepareRequest(params, isStdObject));
  }

  /**
   *
   * @param url
   * @param method
   * @param params
   * @param callback
   * @param reject
   */
  static sendRequest(
    url,
    method = "GET",
    params = null,
    callback = undefined,
    reject = undefined,
    headers = {}
  ) {
    const request = ConnectionServer.createRequest(callback, reject);

    request.open(method, ConnectionServer.Host() + url);

    ConnectionServer.setAuthHeaders(request, headers);

    request.send(ConnectionServer.prepareRequest(params, false));
  }

  /**
   * Igual a sendRequest, mas com timeout configurável — usado por endpoints
   * cujo tempo de processamento escala com o payload (ex.: lote de agendamento).
   * Método próprio (em vez de acrescentar parâmetro em sendRequest) pra não
   * colidir com chamadas existentes que já usam a posição de argumento seguinte.
   * @param url
   * @param method
   * @param params
   * @param callback
   * @param reject
   * @param timeout
   */
  static sendRequestWithTimeout(
    url,
    method = "GET",
    params = null,
    callback = undefined,
    reject = undefined,
    timeout = 30000
  ) {
    const request = ConnectionServer.createRequest(callback, reject, timeout);

    request.open(method, ConnectionServer.Host() + url);

    ConnectionServer.setAuthHeaders(request);

    request.send(ConnectionServer.prepareRequest(params, false));
  }

  /**
   *
   * @param url
   * @param method
   * @param params
   * @param callback
   * @param reject
   */
  static sendRequestByUrl(
    url,
    method = "GET",
    params = null,
    callback = undefined,
    reject = undefined,
  ) {
    const request = ConnectionServer.createRequest(callback, reject);

    request.open(method, url);

    ConnectionServer.setAuthHeaders(request);

    request.send(ConnectionServer.prepareRequest(params, false));
  }

  static prepareRequest(params, isStdObject) {
    if (!isStdObject) return JSON.stringify(params);

    if (!Array.isArray(params)) {
      params = [params];
    }
    return JSON.stringify({ stdObject: params });
  }

  static _isSessionExpiring = false;
  static sessionExpired() {
    if (ConnectionServer._isSessionExpiring) return;
    ConnectionServer._isSessionExpiring = true;
    console.warn("Session expired triggered.");
    SwalCustom.messageDialog(
      "Sessão expirada",
      "Ops",
      () => {
        Session.delete("user");
        Session.delete("centralSelected");
        Session.delete("centrals");
        localStorage.removeItem("keyAppPartner");
        location.href = "/";
      },
      "info",
    );
  }

  static sendRequestCustomer(
    url,
    method = "GET",
    params = null,
    callback = (response) => {},
    reject = () => {},
  ) {
    const request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        switch (request.status) {
          case 401: {
            ConnectionServer.sessionExpired();
            break;
          }
          case 201:
          case 200: {
            if (callback) callback(JSON.parse(this.responseText));
            break;
          }
          default: {
            let errorPayload = null;
            try {
              if (this.responseText) {
                errorPayload = JSON.parse(this.responseText);
              }
            } catch (e) {
              errorPayload = this.responseText;
            }
            if (reject) {
              if (errorPayload) {
                reject(errorPayload);
              } else if (request.status === 0) {
                reject("problemas com internet");
              } else {
                reject("Erro no servidor (" + request.status + ")");
              }
            }
          }
        }
      }
    };
    request.open(method, url);

    ConnectionServer.setAuthHeaders(request);

    request.send(ConnectionServer.prepareRequest(params, false));
  }

  static createGets(search) {
    return Object.keys(search)
      .filter((attribute) => {
        return search[attribute] !== null;
      })
      .map((attribute) => {
        return `${attribute}=${search[attribute]}`;
      })
      .join("&");
  }

  static requestApi(
    url,
    method = "GET",
    params = {},
    callback = undefined,
    reject = undefined,
  ) {
    const data = ConnectionServer.prepareData(method, params, false);

    fetch(url, data)
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        if (callback) callback(data);
      })
      .catch((error) => {
        if (reject) reject(error);
      });
  }

  static prepareData(method, params, isStdObject) {
    const headers =
      method !== "GET"
        ? {
            "Content-type": "text/plain",
            Accept: "text/plain",
          }
        : {
            "Content-type": "application/x-www-form-urlencoded",
          };

    const data = {
      method: method,
      headers: new Headers(headers),
    };

    if (method === "POST")
      data.body = ConnectionServer.prepareRequest(params, isStdObject);

    return data;
  }

  static requestApiWhatsApp(
    url,
    method = "GET",
    params = {},
    callback = undefined,
    reject = undefined,
    responseType = "json",
  ) {
    const MAIN_URL = "https://api.movymob.com/";
    let fetchOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (method !== "GET" && params) {
      fetchOptions.body = JSON.stringify(params);
    }

    fetch(MAIN_URL + url, fetchOptions)
      .then((response) => {
        if (!response.ok) {
          const errorMessage = `Erro ${response.status} ao acessar: ${
            MAIN_URL + url
          }`;
          if (reject) {
            reject(new Error(errorMessage));
          }
          return Promise.reject(new Error(errorMessage));
        }
        if (responseType === "json") {
          return response.json();
        }  
        if (responseType === "text") {
          return response.text();
        } else {
          return response;
        }
      })
      .then((data) => {
        if (callback) {
          callback(data);
        }
      })
      .catch((error) => {
        if (reject) {
          reject(error);
        } else {
          console.error("Erro na requisição:", error);
        }
      });
  }
}
