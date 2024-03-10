import React, { useState } from "react";
import "../Pages/ImmigrationPage.css";

function RecommendImmigrationConsultant(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [competitiveAdvantage, setCompetitiveAdvantage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleOrganizationChange = (event) => {
    setOrganization(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handlecompetitiveAdvantageChange = (event) => {
    setCompetitiveAdvantage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://backend-service-7fgbxiruaq-nn.a.run.app/api/consultants",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            organization,
            email,
            phone,
            competitiveAdvantage,
          }),
        }
      );

      if (response.ok) {
        <p>"Thank you for providing your Recommendation!"</p>;
        setTimeout(() => {
          window.location.reload();
        }, 400);
      } else {
        console.error("Failed to submit recommendation");
      }
    } catch (error) {
      console.error("Error during recommendation submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="header">Recommend a Consultant! </h2>
      <form className="text" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">Consultant's First Name: &nbsp; </label>
          <p></p>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
            required
          />
          <p></p>
        </div>
        <div>
          <label htmlFor="lastName">Consultant's Last Name: &nbsp;</label>
          <p></p>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={handleLastNameChange}
            required
          />
          <p></p>
        </div>
        <div>
          <label htmlFor="organization">Name of the Organization: &nbsp;</label>
          <p></p>
          <input
            type="text"
            id="organization"
            value={organization}
            onChange={handleOrganizationChange}
            required
          />
          <p></p>
        </div>
        <div>
          <label htmlFor="email">Consultant's Email Address: &nbsp;</label>
          <p></p>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <br />
          <p></p>
          <label htmlFor="phone">Consultant's Phone Number: &nbsp;</label>
          <p></p>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={handlePhoneChange}
            required
          />
        </div>
        <p></p>
        <div>
          <label htmlFor="competitiveAdvantage">
            Why would you recommend this Immigration Consultant? &nbsp;
          </label>
          <p></p>
          <textarea
            id="competitiveAdvantage"
            name="competitiveAdvantage"
            value={competitiveAdvantage}
            onChange={handlecompetitiveAdvantageChange}
            required
          />
        </div>
        <p></p>
        <button type="submit" className="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <p></p>
      </form>
    </div>
  );
}

export default RecommendImmigrationConsultant;
