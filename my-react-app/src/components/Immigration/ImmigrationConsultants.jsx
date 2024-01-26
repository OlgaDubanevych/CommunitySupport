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
      const consultantInfoArray = await consultantInfoResponse.json();

      console.log(
        "Consultant Information for Consultant ID:",
        consultantId,
        consultantInfoArray
      );

      setShowMessageForm((prev) => ({
        ...prev,
        [consultantId]: { show: true, consultantInfo: consultantInfoArray[0] },
      }));
    } catch (error) {
      console.error("Error fetching consultant information:", error.message);
    }
  };

  const handleCancelMessageForm = (consultantId) => {
    setShowMessageForm((prev) => ({ ...prev, [consultantId]: false }));
  };

  const handleMessageSubmit = async (consultantId, messageData) => {
    try {
      const updatedConsultantResponse = await fetch(
        `http://localhost:7000/api/consultants/${consultantId}`
      );
      const updatedConsultant = await updatedConsultantResponse.json();

      setConsultants((prevConsultants) => [
        updatedConsultant,
        ...prevConsultants.filter(
          (consultant) => consultant.id !== consultantId
        ),
      ]);

      const consultantInfoResponse = await fetch(
        `http://localhost:7000/api/consultants/${consultantId}`
      );
      const consultantInfoArray = await consultantInfoResponse.json();

      if (consultantInfoArray.length > 0) {
        const consultantInfo = consultantInfoArray[0];
        const emailBody = `Consultant Email: ${consultantInfo.email}\n${messageData.message}`;

        const subject = encodeURIComponent("Consultant Message");
        const body = encodeURIComponent(emailBody);
        const mailtoLink = `mailto:${consultantInfo.email}?subject=${subject}&body=${body}`;

        window.open(mailtoLink);

        setShowMessageForm((prev) => ({ ...prev, [consultantId]: false }));
      } else {
        console.error(
          "Consultant information not found for Consultant ID:",
          consultantId
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
                {showMessageForm[consultant.id] && (
                  <MessageForm
                    consultant={consultant}
                    consultantInfo={
                      showMessageForm[consultant.id].consultantInfo
                    }
                    onMessageSubmit={(data) =>
                      handleMessageSubmit(consultant.id, data)
                    }
                    onCancelClick={() => handleCancelMessageForm(consultant.id)}
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
