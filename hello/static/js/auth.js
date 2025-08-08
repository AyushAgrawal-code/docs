
document.addEventListener('DOMContentLoaded', function() {
  // Toggle password visibility
    // const togglePasswordButton = document.querySelector('.toggle-password');
    // const passwordInput = document.querySelector('#login-password');
    // const icon = togglePasswordButton.querySelector('i');

    // togglePasswordButton.addEventListener('click', function () {
    //   const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    //   passwordInput.setAttribute('type', type);

    //   // Toggle icon class
    //   if (type === 'text') {
    //     icon.classList.remove('fa-eye');
    //     icon.classList.add('fa-eye-slash');
    //   } else {
    //     icon.classList.remove('fa-eye-slash');
    //     icon.classList.add('fa-eye');
    //   }
    // });

  
  // Switch between login and signup forms
  const switchButtons = document.querySelectorAll('.switch-auth-mode');
  
  switchButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = this.getAttribute('data-target');
      const currentPanel = document.querySelector('.auth-form-panel.active');
      const targetPanel = document.getElementById(target + '-panel');
      
      if (currentPanel && targetPanel) {
        // Animate out current panel
        currentPanel.style.transform = target === 'signup' ? 'translateX(-50px)' : 'translateX(50px)';
        currentPanel.style.opacity = '0';
        
        // After animation completes, swap active class
        setTimeout(() => {
          currentPanel.classList.remove('active');
          targetPanel.classList.add('active');
          
          // Reset transform of target panel before fading in
          targetPanel.style.transform = target === 'signup' ? 'translateX(50px)' : 'translateX(-50px)';
          
          // Force reflow
          void targetPanel.offsetWidth;
          
          // Animate in target panel
          targetPanel.style.transform = 'translateX(0)';
          targetPanel.style.opacity = '1';
        }, 300);
      }
    });
  });
  
  // Password strength meter
  const signupPassword = document.getElementById('signup-password');
  const strengthBar = document.querySelector('.strength-progress');
  const strengthText = document.querySelector('.strength-text');
  
  if (signupPassword) {
    signupPassword.addEventListener('input', function() {
      const password = this.value;
      let strength = 0;
      
      // Calculate password strength
      if (password.length >= 8) strength += 25;
      if (password.match(/[a-z]/)) strength += 15;
      if (password.match(/[A-Z]/)) strength += 20;
      if (password.match(/[0-9]/)) strength += 20;
      if (password.match(/[^a-zA-Z0-9]/)) strength += 20;
      
      // Cap at 100%
      strength = Math.min(strength, 100);
      
      // Update UI
      strengthBar.style.width = strength + '%';
      
      // Set color based on strength
      if (strength < 30) {
        strengthBar.style.backgroundColor = '#f56565';
        strengthText.textContent = 'Weak password';
      } else if (strength < 70) {
        strengthBar.style.backgroundColor = '#ed8936';
        strengthText.textContent = 'Moderate password';
      } else {
        strengthBar.style.backgroundColor = '#48bb78';
        strengthText.textContent = 'Strong password';
      }
    });
  }
  
  // Form validation and submission
  const loginForm = document.querySelector('#login-panel form');
  const signupForm = document.querySelector('#signup-panel form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      // e.preventDefault();
      
      // Get form values
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      // Here you would typically send a request to your authentication endpoint
      // For demo purposes, we'll just show a success message
      console.log('Login attempt with:', { email });
      
      // Show success message (in a real app, you would redirect after successful authentication)
      showToast('Successfully logged in!', 'success');
      
      // Redirect after a delay (simulating server response time)
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    });
  }
  
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      // e.preventDefault();
      
      // Get form values
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const termsAccepted = document.getElementById('terms').checked;
      
      // Validate form
      if (!termsAccepted) {
        showToast('Please accept the Terms of Service', 'error');
        return;
      }
      
      // Here you would typically send a request to your registration endpoint
      console.log('Signup attempt with:', { name, email,password });
      
      // Show success message
      showToast('Account created successfully!', 'success');
      
      // Redirect after a delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    });
  }

});