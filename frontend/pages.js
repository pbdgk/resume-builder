import { 
  DateChangeListener,
  FieldChangeListener,
  ImageChangeListener,
  RatingChangeListener
} from './changelisteners';

import {
  ProfileRenderer,
  SocialRenderer,
  SummaryRenderer,
  JobRenderer,
  SchoolRenderer,
  SkillRenderer
} from './renderers';



export class Page{
  constructor(api) {
    this.api = api
  }

  async show(){
    await this.render();
    this.animate()
  }

  async render() {
    const data = await this.api.getData(this.cName)
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
  constructor(...args) {
    super(...args);
    this.cName = 'profiles'
    this.renderer = ProfileRenderer
    this.listeners = [FieldChangeListener, ImageChangeListener]
  }
}

export class SocialsPage extends Page {
  constructor(...args) {
    super(...args);
    this.cName = 'socials'
    this.renderer = SocialRenderer
    this.listeners = [FieldChangeListener]
    this.registerCreateSocial()
  }

  async render(){
    await super.render();
    this.registerAddButtons();
    this.onHideModal();
    this.showDeleteButtonsOnHover();
    this.registerDeleteButtons();
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
        const id = target.parentElement.previousElementSibling.name
        this.deleteSocial(id);
      })
    })
  }

  async deleteSocial(id){
    await this.api.delete(this.cName, id)
    this.render();
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

  async createSocial(data, modal){
    await this.api.create(this.cName, data);
    this.hide(modal)
    this.render()
  }

  registerCreateSocial() {
  const modal = document.querySelector("#socialModal .modal")
  const socialButtons = modal.querySelectorAll('[data-social]')
  console.log('registering click!!!!!')
  socialButtons.forEach(btn => {
    btn.addEventListener('click', ({ target }) => {
      const data = {
        group: modal.dataset.group,
        social: target.dataset.social
      }
      this.createSocial(data, modal);
      })
    })
  }
}

export class SummaryPage extends Page {
  constructor(...args) {
    super(...args);
    this.cName = 'summaries'
    this.renderer = SummaryRenderer
    this.listeners = [FieldChangeListener]
  }
}

export class CreateDeleteSectionPage extends Page {
  async render(){
    await super.render()
    this.registerCreateSection()
    this.registerDeleteSection()
  }

  registerCreateSection(){
    const addBtn = document.querySelector('[data-add]')
    addBtn.addEventListener('click', () => {
      this.createSection()
    });
  }

  registerDeleteSection(){
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      let deleteBtn = section.querySelector('.deleteBtn')
      deleteBtn.addEventListener('click', ({ target }) => {
        const parentSection = target.closest('section');
        if (parentSection){
          const sectionId = parentSection.dataset.num
          if (sectionId){
            this.deleteSection(sectionId)
          }
        }
      })
    })
  }

  async deleteSection(id){
    await this.api.delete(this.cName, id);
    this.render();
  }

  async createSection(){
    await this.api.create(this.cName);
    this.render();
  }
}

export class ExperiencePage extends CreateDeleteSectionPage {
  constructor(...args) {
    super(...args);
    this.cName = 'jobs'
    this.renderer = JobRenderer
    this.listeners = [FieldChangeListener, DateChangeListener]
  }
}

export class EducationPage extends CreateDeleteSectionPage {
  constructor(...args) {
    super(...args);
    this.cName = 'schools'
    this.renderer = SchoolRenderer
    this.listeners = [FieldChangeListener, DateChangeListener]
  }
}

export class SkillPage extends CreateDeleteSectionPage {
  constructor(...args) {
    super(...args);
    this.cName = 'skills'
    this.renderer = SkillRenderer
    this.listeners = [FieldChangeListener, RatingChangeListener]
  }
}