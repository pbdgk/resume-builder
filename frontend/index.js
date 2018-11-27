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

const pages = {
  'profile/': MainPage,
  'socials/': SocialsPage,
  'summary/': SummaryPage,
  'experience/': ExperiencePage,
  'education/': EducationPage,
  'skills/': SkillPage
}

const router = new Navigo('/app/', true);

const api = new Api()


Object.keys(pages).forEach(url => {
  router.on({[url]: function() {
    let page = new pages[url](api);
    page.show();
  }})
  .resolve()
})


router.notFound(function () {
  router.navigate('profile/')
});