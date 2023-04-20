const tagIELement = document.querySelectorAll('#update-order');
const labelElement = document.querySelectorAll('.label--update');
const inputElement = document.querySelectorAll('.input-order');
const btnUpdateElement = document.querySelectorAll('.btn-update');
const btnDeleteElement = document.querySelectorAll('#btn-delete');
const sizeOrderElement = document.querySelectorAll('.size-order');
const spanOrderElement = document.querySelectorAll('.span-order');
const actions = document.querySelector('#actions');
const spanQuantityOrderElement = document.querySelectorAll('.span-order__quantity');
const quantityOrderElement = document.querySelectorAll('.quantity-order');
console.log(tagIELement, labelElement, inputElement);
for (let i = 0; i < inputElement.length; i++) {
    inputElement[i].hidden = true;
    tagIELement[i].addEventListener('click', () => {
        labelElement[i].style.display = 'none';
        inputElement[i].hidden = false;
    });
}
btnUpdateElement.forEach((update, index) => {
    quantityOrderElement[index].hidden = true;
    sizeOrderElement[index].style.display = 'none';
    update.addEventListener('click', (e) => {
        e.preventDefault();
        sizeOrderElement[index].style.display = 'block';
        quantityOrderElement[index].hidden = false;
        spanOrderElement[index].style.display = 'none';
        spanQuantityOrderElement[index].style.display = 'none';
    });
    btnDeleteElement[index].addEventListener('click', (e) => {
        e.preventDefault();
        const parentDelete = btnDeleteElement[index].parentElement.parentElement;
        const sizeOrder = parentDelete.querySelector('#size');
        const quantityOrder = parentDelete.querySelector('#quantity');
        const InputInfoOrder = parentDelete.querySelector('#id_orderInfo');

        InputInfoOrder.setAttribute('disabled', 'disabled');
        InputInfoOrder.setAttribute('name', 'id_orderInfoDelete');
        InputInfoOrder.removeAttribute('disabled', 'disabled');
        sizeOrder.setAttribute('disabled', 'disabled');
        quantityOrder.setAttribute('disabled', 'disabled');
        parentDelete.style.display = 'none';
    });
});
function createTag(name) {
    return document.createElement(name);
}
var countProduct = 0;
var arrProduct;
function handleAddProduct(event, products) {
    event.preventDefault();
    countProduct++;
    arrProduct = products;
    // Lấy Element
    const table = document.querySelector('.table--add__product');
    const tagTr = document.createElement('tr');

    // ----Tạo thẻ td -----
    // 1. STT
    const tagTdName = createTag('td');
    // 2. Tên sản phẩm
    const tagTdIndex = createTag('td');
    tagTdIndex.innerText = countProduct;
    // 3. Size
    const tagTdSize = createTag('td');
    // 4. input
    const tagTdInput = createTag('td');
    // 5. btn xóa
    const tagTdBtn = createTag('td');

    // --------------------
    const button = createTag('button');
    button.id = 'btn-delete__addProduct';
    const tagI = createTag('i');
    tagI.className = 'fa-solid fa-trash remove';
    // ------- Input
    const tagInput = createTag('input');
    tagInput.name = 'quantityAdd';
    tagInput.type = 'number';
    tagInput.id = 'quantityAdd';

    // ---- Tạo thẻ select------
    // 1. Select tên sản phẩm
    const tagSelectTitle = createTag('select');
    tagSelectTitle.name = 'product';
    tagSelectTitle.id = 'product';
    // 2. Select tên Size
    const tagSelectSize = createTag('select');
    tagSelectSize.name = 'sizeAdd';
    tagSelectSize.id = 'sizeAdd';
    // -------------------//

    //-------- Tạo option trong select sản phẩm
    arrProduct.forEach((product) => {
        const optionProduct = createTag('option');
        optionProduct.value = product.id;
        optionProduct.innerText = product.title;
        tagSelectTitle.appendChild(optionProduct);
    });
    button.appendChild(tagI);
    tagTdName.appendChild(tagSelectTitle);
    tagTdSize.appendChild(tagSelectSize);
    tagTdBtn.appendChild(button);
    tagTdInput.appendChild(tagInput);
    tagTr.appendChild(tagTdIndex);
    tagTr.appendChild(tagTdName);
    tagTr.appendChild(tagTdSize);
    tagTr.appendChild(tagTdInput);
    tagTr.appendChild(tagTdBtn);
    table.appendChild(tagTr);
    handleSelectOption();
}
function handleSelectOption() {
    const selectProduct = document.querySelectorAll('#product');
    const selectSize = document.querySelectorAll('#sizeAdd');
    const btnDeleteAdd = document.querySelectorAll('#btn-delete__addProduct');

    if (selectProduct) {
        selectProduct.forEach((select, indexSelect) => {
            select.addEventListener('change', (e) => {
                arrProduct.forEach((product, index) => {
                    if (product.id === e.target.value) {
                        while (selectSize[indexSelect].options.length > 0) {
                            selectSize[indexSelect].options.remove(0);
                        }
                        product.size.forEach((size) => {
                            const optionsSize = createTag('option');
                            optionsSize.value = size._id;
                            optionsSize.innerText = size.name;
                            selectSize[indexSelect].appendChild(optionsSize);
                        });
                    }
                });
            });
        });
        btnDeleteAdd.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const parentBtnDelete = btnDeleteAdd[index].parentElement.parentElement;
                const selectHidden = parentBtnDelete.querySelector('#product');
                const sizeHidden = parentBtnDelete.querySelector('#sizeAdd');
                const quantityHidden = parentBtnDelete.querySelector('#quantityAdd');
                console.log(selectHidden, sizeHidden, quantityHidden);
                selectHidden.setAttribute('disabled', 'disabled');
                sizeHidden.setAttribute('disabled', 'disabled');
                quantityHidden.setAttribute('disabled', 'disabled');
                parentBtnDelete.style.display = 'none';
            });
        });
    }
}
actions.addEventListener('change', (e) => {
    const dateShip = document.querySelector('.dateShip');
    const [name, idAction] = e.target.value.split('|');
    if (name == 'Xuất kho') {
        dateShip.style.display = 'flex';
    }
});
