import Navigo from "navigo";

import Api from './api';

import { 
  MainPage,
  SocialsPage,
  SummaryPage,
  ExperiencePage,
  EducationPage,
  SkillPage
} from "./pages";

const api = new Api()

const pages = {
  'profile/': new MainPage(api),
  'socials/': new SocialsPage(api),
  'summary/': new SummaryPage(api),
  'experience/': new ExperiencePage(api),
  'education/': new EducationPage(api),
  'skills/': new SkillPage(api)
}

const router = new Navigo('/app/', true);



Object.keys(pages).forEach(url => {
  router.on({[url]: function() {
    let page = pages[url];
    page.show();
  }})
  .resolve()
})


router.notFound(function () {
  router.navigate('profile/')
});