document.addEventListener('DOMContentLoaded', () => {
    // Check All selected products
    var submitElement = document.querySelector('.submit');
    var formReceipt = document.querySelector('.form-getProduct');
    var checkAll = document.querySelector('#checkAll');
    var checkInputs = document.querySelectorAll('.form-check-input');
    if (checkAll) {
        checkAll.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            for (let i = 0; i < checkInputs.length; i++) {
                checkInputs[i].checked = isChecked;
            }
            renderSubmitBtn();
        });
    }

    for (let i = 0; i < checkInputs.length; i++) {
        checkInputs[i].addEventListener('change', (e) => {
            const countChecked = document.querySelectorAll('input[name="products"]:checked').length;
            const isChecked = checkInputs.length === countChecked;
            checkAll.checked = isChecked;
            renderSubmitBtn();
        });
    }
    function renderSubmitBtn() {
        const countChecked = document.querySelectorAll('input[name="products"]:checked').length;
        const countCheckedCategory = document.querySelectorAll('input[name="categories"]:checked').length;
        const countCheckedSupplier = document.querySelectorAll('input[name="suppliers"]:checked').length;
        if (countChecked > 0 || countCheckedCategory > 0 || countCheckedSupplier > 0) {
            submitElement.removeAttribute('disabled');
        } else {
            submitElement.setAttribute('disabled', 'disabled');
        }
    }
    function handleBtnReceipt() {
        submitElement.addEventListener('click', () => {
            const inputChecked = document.querySelectorAll('input[name="products"]:checked');
            for (let i = 0; i < inputChecked.length; i++) {
                const parentElement = inputChecked[i].parentNode.parentNode;
                const nameProduct = parentElement.querySelector('.name').innerText;
                const sizeElement = parentElement.querySelectorAll('.size-Product');
                const supplierElement = parentElement.querySelectorAll('.supplier');
                const sizeText = [];
                const sizeId = [];
                const supplierText = [];
                const supplierId = [];
                sizeElement.forEach((size) => {
                    sizeText.push(size.innerText);
                });
                sizeElement.forEach((size) => {
                    sizeId.push(size.id);
                });
                supplierElement.forEach((supplier) => {
                    supplierText.push(supplier.innerText);
                });
                supplierElement.forEach((supplier) => {
                    supplierId.push(supplier.id);
                });

                addReceipt(nameProduct, sizeText, sizeId, supplierText, supplierId);
                const btnDeleteElements = document.querySelectorAll('.deleteReceipt');
                const tagTR = document.querySelector('.tagTR');
                for (let i = 0; i < btnDeleteElements.length; i++) {
                    btnDeleteElements[i].addEventListener('click', (e) => {
                        e.preventDefault();
                        const parentBtn = btnDeleteElements[i].parentElement.parentElement;
                        parentBtn.style.display = 'none';
                    });
                }
            }
        });

        function addReceipt(name, size, sizeId, supplier, supplierId) {
            const tableElement = document.querySelector('.tableReceipt');
            const tagTR = document.createElement('tr');
            tagTR.className = 'tagTR';
            const tdName = document.createElement('td');
            const inputName = document.createElement('input');
            tdName.innerHTML = name;
            inputName.setAttribute('value', name);
            inputName.id = 'name';
            inputName.name = 'name';
            inputName.hidden = true;
            tdName.appendChild(inputName);
            //Element td size ----- select Option
            const tdSize = document.createElement('td');
            const selectElement = document.createElement('select');
            selectElement.id = 'size';
            selectElement.name = 'size';
            selectElement.className = 'receipt--select';

            if (size) {
                for (let i = 0; i < size.length; i++) {
                    const optionELement = document.createElement('option');
                    optionELement.value = sizeId[i];
                    optionELement.text = size[i];
                    optionELement.className = 'selectAction--Receipt';
                    selectElement.appendChild(optionELement);
                }
            }
            //Element td suppliers ----- select Option
            const tdSupplier = document.createElement('td');
            const selectSupplier = document.createElement('select');
            selectSupplier.id = 'supplier';
            selectSupplier.name = 'supplier';
            selectSupplier.className = 'receipt--select';
            if (supplier) {
                for (let i = 0; i < supplier.length; i++) {
                    const optionELement = document.createElement('option');
                    optionELement.value = supplierId[i];
                    optionELement.text = supplier[i];
                    optionELement.className = 'selectAction--Receipt';
                    selectSupplier.appendChild(optionELement);
                }
            }
            //Element td input
            const tdQuantity = document.createElement('td');
            const inputQuantity = document.createElement('input');
            inputQuantity.type = 'number';
            inputQuantity.id = 'count';
            inputQuantity.name = 'count';
            inputQuantity.className = 'input-receipt';
            //Element td input exportPrice
            const tdExportPrice = document.createElement('td');
            const inputExportPrice = document.createElement('input');
            inputExportPrice.type = 'number';
            inputExportPrice.id = 'export_price';
            inputExportPrice.name = 'export_price';
            inputExportPrice.className = 'input-receipt';

            tdExportPrice.appendChild(inputExportPrice);
            tdQuantity.appendChild(inputQuantity);
            tdSize.appendChild(selectElement);
            tdSupplier.appendChild(selectSupplier);
            //Element btn delete
            const tdBtn = document.createElement('td');
            const btnDelete = document.createElement('button');
            const tagI = document.createElement('i');
            tagI.className = 'fa-solid fa-trash remove';
            btnDelete.className = 'deleteReceipt';
            btnDelete.appendChild(tagI);
            tdBtn.appendChild(btnDelete);
            tagTR.appendChild(tdName);
            tagTR.appendChild(tdSupplier);
            tagTR.appendChild(tdSize);
            tagTR.appendChild(tdQuantity);
            tagTR.appendChild(tdExportPrice);
            tagTR.appendChild(tdBtn);
            tableElement.appendChild(tagTR);
        }
    }
    handleBtnReceipt();
});
