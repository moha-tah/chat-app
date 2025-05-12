document.addEventListener('DOMContentLoaded', function () {
        const togglePasswordIcons = document.querySelectorAll('.toggle-password-icon');

        togglePasswordIcons.forEach(icon => {
            icon.addEventListener('click', function () {
                const passwordInput = this.previousElementSibling;
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Toggle the icon
                const iconElement = this.querySelector('i');
                if (type === 'password') {
                    iconElement.classList.remove('bi-eye-slash-fill');
                    iconElement.classList.add('bi-eye-fill');
                } else {
                    iconElement.classList.remove('bi-eye-fill');
                    iconElement.classList.add('bi-eye-slash-fill');
                }
            });
        });
    });