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


function getAllInputs () {
  return document.querySelectorAll('.form-field')
}


function getContainerName (target) {
  let container = target.closest('.form');
  if (container.dataset && container.dataset.n){
    return container.dataset.n
  } else {
    // TODO:
    // THROW EXEPSION
    return ""
  }
}


function setEventListenerOnChange(target) {
  let model = getContainerName(target);
  let typingTimer;
  target.addEventListener('keyup', function() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function(){
      updateResume(model, target)
      console.log('updated')
    }, doneTypingInterval)
  });
}

function updateResume(model, target){
  let data = {[target.name]: target.value}
  $.ajax({
      method: "PUT",
      url: `http://127.0.0.1:8000/api/v1/${model}/`,
      data: data,
      success: function(msg) {
        console.log("SUCCESS", msg)
      },
      error: function(msg) {
        console.log("ERROR", msg)
      }
   })
}


const inputs = getAllInputs()
for (var i=0; i < inputs.length; i++){
  setEventListenerOnChange(inputs[i])
}
