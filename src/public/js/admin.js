function toggleMenu() {
    let toggle = document.querySelector('.toggle');
    let navigation = document.querySelector('.navigation');
    let main = document.querySelector('.main');
    let topbar = document.querySelector('.topbar');
    toggle.classList.toggle('active');
    navigation.classList.toggle('active');
    main.classList.toggle('active');
    topbar.classList.toggle('active');
}
function valueImages() {
    var file = images.files;
    lenImages.innerHTML = `${file.length} files selected`;
}
const images = document.querySelector('.images');
const lenImages = document.querySelector('.message__images');
const getFileImg = () => {
    const value = images.value;
    if (value > 0) {
        lenImages.innerHTML = `${file.length} files selected`;
    } else {
        lenImages.innerHTML = `No files selected`;
    }
};
const message = document.querySelector('#toast');
if (message) {
    myTimeOut = setTimeout(() => {
        message.style.display = 'none';
    }, 2000);
}
// modal delete product
