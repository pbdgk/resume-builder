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
  console.log(preview)
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
// let preview = document.getElementById('previewBox');
image.addEventListener('load', function (event){
  cropper = new Cropper(image, {
    aspectRatio: 4 / 5,
    checkCrossOrigin: false,
    preview: ".preview-box"
  });
});
