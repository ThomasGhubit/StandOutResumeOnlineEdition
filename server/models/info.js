const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InfoSchema= new Schema({
  userId: String,
  name: String,
  updateDate: Date,
  edited: Boolean,
  basic: {
    firstName: String,
    lastName: String,
    occupation: String,
    email: String,
    phone: String,
    website: String,
    location: String
  },
  summary: Array,
  education: [
    {
      schoolName: String,
      duration: Array,
      degree: String,
      field: String,
      note: String
    }
  ],
  employment: [
    {
      employer: String,
      employee: [
        {
          title: String,
          duration: Array,
          description: String
        }
      ]
    }
  ],
  skill: [
    {
      group: String,
      skillNames: Array
    }
  ],
  project: [
    {
      name: String,
      duration: Array,
      link: String,
      description: String
    }
  ],
  award: [
    {
      name: String,
      time: String,
      awarder: String,
      description: String
    }
  ],
  activity: [
    {
      title: String,
      duration: Array,
      description: String
    }
  ],
  volunteering: [
    {
      title: String,
      duration: Array,
      organization: String,
      location: String,
      description: String
    }
  ]
});

module.exports = mongoose.model('info', InfoSchema);