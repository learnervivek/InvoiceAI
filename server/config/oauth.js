const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/gmail.send',
];

const getAuthUrl = (redirectUri) => {
  const options = {
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  };
  if (redirectUri) {
    options.redirect_uri = redirectUri;
  }
  return oauth2Client.generateAuthUrl(options);
};

module.exports = { oauth2Client, getAuthUrl, SCOPES };
