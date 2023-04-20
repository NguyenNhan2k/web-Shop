function clickSize() {
    const elementDetail = document.querySelectorAll('.size--detail');
    for (let i = 0; i < elementDetail.length; i++) {
        elementDetail[i].addEventListener('click', (e) => {
            elementDetail.forEach((event) => {
                event.classList.remove('active-size');
                const stickCheck = event.querySelector('.sticker-check');
                stickCheck.style.display = 'none';
            });
            elementDetail[i].classList.add('active-size');
            const stickCheck = elementDetail[i].querySelector('.sticker-check');
            const inputCheck = elementDetail[i].querySelector('.inputSize');
            inputCheck.style.setProperty('checked', 'checked');
            inputCheck.checked = true;
            stickCheck.style.display = 'block';
        });
    }
    const plus = document.querySelector('.plus');
    const minus = document.querySelector('.minus');
    const quantity = document.querySelector('#quantity');

    if (plus && minus) {
        plus.addEventListener('click', () => {
            quantity.value = parseInt(quantity.value) + 1;
        });
        minus.addEventListener('click', () => {
            quantity.value = quantity.value > 0 ? parseInt(quantity.value) - 1 : 0;
        });
    }
}
function handleInputCart() {
    const plus = document.querySelectorAll('.plusCart');
    const minus = document.querySelectorAll('.minusCart');
    const quantity = document.querySelectorAll('#quantity');

    for (let i = 0; i < plus.length; i++) {
        plus[i].addEventListener('click', () => {
            quantity[i].value = parseInt(quantity[i].value) + 1;
        });
        minus[i].addEventListener('click', () => {
            quantity[i].value = quantity[i].value > 0 ? parseInt(quantity[i].value) - 1 : 0;
        });
    }
}
function handleFormDeleteCart() {
    const elementButton = document.querySelector('.cart--contain__btn');
    const formDelete = document.querySelector('.formDeleteCart');
    if (elementButton) {
        elementButton.addEventListener('click', (e) => {
            e.preventDefault();
            const idProduct = elementButton.dataset.id;
            const indexProduct = elementButton.dataset.index;
            formDelete.action = `/cart/delete/${idProduct}&${indexProduct}?_method=DELETE`;
            formDelete.submit();
        });
    }
}

function handleFormDeleteCartUser() {
    const elementButton = document.querySelectorAll('.cart--contain__btn--user');
    const formDelete = document.querySelector('.formDeleteCart');
    for (let i = 0; i < elementButton.length; i++) {
        elementButton[i].addEventListener('click', (e) => {
            e.preventDefault();
            const idProduct = elementButton[i].dataset.id;
            formDelete.action = `/cart/delete/${idProduct}?_method=DELETE`;
            formDelete.submit();
        });
    }
}
function handleBtnUpdate() {
    const elementButton = document.querySelector('.cart--total__Update');
    const formUpdate = document.querySelector('.cart');
    if (elementButton) {
        elementButton.addEventListener('click', () => {
            formUpdate.action = `/cart/update/?_method=PATCH`;
            formUpdate.submit();
        });
    }
}
function main() {
    clickSize();
    handleBtnUpdate();
    handleFormDeleteCart();
    handleInputCart();
    handleFormDeleteCartUser();
}
main();
