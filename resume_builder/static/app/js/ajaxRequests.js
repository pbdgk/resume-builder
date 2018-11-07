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

function getContainerName(target){
  let container = target.closest('.panel');
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


function listenRating(target, fn, event, model){
  target.addEventListener('mouseover', function(){
    listenOnHoverStar(this);
  });
  target.addEventListener('mouseout', function(){
    listenOnMouseOut(this);
  });
  target.addEventListener(event, function(){
    selectStar(this);
    updateRating(model, this);
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
  let model = getContainerName(target);
  listen(target, fn, event, [model, target])
}

function onRatingChange(target, fn, event) {
  let model = getContainerName(target)
  // starR()
  listenRating(target, fn, event, model)
}

function updateRating(model, target){
  let url, many, rating, data
  url = `http://127.0.0.1:8000/api/v1/${model}/`;
  many = checkMany(target)
  rating = target.dataset && target.dataset.rating
  data = {
    rating: rating,
    priority: many
  }
  $.ajax({
    method: "PUT",
    url: url,
    data: data,
    success: function(msg) {
      showGoodResponse()
      console.log("SUCCESS", msg)
    },
    error: function(msg) {
      console.log("ERROR", msg)
    }
  })
}

function updateDate(model, target, selects){
  let data, date, prefix, many, url;
  many = checkMany(target);
  url = `http://127.0.0.1:8000/api/v1/${model}/`;
  prefix = target.dataset.prefix;
  date = {
    [selects[0].dataset.datePart]: selects[0].value,
    [selects[1].dataset.datePart]: selects[1].value,
  };
  date = new Date(date.year, date.month);
  // Not the best way, but seems that js don't have strftime method.
  // It's better than include one of date libraries.
  let datestring = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  if (many){
    data = {[prefix]: datestring, 'priority': many}
  } else {
    data = {[prefix]: datestring}
  }
  $.ajax({
    method: "PUT",
    url: url,
    data: data,
    success: function(msg) {
      showGoodResponse()
      console.log("SUCCESS", msg)
    },
    error: function(msg) {
      console.log("ERROR", msg)
    }
  })
}

function updateField(model, target){
  let data, many;
  many = checkMany(target);
  if (many){
    data = {[target.name]: target.value, 'priority': many}
  } else {
    data = {[target.name]: target.value}
  }
  let url = `http://127.0.0.1:8000/api/v1/${model}/`
  $.ajax({
    method: "PUT",
    url: url,
    data: data,
    success: function(msg) {
      showGoodResponse()
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

function addSection(type){
  $.ajax({
      method: "POST",
      url: `http://127.0.0.1:8000/api/v1/${type}/`,
      success: function(msg) {
        console.log("SUCCESS", msg)
        getData(type)
      },
      error: function(msg) {console.log("ERROR", msg)}
   });
};

function deleteSection(target, type){
  let container = target.closest('.panel');
  let priority = container.dataset && container.dataset.num
  $.ajax({
      method: "DELETE",
      url: `http://127.0.0.1:8000/api/v1/${type}/`,
      data: {"priority": priority},
      success: function(data) {
        console.log("SUCCESS", data)
        getData(type)
      },
      error: function(msg) {console.log("ERROR", msg)}
   })
}


// getProfileData()
