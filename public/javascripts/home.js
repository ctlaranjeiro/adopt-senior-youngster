// ====Togling on/off the captions div according to the hamburger menu===


let toggler = document.getElementById('tog');
let unwanted = document.getElementsByClassName('unwanted');
// console.log('unwanted:', unwanted, 'toggler: ', toggler);
toggler.addEventListener('click', () => {
  for (let i=0; i < unwanted.length; i++) {
    // console.log(unwanted[i]);
    if (unwanted[i].style.display !== 'none') {
      unwanted[i].style.display = 'none';
      // console.log('button style: ', unwanted[i].style.display);
    } else {
      unwanted[i].style.display = 'flex';
      // console.log('button style: ', unwanted[i].style.display);
    }
  }
});