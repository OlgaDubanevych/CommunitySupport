import React, { useState, useEffect } from "react";
import MessageForm from "./MessageForm";
import "../Pages/ImmigrationPage.css";

const Consultants = () => {
  const [consultants, setConsultants] = useState([]);
  const [showMessageForm, setShowMessageForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConsultants = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/consultants");
      if (response.ok) {
        const data = await response.json();
        setConsultants(data);

        setShowMessageForm((prev) => {
          const newFormState = { ...prev };
          data.forEach((consultant) => {
            if (prev[consultant.id] === undefined) {
              newFormState[consultant.id] = false;
            }
          });
          return newFormState;
        });

        setLoading(false);
      } else {
        console.error(
          "Failed to fetch consultants:",
          response.status,
          response.statusText
        );
        setError("Failed to fetch consultants");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching consultants:", error.message);
      setError("Error fetching consultants");
      setLoading(false);
    }
  };

  const handleShowMessageForm = async (consultantId) => {
    try {
      const consultantInfoResponse = await fetch(
        `http://localhost:7000/api/consultants/${consultantId}`
      );

      if (consultantInfoResponse.ok) {
        const consultantInfoArray = await consultantInfoResponse.json();
        const updatedConsultantInfo =
          consultantInfoArray.length > 0
            ? consultantInfoArray.find(
                (consultant) => consultant.id === consultantId
              )
            : null;

        console.log(
          "Consultant Information for Consultant ID:",
          consultantId,
          updatedConsultantInfo
        );

        setShowMessageForm((prev) => ({
          ...prev,
          [consultantId]: {
            show: true,
            consultantInfo: updatedConsultantInfo,
            email: updatedConsultantInfo.email, // Pass email here
          },
        }));
      } else {
        console.error(
          "Failed to fetch consultant information:",
          consultantInfoResponse.status,
          consultantInfoResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching consultant information:", error.message);
    }
  };

  const handleCancelMessageForm = (consultantId) => {
    setShowMessageForm((prev) => ({
      ...prev,
      [consultantId]: { show: false, consultantInfo: null },
    }));
  };

  const handleMessageSubmit = async (consultantId, messageData) => {
    try {
      console.log("Consultant ID:", consultantId); // Log the consultantId
      const response = await fetch(
        `http://localhost:7000/api/consultants/${consultantId}`
      );

      if (response.ok) {
        const updatedConsultants = await response.json(); // Change variable name to plural to indicate it's an array
        console.log("Updated Consultant Information:", updatedConsultants); // Log the fetched consultant information

        // Assuming that the consultant with the specified ID is the first item in the array
        const updatedConsultant = updatedConsultants.find(
          (consultant) => consultant.id === consultantId
        );

        if (updatedConsultant) {
          // Constructing the email body
          const emailBody = `Consultant Email: ${updatedConsultant.email}\n${messageData.message}`;

          // Encoding subject and body for the mailto link
          const subject = encodeURIComponent(
            "Inquiry about your immigration services"
          );
          const body = encodeURIComponent(emailBody);

          // Constructing the mailto link
          const mailtoLink = `mailto:${updatedConsultant.email}?subject=${subject}&body=${body}`;

          // Opening the mailto link
          window.open(mailtoLink);
        } else {
          console.error("Consultant with ID not found:", consultantId);
        }
      } else {
        console.error(
          "Failed to fetch updated consultant:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchConsultants, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <p className="other_text">Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="header">Consultants</h1>
      <div className="consultants-container">
        {consultants.length === 0 ? (
          <p className="text">No consultants available</p>
        ) : (
          consultants.map((consultant) => (
            <div key={consultant.id} className="consultant-card">
              <h2 className="name">
                {consultant.firstName} {consultant.lastName}
              </h2>
              <p className="other_text">
                {consultant.organization} | {consultant.email} |{" "}
                {consultant.phone}
              </p>
              <p className="other_text">{consultant.competitiveAdvantage}</p>
              <div>
                <button
                  className="message-button"
                  onClick={() => handleShowMessageForm(consultant.id)}
                >
                  Message
                </button>
                {showMessageForm[consultant.id] &&
                  showMessageForm[consultant.id].show && (
                    <MessageForm
                      consultant={consultant}
                      email={
                        showMessageForm[consultant.id]
                          ? showMessageForm[consultant.id].email
                          : ""
                      } // Pass email here
                      consultantInfo={
                        showMessageForm[consultant.id]
                          ? showMessageForm[consultant.id].consultantInfo
                          : null
                      }
                      onMessageSubmit={(data) =>
                        handleMessageSubmit(consultant.id, data)
                      }
                      onCancelClick={() =>
                        handleCancelMessageForm(consultant.id)
                      }
                    />
                  )}
              </div>
              <hr />
            </div>
          ))
        )}
      </div>
      <hr />
    </div>
  );
};
export default Consultants;
