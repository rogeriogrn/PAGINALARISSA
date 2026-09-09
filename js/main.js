document.addEventListener('DOMContentLoaded', () => {
  const formatBRL = value => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0
  }).format(value);

  const sliders = {
    clients: document.querySelector('#calc-clients'),
    days: document.querySelector('#calc-days'),
    ticket: document.querySelector('#calc-ticket')
  };

  function updateCalculator() {
    if (!sliders.clients || !sliders.days || !sliders.ticket) return;
    const clients = Number(sliders.clients.value);
    const days = Number(sliders.days.value);
    const ticket = Number(sliders.ticket.value);
    const daily = clients * ticket;
    const weekly = daily * days;
    document.querySelector('#calc-clients-val').textContent = clients;
    document.querySelector('#calc-days-val').textContent = days;
    document.querySelector('#calc-ticket-val').textContent = formatBRL(ticket);
    document.querySelector('#calc-daily-total').textContent = formatBRL(daily);
    document.querySelector('#calc-weekly-total').textContent = formatBRL(weekly);
    document.querySelector('#calc-monthly-total').textContent = formatBRL(weekly * 4);
  }

  Object.values(sliders).forEach(slider => slider?.addEventListener('input', updateCalculator));
  updateCalculator();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  const sticky = document.querySelector('#sticky-buy');
  const hero = document.querySelector('.hero');
  const offer = document.querySelector('#oferta');
  if (sticky && hero && offer && 'IntersectionObserver' in window) {
    let heroVisible = true;
    let offerVisible = false;
    const renderSticky = () => {
      const visible = !heroVisible && !offerVisible;
      sticky.classList.toggle('visible', visible);
      sticky.setAttribute('aria-hidden', String(!visible));
    };
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      renderSticky();
    }, { threshold: .05 }).observe(hero);
    new IntersectionObserver(([entry]) => {
      offerVisible = entry.isIntersecting;
      renderSticky();
    }, { threshold: .08 }).observe(offer);
  }

  const carousel = document.querySelector('#social-proof-carousel');
  const counter = document.querySelector('#proof-counter');
  const carouselButtons = document.querySelectorAll('[data-carousel-direction]');
  if (carousel && counter && carouselButtons.length) {
    const slides = Array.from(carousel.querySelectorAll('.proof-slide'));

    const getStep = () => {
      const firstSlide = slides[0];
      if (!firstSlide) return carousel.clientWidth;
      const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
      return firstSlide.getBoundingClientRect().width + gap;
    };

    const getIndex = () => Math.max(0, Math.min(slides.length - 1, Math.round(carousel.scrollLeft / getStep())));

    const updateCarousel = () => {
      const index = getIndex();
      const maxScroll = carousel.scrollWidth - carousel.clientWidth - 2;
      counter.textContent = `${index + 1} / ${slides.length}`;
      carouselButtons.forEach(button => {
        const direction = button.dataset.carouselDirection;
        button.disabled = direction === 'previous' ? carousel.scrollLeft <= 2 : carousel.scrollLeft >= maxScroll;
      });
    };

    carouselButtons.forEach(button => {
      button.addEventListener('click', () => {
        const multiplier = button.dataset.carouselDirection === 'next' ? 1 : -1;
        carousel.scrollBy({ left: getStep() * multiplier, behavior: reducedMotion ? 'auto' : 'smooth' });
      });
    });

    carousel.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const multiplier = event.key === 'ArrowRight' ? 1 : -1;
      carousel.scrollBy({ left: getStep() * multiplier, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
    carousel.addEventListener('scroll', updateCarousel, { passive: true });
    window.addEventListener('resize', updateCarousel, { passive: true });
    updateCarousel();
  }
});
