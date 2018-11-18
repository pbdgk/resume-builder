
const navLinks = document.querySelectorAll(".nav-panel a")
let margin = -200;
navLinks.forEach( link => {
  link.style.marginLeft = margin + 'px';
})

for (let i=0; i<navLinks.length; i++){
  let link = navLinks[i];
  setTimeout(()=> {
    moveNavLinks(link, margin)
  }, 300 * i)
}

function moveNavLinks(link, margin){
  var id = setInterval(frame, 1);
  function frame(){
    if (margin === 0) {
      clearInterval(id);
    } else {
      margin += 5;
      link.style.marginLeft = margin + 'px';
    }
  }
}

function makeActiveNavLink(activeLink, links) {
  links.forEach( link => {
    link.classList.remove('active-nav-link')
  })
  activeLink.classList.add('active-nav-link')
}
