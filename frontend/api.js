import $ from 'jquery';

import { baseUrl } from './endpoints';

// ====================== Messages ==================================
// TODO some how move to models
function showGoodResponse() {
  let btn = document.getElementById("resMessage");
  btn.classList.add("show");
  setTimeout(function() {
    btn.classList.remove("show");
  }, 1000);
}
export default class Api{
  constructor(){
    const csrftoken = this._getToken("csrftoken")
    this.headers = new Headers({
      "X-CSRFToken": csrftoken,
      "Accept": "application/json",
      "Content-Type": "application/json"
    })
  }

  async create(cName, data=false) {
    const url = baseUrl + cName + '/'
    const options = {
      method: "post",
      headers: this.headers,
    }
    data ? options.body = JSON.stringify(data): null;
    console.log(options)
    console.log(data)
    await this.doFetch(url, options)
  }

  async delete(cName, id){
    const url = baseUrl + cName + '/';
    const options = {
      method: "delete",
      headers: this.headers,
      body: JSON.stringify({"id": id})
    }
    await this.doFetch(url, options)
  }


  getTemplate(url) {
    return fetch(url)
      .then(response => {
        if (this.goodResponse(respones)){
          return response.text();
        } else {
          this.manageTemplateEror()
          console.log('No template')
        }
      })
      .catch(e => {
        this.logError(e)
      });
  }

  doFetch(url, options = {}){
    return fetch(url, options)
    .then(response => {
      if (this.checkGoodStatus(response)){
        this.showGoodMessage()
        return response.json()
      } else {
        this.showBadMessage()
      }
    })
    .then(data => {
      return data
    })
    .catch(e => {
      this.logError(e)
    })
  };


  async getData(cName) {
    const url = baseUrl + cName + '/';
    return await this.doFetch(url)
  }

  checkGoodStatus(response) {
    console.log('checking stats:> ', response.status)
    return [200, 201].includes(response.status);
  }
  showBadMessage(){
    console.log('bad message')
  }

  showGoodMessage() {
    console.log('good message')
  }

  logError(e){
    console.error(e);
  }

  _getToken(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = $.trim(cookies[i]);
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

}