document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  
    // Animate progress bars
    setTimeout(function() {
      const progressBars = document.querySelectorAll('.progress-bar');
      progressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = targetWidth;
      });
    }, 500);
  
    // Add click handlers for interactive elements
    document.querySelectorAll('.expandable-section').forEach(section => {
      const header = section.querySelector('.expandable-header');
      const content = section.querySelector('.expandable-content');
      
      header.addEventListener('click', () => {
        content.classList.toggle('expanded');
        header.classList.toggle('active');
      });
    });
  
    // Add typing effect to designated elements
    document.querySelectorAll('.typing-effect').forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      
      let i = 0;
      const speed = 50; // typing speed in milliseconds
      
      function typeWriter() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, speed);
        }
      }
      
      // Start typing effect when element is in viewport
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typeWriter();
            observer.unobserve(element);
          }
        });
      });
      
      observer.observe(element);
    });
  
    // Interactive tooltips
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      element.addEventListener('mouseenter', () => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        setTimeout(() => tooltip.classList.add('visible'), 10);
      });
      
      element.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
          tooltip.classList.remove('visible');
          setTimeout(() => tooltip.remove(), 300);
        }
      });
    });
  
    // Check for dark mode preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
      document.body.classList.add('dark-mode');
    }
  
    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '&uarr;';
    scrollToTopBtn.className = 'scroll-top-btn';
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  
    // Feature detection for advanced animations
    if ('IntersectionObserver' in window) {
      // Add parallax effect to hero sections
      document.querySelectorAll('.hero').forEach(hero => {
        hero.style.backgroundAttachment = 'fixed';
        window.addEventListener('scroll', () => {
          const scrollPosition = window.pageYOffset;
          hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        });
      });
    }
  });