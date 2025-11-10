// Unified landing page enhancements (merged from legacy + new landing-page-new/script.js)
(function(){
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if(!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null,'',href);
      }
    });
  });

  // Navbar scroll shadow effect
  const navbar = document.querySelector('.navbar');
  if(navbar){
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 50 ? '0 2px 20px rgba(0,0,0,0.15)' : 'none';
    });
  }

  // IntersectionObserver animations
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('animate-in'); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.feature-card, .template-card, .pricing-card, .comparison-item, .template-showcase-card').forEach(el => observer.observe(el));

  // Inject animation CSS once
  const animStyle = document.createElement('style');
  animStyle.textContent = `
    .feature-card, .template-card, .pricing-card, .comparison-item, .template-showcase-card { opacity:0; transform:translateY(20px); transition:all .6s ease; }
    .feature-card.animate-in, .template-card.animate-in, .pricing-card.animate-in, .comparison-item.animate-in, .template-showcase-card.animate-in { opacity:1; transform:translateY(0); }
  `;
  document.head.appendChild(animStyle);

  // Button transient loading state (emails only)
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(){
      if(this.dataset.loadingApplied) return; // avoid stacking
      const original = this.textContent;
      this.dataset.loadingApplied = 'true';
      this.classList.add('btn-loading');
      this.textContent = 'Processing…';
      setTimeout(()=>{ this.textContent = original; this.classList.remove('btn-loading'); this.dataset.loadingApplied=''; }, 900);
    });
  });

  // Lightweight syntax highlight for YAML snippet
  document.querySelectorAll('pre code').forEach(code => {
    code.innerHTML = code.innerHTML
      .replace(/\b(apiVersion|kind|metadata|steps|uses|needs|outputs|name|compliance)\b/g,'<span style="color:#93c5fd">$1</span>')
      .replace(/("[^"]+"|'[^']+')/g,'<span style="color:#c3e88d">$1</span>')
      .replace(/\b(true|false|null)\b/g,'<span style="color:#f78c6c">$1</span>');
  });

  // Public key fingerprint injection from securamem-public-keys.json if available
  try {
    fetch('../securamem-public-keys.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if(!data || !data.keys || !data.keys.length) return;
        const fp = data.keys[0].fingerprint;
        window.SECURAMEM_PUBLIC_KEY = fp;
        const pkEls = [document.getElementById('pk-fingerprint'), document.getElementById('hero-pk')];
        pkEls.forEach(el => { if(el) el.textContent = fp; });
        try { localStorage.setItem('securamem.publicKey', fp); } catch(e) {}
      }).catch(()=>{});
  } catch(e) { /* non-fatal */ }
})();
