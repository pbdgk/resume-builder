'use strict'


function showGoodResponse(){
  btn = document.getElementById("resMessage");
  btn.classList.add('show')
  setTimeout(function() {
    btn.classList.remove('show')
  }, 1000);
}


function addField() {

  var panel = document.getElementById("info3")

  var field = document.createElement("div");
  field.classList.add('field', 'c12');

  var label = document.createElement("label");
  label.classList.add('form-label');

  var text = document.createTextNode("New");
  var inp = document.createElement("input");
  inp.classList.add('form-field');

  label.appendChild(text)
  field.appendChild(label)
  field.appendChild(inp)
  panel.appendChild(field)
}

var btn = document.getElementById("btn-upload-avatar");
btn.addEventListener("click", uploadAvatar);


function uploadAvatar(){
  let btn = document.getElementById("inp-avatar");
  btn.click();
}

var modal = document.getElementById("uploadAvatarModal");
var btn = document.getElementById("myBtn");

// TODO: remove
btn.onclick = function(){
  modal.style.display = "block";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function previewImage( input ) {
  let preview = document.getElementById('toCropImg');
  let files = input.files
  if (files && files[0]) {
    let reader = new FileReader();
    reader.addEventListener('load', function (event){
      cropper ? cropper.replace(reader.result) : preview.src = reader.result;
      modal.style.display = "block";
    }, false)
    reader.readAsDataURL(files[0]);
    }
  };


let cropper;
let image = document.getElementById('toCropImg');
image.addEventListener('load', function (event){
  cropper = new Cropper(image, {
    aspectRatio: 1 / 1,
    checkCrossOrigin: false,
    preview: ".preview-box"
  });
});


var btn = document.getElementById("jobsReq");
btn.addEventListener('click', () => {
  getData("jobs")
})

var btn = document.getElementById("schoolsReq");
btn.addEventListener('click', () => {
  getData("schools")
})

var btn = document.getElementById("skillsReq");
btn.addEventListener('click', () => {
  getData("skills")
})

function getAllInputs(element, cssSelector) {
  return element.querySelectorAll(cssSelector)
}

function registerListeners(containers){
  for (var i=0; i < containers.length; i++){
    let container = containers[i]
    const inputs = getAllInputs(container, '[data-listener]')
    let event, target;
    for (var j=0; j < inputs.length; j++){
      target = inputs[j]
      event = target.dataset && target.dataset.listener
      if (event === "changeDate") {
        onDateChange(target, updateDate, "change");
      }
      else if (event === "click") {
        onRatingChange(target, updateRating, event);
      }
      else if (event){
        onFieldChange(target, updateField, event);
      }
    }
  }
}

function getData(dataName){
  $.ajax({
      method: "GET",
      url: `http://127.0.0.1:8000/api/v1/${dataName}/`,
      success: function(data) {
        console.log("SUCCESS", data)
        render(data, dataName)
      },
      error: function(msg) {
        console.log("ERROR", msg)
      }
   })
}

function generateYearOptions(select, endYear, range){
  for (var i = 0; i <= range; i++){
      var opt = document.createElement('option');
      opt.value = endYear - i ;
      opt.innerHTML = endYear - i;
      select.appendChild(opt);
  }
}

function chooseSelect(select, value){
  let opts = select.options;
  for (var i = 0; i < opts.length; i++) {
    if (opts[i].value == value){
      opts.selectedIndex = i;
      break;
    }
  }
}

function setYearAndMonth(container, selector, part){
    let selects, dateSelects, yearOrMonth;
    selects = container.querySelectorAll(selector);
    dateSelects = {"year": selects[0], "month": selects[1]}
    for (yearOrMonth in dateSelects){
      chooseSelect(dateSelects[yearOrMonth], part[yearOrMonth])
    }
}

function parseDate(date){
  let year, month, d;
  if (date){
    d = new Date(date)
    year = d.getFullYear()
    month = d.getMonth()
  } else {
    year = "YYYY"
    month = 'MM'
  }
  return {"year": year, "month": month}
}

function setDates(jobs, selector, containers){
  for (var i=0; i < containers.length; i++){
    console.log(containers)
    let dateContainer, part, block = containers[i], job = jobs[i];
    let dateObj = {"start": parseDate(job.start), "end": parseDate(job.end)}
    for (part in dateObj){
      dateContainer = block.querySelector(`[data-prefix=${part}]`)
      setYearAndMonth(dateContainer, selector, dateObj[part])
    }
  }
}




var addJobBtn = document.getElementById("addJob")
addJobBtn.addEventListener('click', e => {
  addSection("jobs");
})

var addSchoolBtn = document.getElementById("addSchool")
addSchoolBtn.addEventListener('click', e => {
  addSection("schools");
})

var addSkillBtn = document.getElementById("addSkill")
addSkillBtn.addEventListener('click', e => {
  addSection("skills");
})
