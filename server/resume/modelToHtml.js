module.exports = (data) => {
  this.firstName = "";

  this.fillFirstName = () => {
    this.firstName = data.basic ? data.basic.firstName : "";
  }

  this.fillLastName = () => {
    this.lastName = data.basic ? data.basic.lastName : "";
  }

  this.fillOccupation = () => {
    this.occupation = data.basic ? data.basic.occupation : "";
  }

  this.fillEmail = () => {
    if (data.basic && data.basic.email) {
      this.email = `
        <div class="email-item">
          <img src="/assets/img/mail.png">
          <span>${data.basic.email}</span>
        </div>
      `;
    } else {
      this.email = "";
    }
  }

  this.fillPhone = () => {
    if (data.basic && data.basic.phone) {
      this.phone = `
        <div class="phone-item">
          <img src="/assets/img/phone.png">
          <span>${data.basic.phone}</span>
        </div>
      `;
    } else {
      this.phone = "";
    }
  }

  this.fillWebsite = () => {
    if (data.basic && data.basic.website) {
      this.website = `
        <div class="website-item">
          <img src="/assets/img/website.png">
          <span>${data.basic.website}</span>
        </div>
      `;
    } else {
      this.website = "";
    }
  }

  this.fillLocation = () => {
    if (data.basic && data.basic.location) {
      this.location = `
        <div class="location-item">
          <img src="/assets/img/location.png">
          <span>${data.basic.location}</span>
        </div>
      `;
    } else {
      this.location = "";
    }
  }

  this.fillSummary = () => {
    if (data.summary && data.summary.length > 0) {
      let summarys = "";
      data.summary.forEach((item) => {
        summarys += `
          <p class="summary-item">${item}</p>
        `;
      });
      this.summary = `
        <div class="summary">
          <div class="section-header">
            <span>Summary</span>
            <div class="section-header-underline"></div>
          </div>
          <div class="item-container">
            ${summarys}
          </div>
        </div>
      `;
    } else {
      this.summary = ""
    }
  }

  this.fillEmployment = () => {
    if (data.employment && data.employment.length > 0) {
      let employments = "";
      data.employment.forEach((item) => {
        let employees = "";
        if (item.employee) {
          item.employee.forEach((e) => {
            let info = `
              <div class="employee-info">
                <span class="employee-title">${e.title}</span>
                <span class="employee-duration">${e.duration[0]} to ${e.duration[1]}</span>
              </div>
            `;
  
            if (e.description != null) {
              employees += `
                <div class="employee-item">
                  ${info}
                  <p class="employee-desc">${e.description}</p>
                </div>
              `;
            } else {
              employees += `
                <div class="employee-item">
                  ${info}
                </div>
              `;
            }
          });
        }
        
        employments += `
          <div class="employment-item">
            <span class="employer">${item.employer}</span>
            ${employees}
          </div>
        `;
      });

      this.employment = `
        <div class="employment">
          <div class="section-header">
            <span>Employment</span>
            <div class="section-header-underline"></div>
          </div>
          <div class="item-container">
            ${employments}
          </div>
        </div>
      `;
    } else {
      this.employment = "";
    }
  }

  this.fillProject = () => {
    if (data.project && data.project.length > 0) {
      let projects = "";
      data.project.forEach((item) => {
        let desc = item.description ? `<p class="project-desc">${item.description}</p>` : "";
        let link = item.link ? `<p class="project-link">${item.link}</p>` : "";
        projects = `
          <div class="project-item">
            <div class="project-info">
              <span class="project-name">${item.name}</span>
              <span class="project-duration">${item.duration[0]} to ${item.duration[1]}</span>
            </div>
            ${desc}
            ${link}
          </div>
        `;
      });

      this.project = `
        <div class="project">
          <div class="section-header">
            <span>Projects</span>
            <div class="section-header-underline"></div>
          </div>
          <div class="item-container">
            ${projects}
          </div>
        </div>
      `;
    } else {
      this.project = "";
    }
  }

  this.fillAward = () => {
    if (data.award && data.award.length > 0) {
      let awards = "";
      data.award.forEach((item) => {
        let desc = item.description ? `<p class="award-desc">${item.description}</p>` : "";
        let awardItem = item.awarder ? `
          <div class="award-item">
            <div class="award-info">
              <span class="award-awarder-&-name">${item.awarder} · ${item.name}</span>
              <span class="award-time">${item.time}</span>
            </div>
            ${desc}
          </div>
        ` : `
          <div class="award-item">
            <div class="award-info">
              <span class="award-name">${item.name}</span>
              <span class="award-time">${item.time}</span>
            </div>
            ${desc}
          </div>
        `;

        awards += awardItem;
      });

      this.award = `
        <div class="award">
          <div class="section-header">
            <span>Awards</span>
            <div class="section-header-underline"></div>
          </div>
          <div class="item-container">
            ${awards}
          </div>
        </div>
      `;
    } else {
      this.award = "";
    }
  }

  this.fillActivity = () => {
    if (data.activity && data.activity.length > 0) {
      let activities = "";
      data.activity.forEach((item) => {
        let desc = item.description ? `<p class="activity-desc">${item.description}</p>` : "";
        activities += `
          <div class="activity-item">
            <div class="activity-info">
              <span class="activity-title">${item.title}</span>
              <span class="activity-duration">${item.duration[0]} to ${item.duration[1]}</span>
            </div>
            ${desc}
          </div>
        `;
      });

      this.activity = `
        <div class="activity">
          <div class="section-header">
            <span>Activities</span>
            <div class="section-header-underline"></div>
          </div>
          <div class="item-container">
            ${activities}
          </div>
        </div>
      `;
    } else {
      this.activity = "";
    }
  }

  this.fillVolunteering = () => {
    if (data.volunteering && data.volunteering.length > 0) {
      let volunteerings = "";
      data.volunteering.forEach((item) => {
        let desc = item.description ? `<p class="volunteering-desc">${item.description}</p>` : "";
        let location = item.locaiton ? `<p class="volunteering-location">${item.location}</p>` : "";
        let title = item.organzation ? `<span class="volunteering-title">${item.title} · ${item.organzation}</span>`
          : `<span class="volunteering-title">${item.title}</span>`;

        volunteerings += `
          <div class="volunteering-item">
            <div class="volunteering-info">
              ${title}
              <span class="volunteering-duration">${item.duration[0]} to ${item.duration[1]}</span>
            </div>
            ${location}
            ${desc}
          </div>
        `;
      });

      this.volunteering = `
        <div class="volunteering">
          <div class="section-header">
            <span>Volunteering</span>
            <div class="section-header-underline"></div>
          </div>
          <div class="item-container">
            ${volunteerings}
          </div>
        </div>
      `;
    } else {
      this.volunteering = "";
    }
  }

  this.fillEducation = () => {
    if (data.education && data.education.length > 0) {
      let educations = "";
      data.education.forEach((item) => {
        let degree = item.degree ? `<span class="education-degree">${item.degree}</span>` : "";
        let field = item.field ? `<span class="education-field">${item.field}</span>` : "";
        let note = item.note ? `<p class="education-note">${item.note}</p>` : "";

        educations += `
          <div class="education-item">
            <div class="education-info">
              <span class="education-school">${item.schoolName}</span>
              <div>
                ${degree}
                ${field}
              </div>
            </div>
            <p class="education-duration">${item.duration[0]} to ${item.duration[1]}</p>           
            ${note}
          </div>
        `;
      });

      this.education = `
        <div class="education">
          <div class="section-header">
            <span>Education</span>
            <div class="section-header-underline"></div>
          </div>
          <div class="item-container">
            ${educations}
          </div>
        </div>
      `;
    } else {
      this.education = "";
    }
  }

  this.fillSkill = () => {
    if (data.skill && data.skill.length > 0) {
      let skills = "";
      data.skill.forEach((item) => {
        let skillNames = "";
        if (item.skillNames) {
          item.skillNames.forEach((s) => {
            skillNames += `<p class="skill-name">${s}</p>`;
          });
        }
        
        skills += `
          <div class="skill-item">
            <span class="skill-group">${item.group}</span>
            ${skillNames}
          </div>
        `;
      });

      this.skill = `
        <div class="skill">
          <div class="section-header">
            <span>Skills</span>
            <div class="section-header-underline"></div>
          </div>
          <div class="item-container">
            ${skills}
          </div>
        </div>
      `;
    }
  }

  this.fillData = () => {
    this.fillFirstName();
    this.fillLastName();
    this.fillOccupation();
    this.fillEmail();
    this.fillPhone();
    this.fillWebsite();
    this.fillLocation();
    this.fillSummary();
    this.fillEmployment();
    this.fillProject();
    this.fillAward();
    this.fillActivity();
    this.fillVolunteering();
    this.fillEducation();
    this.fillSkill();

    return {
      pageTitle: data.name,
      firstName: this.firstName,
      lastName: this.lastName,
      occupation: this.occupation,
      email: this.email,
      phone: this.phone,
      website: this.website,
      location: this.location,
      summary: this.summary,
      employment: this.employment,
      project: this.project,
      award: this.award,
      activity: this.activity,
      volunteering: this.volunteering,
      education: this.education,
      skill: this.skill
    };
  }

  return this;
}