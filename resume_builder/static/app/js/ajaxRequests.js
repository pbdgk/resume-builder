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


function setEventListenerOnChange(target, fn, event) {
  let model, many, typingTimer;
  model = getContainerName(target);
  many = checkMany(target);
  target.addEventListener(event, function() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function(){
      fn(model, target, many)
    }, doneTypingInterval)
  });
}

function updateField(model, target, many){
  let name = target.name.slice(0, -1)
  let data = {[name]: target.value}
  console.log(data)
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


// function updateResume(model, target){
//   let data = {[target.name]: target.value}
//   $.ajax({
//       method: "PUT",
//       url: `http://127.0.0.1:8000/api/v1/${model}/`,
//       data: data,
//       success: function(msg) {
//         console.log("SUCCESS", msg)
//       },
//       error: function(msg) {
//         console.log("ERROR", msg)
//       }
//    })
// }


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

getProfileData()


const profileInputs = getAllInputs('.form-field')
let event;
for (var i=0; i < profileInputs.length; i++){
  let input = profileInputs[i]
  event = input.dataset && input.dataset.listener
  if (event) {
    setEventListenerOnChange(profileInputs[i], updateField, event)
  }
}

// const jobInputs = getAllInputs('.job .form-field')
// for (var i=0; i < jobInputs.length; i++){
//   setEventListenerOnChange(jobInputs[i], updateJob)
// }

// function updateJob(model, target){
//   let data = {[target.name]: target.value}
//   console.log(model, target)
  // $.ajax({
  //     method: "PUT",
  //     url: `http://127.0.0.1:8000/api/v1/${model}/`,
  //     data: data,
  //     success: function(msg) {
  //       console.log("SUCCESS", msg)
  //     },
  //     error: function(msg) {
  //       console.log("ERROR", msg)
  //     }
   // })
// }

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

// getJobData()
