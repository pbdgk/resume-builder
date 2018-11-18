"use strict";

const EMAIL_RE_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const GITHUB_RE_PATTERN = /^https?:\/\/github\.com/;
// ====================== CSRF token and headers =====================
const csrftoken = getCookie("csrftoken");
const myHeaders = new Headers({
  "X-CSRFToken": csrftoken,
  "Accept": "application/json",
  "Content-Type": "application/json"
});

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// ====================== Messages ==================================
// TODO some how move to models
function showGoodResponse() {
  let btn = document.getElementById("resMessage");
  btn.classList.add("show");
  setTimeout(function() {
    btn.classList.remove("show");
  }, 1000);
}

// ====================== cropper init ==================================

// ====================== Renderers ==================================

class BaseRenderer {
  render() {
    this.rememberContainer();
    let url = `/static/app/mst/${this.cName}.mst`;
    let promise = getTemplate(url);
    for (let i = 0; i < this.methods.length; i++) {
      promise = promise.then(this.methods[i].bind(this));
    }
    promise.catch(e => {
      console.error(e);
    });
  }
  registerListeners() {
    const len = this.listeners.length;
    for (let i = 0; i < len; i++) {
      let listener = new this.listeners[i](this.container, this.cName);
      listener.listen();
    }
  }

  rememberContainer() {
    this.container = document.getElementById("content");
  }
}

class SingleRenderer extends BaseRenderer {
  renderTemplate(template) {
    var rendered = Mustache.render(template, this.data);
    $("#content").html(rendered);
  }
}

class MultipleRenderer extends BaseRenderer {
  renderTemplate(template) {
    var rendered = Mustache.render(template, { [this.cName]: this.data });
    $("#content").html(rendered);
  }
}

class WithDatesRenderer extends MultipleRenderer {
  manageDateFields() {
    let selects = this.container.querySelectorAll(
      "select[data-date-part=year]"
    );
    for (let i = 0; i < selects.length; i++) {
      this.populateYearOptions(selects[i], 50);
    }
    this.setDates();
  }

  populateYearOptions(select, range) {
    let currentYear = new Date().getFullYear();
    for (let i = 0; i <= range; i++) {
      let opt = document.createElement("option");
      opt.value = currentYear - i;
      opt.innerHTML = currentYear - i;
      select.appendChild(opt);
    }
  }

  setDates() {
    let containers = this.container.querySelectorAll("section");
    let dateContainer, data, section;
    for (let i = 0; i < containers.length; i++) {
      (dateContainer = containers[i]), (data = this.data[i]);
      let dateObj = {
        start: this.parseDate(data.start),
        end: this.parseDate(data.end)
      };
      for (let datePrefix in dateObj) {
        for (let datePart in dateObj[datePrefix]) {
          this.setYearAndMonth(
            dateContainer,
            datePrefix,
            datePart,
            dateObj[datePrefix][datePart]
          );
        }
      }
    }
  }

  setYearAndMonth(dateContainer, datePrefix, datePart, data) {
    let block, select;
    block = dateContainer.querySelector(`[data-prefix=${datePrefix}]`);
    select = block.querySelector(`[data-date-part=${datePart}]`);
    this.chooseSelect(select, data);
  }

  parseDate(date) {
    let year, month, d;
    if (date) {
      d = new Date(date);
      year = d.getFullYear();
      month = d.getMonth();
    } else {
      year = "YYYY";
      month = "MM";
    }
    return { year: year, month: month };
  }

  chooseSelect(select, value) {
    let opts = select.options;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value == value) {
        opts.selectedIndex = i;
        break;
      }
    }
  }
}

class WithRatingsRenderer extends MultipleRenderer {
  manageRatingFields() {
    let containers = document.getElementsByClassName("rating-stars");
    for (let i = 0; i < containers.length; i++) {
      this.setStar(containers[i], this.data[i].rating);
    }
  }

  setStar(container, rating) {
    let onStar = parseInt(rating, 10);
    let stars = container.querySelectorAll(".star");
    let i;
    for (i = 0; i < stars.length; i++) {
      stars[i].classList.remove("selected");
    }
    for (i = 0; i < onStar; i++) {
      stars[i].classList.add("selected");
    }
  }
}

class ProfileRenderer extends SingleRenderer {
  constructor(data, cName, listeners) {
    super();
    this.data = data;
    this.cName = cName;
    this.listeners = listeners;
    this.methods = [
      this.renderTemplate,
      this.setAvatar,
      this.registerListeners
    ];
  }

  setAvatar() {
    let photoBox = document.querySelector(".avatar");
    photoBox.style.backgroundImage = `url(${this.data.photo})`;
  }
}

class SummaryRenderer extends SingleRenderer {
  constructor(data, cName, listeners) {
    super();
    this.data = data;
    this.cName = cName;
    this.listeners = listeners;
    this.methods = [
      this.renderTemplate,
      this.registerListeners
    ];
  }
}

class SocialRenderer extends MultipleRenderer {
  constructor(data, cName, listeners) {
    super();
    this.data = data;
    this.cName = cName;
    this.listeners = listeners;
    this.methods = [
      this.renderTemplate,
      this.registerListeners
    ];
  }
  renderTemplate(template) {
    var rendered = Mustache.render(template, {...this.data});
    $("#content").html(rendered);
  }
}

class JobRenderer extends WithDatesRenderer {
  constructor(data, cName, listeners) {
    super();
    this.data = data;
    this.cName = cName;
    this.listeners = listeners;
    this.methods = [
      this.renderTemplate,
      this.manageDateFields,
      this.registerListeners
    ];
  }
}

class SchoolRenderer extends WithDatesRenderer {
  constructor(data, cName, listeners) {
    super();
    this.data = data;
    this.cName = cName;
    this.listeners = listeners;
    this.methods = [
      this.renderTemplate,
      this.manageDateFields,
      this.registerListeners
    ];
  }
}

class SkillRenderer extends WithRatingsRenderer {
  constructor(data, cName, listeners) {
    super();
    this.data = data;
    this.cName = cName;
    this.listeners = listeners;
    this.methods = [
      this.renderTemplate,
      this.manageRatingFields,
      this.registerListeners
    ];
  }
}

// ====================== Change Listeners =============================

class BaseChangeListener {
  constructor(container, cName) {
    this.container = container;
    this.cName = cName;
  }
  getPriority(target) {
    let container = target.closest("section");
    return container.dataset && container.dataset.num;
  }
}

class RatingChangeListener extends BaseChangeListener {
  listen() {
    let ratings = document.getElementsByClassName("star");
    for (let i = 0; i < ratings.length; i++) {
      let rating = ratings[i];
      this.listenRating(rating);
    }
  }

  listenRating(target) {
    target.addEventListener("mouseover", () => {
      let onStar, stars;
      onStar = parseInt(target.dataset.rating, 10);
      stars = target.parentNode.children;
      for (let i = 0; i < stars.length; i++) {
        if (i < onStar) {
          stars[i].classList.add("hover");
        } else {
          stars[i].classList.remove("hover");
        }
      }
    });

    target.addEventListener("mouseout", () => {
      let stars;
      stars = target.parentNode.children;
      for (let i = 0; i < stars.length; i++) {
        stars[i].classList.remove("hover");
      }
    });

    target.addEventListener("click", () => {
      //select star
      let onStar = parseInt(target.dataset.rating, 10);
      let stars = target.parentNode.children;
      let i;
      for (i = 0; i < stars.length; i++) {
        stars[i].classList.remove("selected");
      }
      for (i = 0; i < onStar; i++) {
        stars[i].classList.add("selected");
      }
      // update rating
      let url, many, rating, data;
      url = `http://127.0.0.1:8000/api/v1/${this.cName}/`;
      many = this.getPriority(target);
      rating = target.dataset && target.dataset.rating;
      data = {
        rating: rating,
        priority: many
      };
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: myHeaders
      })
        .then(response => {
          if (response.status !== 200) {
            console.log("error", response.status);
          } else {
            showGoodResponse();
            console.log("SUCCESS");
          }
        })
        .catch(e => {
          console.log(e.message);
        });
    });
  }
}

class DateChangeListener extends BaseChangeListener {
  getDatePrefix(target) {
    let container = target.closest("[data-prefix]");
    return container.dataset.prefix;
  }

  listen() {
    let selects = this.container.getElementsByTagName("select");
    for (let i = 0; i < selects.length; i++) {
      let select = selects[i];
      select.addEventListener("change", () => {
        this.updateDate(this.cName, select);
      });
    }
  }

  updateDate(model, target) {
    let data, url;
    url = `http://127.0.0.1:8000/api/v1/${model}/`;
    data = {
      [target.dataset.datePart]: target.value,
      priority: this.getPriority(target),
      prefix: this.getDatePrefix(target)
    };
    fetch(url, {
      method: "PUT",
      body: data,
      headers: myHeaders
    })
      .then(response => {
        if (response.status !== 200) {
          console.log("error", response.status);
        } else {
          showGoodResponse();
          console.log("SUCCESS");
        }
      })
      .catch(e => {
        console.log(e.message);
      });
  }
}

class FieldChangeListener extends BaseChangeListener {
  // TODO maybe should remove all this ids
  listen() {
    let fields = this.container.getElementsByClassName("form-field");
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      field.addEventListener("keyup", () => {
        this.updateField(field);
      });
    }
  }

  updateField(target) {
    let data, many;
    many = this.getPriority(target);
    if (many) {
      data = { [target.name]: target.value, priority: many };
    } else {
      data = { [target.name]: target.value };
    }
    let url = `http://127.0.0.1:8000/api/v1/${this.cName}/`;
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: myHeaders
    })
      .then(response => {
        if (response.status !== 200) {
          console.log("error", response.message);
        } else {
          console.log("Good");
          showGoodResponse();
        }
      })
      .catch(e => {
        console.log(e.message);
      });
  }
}

class ImageChangeListener extends BaseChangeListener {
  constructor(...args) {
    super(args);
    this.image = document.getElementById("toCropImg");
    this.reader = new FileReader();
  }

  listen() {
    this.onLoadImage();
    this.onHideModal();
    let btn = document.getElementById("btn-upload-avatar");
    btn.addEventListener("click", () => {
      this.uploadAvatar();
    });
    let inp = document.getElementById("inp-avatar");
    let save = document.getElementById("save");
    save.addEventListener("click", () => {
      this.cropper.getCroppedCanvas().toBlob(blob => {
        const formData = new FormData();
        formData.append("image", blob, inp.files[0].name);
        let headers = new Headers({
          "X-CSRFToken": csrftoken,
          Accept: "application/json"
        });
        fetch("/api/v1/photos/", {
          method: "PUT",
          body: formData,
          headers: headers
        })
          .then(response => {
            return response.json();
          })
          .then(url => {
            let avatar = document.querySelector(".avatar");
            avatar.style.backgroundImage = `url(${url.image})`;
          })
          .catch(e => {
            console.log(e.message);
          });
      }, inp.files[0].type);
    });
  }

  uploadAvatar() {
    let btn = document.getElementById("inp-avatar");
    btn.click();
  }

  initCropperInstance() {
    const image = this.image;
    this.cropper = new Cropper(image, {
      aspectRatio: 1 / 1,
      checkCrossOrigin: false,
      preview: ".preview-box"
    });
  }

  hideModal(event) {
    const modal = document.getElementById("uploadAvatarModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  onHideModal() {
    window.addEventListener("click", this.hideModal);
  }

  onLoadImage() {
    let btn = document.getElementById("inp-avatar");
    btn.addEventListener("change", e => {
      let file = e.target.files && e.target.files[0];
      const modal = document.getElementById("uploadAvatarModal");
      modal.style.display = "block";
      this.reader.onloadend = () => {
        if (this.cropper) {
          this.cropper.replace(this.reader.result);
        } else {
          this.image.src = this.reader.result;
          this.initCropperInstance();
        }
      };
      if (file) {
        this.reader.readAsDataURL(file);
      }
    });
  }
}

// ====================== Entry =============================

// TODO check response
function getTemplate(url) {
  return fetch(url)
    .then(response => {
      return response.text();
    })
    .catch(e => {
      console.log(e);
    });
}

// const gh = {
//   label: 'Github',
//   value: '',
//   field_type: 'text',
//   fa_image_class: "fab fa-github",
//   field_name: 'github',
//   priority: 0,
//   validate: function(){
//     return this.value
//       ? this.value.match(GITHUB_RE_PATTERN)
//       : true
//   }
// }

// const SOCIALS = {
//   'Github': gh,
// }



// let github = (target) => {
//   const label = target.childNodes[3].dataset.label
//   const social = SOCIALS[label]
//   addSocial(social)
// }


// function addSocial(target) {
//   const url = `http://127.0.0.1:8000/api/v1/socials/`;
//   fetch(url, {
//     method: "POST",
//     headers: myHeaders,
//     body: JSON.stringify(target)
//   })
//   .then(response => {
//     return response.json()
//   })
//   .catch(e => {
//     console.log(e.message)
//   })
// }


class Page{

  getData(){
  let url = `http://127.0.0.1:8000/api/v1/${this.cName}/`;
  return fetch(url)
    .then(response => {
      return response.json();
    })
    .catch(e => {
      console.log(e.message);
    });
  }
  async render() {
    const data = await this.getData()
    try {
      const renderer = new this.renderer(data, this.cName, this.listeners)
      renderer.render()
    } catch (e){
      console.log(e)
    }
  }

  animate(){
    this.activeNavLink();
  }

  activeNavLink() {
    const navLinks = document.querySelectorAll('.nav-panel a')
    let currentLink;
    navLinks.forEach(link => {
      link.classList.remove('active-nav-link')
      if (link.dataset.route == this.cName) {
        currentLink = link;
      }
    })
    currentLink && currentLink.classList.add('active-nav-link') 
  }
}

class MainPage extends Page {
  constructor() {
    super();
    this.cName = 'profiles'
    this.renderer = ProfileRenderer
    this.listeners = [FieldChangeListener, ImageChangeListener]
  }
}

class SocialsPage extends Page {
  constructor() {
    super();
    this.cName = 'socials'
    this.renderer = SocialRenderer
    this.listeners = [FieldChangeListener]
  }
}

class SummaryPage extends Page {
  constructor() {
    super();
    this.cName = 'summaries'
    this.renderer = SummaryRenderer
    this.listeners = [FieldChangeListener]
  }
}

class ExperiencePage extends Page {
  constructor() {
    super();
    this.cName = 'jobs'
    this.renderer = JobRenderer
    this.listeners = [FieldChangeListener, DateChangeListener]
  }
}

class EducationPage extends Page {
  constructor() {
    super();
    this.cName = 'schools'
    this.renderer = SchoolRenderer
    this.listeners = [FieldChangeListener, DateChangeListener]
  }
}

class SkillPage extends Page {
  constructor() {
    super();
    this.cName = 'skills'
    this.renderer = SkillRenderer
    this.listeners = [FieldChangeListener, RatingChangeListener]
  }
}

const pages = {
  'profile/': MainPage,
  'socials/': SocialsPage,
  'summary/': SummaryPage,
  'experience/': ExperiencePage,
  'education/': EducationPage,
  'skills/': SkillPage
}

const router = new Navigo('/app/', true);

Object.keys(pages).forEach(url => {
  router.on({[url]: function() {
    let page = new pages[url]();
    page.render();
    page.animate();
  }})
  .resolve()
})


router.notFound(function () {
  router.navigate('profile')
});
