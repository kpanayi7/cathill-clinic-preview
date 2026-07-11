// Shared behaviour: mobile nav, scroll reveals, generic demo forms

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Demo forms: swap for a success note instead of submitting
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var note = form.querySelector('.form-success');
      if (note) {
        note.style.display = 'block';
        note.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.querySelectorAll('input, select, textarea, button[type="submit"]').forEach(function (el) {
        el.disabled = true;
      });
    });
  });
});
