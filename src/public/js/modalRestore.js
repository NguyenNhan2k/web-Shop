document.addEventListener('DOMContentLoaded', () => {
    var restoreElement = document.querySelectorAll('#restore');
    var restoreSize = document.querySelectorAll('#restore-size');
    var restoreCategoryElement = document.querySelectorAll('#restore-category');
    var restoreSupplierElement = document.querySelectorAll('#restore-category-supplier');
    var restoreReceiptElement = document.querySelectorAll('#restore-receipt');
    var restoreOrderElement = document.querySelectorAll('#restore-order');
    var restoreStaff = document.querySelectorAll('#restore-staff');
    var restoreStatusOrderElement = document.querySelectorAll('#restore-statusOrder');
    var restoreCustomer = document.querySelectorAll('#restore-customer');
    var forceDestroy = document.querySelectorAll('#force_Destroy');
    var forceDestroySize = document.querySelectorAll('#force_Destroy-Size');
    var forceDestroyCategory = document.querySelectorAll('#force_Destroy-category');
    var forceDestroyStatusOrder = document.querySelectorAll('#force_Destroy-statusOrder');
    var forceDestroyStaff = document.querySelectorAll('#force_Destroy-staff');
    var forceDestroySupplier = document.querySelectorAll('#force_Destroy-supplier');
    var forceDestroyOrder = document.querySelectorAll('#force_Destroy-order');
    var forceDestroyReceipt = document.querySelectorAll('#force_Destroy-receipt');
    var forceDestroyCustomer = document.querySelectorAll('#force_Destroy-Customer');

    var formElement = document.forms['form-restore'];
    var backElement = document.querySelector('.back');
    var submitElement = document.querySelector('.delete_modal');
    var modal = document.querySelector('.modal');

    var forceIdProduct;
    var forceIdReceipt;
    var forceIdCustomer;
    var forceIdCategory;
    var forceIdOrder;
    var forceIdStaff;
    var forceIdSize;
    var forceIdStatusOrder;

    var idProduct;
    var idSize;
    var idStaff;
    var idCategory;
    var idSupplier;
    var idReceipt;
    var idOrder;
    var idCustomer;
    var idStatusOrder;

    // Khôi phục sản phẩm
    for (let i = 0; i < restoreStaff.length; i++) {
        restoreStaff[i].addEventListener('click', (e) => {
            e.preventDefault();
            idStaff = restoreStaff[i].dataset.id;
            formElement.action = `/staff/restore/` + `${idStaff}` + `?_method=PATCH`;
            formElement.submit();
        });
    }
    // Khôi phục nhân viên
    for (let i = 0; i < restoreElement.length; i++) {
        restoreElement[i].addEventListener('click', (e) => {
            e.preventDefault();
            idProduct = restoreElement[i].dataset.id;
            formElement.action = `/products/restore/` + `${idProduct}` + `?_method=PATCH`;
            formElement.submit();
        });
    }
    // Khôi phục size
    for (let i = 0; i < restoreSize.length; i++) {
        restoreSize[i].addEventListener('click', (e) => {
            e.preventDefault();
            idSize = restoreSize[i].dataset.id;
            formElement.action = `/sizeProduct/restore/` + `${idSize}` + `?_method=PATCH`;
            formElement.submit();
        });
    }
    // Khôi phục khách hàng
    for (let i = 0; i < restoreCustomer.length; i++) {
        restoreCustomer[i].addEventListener('click', (e) => {
            e.preventDefault();
            idCustomer = restoreCustomer[i].dataset.id;
            formElement.action = `/customers/restore/` + `${idCustomer}` + `?_method=PATCH`;
            formElement.submit();
        });
    }
    // Khôi phục đơn hàng
    for (let i = 0; i < restoreOrderElement.length; i++) {
        restoreOrderElement[i].addEventListener('click', (e) => {
            e.preventDefault();
            idOrder = restoreOrderElement[i].dataset.id;
            formElement.action = `/order/restore/` + `${idOrder}` + `?_method=PATCH`;
            formElement.submit();
        });
    }
    // Khôi phục NCC
    for (let i = 0; i < restoreSupplierElement.length; i++) {
        restoreElement[i].addEventListener('click', (e) => {
            e.preventDefault();
            idSupplier = restoreSupplierElement[i].dataset.id;
            formElement.action = `/supplier/restore/` + `${idSupplier}` + `?_method=PATCH`;
            formElement.submit();
        });
    }
    // Khôi phục mã nhập hàng
    for (let i = 0; i < restoreReceiptElement.length; i++) {
        restoreReceiptElement[i].addEventListener('click', (e) => {
            e.preventDefault();
            idReceipt = restoreReceiptElement[i].dataset.id;
            formElement.action = `/receipt/restore/` + `${idReceipt}` + `?_method=PATCH`;
            formElement.submit();
        });
    }
    // khôi phục danh mục
    for (let j = 0; j < restoreCategoryElement.length; j++) {
        restoreCategoryElement[j].addEventListener('click', (e) => {
            e.preventDefault();
            idCategory = restoreCategoryElement[j].dataset.id;
            console.log(idCategory);
            formElement.action = `/category/restore/` + `${idCategory}` + `?_method=PATCH`;
            formElement.submit();
        });
    }
    // khôi phục trang thai đơn hàng
    for (let j = 0; j < restoreStatusOrderElement.length; j++) {
        restoreStatusOrderElement[j].addEventListener('click', (e) => {
            e.preventDefault();
            idStatusOrder = restoreStatusOrderElement[j].dataset.id;
            formElement.action = `/statusOrder/restore/` + `${idStatusOrder}` + `?_method=PATCH`;
            formElement.submit();
        });
    }
    // Xóa vĩnh viễn 1 sản phầm
    for (let j = 0; j < forceDestroy.length; j++) {
        forceDestroy[j].addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            forceIdProduct = forceDestroy[j].dataset.id;
        });
    }
    // Xóa vĩnh viễn 1 phieu nhap
    for (let j = 0; j < forceDestroyReceipt.length; j++) {
        forceDestroyReceipt[j].addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            forceIdReceipt = forceDestroyReceipt[j].dataset.id;
        });
    }
    // Xóa vĩnh viễn 1 nhaan vien
    for (let j = 0; j < forceDestroyStaff.length; j++) {
        forceDestroyStaff[j].addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            forceIdStaff = forceDestroyStaff[j].dataset.id;
        });
    }
    // Xóa vĩnh viễn khách hàng
    for (let j = 0; j < forceDestroyCustomer.length; j++) {
        forceDestroyCustomer[j].addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            forceIdCustomer = forceDestroyCustomer[j].dataset.id;
        });
    }
    // Xóa vĩnh viễn 1 danh mục
    for (let j = 0; j < forceDestroyCategory.length; j++) {
        forceDestroyCategory[j].addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            forceIdCategory = forceDestroyCategory[j].dataset.id;
        });
    }
    // Xóa vĩnh viễn 1 đơn hàng
    for (let j = 0; j < forceDestroyOrder.length; j++) {
        forceDestroyOrder[j].addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            forceIdOrder = forceDestroyOrder[j].dataset.id;
        });
    }
    // Xóa vĩnh viễn 1 size san pham
    for (let j = 0; j < forceDestroySize.length; j++) {
        forceDestroySize[j].addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            forceIdSize = forceDestroySize[j].dataset.id;
        });
    }
    // Xóa vĩnh viễn 1 trang thái đơn hàng
    for (let j = 0; j < forceDestroyStatusOrder.length; j++) {
        forceDestroyStatusOrder[j].addEventListener('click', () => {
            modal.style.display = 'block';
            forceIdStatusOrder = forceDestroyStatusOrder[j].dataset.id;
        });
    }

    backElement.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    submitElement.addEventListener('click', () => {
        if (forceIdProduct) {
            formElement.action = `/products/force-destroy/` + `${forceIdProduct}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (forceIdSize) {
            formElement.action = `/sizeProduct/force-destroy/` + `${forceIdSize}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (forceIdCategory) {
            formElement.action = `/category/force-destroy/` + `${forceIdCategory}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (forceIdOrder) {
            formElement.action = `/order/force-destroy/` + `${forceIdOrder}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (forceIdStatusOrder) {
            formElement.action = `/statusOrder/force-destroy/` + `${forceIdStatusOrder}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (forceIdCustomer) {
            formElement.action = `/customers/force-destroy/` + `${forceIdCustomer}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (forceIdReceipt) {
            formElement.action = `/receipt/force-destroy/` + `${forceIdReceipt}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
        if (forceIdStaff) {
            formElement.action = `/staff/force-destroy/` + `${forceIdStaff}` + `?_method=DELETE`;
            formElement.submit();
            modal.style.display = 'none';
        }
    });

    var submitElement = document.querySelector('.submit');
    var checkAll = document.querySelector('#checkAll');
    var checkInputs = document.querySelectorAll('.form-check-input');
    checkAll.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        for (let i = 0; i < checkInputs.length; i++) {
            checkInputs[i].checked = isChecked;
        }
        renderSubmitBtn();
    });
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
        const countCheckedOrder = document.querySelectorAll('input[name="orders"]:checked').length;
        const countCheckedSize = document.querySelectorAll('input[name="sizes"]:checked').length;
        const countCheckedStatusOrder = document.querySelectorAll('input[name="statusOrders"]:checked').length;
        const countCheckedCustomers = document.querySelectorAll('input[name="customers"]:checked').length;
        const countCheckedStaff = document.querySelectorAll('input[name="staffs"]:checked').length;
        if (
            countChecked > 0 ||
            countCheckedCategory > 0 ||
            countCheckedSupplier > 0 ||
            countCheckedReceipt > 0 ||
            countCheckedOrder > 0 ||
            countCheckedCustomers > 0 ||
            countCheckedStatusOrder > 0 ||
            countCheckedSize > 0 ||
            countCheckedStaff > 0
        ) {
            submitElement.removeAttribute('disabled');
        } else {
            submitElement.setAttribute('disabled', 'disabled');
        }
    }
});
