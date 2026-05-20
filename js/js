// Interactive behavior for CarlosFINAL.html. Loaded at the end of the body.
(function () {
  var header = document.getElementById('site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 48);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  var bookingForm = document.getElementById('bookingForm');
  var bookingStatus = document.getElementById('bookingStatus');
  var bookingSubmit = document.getElementById('bookingSubmit');
  var preferredDate = document.getElementById('preferredDate');

  function setBookingStatus(message, type) {
    if (!bookingStatus) return;
    bookingStatus.textContent = message;
    bookingStatus.className = 'booking-status';
    if (type) {
      bookingStatus.classList.add(type);
    }
  }

  function cleanValue(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
  }

  function updateInvalidFields(form, showErrors) {
    form.querySelectorAll('.booking-field').forEach(function (field) {
      var control = field.querySelector('input, select, textarea');
      field.classList.toggle('is-invalid', !!showErrors && !!control && !control.validity.valid);
    });
  }

  function getBookingData(form) {
    var formData = new FormData(form);
    return {
      contactName: cleanValue(formData.get('contactName')),
      playerName: cleanValue(formData.get('playerName')),
      phone: cleanValue(formData.get('phone')),
      email: cleanValue(formData.get('email')).toLowerCase(),
      playerAgeGroup: cleanValue(formData.get('playerAgeGroup')),
      sessionType: cleanValue(formData.get('sessionType')),
      preferredDate: cleanValue(formData.get('preferredDate')),
      preferredTime: cleanValue(formData.get('preferredTime')),
      trainingGoals: cleanValue(formData.get('trainingGoals')),
      bookingConsent: formData.get('bookingConsent') === 'agreed'
    };
  }

  function getLocalDateString(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  if (preferredDate) {
    preferredDate.min = getLocalDateString(new Date());
  }

  if (bookingForm) {
    bookingForm.addEventListener('input', function () {
      updateInvalidFields(bookingForm, bookingForm.classList.contains('was-submitted'));
      setBookingStatus('', '');
    });

    bookingForm.addEventListener('change', function () {
      updateInvalidFields(bookingForm, bookingForm.classList.contains('was-submitted'));
      setBookingStatus('', '');
    });

    bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();
      setBookingStatus('', '');
      bookingForm.classList.add('was-submitted');
      updateInvalidFields(bookingForm, true);

      if (bookingForm.elements.website && bookingForm.elements.website.value) {
        setBookingStatus('Your request could not be submitted. Please try again.', 'error');
        return;
      }

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        setBookingStatus('Please complete the highlighted fields before submitting.', 'error');
        return;
      }

      var bookingData = getBookingData(bookingForm);

      if (!bookingData.bookingConsent) {
        setBookingStatus('Please agree to be contacted about this booking request.', 'error');
        return;
      }

      if (bookingSubmit) {
        bookingSubmit.disabled = true;
        bookingSubmit.textContent = 'Request Prepared';
      }

      console.info('Booking request ready for backend:', bookingData);

      // Future backend connection:
      // fetch(bookingForm.dataset.endpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(bookingData)
      // });

      setBookingStatus('Booking request prepared. Next step: connect this to your backend/database endpoint.', 'success');
      bookingForm.reset();
      bookingForm.classList.remove('was-submitted');
      updateInvalidFields(bookingForm, false);

      window.setTimeout(function () {
        if (bookingSubmit) {
          bookingSubmit.disabled = false;
          bookingSubmit.textContent = 'Submit Booking Request';
        }
      }, 800);
    });
  }
})();
