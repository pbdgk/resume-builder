"use strict";

const PAGE_MARGIN_BOTTOM = 30;
const PAGE_OFFSET_BOTTOM = 30;

const csrftoken = getCookie("csrftoken");
const myHeaders = new Headers({
  "X-CSRFToken": csrftoken,
  Accept: "application/json",
  "Content-Type": "application/json"
});

function showFile(blob){
  // It is necessary to create a new blob object with mime-type explicitly set
  // otherwise only Chrome works like it should
  var newBlob = new Blob([blob], {type: "application/pdf"})
  // // IE doesn't allow using a blob object directly as link href
  // // instead it is necessary to use msSaveOrOpenBlob
  // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
  //   window.navigator.msSaveOrOpenBlob(newBlob);
  //   return;
  // }

 
  // For other browsers: 
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(newBlob);
  const link = document.getElementById('downl')
  link.href = data;
  // link.download="file.pdf";
  link.click();
  setTimeout(function(){ 
    window.URL.revokeObjectURL(data)
  }, 100)
}
 

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

function send(e) {
  let t = document.documentElement.innerHTML;
  const url = "http://127.0.0.1:8000/api/v1/download/";
  fetch(url, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(t)
  })
    .then(response => {
      return response.blob()
      
    })
    .then(showFile)
    .catch(e => {
      console.log(e);
    });
}

class Builder {
  constructor(doc) {
    this.doc = doc;
    this.container = document.querySelector(".page-container");
  }

  // for TEST PURPOSES;
  renderSpace(h) {
    const child = this.createNode("div");
    child.style.height = h + "px";
    child.style.width = "100%";
    child.style.backgroundColor = "blue";
    console.log(child);
    this.currentPage.appendChild(child);
  }

  build() {
    this.createPage();
    this.buildFirstSection();
    this.buildSummary();
    this.buildExperience();
    this.buildEducation();
    this.buildSkills();
  }

  createPage() {
    const page = this.createNode("div", "page");
    this.container.appendChild(page);
    this.currentPage = page;
  }

  buildFirstSection() {
    this.createEntry();
    const title = this.createNode("div", ["title-col", "first-line-col"]);
    this.currentSection.appendChild(title);
    const { profile, img, socials } = this.doc;

    this.buildHeader(profile, title);
    this.buildSocials(socials, title);
    this.buildPhotoSection(img, this.currentSection);
  }

  buildHeader(profile, parent) {
    const inner = this.createNode("div", "cRow-inner");
    parent.appendChild(inner);

    const h1 = this.createNode("h1");
    const h2 = this.createNode("h2");

    h1.innerHTML = `${profile.first_name} ${profile.last_name}`;
    h2.innerHTML = profile.profession;
    inner.appendChild(h1);
    inner.appendChild(h2);
  }

  buildSocials(socials, parent) {
    const innerSocial = this.createNode("div", "cRow-inner");
    for (let group in socials) {
      const container = this.createNode("div", ["cCol-inner", "content"]);
      for (let i = 0; i < socials[group].length; i++) {
        let social = socials[group][i];
        const div = this.createNode("div");
        const strong = this.createNode("strong");
        strong.innerHTML = social.label;
        const span = this.createNode("span");
        span.innerText = social.text;
        div.appendChild(strong);
        div.appendChild(span);
        container.appendChild(div);
      }
      innerSocial.appendChild(container);
    }
    parent.appendChild(innerSocial);
  }

  buildPhotoSection(img, parent) {
    const imageContainer = this.createNode("div", [
      "image-col",
      "first-line-col"
    ]);
    const iContainer = this.createNode("div", "iContainer");
    const figure = this.createNode("figure");
    const imgblock = this.createNode("img");

    figure.appendChild(imgblock);
    iContainer.appendChild(figure);
    imageContainer.appendChild(iContainer);

    this.getBase64ImageFromUrl(img.image)
      .then(result => {
        imgblock.src = result;
        parent.appendChild(imageContainer);
      })
      .catch(err => console.error(err));
  }

  buildSummary() {
    const summary_text = this.doc.summary.text;
    this.createEntry();
    this.createContentContainer();
    const ps = this.textToParagraphs(summary_text);
    for (let p of ps) {
      this.currentContent.appendChild(p);
      if (this.checkEndOfPage(p)) {
        this.manageParapraphWrap(p);
      }
    }
  }

  buildExperience() {
    const exp = this.doc.exp;
    this.createTitleEntry("Experience");
    for (let i = 0; i < exp.length; i++) {
      let job = exp[i];
      this.renderJob(job);
    }
  }

  renderJob(job) {
    this.createContentContainer();
    this.createDateEntry(job);
    this.createSubjectEntry(job.position);
    this.createSubTitleEntry(job);
    this.createParagraphsEntry(job.experience);
  }

  buildEducation() {
    const schools = this.doc.edu;
    this.createTitleEntry("Education");
    for (let i = 0; i < schools.length; i++) {
      let school = schools[i];
      this.renderSchool(school);
    }
  }

  renderSchool(school) {
    this.createContentContainer();
    this.createDateEntry(school);
    this.createSubjectEntry(school.name);
    this.createParagraphsEntry(school.description);
  }

  buildSkills() {
    const skills = this.doc.skills;
    this.createTitleEntry("Skills");
    for (let i = 0; i < skills.length; i++) {
      let skill = skills[i];
      this.renderSkill(skill);
    }
  }

  renderSkill(skill) {
    this.createContentContainer();
    this.createRatingEntry(skill);
  }

  createEntry() {
    const row = this.createSectionFrame();
    this.currentPage.appendChild(row);
    this.currentSection = row.children[0];
  }

  createTitleEntry(name) {
    this.createEntry();
    const title = this.createNode("div", "title");
    this.currentSection.appendChild(title);
    title.innerHTML = name;
    if (this.checkEndOfPage(this.currentSection)) {
      this.currentPage = this.createPage();
      this.removeTo(this.currentSection.parentNode, this.currentPage);
    }
  }

  createContentContainer() {
    const col = this.createNode("div", "col");
    this.currentSection.appendChild(col);
    const content = this.createNode("div", "content");
    col.appendChild(content);
    this.currentContent = content;
  }

  createDateEntry(obj) {
    const dates = this.createNode("div", ["dates", "inline-b"]);
    const dateFrom = this.createNode("span", "date-from");
    const dateTo = this.createNode("span", "date-to");
    this.currentContent.appendChild(dates);
    dates.appendChild(dateFrom);
    dates.appendChild(dateTo);
    dateFrom.innerHTML = obj.start;
    dateTo.innerHTML = obj.end;
    console.log(this.currentSection, this.currentContent, this.currentSubject);

    if (this.checkEndOfPage(this.currentContent)) {
      this.manageContentContainerWrap(this.currentContent);
    }
  }

  createSubjectEntry(data) {
    const subject = this.createNode("div", ["subject", "inline-b"]);
    this.currentSubject = subject;
    this.currentContent.appendChild(subject);
    const name = this.createNode("h5");
    subject.appendChild(name);
    name.innerHTML = data;
    if (this.checkEndOfPage(this.currentContent)) {
      this.manageContentContainerWrap(this.currentContent);
    }
  }

  createWrappedSubjectEntry() {
    // TODO: mb change subject-wrapper to left-offset, also add it to raigin-row
    this.currentSubject = this.createNode("div", [
      "subject",
      "subject-wrapped",
      "inline-b"
    ]);
    this.currentContent.appendChild(this.currentSubject);
  }

  createSubTitleEntry(obj) {
    const companyTitle = this.createNode("p", "subtitle");
    companyTitle.innerHTML = obj.company;
    this.currentSubject.appendChild(companyTitle);
    if (this.checkEndOfPage(companyTitle)) {
      return this.manageSubjectWrap(companyTitle);
    }
  }

  createParagraphsEntry(data) {
    const ps = this.textToParagraphs(data);
    for (let p of ps) {
      this.currentSubject.appendChild(p);
      if (this.checkEndOfPage(this.currentSubject)) {
        this.manageSubjectWrap(p);
      }
    }
  }
  createRatingEntry(skill) {
    const ratingRow = this.createNode("div", "subject-rating-row");
    const skillName = this.createNode("p");
    const ratingCircle = this.createNode("div", "rating-circle");

    this.currentContent.appendChild(ratingRow);
    ratingRow.appendChild(skillName);
    ratingRow.appendChild(ratingCircle);

    skillName.innerHTML = skill.name;
    for (let i = 0; i < 5; i++) {
      let circle = this.createNode("div");
      ratingCircle.appendChild(circle);
    }
    if (this.checkEndOfPage(this.currentContent)) {
      this.manageContentContainerWrap(this.currentContent);
    }
  }

  manageContentContainerWrap() {
    this.createPage();
    this.createEntry();
    this.removeTo(this.currentContent, this.currentSection);
  }

  manageSubjectWrap(el) {
    this.createPage();
    this.createEntry();
    this.createContentContainer();
    this.createWrappedSubjectEntry();
    this.removeTo(el, this.currentSubject);
  }

  manageParapraphWrap(p) {
    this.createPage();
    this.createEntry();
    this.createContentContainer();
    this.removeTo(p, this.currentContent);
  }

  checkEndOfPage(element) {
    const lastPage = this.currentPage;
    const y_page =
      lastPage.getBoundingClientRect().bottom -
      PAGE_MARGIN_BOTTOM -
      PAGE_OFFSET_BOTTOM;
    const y_element = element.getBoundingClientRect().bottom;
    return y_element > y_page;
  }

  createNode(name, cls) {
    const el = document.createElement(name);
    if (cls === undefined) {
      return el;
    }
    cls && Array.isArray(cls)
      ? el.classList.add(...cls)
      : el.classList.add(cls);
    return el;
  }

  createSectionFrame() {
    const row = this.createNode("div", "row");
    const section = this.createNode("div", "section");
    row.appendChild(section);
    return row;
  }

  textToParagraphs(text) {
    const paragraphs = [];
    const pArr = text.split("\n");
    for (let i = 0; i < pArr.length; i++) {
      let p = this.createNode("p");
      p.innerHTML = pArr[i];
      paragraphs.push(p);
    }
    return paragraphs;
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        "load",
        function() {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

  removeTo(el, parent) {
    el.remove();
    parent.appendChild(el);
  }
}

getData("doc").then(doc => {
  try {
    const builder = new Builder(doc);
    builder.build();
  } catch (err) {
    console.error(err);
  }
});

function getData(cName) {
  let url = `http://127.0.0.1:8000/api/v1/${cName}/`;
  return fetch(url)
    .then(response => {
      console.log(response);
      return response.json();
    })
    .catch(e => {
      console.log(e.message);
    });
}
