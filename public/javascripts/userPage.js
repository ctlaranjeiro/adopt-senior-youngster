const User = require('../models/user');
const Volunteer = require('../models/volunteer');

if (!user.assignedVolunteers.length) {
  document.getElementById('user-volunteers').innerHTML = 
  `
    <p>{{user.firstName}} {{user.lastName}} has no volunteers assigned!</p>
  `;
} else {
  let assignedVolunteers = user.assignedVolunteers;
  document.getElementById('volunteersList').innerHTML = assignedVolunteers.forEach(volunteer => {
    `
      <li>
        
      </li>
    `
  });
}
