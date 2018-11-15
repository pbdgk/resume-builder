'use strict'

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

function send(e){
  // console.log(e)
  // e.remove()
  let img = document.querySelector('img')
  let tmp = img.src
  img.src = '/home/g/app/resume_builder/media/photos/photo.png'
  let t = document.documentElement.innerHTML;
  img.src = tmp
  const url = 'http://127.0.0.1:8000/api/v1/download/'
  fetch(url, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(t)
  })
  .then(response => {
    console.log(response.status)
  })
  .catch(e => {
    console.log(e)
  })
}
const appendEntry = (parent, entry) => {
  parent.appendChild(entry);
};

const generate = (num, el) => {
  const arr = []
  for (let i=0; i < num; i++) {
    arr.push(document.createElement(el))
  }
  return arr;
}

// let ip = container.querySelector(".page-inner");
// for (let i = 0; i < 10; i++) {
//   let div = document.createElement('div');
//   ip.appendChild(div);
//   for (let i = 0; i < 10; i++) {
//     p = document.createElement('p')
//     div.appendChild(p)
//   }
// }

// 150 km 1300 - 1400 grn


class Builder {
  constructor(doc) {
    this.doc = doc;
    this.pages = [];
    this.container = document.querySelector(".page-container");
  }

  build(){
    this.createPage();
    this.buildFirstSection();
    this.buildSummary();
    this.buildSummary();
    this.buildEducation();
    this.buildSkills();
  }

  createPage() {
    const page = this.createNode('div', 'page')
    this.pages.push(page);
    this.container.appendChild(page);
    return page;
  }

  createNode(name, cls) {
    const el = document.createElement(name);
    if (cls === undefined){
      return el
    }
    cls && Array.isArray(cls)
      ? el.classList.add(...cls)
      : el.classList.add(cls)
    return el;

  }

  createSectionSkillet(){
    const row = this.createNode('div', 'row')
    const section = this.createNode('div', 'section')
    row.appendChild(section)
    return row;
  }


  buildFirstSection(){
    const page = this.pages[this.pages.length - 1]
    const row = this.createSectionSkillet()
    page.appendChild(row)
    const section = row.children[0]
    const title = this.createNode('div', ['title-col', 'first-line-col'])
    const inner = this.createNode('div', 'cRow-inner')
    const h1 = this.createNode('h1')
    const h2 = this.createNode('h2')

    const {profile, img, socials} = this.doc
    h1.innerHTML = `${profile.first_name} ${profile.last_name}`
    inner.appendChild(h1)
    h2.innerHTML = profile.profession
    inner.appendChild(h2)

    title.appendChild(inner)
    const innerSocial = this.buildSocials(socials);

    title.appendChild(innerSocial)


    const imageContainer = this.createNode('div', ['image-col', 'first-line-col'])
    const iContainer = this.createNode('div', 'iContainer')
    const figure = this.createNode('figure')
    const imgblock = this.createNode('img')
    imgblock.src = img.image;
    figure.appendChild(imgblock)
    iContainer.appendChild(figure)
    imageContainer.appendChild(iContainer)

    section.appendChild(title)    
    section.appendChild(imageContainer)    
  }

  buildSocials(socials){
    const innerSocial = this.createNode('div', 'cRow-inner')
    for (let group in socials){
      const container = this.createNode('div', ['cCol-inner', 'content'])
      for (let i=0; i < socials[group].length; i++){
        let social = socials[group][i]
        const div = this.createNode('div')
        const strong = this.createNode('strong')
        strong.innerHTML = social.label
        const span = this.createNode('span')
        span.innerText = social.text
        div.appendChild(strong)
        div.appendChild(span)
        container.appendChild(div)
      }
      innerSocial.appendChild(container)
    }
    return innerSocial
  }



  buildSummary(){
    const section = this.createEntry()
    const contentContainer = this.createDataContainer(section)
    const ps = this.textToParagraphs(this.doc.summary.text)
    for (let p of ps){
      contentContainer.appendChild(p)
    }
  }

  buildEducation(){
    const edu = this.doc.edu;
    let section = this.createTitleEntry("Education")
    for (let i=0; i < edu.length; i++){
      let school = edu[i]
      let contentContainer = this.createDataContainer(section)
      this.createDateEntry(contentContainer, school.start, school.end)
      let subject = this.createSubjectEntry(contentContainer, school.name)
      const ps = this.textToParagraphs(school.description)
      for (let p of ps){
        subject.appendChild(p)
        if (this.checkEndOfPage(p)){
          p.remove()
          this.createPage()
          section = this.createEntry(null, true)
          contentContainer = this.createDataContainer(section)
          subject =  this.createWrappedSubjectEntry(contentContainer)
          subject.appendChild(p)

        }
      }

    }
  }

  buildExperience(){
    const exp = this.doc.exp;
    let section = this.createTitleEntry("Experience");
    for (let i=0; i < exp.length; i++){
      let job = exp[i]
      let contentContainer = this.createDataContainer(section)
      this.createDateEntry(contentContainer, job.start, job.end)
      let subject = this.createSubjectEntry(contentContainer, job.position)
      const ps = this.textToParagraphs(job.experience)
      for (let p of ps){
        subject.appendChild(p)
        if (this.checkEndOfPage(p)){
          p.remove()
          this.createPage()
          section = this.createEntry()
          contentContainer = this.createDataContainer(section)
          subject =  this.createWrappedSubjectEntry(contentContainer)
          subject.appendChild(p)

        }
      }

    }
  }



  buildSkills(){
    const skills = this.doc.skills;
    let section = this.createTitleEntry('Skills')
    for (let i=0; i < skills.length; i++){
      let skill = skills[i]
      const contentContainer = this.createDataContainer(section)
      this.createRatingEntry(contentContainer, skill)
      if (this.checkEndOfPage(contentContainer)){
        let page = this.createPage();
        section = this.createEntry();
        page.appendChild(section)
        contentContainer.remove()
        section.appendChild(contentContainer)
      }
    }
  }


  checkEndOfPage(element){
    let lastPage = this.getLastPage();
    const y_page = lastPage.getBoundingClientRect().bottom - 30;
    const y_e = element.getBoundingClientRect().bottom;
    // return y_e > y_page
    if (y_e > y_page){
      console.log(element, y_page, y_e)
      return true
    }
  }

  createRatingEntry(contentContainer, skill){
      const ratingRow = this.createNode('div', 'subject-rating-row')
      contentContainer.appendChild(ratingRow)
      const p = this.createNode('p')
      p.innerHTML = skill.name;
      const ratingCircle = this.createNode('div', 'rating-circle')
      ratingRow.appendChild(p)
      ratingRow.appendChild(ratingCircle)
      for (let i=0; i<5; i++){
        let div = this.createNode('div')
        ratingCircle.appendChild(div)
      }
  }


  createDateEntry(contentContainer, start, end){
      const dates = this.createNode('div', ['dates', 'inline-b'])
      const dateFrom = this.createNode('span', 'date-from')
      const dateTo = this.createNode('span', 'date-to' )
      contentContainer.appendChild(dates)
      dates.appendChild(dateFrom)
      dates.appendChild(dateTo)
      dateFrom.innerHTML = start
      dateTo.innerHTML = end

      if (this.checkEndOfPage(contentContainer)){
        let page = this.createPage()
        let section = this.createEntry()
        page.appendChild(section)
        contentContainer.remove()
        section.appendChild(contentContainer)
      }
  }

  createSubjectEntry(contentContainer, text){
      const subject = this.createNode('div', ['subject', 'inline-b'])
      contentContainer.appendChild(subject)
      const name = this.createNode('h5')
      subject.appendChild(name)
      name.innerHTML = text;
      if (this.checkEndOfPage(contentContainer)){
        let page = this.createPage()
        let section = this.createEntry()
        page.appendChild(section)
        contentContainer.remove()
        section.appendChild(contentContainer)
      }
      return subject
  }

  createWrappedSubjectEntry(contentContainer){
    // TODO: mb change subject-wrapper to left-offset, also add it to raigin-row
    const subject = this.createNode('div', ['subject', 'subject-wrapped', 'inline-b'])
    contentContainer.appendChild(subject)
    return subject;
    
  }
  getLastPage(){
    return this.pages[this.pages.length - 1]
  }

  createTitleEntry(name){
    const row = this.createSectionSkillet();
    let page = this.getLastPage()
    page.appendChild(row)
    const section = row.children[0]
    const title = this.createNode('div', 'title')
    section.appendChild(title)
    title.innerHTML = name;
    if (this.checkEndOfPage(row)){
      row.remove()
      page = this.createPage()
      page.appendChild(row)
    }
    return section;
  }

  createEntry(){
    const row = this.createSectionSkillet();
    const page = this.getLastPage()
    page.appendChild(row)
    return row.children[0]
  }

  createDataContainer(section){
      const col = this.createNode('div', 'col')
      section.appendChild(col)
      const content = this.createNode('div', 'content')
      col.appendChild(content)
      return content;
  }



  textToParagraphs(text){
    if (!text){
      return false
    }
    const paragraphs = []
    const pArr = text.split('\n')
    for (let i=0; i < pArr.length; i++){
      let p = this.createNode('p')
      p.innerHTML = pArr[i]
      paragraphs.push(p)
    }
    return paragraphs
  }

}

getData('doc')
  .then((doc) => {
    const builder = new Builder(doc)
    builder.build()
  }
)



function getData(cName) {
  let url = `http://127.0.0.1:8000/api/v1/${cName}/`;
  return fetch(url)
    .then(response => {
      console.log(response)
      return response.json();
    })
    .catch(e => {
      console.log(e.message);
    });
}

