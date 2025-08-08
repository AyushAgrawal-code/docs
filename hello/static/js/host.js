console.log("host.js loaded from:", document.currentScript?.src, "at", new Date().toISOString());

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('createEventForm');
  const steps = document.querySelectorAll('.form-step');
  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');

  const previewTitle = document.getElementById('previewTitle');
  const previewDate = document.getElementById('previewDate');
  const previewDescription = document.getElementById('previewDescription');
  const previewCover = document.getElementById('previewCover');

  const coverPhotoUpload = document.getElementById('coverPhotoUpload');
  const coverPhotoPreview = document.getElementById('coverPhotoPreview');

  const eventCodeDisplay = document.getElementById('eventCodeDisplay');
  const previewCode = document.getElementById('previewCode');
  const qrCodeContainer = document.getElementById('eventQRCode');

  let isSubmitting = false; // prevent duplicate submits

  // Step switching
  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      showStep(parseInt(button.getAttribute('data-next')));
    });
  });

  prevButtons.forEach(button => {
    button.addEventListener('click', () => {
      showStep(parseInt(button.getAttribute('data-prev')));
    });
  });

  function showStep(stepNumber) {
    steps.forEach(step => step.classList.remove('active'));
    document.querySelector(`.form-step[data-step="${stepNumber}"]`).classList.add('active');
  }

  // Event preview update
  form.addEventListener('input', function () {
    previewTitle.textContent = form.event_name.value || 'Event Name';
    previewDate.innerHTML = `<i class="far fa-calendar"></i> ${form.event_date.value || 'Event Date'}`;
    previewDescription.textContent = form.description.value || 'Event description will appear here...';
  });

  // Cover photo preview
  coverPhotoUpload.addEventListener('change', function () {
    const file = this.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        previewCover.style.backgroundImage = `url('${e.target.result}')`;
        previewCover.classList.add('has-image');
        coverPhotoPreview.innerHTML = '';
      };
      reader.readAsDataURL(file);
    }
  });

  // QR Code Generator
  function generateQRCode(text) {
    qrCodeContainer.innerHTML = ''; // clear previous
    new QRCode(qrCodeContainer, { text, width: 100, height: 100 });
  }

  // CSRF Token helper
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const csrftoken = getCookie('csrftoken');

  // ✅ Form submit (backend code only)
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (isSubmitting) return; // block double submit
    isSubmitting = true;

    const formData = new FormData(form);

    fetch(form.action || window.location.href, {
      method: 'POST',
      headers: { 'X-CSRFToken': csrftoken },
      body: formData
    })
      .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
      })
      .then(data => {
        isSubmitting = false;
        console.log("Response JSON:", data);

        if (data.success && data.event_code) {
          // ✅ Use backend-generated code only
          eventCodeDisplay.textContent = data.event_code;
          previewCode.textContent = data.event_code;
          generateQRCode(data.event_code);
          document.getElementById('successModal').style.display = 'block';
        } else {
          console.warn("Unexpected response:", data);
          alert(data.error || 'Something went wrong. Please try again.');
        }
      })
      .catch(error => {
        isSubmitting = false;
        console.error('Error submitting form:', error);
        alert('Something went wrong. Please try again.');
      });
  });

  // Share buttons
  document.getElementById('share-button-whatsapp').addEventListener('click', function () {
    const text = `Join my event using this code: ${eventCodeDisplay.textContent}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  });

  document.getElementById('share-button-email').addEventListener('click', function () {
    const subject = 'Join My Event on EchoMoments';
    const body = `Use this event code to join: ${eventCodeDisplay.textContent}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  document.getElementById('copy-link').addEventListener('click', function () {
    navigator.clipboard.writeText(eventCodeDisplay.textContent).then(() => {
      showToast('Event code copied!');
    });
  });

  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
  }
});
