// JS Animation Initialization
document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
    });
});

// Smooth scroll to Apply section if needed in future
document.querySelectorAll('.btn-apply').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector('#apply');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
