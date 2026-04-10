// --- INTERACTION LOGIC ---
// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    const isOpen = !menu.classList.contains('translate-x-full');

    if (isOpen) {
        menu.classList.add('translate-x-full');
        document.body.style.overflow = 'auto';
    } else {
        menu.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
    }
}



// Horizontal Scroll for Study Area
function scrollStudy(direction) {
    const container = document.getElementById('study-scroll-container');
    if (container) {
        // Scroll amount corresponds to card width + gap approx
        const scrollAmount = 400;
        if (direction === '+') {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    }
}

 // Specific script for the sticky header transition
//  This is for all pages to use and make header transition smooter 
 window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar && window.scrollY > 50) {
        navbar.classList.add('py-3');
        navbar.classList.remove('py-6');
    } else if (navbar) {
        navbar.classList.add('py-6');
        navbar.classList.remove('py-3');
    }
});

// function for FAQs visibility and hidden accordingly when click
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      answer.classList.toggle('hidden');
    });
  });

// Determine basePath based on where main.js is loaded from
const scripts = document.getElementsByTagName('script');
let basePath = '';
for (let script of scripts) {
    let src = script.getAttribute('src');
    if (src && src.includes('/Assets/main.js')) {
        basePath = src.replace('Assets/main.js', '');
        break;
    }
}

// load each navbar and footer to each file 
function loadComponent(id, file) {
    return fetch(file)
      .then(response => {
          if (!response.ok) throw new Error(`Could not load ${file}`);
          return response.text();
      })
      .then(data => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = data;
            
            // Fix relative paths in the loaded component if we are in a subdirectory
            if (basePath && basePath !== '') {
                const elements = el.querySelectorAll('[href], [src]');
                elements.forEach(element => {
                    const href = element.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('/') && !href.startsWith('mailto:')) {
                        element.setAttribute('href', basePath + href);
                    }
                    
                    const src = element.getAttribute('src');
                    if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/') && !src.startsWith('#')) {
                        element.setAttribute('src', basePath + src);
                    }
                });
                
                const onclickElements = el.querySelectorAll('[onclick]');
                onclickElements.forEach(element => {
                    const onclick = element.getAttribute('onclick');
                    if (onclick && onclick.includes("window.location.href='") && !onclick.includes("http")) {
                        element.setAttribute('onclick', onclick.replace("window.location.href='", "window.location.href='" + basePath));
                    }
                });
            }
        }
      })
      .catch(err => console.error('Error loading component:', err));
}

Promise.all([
    loadComponent("navbar", basePath + "components/navbar.html"),
    loadComponent("footer", basePath + "components/footer.html")
]).then(() => {
    // Initialize Icons after components are fully loaded
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});




// Page announcement popUp logic
let currentSlide = 0;
const slider = document.getElementById("slider");
const slides = document.querySelectorAll("#slider > div");
const dots = document.querySelectorAll(".dot");
const progressBar = document.getElementById("progressBar");

let autoSlide = setInterval(nextSlide, 5000);

function startProgress() {
  progressBar.style.width = "0%";
  setTimeout(() => {
    progressBar.style.width = "100%";
  }, 50);
}

function updateSlider() {
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle("opacity-100", i === currentSlide);
    dot.classList.toggle("opacity-40", i !== currentSlide);
    dot.classList.toggle("scale-110", i === currentSlide);
  });

  startProgress();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlider();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateSlider();
}

// Pause on hover
slider.addEventListener("mouseenter", () => clearInterval(autoSlide));
slider.addEventListener("mouseleave", () => {
  autoSlide = setInterval(nextSlide, 5000);
  startProgress();
});

// Close animation
function closeAnnouncement() {
  const modal = document.getElementById("announcementModal");
  modal.classList.add("opacity-0", "scale-95");
  setTimeout(() => modal.style.display = "none", 300);
}

// Start animation on load
startProgress();