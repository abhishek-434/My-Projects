// school.js

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate__animated", "animate__fadeInUp");
      }
    });
  }, {
    threshold: 0.2
  });

  document.querySelectorAll('.section-title, .event, .testimonial, .gallery img').forEach(el => {
    observer.observe(el);
  });
});

document.querySelectorAll('.gallery img').forEach(img => {
  img.classList.add('animate__animated', 'animate__zoomIn');
});

const sections = document.querySelectorAll('.about, .mission-vision');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate__animated', 'animate__fadeInUp');
    }
  });
}, {
  threshold: 0.2
});

sections.forEach(section => observer.observe(section));


