function searchFilter() {
    const containSearch = document.querySelector('.search-contain');
    const inputSearch = document.querySelector('.search-input');
    const products = document.querySelectorAll('.search-contain__product');
    const searchForm = document.querySelector('#form-search');
    inputSearch.addEventListener('input', (e) => {
        const txtSearch = e.target.value.trim().toLowerCase();

        if (txtSearch.length == 0) {
            containSearch.style.display = 'none';
        } else {
            containSearch.style.display = 'block';
        }
        products.forEach((product) => {
            if (product.innerText.toLowerCase().includes(txtSearch)) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });
    });
    containSearch.addEventListener('blur', () => {
        products.forEach((product) => {
            product.style.display = 'none';
        });
    });
}
searchFilter();
