class BaseListener {
  constructor(container, cName) {
    this.container = container;
    this.cName = cName;
  }
  getPriority(target) {
    let container = target.closest("section");
    return container.dataset && container.dataset.num;
  }
}

export class RatingChangeListener extends BaseListener {
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

export class DateChangeListener extends BaseListener {
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

export class FieldChangeListener extends BaseListener {
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

export class ImageChangeListener extends BaseListener {
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