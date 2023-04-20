const imgFeture = document.querySelector('.img_feature');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const listImages = document.querySelectorAll('.list_img img');
var currentIndex = 0;

function updateImages(index) {
    document
        .querySelectorAll('.list_img .div_img')
        .forEach((divElement) => divElement.classList.remove('active_details'));
    currentIndex = index;
    imgFeture.src = listImages[index].getAttribute('src');
    listImages[index].parentElement.classList.add('active_details');
}
listImages.forEach((imgElement, index) => {
    imgElement.addEventListener('click', (e) => {
        updateImages(index);
    });
});
btnPrev.addEventListener('click', (e) => {
    if (currentIndex >= 0) {
        currentIndex--;
    } else {
        currentIndex = listImages.length - 1;
    }
    updateImages(currentIndex);
});
btnNext.addEventListener('click', (e) => {
    if (currentIndex >= listImages.length - 1) {
        currentIndex = 0;
    } else {
        currentIndex++;
    }
    updateImages(currentIndex);
});
updateImages(0);
