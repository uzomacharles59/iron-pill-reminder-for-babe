const https = require('https');
const querystring = require('querystring');

const TEXTBELT_KEY = '5ae0eb82f1a01d124562ee7cf7b2f7fe79b47f9eMFwl3tZ1Cb0uN2GUnvXnHm4TZ';
const PHONE = '+12163928538';

const smsMessages = [
  "Hi Doctor M! 💊 Time for your iron pill. Your health matters more than you know. Take it with a little water and a big smile. Sweet dreams tonight.",
  "Good evening, Doctor M 🌙 Your daily iron reminder is here. A healthy you is the greatest gift. Don't forget your pill tonight!",
  "Hey Doctor M 💊 9 PM means iron pill time! You spend your days healing others, now let this little pill do something for you. Rest well tonight.",
  "Evening reminder, Doctor M! 🌹 Your iron pill is waiting. Take care of yourself the way you take care of everyone else. Goodnight!",
  "Doctor M, your daily iron pill reminder! 💊 Consistency is everything. One small habit, one healthier you. Have a beautiful night.",
  "Hi Doctor M! Just a gentle nudge to take your iron pill tonight. You deserve to feel your absolute best every single day. Goodnight 🌙",
  "Iron pill time, Doctor M! 💊 You are brilliant, you are strong, and you deserve to be healthy. One pill, one step. Sweet dreams!",
  "Good evening Doctor M 🌹 Don't forget your iron pill tonight! Small habits build great health. Wishing you a peaceful and restful night.",
  "Hey Doctor M! 💊 Your 9 PM iron reminder. You heal so many lives, let this pill take care of yours. Goodnight and sweet dreams!",
  "Evening Doctor M! Time for your iron pill 💊 Your consistency this week has been amazing. Keep going, you are doing great. Goodnight!",
];

exports.handler = async function(event, context) {
  const idx = Math.floor(Date.now() / 86400000) % smsMessages.length;
  const message = smsMessages[idx];

  const postData = querystring.stringify({
    phone: PHONE,
    message: message,
    key: TEXTBELT_KEY,
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'textbelt.com',
      path: '/text',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Textbelt response:', data);
        resolve({
          statusCode: 200,
          body: JSON.stringify({ sent: true, response: data }),
        });
      });
    });
    req.on('error', (e) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ sent: false, error: e.message }),
      });
    });
    req.write(postData);
    req.end();
  });
};