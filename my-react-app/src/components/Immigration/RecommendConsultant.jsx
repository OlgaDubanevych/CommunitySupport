import React, { useState } from 'react';
import '../Pages/ImmigrationPage.css'

function RecommendImmigrationConsultant(props) {
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [consultantFirstName, setConsultantFirstName] = useState('');
const [consultantLastName, setConsultantLastName] = useState('');
const [orgName, setOrgName] = useState('');
const [consultantEmail, setConsultantEmail] = useState('');
const [consultantPhone, setConsultantPhone] = useState('');
const [orgWebsite, setOrgWebsite] = useState('');
const [recommendation, setRecommendation] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);

const handleFirstNameChange = (event) => {
setFirstName(event.target.value);
}

const handleLastNameChange = (event) => {
setLastName(event.target.value);
}

const handleConsultantFirstNameChange = (event) => {
setConsultantFirstName(event.target.value);
}

const handleConsultantLastNameChange = (event) => {
setConsultantLastName(event.target.value);
}

const handleOrgNameChange = (event) => {
setOrgName(event.target.value);
}

const handleConsultantEmailChange = (event) => {
setConsultantEmail(event.target.value);
}

const handleConsultantPhoneChange = (event) => {
setConsultantPhone(event.target.value);
}

const handleOrgWebsiteChange = (event) => {
setOrgWebsite(event.target.value);
}

const handleRecommendationChange = (event) => {
setRecommendation(event.target.value);
}

const handleSubmit = (event) => {
event.preventDefault();
setIsSubmitting(true);
// Do something with the form data (e.g. submit to a backend)
console.log('Form submitted:', { firstName, lastName, consultantFirstName, consultantLastName, orgName, consultantEmail, consultantPhone, orgWebsite, recommendation });
// Clear form fields
setFirstName('');
setLastName('');
setConsultantFirstName('');
setConsultantLastName('');
setOrgName('');
setConsultantEmail('');
setConsultantPhone('');
setOrgWebsite('');
setRecommendation('');
setTimeout(() => {
    setIsSubmitting(false);
  }, 4000);
}
function handleButtonClick() {
    alert("Thank you for providing your Recommendation! It's currently under review and would be posted once our administrators approve it");
    setTimeout(() => {
    window.location.reload();
    }, 4000);
    }
return (
  <div >
    <h2 className ="header">Recommend a Consultant! </h2>
<form className = "text" onSubmit={handleSubmit}>
<div>
<label htmlFor="first-name">Your First Name: &nbsp; </label>
<input  type="text" id="first-name" value={firstName} onChange={handleFirstNameChange} required />
<p></p>
</div>
<div>
<label htmlFor="last-name">Your Last Name: &nbsp;</label>
<input type="text" id="last-name" value={lastName} onChange={handleLastNameChange} required />
<p></p>
</div>
<div>
<label htmlFor="consultant-first-name">Consultant's First Name: &nbsp;</label>
<input type="text" id="consultant-first-name" value={consultantFirstName} onChange={handleConsultantFirstNameChange} required />
<p></p>
</div>
<div>
<label htmlFor="consultant-last-name">Consultant's Last Name: &nbsp;</label>
<input type="text" id="consultant-last-name" value={consultantLastName} onChange={handleConsultantLastNameChange} required />
<p></p>
</div>
<div>
<label htmlFor="org-name">Name of the Organization: &nbsp;</label>
<input type="text" id="org-name" value={orgName} onChange={handleOrgNameChange} required />
<p></p>
</div>
<div>
<label htmlFor="consultant-email">Consultant's Email Address: &nbsp;</label>
<input
      type="email"
      id="consultant-email"
      name="consultant-email"
      value={consultantEmail}
      onChange={(e) => setConsultantEmail(e.target.value)}
      required
    />
<br/>
<p></p>
    <label htmlFor="consultant-phone">Consultant's Phone Number: &nbsp;</label>
    <input
      type="tel"
      id="consultant-phone"
      name="consultant-phone"
      value={consultantPhone}
      onChange={(e) => setConsultantPhone(e.target.value)}
      required
    />
  </div>
  <p></p>
  <div>
    <label htmlFor="org-website">Link to Organization's Website:&nbsp; </label>
    <input
      type="url"
      id="org-website"
      name="org-website"
      value={orgWebsite}
      onChange={(e) => setOrgWebsite(e.target.value)}
      required
    />
  </div> 
  <div>
    <label htmlFor="recommendation">Why would you recommend this Immigration Consultant? &nbsp;</label>
    <textarea
      id="recommendation"
      name="recommendation"
      value={recommendation}
      onChange={(e) => setRecommendation(e.target.value)}
      required
    />
  </div> 
  <p></p>
  <button type="submit" className="submit" onClick={handleButtonClick}>Submit</button>
  <p></p>
</form>
</div>
);
}

export default RecommendImmigrationConsultant;









