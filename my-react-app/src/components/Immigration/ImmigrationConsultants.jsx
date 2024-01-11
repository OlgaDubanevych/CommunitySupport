import React, { useState, useEffect } from "react";
import "../Pages/ImmigrationPage.css";

const ImmigrationConsultants = () => {
  const [questions, setQuestions] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [consultants, setConsultants] = useState([]);

  useEffect(() => {
    // Fetch consultants from the backend when the component mounts
    fetch("http://localhost:7000/api/consultants") // Update the URL with your backend endpoint
      .then((response) => response.json())
      .then((data) => setConsultants(data))
      .catch((error) => console.error("Error fetching consultants:", error));
  }, []); // Empty dependency array to run the effect only once when the component mounts

  const handleQuestionChange = (event, consultant) => {
    const { name, value } = event.target;
    setQuestions((prevState) => ({
      ...prevState,
      [`${consultant.firstName}-${consultant.lastName}-${name}`]: value,
    }));
  };

  const handleQuestionSubmit = async (event, consultant) => {
    event.preventDefault();

    const question =
      questions[`${consultant.firstName}-${consultant.lastName}-question`];
    const email = consultant.email;

    try {
      const response = await fetch(
        `http://localhost:7000/api/donations/${consultant.id}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            email,
          }),
        }
      );

      if (response.ok) {
        setSubmitMessage("Your Question was submitted");
        setTimeout(() => {
          setSubmitMessage("");
        }, 4000);
      } else {
        console.error("Failed to submit question");
      }
    } catch (error) {
      console.error("Error during question submission:", error);
    }
  };

  return (
    <div>
      <h2 className="header">Immigration Consultants</h2>

      <div className="text">
        {consultants.map((consultant) => (
          <div key={`${consultant.firstName}-${consultant.lastName}`}>
            <h2>
              {consultant.firstName} {consultant.lastName}
            </h2>
            <p className="other_text">
              {consultant.organization} | {consultant.email} |{" "}
              {consultant.phone}
            </p>
            <p className="other_text">{consultant.competitiveAdvantage}</p>
            <form onSubmit={(event) => handleQuestionSubmit(event, consultant)}>
              <label
                htmlFor={`${consultant.firstName}-${consultant.lastName}-question`}
              >
                Ask a Question:
              </label>
              <br />
              <textarea
                id={`${consultant.firstName}-${consultant.lastName}-question`}
                name="question"
                rows="4"
                cols="50"
                value={
                  questions[
                    `${consultant.firstName}-${consultant.lastName}-question`
                  ] || ""
                }
                onChange={(event) => handleQuestionChange(event, consultant)}
              />
              <br />
              <p></p>
              <label
                htmlFor={`${consultant.firstName}-${consultant.lastName}-email`}
              >
                Your Email Address:
              </label>
              <br />
              <input
                type="email"
                id={`${consultant.firstName}-${consultant.lastName}-email`}
                name="email"
                value={
                  questions[
                    `${consultant.firstName}-${consultant.lastName}-email`
                  ] || ""
                }
                onChange={(event) => handleQuestionChange(event, consultant)}
              />
              <br />
              <p></p>
              <button type="submit" className="submit">
                Submit
              </button>
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
