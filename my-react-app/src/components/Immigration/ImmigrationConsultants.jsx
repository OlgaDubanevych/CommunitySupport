import React, { useState } from "react";
import '../Pages/ImmigrationPage.css'

const ImmigrationConsultants = () => {
  const [questions, setQuestions] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const consultants = [
    {
      firstName: "John",
      lastName: "Smith",
      organization: "ABC Immigration",
      email: "john@abcimmigration.com",
      phone: "123-456-7890",
      competitiveAdvantage:
        "We have a 98% success rate in helping clients obtain permanent residency.",
    },
    {
      firstName: "Mary",
      lastName: "Jones",
      organization: "XYZ Immigration",
      email: "mary@xyzimmigration.com",
      phone: "510-837-4429",
      competitiveAdvantage:
        "We specialize in helping entrepreneurs and investors immigrate to Canada.",
    },
    {
      firstName: "David",
      lastName: "Chang",
      organization: "Chang Immigration Services",
      email: "david@changimmigration.com",
      phone: "123-456-7890",
      competitiveAdvantage:
        "We offer personalized services and work closely with clients to ensure their success.",
    },
    {
      firstName: "Sarah",
      lastName: "Lee",
      organization: "Lee Immigration Group",
      email: "sarah@leeimmigration.com",
      phone: "613-261-9253",
      competitiveAdvantage:
        "We have extensive knowledge of Canadian immigration laws and regulations.",
    },
    {
      firstName: "Megan",
      lastName: "Wong",
      organization: "Wong Immigration Consulting",
      email: "megan@wongimmigration.com",
      phone: "123-456-7890",
      competitiveAdvantage:
        "We provide cost-effective solutions without compromising quality.",
    },
    {
      firstName: "Ahmed",
      lastName: "Khan",
      organization: "Khan Immigration Services",
      email:"ahmed@khanimmigration.com",
      phone: "307-627-5555",
      competitiveAdvantage:
        "We offer expedited services for clients with urgent immigration needs.",
    },
    {
      firstName: "Grace",
      lastName: "Kim",
      organization: "Kim Immigration Consulting",
      email: "grace@kimimmigration.com",
      phone: "123-456-7890",
      competitiveAdvantage:
        "We have a multilingual team that can assist clients in various languages.",
    },
    {
      firstName: "Liam",
      lastName: "Nguyen",
      organization: "Nguyen Immigration Law",
      email: "liam@nguyenimmigration.com",
      phone: "835-837-3845",
      competitiveAdvantage:
        "We have extensive experience with complex immigration cases.",
    },
    {
      firstName: "Olivia",
      lastName: "Chen",
      organization: "Chen Immigration Solutions",
      email: "olivia@chenimmigration.com",
      phone: "123-456-7890",
      competitiveAdvantage:
        "We offer customized solutions to fit each client's unique situation.",
    },
  ];

  const handleQuestionChange = (event, consultant) => {
    const { name, value } = event.target;
    setQuestions((prevState) => ({
      ...prevState,
      [`${consultant.firstName}-${consultant.lastName}-${name}`]: value,
    }));
  };

  const handleQuestionSubmit = (event, consultant) => {
    event.preventDefault();
    const question = questions[`${consultant.firstName}-${consultant.lastName}-question`];
    const email = questions[`${consultant.firstName}-${consultant.lastName}-email`];
    console.log(`Question for ${consultant.firstName} ${consultant.lastName}: ${question}`);
    console.log(`Contact email: ${email}`);
    setQuestions((prevState) => ({
      ...prevState,
      [`${consultant.firstName}-${consultant.lastName}-question`]: "",
      [`${consultant.firstName}-${consultant.lastName}-email`]: "",
    }));
    setSubmitMessage("Your Question was submitted");
    setTimeout(() => {
      setSubmitMessage("");
    }, 4000);
  };

  return (
    <div >
      <h2 className = "header">Immigration Consultants</h2>
   
    <div className = "text">
      {consultants.map((consultant) => (
        <div key={`${consultant.firstName}-${consultant.lastName}`}>
          <h2>
            {consultant.firstName} {consultant.lastName}
          </h2>
          <p className ="other_text" >
            {consultant.organization} | {consultant.email} | {consultant.phone}
          </p>
          <p className ="other_text">{consultant.competitiveAdvantage}</p>
          <form onSubmit={(event) => handleQuestionSubmit(event, consultant)}>
            <label htmlFor={`${consultant.firstName}-${consultant.lastName}-question`}>
              Ask a Question:
            </label>
            <br />
            <textarea
              id={`${consultant.firstName}-${consultant.lastName}-question`}
              name="question"
              rows="4"
              cols="50"
              value={questions[`${consultant.firstName}-${consultant.lastName}-question`] || ""}
              onChange={(event) => handleQuestionChange(event, consultant)}
            />
            <br />
            <p></p>
            <label htmlFor={`${consultant.firstName}-${consultant.lastName}-email`}>
              Your Email Address:
            </label>
            <br />
            <input
              type="email"
              id={`${consultant.firstName}-${consultant.lastName}-email`}
              name="email"
              value={questions[`${consultant.firstName}-${consultant.lastName}-email`] || ""}
              onChange={(event) => handleQuestionChange(event, consultant)}
            />
            <br />
            <p></p>
            <button type="submit" className="submit">Submit</button>
          </form>
          <div>{submitMessage}</div>
          <hr />
        </div>
        
      ))}
    </div>
    </div>
  );
};

export default ImmigrationConsultants;

  