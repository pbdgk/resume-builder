
export class Page{

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

  async show(){
    await this.render();
    this.animate()

  }

  async render() {
    const data = await this.getData()
    try {
      const renderer = new this.renderer(data, this.cName, this.listeners)
      await renderer.render()
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

export class MainPage extends Page {
  constructor() {
    super();
    this.cName = 'profiles'
    this.renderer = ProfileRenderer
    this.listeners = [FieldChangeListener, ImageChangeListener]
  }
}

export class SocialsPage extends Page {
  constructor() {
    super();
    this.cName = 'socials'
    this.renderer = SocialRenderer
    this.listeners = [FieldChangeListener]
  }

  async render(){
    await super.render();
    this.registerAddButtons();
    this.addNewSocial();
    this.onHideModal();
    this.showDeleteButtonsOnHover();
    this.registerDeleteButtons();
  }

  async rerender(){
    await super.render();
    this.registerAddButtons();
    this.onHideModal();
    this.showDeleteButtonsOnHover();
    this.registerDeleteButtons();
  }

  registerAddButtons(){
    const container = document.querySelector("#content section")
    const btns = container.querySelectorAll('.addSocialBtn')
    btns.forEach(btn => {
      const group = btn.closest(".form").dataset.group;
      btn.addEventListener('click', () => {
        this.showModal(group)
      })
    })
  }

  hideOnOutClick(event) {
    const modal = document.querySelector("#socialModal .modal")
    if (event.target == modal) {
      this.hide(modal)
    }
  }

  hide(modal){
    modal.style.display = "none";
  }

  onHideModal() {
    window.addEventListener("click", this.hideOnOutClick.bind(this));
  }

  showModal(group){
    const modal = document.querySelector("#socialModal .modal")
    modal.dataset.group = group
    modal.style.display = 'block'
  }

  showDeleteButtonsOnHover(){
    const container = document.querySelector("#content section")
    const inputs = container.querySelectorAll('.new_form-field')
    inputs.forEach(input => {
      const btn = input.querySelector('.deleteBtn');
      input.addEventListener('mouseenter', () => {
        btn.style.visibility = 'visible'
      })
      input.addEventListener('mouseleave', () => {
        btn.style.visibility = 'hidden'
      })
    })

  }


  registerDeleteButtons() {
    const container = document.querySelector("#content section")
    const btns = container.querySelectorAll('.deleteBtn')
    btns.forEach(btn => {
      btn.addEventListener('click', ({ target }) => {
        this.deleteSocial(target.parentElement.previousElementSibling);
      })
    })
  }

 addNewSocial() {
  const modal = document.querySelector("#socialModal .modal")
  const socialButtons = modal.querySelectorAll('[data-social]')
  const self = this;
  console.log('registering click!!!!!')
  socialButtons.forEach(btn => {
    btn.addEventListener('click', ({ target }) => {
      const data = {
        group: modal.dataset.group,
        social: target.dataset.social
      }
      const url = "http://127.0.0.1:8000/api/v1/socials/";
      fetch(url, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data)
      })
      .then(response => {
        console.log(response.status)
        self.hide(modal)
        self.rerender()
      })
      .catch(e => {
        console.log(e.message)
      })
    })
  })
}

  deleteSocial(target){
    const url = `http://127.0.0.1:8000/api/v1/${this.cName}/`;
    fetch(url, {
      method: "delete",
      headers: myHeaders,
      body: JSON.stringify({"id": target.name})
    })
    .then(response => {
      if (response.status !== 200){
        console.log(response.status)
        console.log(response.message)
      } else {
        console.log('deleted')
        this.rerender()
      }
    })
    .catch(e => {
      console.log(e)
    })
  }

}

export class SummaryPage extends Page {
  constructor() {
    super();
    this.cName = 'summaries'
    this.renderer = SummaryRenderer
    this.listeners = [FieldChangeListener]
  }
}

export class CreateDeleteSectionPage extends Page {
  async render(){
    await super.render()
    this.addNewSection()
    this.deleteSection()
  }

  deleteSection(){
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      let deleteBtn = section.querySelector('.deleteBtn')
      deleteBtn.addEventListener('click', ({ target }) => {
        const parentSection = target.closest('section');
        if (parentSection){
          const sectionId = parentSection.dataset.num
          if (sectionId){
            this.delete({"priority": sectionId})
          }
        }
      })
    })
  }

  delete(id){
    const url = `http://127.0.0.1:8000/api/v1/${this.cName}/`;
    fetch(url, {
      method: 'delete',
      headers: myHeaders,
      body: JSON.stringify(id)
    })
    .then(response => {
      if (response.status == 200){
        this.render();
      }
      else {
        console.log('some error on delete')
        console.log(response.status)
        console.log(response.message)
      } 
    })
    .catch(e => {
      console.log(e)
    })
  }
  addNewSection(){
    const addBtn = document.querySelector('[data-add]')
    addBtn.addEventListener('click', () => {
      const url = `http://127.0.0.1:8000/api/v1/${this.cName}/`;
      fetch(url, {
        method: "POST",
        headers: myHeaders,
      })
      .then(response => {
        console.log(response.status)
        this.render()
      })
      .catch(e => {
        console.log(e.message)
      })
    })
  }

  animate(){
    super.animate();
  }
}

export class ExperiencePage extends CreateDeleteSectionPage {
  constructor() {
    super();
    this.cName = 'jobs'
    this.renderer = JobRenderer
    this.listeners = [FieldChangeListener, DateChangeListener]
  }
}

export class EducationPage extends CreateDeleteSectionPage {
  constructor() {
    super();
    this.cName = 'schools'
    this.renderer = SchoolRenderer
    this.listeners = [FieldChangeListener, DateChangeListener]
  }
}

export class SkillPage extends CreateDeleteSectionPage {
  constructor() {
    super();
    this.cName = 'skills'
    this.renderer = SkillRenderer
    this.listeners = [FieldChangeListener, RatingChangeListener]
  }
}