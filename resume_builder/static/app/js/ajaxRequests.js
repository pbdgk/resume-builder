'use strict'

const doneTypingInterval = 1500;
const csrftoken = getCookie('csrftoken');

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

function getAllInputs(cssSelector) {
  return document.querySelectorAll(cssSelector)
}

function getContainerName(target){
  let container = target.closest('.form');
  if (container.dataset && container.dataset.n){
    return container.dataset.n
  } else {
    // TODO:
    // THROW EXEPSION
    return ""
  }
}

function checkMany(target){
  let container = target.closest('section')
  return container.dataset && container.dataset.num;

}


function listen(target, fn, event, argumentsToApply){
  let typingTimer;
  target.addEventListener(event, function(){
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function(){
      fn.apply(null, argumentsToApply);
    }, doneTypingInterval)
  });

}

function onDateChange(target, fn, event){
  let model, prefix, selects;
  model = getContainerName(target);
  prefix = target.dataset && target.dataset.prefix
  if (!prefix) {
    throw new Error
  }
  selects = target.getElementsByTagName('select')
  for (var i=0; i<selects.length; i++){
    listen(selects[i], fn, event, [model, target, selects]);
  }
}

function onFieldChange(target, fn, event) {
  let model, many;
  model = getContainerName(target);
  listen(target, fn, event, [model, target])
}

function updateDate(model, target, selects){
  let many = checkMany(target);
  let url = `http://127.0.0.1:8000/api/v1/${model}/`;
  url = many ? url + `${many}/` : url
  console.log(url)
  let data, date, prefix;
  prefix = target.dataset.prefix;
  date = {
    [selects[0].dataset.datePart]: selects[0].value,
    [selects[1].dataset.datePart]: selects[1].value,
  };
  date = new Date(date.year, date.month)
  data = {[prefix]: date}
  $.ajax({
    method: "PUT",
    url: url,
    data: data,
    success: function(msg) {
      console.log("SUCCESS", msg)
    },
    error: function(msg) {
      console.log("ERROR", msg)
    }
  })
}

function updateField(model, target){
  let many = checkMany(target);
  let name = many ? target.name.slice(0, -1) : target.name
  let data = {[name]: target.value}
  let url = `http://127.0.0.1:8000/api/v1/${model}/`
  url = many ? url + `${many}/` : url
  $.ajax({
    method: "PUT",
    url: url,
    data: data,
    success: function(msg) {
      console.log("SUCCESS", msg)
    },
    error: function(msg) {
      console.log("ERROR", msg)
    }
  })
}


function getProfileData(){
  $.ajax({
      method: "GET",
      url: `http://127.0.0.1:8000/api/v1/profile/`,
      success: function(msg) {
        console.log("SUCCESS", msg)
        let pairs = Object.entries(msg)
        console.log(pairs)
        for (var i=0; i < pairs.length; i++){
          let key = pairs[i][0]
          let value = pairs[i][1]
          let inp = document.querySelector(`[name="${key}"]`)
          inp.value = value;
        }
      },
      error: function(msg) {
        console.log("ERROR", msg)
      }
   })
}

function getJobData(){
  $.ajax({
      method: "GET",
      url: `http://127.0.0.1:8000/api/v1/jobs/`,
      success: function(msg) {
        console.log("SUCCESS", msg)
        // let pairs = Object.entries(msg)
        // console.log(pairs)
        // for (var i=0; i < pairs.length; i++){
        //   let key = pairs[i][0]
        //   let value = pairs[i][1]
        //   let inp = document.querySelector(`[name="${key}"]`)
        //   inp.value = value;
        // }

      },
      error: function(msg) {
        console.log("ERROR", msg)
      }
   })
}

getProfileData()

// getJobData()


const profileInputs = getAllInputs('[data-listener]')
let event;
for (var i=0; i < profileInputs.length; i++){
  let target = profileInputs[i]
  event = target.dataset && target.dataset.listener
  if (event === "changeDate") {
    onDateChange(target, updateDate, "change");
  }
  else if (event) {
    onFieldChange(target, updateField, event);
  }
}
