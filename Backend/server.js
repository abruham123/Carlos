require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_ROOT = path.join(__dirname, '..');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseServiceRoleKey);

const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: true
}));
app.use(express.json({
  limit: '25kb'
}));
app.use(express.static(SITE_ROOT));

function cleanValue(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9+() .-]{7,20}$/.test(phone);
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
}

function isPastDate(value) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const submittedDate = new Date(`${value}T00:00:00`);
  submittedDate.setHours(0, 0, 0, 0);

  return submittedDate < today;
}

function normalizeBooking(body) {
  return {
    contactName: cleanValue(body.contactName),
    playerName: cleanValue(body.playerName),
    phone: cleanValue(body.phone),
    email: cleanValue(body.email).toLowerCase(),
    playerAgeGroup: cleanValue(body.playerAgeGroup),
    sessionType: cleanValue(body.sessionType),
    preferredDate: cleanValue(body.preferredDate),
    preferredTime: cleanValue(body.preferredTime),
    trainingGoals: cleanValue(body.trainingGoals),
    bookingConsent: body.bookingConsent === true,
    website: cleanValue(body.website)
  };
}

function validateBooking(booking) {
  const errors = [];

  if (booking.website) {
    errors.push({ field: 'website', message: 'Spam check failed.' });
  }

  if (!booking.contactName || booking.contactName.length > 80) {
    errors.push({ field: 'contactName', message: 'Enter a contact name under 80 characters.' });
  }

  if (!booking.playerName || booking.playerName.length > 80) {
    errors.push({ field: 'playerName', message: 'Enter a player name under 80 characters.' });
  }

  if (!isValidPhone(booking.phone)) {
    errors.push({ field: 'phone', message: 'Enter a valid phone number.' });
  }

  if (!booking.email || booking.email.length > 120 || !isValidEmail(booking.email)) {
    errors.push({ field: 'email', message: 'Enter a valid email address.' });
  }

  if (!booking.playerAgeGroup) {
    errors.push({ field: 'playerAgeGroup', message: 'Select a player age group.' });
  }

  if (!booking.sessionType) {
    errors.push({ field: 'sessionType', message: 'Select a session type.' });
  }

  if (!isValidIsoDate(booking.preferredDate) || isPastDate(booking.preferredDate)) {
    errors.push({ field: 'preferredDate', message: 'Choose today or a future date.' });
  }

  if (!booking.preferredTime) {
    errors.push({ field: 'preferredTime', message: 'Select a preferred time.' });
  }

  if (booking.trainingGoals.length > 600) {
    errors.push({ field: 'trainingGoals', message: 'Training goals must stay under 600 characters.' });
  }

  if (!booking.bookingConsent) {
    errors.push({ field: 'bookingConsent', message: 'Consent is required before submitting.' });
  }

  return errors;
}

function toSupabaseRow(booking) {
  return {
    contact_name: booking.contactName,
    player_name: booking.playerName,
    phone: booking.phone,
    email: booking.email,
    player_age_group: booking.playerAgeGroup,
    session_type: booking.sessionType,
    preferred_date: booking.preferredDate,
    preferred_time: booking.preferredTime,
    training_goals: booking.trainingGoals || null,
    consent_given: booking.bookingConsent,
    status: 'new'
  };
}

app.get('/api/health', function (_req, res) {
  res.json({
    success: true,
    message: 'Todo Fut Booking API is running.',
    supabaseConfigured: hasSupabaseConfig
  });
});

app.post('/api/bookings', async function (req, res) {
  const booking = normalizeBooking(req.body || {});
  const errors = validateBooking(booking);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Please check the booking request and try again.',
      errors
    });
  }

  if (!supabase) {
    return res.status(503).json({
      success: false,
      message: 'Booking storage is not configured yet. Add Supabase values to backend/.env.'
    });
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert(toSupabaseRow(booking))
    .select('id')
    .single();

  if (error) {
    console.error('Supabase insert failed:', error);
    return res.status(500).json({
      success: false,
      message: 'The booking request could not be saved. Please try again later.'
    });
  }

  return res.status(201).json({
    success: true,
    message: 'Booking request received.',
    bookingId: data.id
  });
});

app.get('*', function (_req, res) {
  res.sendFile(path.join(SITE_ROOT, 'CarlosFINAL.html'));
});

app.listen(PORT, function () {
  console.log(`Todo Fut site and API running at http://localhost:${PORT}`);
  console.log(`Booking endpoint: http://localhost:${PORT}/api/bookings`);
});
