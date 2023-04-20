document.addEventListener('DOMContentLoaded', () => {
    var deleteElement = document.querySelectorAll('#delete');
    var deleteSize = document.querySelectorAll('#delete-size');
    var deleteStaff = document.querySelectorAll('#delete-staff');
    var categoryElement = document.querySelectorAll('#delete-category');
    var statusOrderElement = document.querySelectorAll('#delete-statusOrder');
    var orderElement = document.querySelectorAll('#delete-order');
    var customerElement = document.querySelectorAll('#delete-customer');
    var receiptElement = document.querySelectorAll('#delete-receipt');
    var backElement = document.querySelector('.back');
    var submitElement = document.querySelector('.delete_modal');
    var modal = document.querySelector('.modal');
    var formElement = document.forms['form-delete'];
    var idProduct;
    var idCategory;
    var idSupplier;
    var idReceipt;
    var idSize;
    var idStaff;
    var idCustomer;
    var idOrder;
    var idStatusOrder;

    // Lắng nghe xóa nhân viên
    for (let i = 0; i < deleteStaff.length; i++) {
        deleteStaff[i].addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            idStaff = deleteStaff[i].dataset.id;
        });
    }
    // Lắng nghe click button nut xóa đơn hàng
    for (let i = 0; i < orderElement.length; i++) {
        orderElement[i].addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            idOrder = orderElement[i].dataset.id;
        });
    }
    // Lắng nghe click button nut xóa khách hàng
    for (let i = 0; i < customerElement.length; i++) {
        customerElement[i].addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            idCustomer = customerElement[i].dataset.id;
        });
    }
    // Lắng nghe click button nut xóa trạng thái đơn hàng
    for (let i = 0; i < statusOrderElement.length; i++) {
        statusOrderElement[i].addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            idStatusOrder = statusOrderElement[i].dataset.id;
        });
    }
    // Lắng nghe click button nut xóa Sản phẩm
    for (let i = 0; i < deleteElement.length; i++) {
        deleteElement[i].addEventListener('click', () => {
            modal.style.display = 'block';
            idProduct = deleteElement[i].dataset.id;
        });
    }
    // Xoa Receipt
    for (let i = 0; i < receiptElement.length; i++) {
        receiptElement[i].addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            idReceipt = receiptElement[i].dataset.id;
        });
    }
    // Lắng nghe click button nut xóa nha cung cap
    // for (let i = 0; i < deleteElement.length; i++) {
    //deleteElement[i].addEventListener('click', () => {
    // modal.style.display = 'block';
    //idSupplier = deleteElement[i].dataset.id;
    // });
    // }
    // Lắng nghe click button nut xóa size
    for (let i = 0; i < deleteSize.length; i++) {
        deleteSize[i].addEventListener('click', (e) => {
            modal.style.display = 'block';
            idSize = deleteSize[i].dataset.id;
        });
    }
    // Lắng nghe click button nut xóa danh mục
    for (let i = 0; i < categoryElement.length; i++) {
        categoryElement[i].addEventListener('click', () => {
            modal.style.display = 'block';
            idCategory = categoryElement[i].dataset.id;
        });
    }
    // Lắng nghe click button hủy
    backElement.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    // Lắng nghe click button xóa bỏ (submit)
    submitElement.addEventListener('click', () => {
        if (idProduct) {
            formElement.action = `/products/destroy/` + `${idProduct}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (idSize) {
            formElement.action = `/sizeProduct/destroy/` + `${idSize}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (idCategory) {
            formElement.action = `/category/destroy/` + `${idCategory}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (idSupplier) {
            formElement.action = `/supplier/destroy/` + `${idSupplier}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (idReceipt) {
            formElement.action = `/receipt/destroy/` + `${idReceipt}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (idOrder) {
            formElement.action = `/order/destroy/` + `${idOrder}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (idStatusOrder) {
            formElement.action = `/statusOrder/destroy/` + `${idStatusOrder}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (idCustomer) {
            formElement.action = `/customers/destroy/` + `${idCustomer}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (idStaff) {
            formElement.action = `/staff/destroy/` + `${idStaff}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
    });

    // Check All selected products
    var submitElement = document.querySelector('.submit');
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
            renderSubmitBtn();
        });
    }
    function renderSubmitBtn() {
        const countChecked = document.querySelectorAll('input[name="products"]:checked').length;
        const countCheckedCategory = document.querySelectorAll('input[name="categories"]:checked').length;
        const countCheckedSupplier = document.querySelectorAll('input[name="suppliers"]:checked').length;
        const countCheckedReceipt = document.querySelectorAll('input[name="receipts"]:checked').length;
        const countCheckedSize = document.querySelectorAll('input[name="sizes"]:checked').length;
        const countCheckedOrder = document.querySelectorAll('input[name="orders"]:checked').length;
        const countCheckedStatusOrder = document.querySelectorAll('input[name="statusOrders"]:checked').length;
        const countCheckedCustomer = document.querySelectorAll('input[name="customers"]:checked').length;
        const countCheckedStaff = document.querySelectorAll('input[name="staffs"]:checked').length;

        if (
            countChecked > 0 ||
            countCheckedCategory > 0 ||
            countCheckedSupplier > 0 ||
            countCheckedReceipt > 0 ||
            countCheckedReceipt > 0 ||
            countCheckedOrder > 0 ||
            countCheckedStatusOrder > 0 ||
            countCheckedCustomer > 0 ||
            countCheckedSize > 0 ||
            countCheckedStaff > 0
        ) {
            submitElement.removeAttribute('disabled');
        } else {
            submitElement.setAttribute('disabled', 'disabled');
        }
    }
});
