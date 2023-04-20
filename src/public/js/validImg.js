function previewProfile() {
    var upload_img = '';
    const uploadInput = document.querySelector('.images--profile');
    const imgProfile = document.querySelector('.img-profile');
    uploadInput.addEventListener('change', () => {
        const reader = new FileReader();
        reader.onload = () => {
            imgProfile.setAttribute('src', reader.result);
        };
        reader.readAsDataURL(uploadInput.files[0]);
    });
}
previewProfile();
