// Token Management
let tokenData = {
  count: 50,
  lastReset: Date.now(),
  isLoggedIn: false,
  user: null
};

// Initialize token system
function initTokenSystem() {
  // Check if token data exists in localStorage
  const savedTokenData = localStorage.getItem('tokenData');
  if (savedTokenData) {
    tokenData = JSON.parse(savedTokenData);
  }
  
  // Check if tokens need to be reset
  checkTokenReset();
  
  // Update UI
  updateTokenDisplay();
  
  // Check if user is logged in
  if (tokenData.isLoggedIn) {
    showUserMenu();
  }
  
  // Start token countdown
  startTokenCountdown();
}

// Check if tokens need to be reset
function checkTokenReset() {
  const now = Date.now();
  const resetTime = tokenData.isLoggedIn ? 2.5 * 60 * 60 * 1000 : 3 * 60 * 60 * 1000; // 2.5 hours for logged-in, 3 hours for guests
  
  if (now - tokenData.lastReset >= resetTime) {
    tokenData.count = tokenData.isLoggedIn ? 100 : 50;
    tokenData.lastReset = now;
    saveTokenData();
  }
}

// Save token data to localStorage
function saveTokenData() {
  localStorage.setItem('tokenData', JSON.stringify(tokenData));
}

// Update token display
function updateTokenDisplay() {
  document.getElementById('tokenCount').textContent = tokenData.count;
}

// Start token countdown
function startTokenCountdown() {
  setInterval(() => {
    const now = Date.now();
    const resetTime = tokenData.isLoggedIn ? 2.5 * 60 * 60 * 1000 : 3 * 60 * 60 * 1000;
    const timeUntilReset = resetTime - (now - tokenData.lastReset);
    
    if (timeUntilReset <= 0) {
      checkTokenReset();
      updateTokenDisplay();
    } else {
      const hours = Math.floor(timeUntilReset / (60 * 60 * 1000));
      const minutes = Math.floor((timeUntilReset % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((timeUntilReset % (60 * 1000)) / 1000);
      
      document.getElementById('tokenReset').textContent = 
        `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

// Use a token
function useToken() {
  if (tokenData.count > 0) {
    tokenData.count--;
    saveTokenData();
    updateTokenDisplay();
    return true;
  } else {
    showNotification('You have run out of tokens! Please wait for the reset.');
    return false;
  }
}

// Login Modal Functions
function openLoginModal() {
  document.getElementById('loginModal').classList.add('active');
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('active');
}

function openRegisterModal() {
  document.getElementById('registerModal').classList.add('active');
}

function closeRegisterModal() {
  document.getElementById('registerModal').classList.remove('active');
}

function switchToRegister() {
  closeLoginModal();
  openRegisterModal();
}

function switchToLogin() {
  closeRegisterModal();
  openLoginModal();
}

// Handle login
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // For demo purposes, we'll just simulate a successful login
  // In a real application, you would validate against a server
  
  // Simulate login success
  tokenData.isLoggedIn = true;
  tokenData.user = {
    email: email,
    name: email.split('@')[0] // Extract name from email for demo
  };
  
  // Reset tokens for logged-in user
  tokenData.count = 100;
  tokenData.lastReset = Date.now();
  
  saveTokenData();
  updateTokenDisplay();
  showUserMenu();
  closeLoginModal();
  
  showNotification('Login successful! You now have 100 tokens.');
}

// Handle register
function handleRegister(event) {
  event.preventDefault();
  
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  
  // Validate passwords match
  if (password !== confirmPassword) {
    showNotification('Passwords do not match!');
    return;
  }
  
  // For demo purposes, we'll just simulate a successful registration
  // In a real application, you would send this data to a server
  
  // Simulate registration success and auto-login
  tokenData.isLoggedIn = true;
  tokenData.user = {
    email: email,
    name: name
  };
  
  // Reset tokens for logged-in user
  tokenData.count = 100;
  tokenData.lastReset = Date.now();
  
  saveTokenData();
  updateTokenDisplay();
  showUserMenu();
  closeRegisterModal();
  
  showNotification('Registration successful! You now have 100 tokens.');
}

// Show user menu
function showUserMenu() {
  document.getElementById('loginBtn').style.display = 'none';
  document.getElementById('userMenu').style.display = 'block';
  
  // Set user avatar
  if (tokenData.user && tokenData.user.name) {
    document.getElementById('userAvatar').textContent = tokenData.user.name.charAt(0).toUpperCase();
  }
}

// Hide user menu
function hideUserMenu() {
  document.getElementById('loginBtn').style.display = 'flex';
  document.getElementById('userMenu').style.display = 'none';
}

// Toggle user dropdown
function toggleUserDropdown() {
  document.getElementById('userDropdown').classList.toggle('active');
}

// Logout
function logout() {
  tokenData.isLoggedIn = false;
  tokenData.user = null;
  
  // Reset tokens for guest user
  tokenData.count = 50;
  tokenData.lastReset = Date.now();
  
  saveTokenData();
  updateTokenDisplay();
  hideUserMenu();
  
  showNotification('You have been logged out.');
}

// Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
  // Initialize token system
  initTokenSystem();
  
  // Check for saved theme preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Theme toggle functionality
  document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Mobile menu toggle
  document.getElementById('mobileMenuToggle').addEventListener('click', function() {
    document.getElementById('navLinks').classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      document.getElementById('navLinks').classList.remove('active');
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// FAQ Toggle
function toggleFAQ(element) {
  const answer = element.nextElementSibling;
  const allQuestions = document.querySelectorAll('.faq-question');
  const allAnswers = document.querySelectorAll('.faq-answer');
  
  // Close all other FAQs
  allQuestions.forEach(q => {
    if (q !== element) {
      q.classList.remove('active');
    }
  });
  
  allAnswers.forEach(a => {
    if (a !== answer) {
      a.classList.remove('active');
    }
  });
  
  // Toggle current FAQ
  element.classList.toggle('active');
  answer.classList.toggle('active');
}

// FAQ Tab Switching
function switchTab(tabName) {
  // Update tab states
  document.querySelectorAll('.faq-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Update content visibility
  document.querySelectorAll('.faq-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(tabName).classList.add('active');
}

// Newsletter Subscription
function subscribeNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  
  // Show notification
  showNotification(`Successfully subscribed with ${email}!`);
  
  // Clear form
  event.target.reset();
}

// Show Notification
function showNotification(message) {
  const notification = document.getElementById('notification');
  document.getElementById('notificationText').textContent = message;
  notification.classList.add('show');
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Add scroll effect to header
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    if (document.body.classList.contains('dark-mode')) {
      header.style.background = 'rgba(30, 30, 46, 0.98)';
    }
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    if (document.body.classList.contains('dark-mode')) {
      header.style.background = 'rgba(30, 30, 46, 0.95)';
    }
  }
});

// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
  const elementsToAnimate = document.querySelectorAll('.card, .faq-item');
  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const userMenu = document.getElementById('userMenu');
  const userDropdown = document.getElementById('userDropdown');
  
  if (userMenu && userDropdown && !userMenu.contains(event.target)) {
    userDropdown.classList.remove('active');
  }
});