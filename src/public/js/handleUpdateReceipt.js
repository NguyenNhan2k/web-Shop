const tagIELement = document.querySelectorAll('#update-order');
const labelElement = document.querySelectorAll('.label--update');
const inputElement = document.querySelectorAll('.input-order');
const btnUpdateElement = document.querySelectorAll('.btn-update');
const btnDeleteElement = document.querySelectorAll('#btn-delete');
const sizeOrderElement = document.querySelectorAll('.size-order');
const spanOrderElement = document.querySelectorAll('.span-order');
const supplier = document.querySelectorAll('.supplier-order');
const actions = document.querySelector('#action');
const spanQuantityOrderElement = document.querySelectorAll('.span-order__quantity');
const spanExportPrice = document.querySelectorAll('.span-order__exportPrice');
const spanSupplier = document.querySelectorAll('.span-order__supplier');
const quantityOrderElement = document.querySelectorAll('.quantity-order');
const exportReceipt = document.querySelectorAll('.export-receipt');
for (let i = 0; i < inputElement.length; i++) {
    inputElement[i].hidden = true;
    tagIELement[i].addEventListener('click', () => {
        labelElement[i].style.display = 'none';
        inputElement[i].hidden = false;
    });
}
btnUpdateElement.forEach((update, index) => {
    quantityOrderElement[index].hidden = true;
    exportReceipt[index].hidden = true;
    sizeOrderElement[index].style.display = 'none';
    update.addEventListener('click', (e) => {
        e.preventDefault();
        supplier[index].hidden = false;
        sizeOrderElement[index].style.display = 'block';
        quantityOrderElement[index].hidden = false;
        supplier[index].style.display = 'block';
        exportReceipt[index].hidden = false;
        spanSupplier[index].style.display = 'none';
        spanOrderElement[index].style.display = 'none';
        spanQuantityOrderElement[index].style.display = 'none';
        spanExportPrice[index].style.display = 'none';
    });
    btnDeleteElement[index].addEventListener('click', (e) => {
        e.preventDefault();
        const parentDelete = btnDeleteElement[index].parentElement.parentElement;
        const sizeOrder = parentDelete.querySelector('#size');
        const quantityOrder = parentDelete.querySelector('#quantity');
        const InputInfoOrder = parentDelete.querySelector('#id_receiptInfo');
        const exportPrice = parentDelete.querySelector('#export_price');
        const supplier = parentDelete.querySelector('#supplier');
        const totalPrice = parentDelete.querySelector('#total_money');

        totalPrice.setAttribute('name', 'totalPriceDelete');
        InputInfoOrder.setAttribute('name', 'receiptDelete');
        supplier.setAttribute('name', 'supplierDelete');
        exportPrice.setAttribute('name', 'exportPriceDelete');
        sizeOrder.setAttribute('name', 'sizeDelete');
        quantityOrder.setAttribute('name', 'quantityDelete');
        parentDelete.style.display = 'none';
    });
});
function createTag(name) {
    return document.createElement(name);
}
var countProduct = 0;
var arrProduct;
var suppliers;
function handleAddReceipt(event, products, supplier) {
    event.preventDefault();
    countProduct++;
    arrProduct = products;
    suppliers = supplier;

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
    // 5. input gia nhap
    const tagExport = createTag('td');
    //6. nha cung cap
    const tagSupplier = createTag('td');
    // 7. btn xóa
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
    const tagInputExport = createTag('input');
    tagInputExport.name = 'exportAdd';
    tagInputExport.type = 'number';
    tagInputExport.id = 'exportAdd';
    // ---- Tạo thẻ select------
    // 1. Select tên sản phẩm
    const tagSelectTitle = createTag('select');
    tagSelectTitle.name = 'product';
    tagSelectTitle.id = 'product';
    // 2. Select tên Size
    const tagSelectSize = createTag('select');
    tagSelectSize.name = 'sizeAdd';
    tagSelectSize.id = 'sizeAdd';
    // 3. select Supplier
    const tagSelectSupplier = createTag('select');
    tagSelectSupplier.name = 'supplierAdd';
    tagSelectSupplier.id = 'supplierAdd';
    // -------------------//

    //-------- Tạo option trong select sản phẩm
    arrProduct.forEach((product) => {
        const optionProduct = createTag('option');
        optionProduct.value = product.id;
        optionProduct.innerText = product.title;
        tagSelectTitle.appendChild(optionProduct);
    });
    suppliers.forEach((supplier) => {
        const optionSupplier = createTag('option');
        optionSupplier.value = supplier._id;
        optionSupplier.innerText = supplier.name;
        tagSelectSupplier.appendChild(optionSupplier);
    });
    button.appendChild(tagI);
    tagTdName.appendChild(tagSelectTitle);
    tagTdSize.appendChild(tagSelectSize);
    tagTdInput.appendChild(tagInput);
    tagSupplier.appendChild(tagSelectSupplier);
    tagExport.appendChild(tagInputExport);
    tagTdBtn.appendChild(button);
    tagTr.appendChild(tagTdIndex);
    tagTr.appendChild(tagTdName);
    tagTr.appendChild(tagTdSize);
    tagTr.appendChild(tagTdInput);
    tagTr.appendChild(tagExport);
    tagTr.appendChild(tagSupplier);
    tagTr.appendChild(tagTdBtn);
    tagExport.appendChild(tagInputExport);
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
                const exportHidden = parentBtnDelete.querySelector('#exportAdd');
                selectHidden.setAttribute('disabled', 'disabled');
                sizeHidden.setAttribute('disabled', 'disabled');
                exportHidden.setAttribute('disabled', 'disabled');
                quantityHidden.setAttribute('disabled', 'disabled');
                parentBtnDelete.style.display = 'none';
            });
        });
    }
}
actions.addEventListener('change', (e) => {
    const dateShip = document.querySelector('.dateShip');
    if (e.target.value == 'export') {
        dateShip.style.display = 'flex';
    }
});
