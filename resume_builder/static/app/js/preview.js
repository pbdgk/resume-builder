"use strict";

const PAGE_MARGIN_BOTTOM = 30;
const PAGE_OFFSET_BOTTOM = 30;

const csrftoken = getCookie("csrftoken");
const myHeaders = new Headers({
  "X-CSRFToken": csrftoken,
  Accept: "application/json",
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


function ContentContainerWrapException(value) {
   this.section = value;
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
      console.log(response.status);
    })
    .catch(e => {
      console.log(e);
    });
}

class Builder {
  constructor(doc) {
    this.doc = doc;
    this.pages = [];
    this.container = document.querySelector(".page-container");
  }

  build() {
    this.createPage();
    this.buildFirstSection();
    this.buildSummary();
    this.buildSummary();
    this.buildSummary();
    this.buildSummary();
    this.buildSkills();
    this.buildSkills();
    this.buildSkills();
    this.buildSummary();
    this.buildExperience();
    this.buildSkills();
  }

  createPage() {
    const page = this.createNode("div", "page");
    this.pages.push(page);
    this.container.appendChild(page);
    return page;
  }

  buildFirstSection() {
    const section = this.createEntry()
    const title = this.createNode("div", ["title-col", "first-line-col"]);
    section.appendChild(title);
    const { profile, img, socials } = this.doc;

    this.buildHeader(profile, title)
    this.buildSocials(socials, title);
    this.buildPhotoSection(img, section)
  }

  buildHeader(profile, parent){
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

  buildPhotoSection(img, parent){
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
        parent.appendChild(imageContainer)
      })
      .catch(err => console.error(err));
  }
  
  buildSummary() {
    let section = this.createEntry();
    let contentContainer = this.createDataContainer(section);
    const ps = this.textToParagraphs(this.doc.summary.text);
    for (let p of ps) {
      contentContainer.appendChild(p);
      if (this.checkEndOfPage(p)){
        contentContainer = this.manageParapraphWrap(p)
      }
    }
  }

  buildEducation() {
    const edu = this.doc.edu;
    let section = this.createTitleEntry("Education");
    for (let i = 0; i < edu.length; i++) {
      let school = edu[i];

      let contentContainer = this.createDataContainer(section);
      
      this.createDateEntry(contentContainer, school.start, school.end)

      let subject = this.createSubjectEntry(contentContainer, school.name);

      const ps = this.textToParagraphs(school.description);
      for (let p of ps) {
        subject.appendChild(p);
        if (this.checkEndOfPage(subject)) {
          subject = this.manageSubjectWrap(p);
        }
      }
    }
  }

  buildExperience() {
    const exp = this.doc.exp;
    let section = this.createTitleEntry("Experience");
    for (let i = 0; i < exp.length; i++) {
      let job = exp[i];

      let contentContainer = this.createDataContainer(section);

      try {
        this.createDateEntry(contentContainer, job.start, job.end);
      } catch (err) {
        section = err.section;
      }
      let subject;
      try {
        subject = this.createSubjectEntry(contentContainer, job.position);
      } catch (err) {
        section  = err.section;
        subject = err.subject;
      }
      subject = this.createSubTitleEntry(subject, job.company)
      console.log('sibj', subject)
      const ps = this.textToParagraphs(job.experience);
      for (let p of ps) {
        subject.appendChild(p);
        if (this.checkEndOfPage(subject)) {
          subject = this.manageSubjectWrap(p);
        }
      }
    }
  }

  buildSkills() {
    const skills = this.doc.skills;
    let section = this.createTitleEntry("Skills");
    for (let i = 0; i < skills.length; i++) {
      let skill = skills[i];
      const contentContainer = this.createDataContainer(section);
      this.createRatingEntry(contentContainer, skill);
      if (this.checkEndOfPage(contentContainer)) {
        this.manageContentContainerWrap(contentContainer)
      }
    }
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

  createSectionSkillet() {
    const row = this.createNode("div", "row");
    const section = this.createNode("div", "section");
    row.appendChild(section);
    return row;
  }

  createRatingEntry(contentContainer, skill) {
    const ratingRow = this.createNode("div", "subject-rating-row");
    contentContainer.appendChild(ratingRow);
    const p = this.createNode("p");
    p.innerHTML = skill.name;
    const ratingCircle = this.createNode("div", "rating-circle");
    ratingRow.appendChild(p);
    ratingRow.appendChild(ratingCircle);
    for (let i = 0; i < 5; i++) {
      let div = this.createNode("div");
      ratingCircle.appendChild(div);
    }
  }

  createDateEntry(contentContainer, start, end) {
    const dates = this.createNode("div", ["dates", "inline-b"]);
    const dateFrom = this.createNode("span", "date-from");
    const dateTo = this.createNode("span", "date-to");
    contentContainer.appendChild(dates);
    dates.appendChild(dateFrom);
    dates.appendChild(dateTo);
    dateFrom.innerHTML = start;
    dateTo.innerHTML = end;

    if (this.checkEndOfPage(contentContainer)) {
      console.log('!!!!!', contentContainer)
      this.manageContentContainerWrap(contentContainer);
    }
  }

  createSubTitleEntry(subject, companyName){
    const companyTitle = this.createNode('p', 'subtitle')
    companyTitle.innerHTML = companyName;
    subject.appendChild(companyTitle)
    if (this.checkEndOfPage(companyTitle)){
      return this.manageSubjectWrap(companyTitle)
    }
    return subject;
  }

  // createSubjectWithSubtitleEntry(contentContainer, companyName, text){
  //   try{
  //     let subject = this.createSubjectEntry(contentContainer, text)
  //   } finally{

  //   }
  //     const companyTitle = this.createNode('p')
  //     companyTitle.innerHTML = companyName;
  //     subject.appendChild(companyTitle)
  //     if (this.checkEndOfPage(subject)){
  //       console.log('sfdsfsd')
  //       this.manageContentContainerWrap(subject)
  //     }
  //     return subject;
  // }

  createSubjectEntry(contentContainer, text) {
    const subject = this.createNode("div", ["subject", "inline-b"]);
    contentContainer.appendChild(subject);
    const name = this.createNode("h5");
    subject.appendChild(name);
    name.innerHTML = text;
    if (this.checkEndOfPage(contentContainer)) {
      try {
        this.manageContentContainerWrap(contentContainer);
      } catch (err){
        err.subject = subject;
        throw err
      }
    }
    return subject;
  }


  manageParapraphWrap(p){
    this.createPage();
    const section = this.createEntry();
    const contentContainer = this.createDataContainer(section);
    this._removeTo(p, contentContainer)
    return contentContainer;
  }

  manageSubjectWrap(el){
    this.createPage()
    const section = this.createEntry()
    const contentContainer = this.createDataContainer(section)
    let subject = this.createWrappedSubjectEntry(contentContainer)
    this._removeTo(el, subject)
    return subject;
  }

  manageContentContainerWrap(contentContainer){
      this.createPage();
      const section = this.createEntry();
      this._removeTo(contentContainer, section);
      throw new ContentContainerWrapException(section);

  }

  createWrappedSubjectEntry(contentContainer) {
    // TODO: mb change subject-wrapper to left-offset, also add it to raigin-row
    const subject = this.createNode("div", [
      "subject",
      "subject-wrapped",
      "inline-b"
    ]);
    contentContainer.appendChild(subject);
    return subject;
  }

  checkEndOfPage(element) {
    let lastPage = this.getLastPage();

    const y_page = lastPage.getBoundingClientRect().bottom - PAGE_MARGIN_BOTTOM - PAGE_OFFSET_BOTTOM;
    const y_element = element.getBoundingClientRect().bottom;
    // console.log(y_element, y_page, element) 
    if (y_element > y_page){
      console.log(y_element, y_page, element) 
    }
    return y_element > y_page
  }
  getLastPage() {
    return this.pages[this.pages.length - 1];
  }

  createTitleEntry(name) {
    const section = this.createEntry()
    const title = this.createNode("div", "title");
    section.appendChild(title);
    title.innerHTML = name;
    if (this.checkEndOfPage(section)) {
      const page = this.createPage();
      this._removeTo(section.parentNode, page)
    }
    return section;
  }

  createEntry() {
    const row = this.createSectionSkillet();
    const page = this.getLastPage();
    page.appendChild(row);
    return row.children[0];
  }

  createDataContainer(section) {
    const col = this.createNode("div", "col");
    section.appendChild(col);
    const content = this.createNode("div", "content");
    col.appendChild(content);
    return content;
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
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  _removeTo(el, parent){
    el.remove();
    parent.appendChild(el);
  }
}

getData("doc").then(doc => {
  try {
    const builder = new Builder(doc);
    builder.build();
  } catch (err) {
    console.error(err)
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
