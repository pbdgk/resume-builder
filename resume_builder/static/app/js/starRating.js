function listenOnHoverStar(target){
  let onStar, stars;
  onStar = parseInt(target.dataset.rating, 10);
  stars = target.parentNode.children
  for (i = 0; i < stars.length; i++) {
    if (i < onStar){
      stars[i].classList.add('hover')
    }
    else {
      stars[i].classList.remove('hover')
    }
  }
};

function listenOnMouseOut(target){
  let stars;
  stars = target.parentNode.children;
  for (var i = 0; i < stars.length; i++) {
    stars[i].classList.remove('hover')
  }
};

function selectStar(target){
  let onStar = parseInt(target.dataset.rating, 10);
  let stars = target.parentNode.children;
  let i;
  for (i = 0; i < stars.length; i++) {
    stars[i].classList.remove('selected');
  }
  for (i = 0; i < onStar; i++) {
    stars[i].classList.add('selected');
  }
};
