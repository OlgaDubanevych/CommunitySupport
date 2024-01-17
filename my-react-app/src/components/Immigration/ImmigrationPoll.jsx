import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../Pages/JobSearchPage.css";

function ImmigrationPoll() {
  const [pollData, setPollData] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const data = {
      labels: pollOptions.map((option) => option.label),
      datasets: [
        {
          label: "Percentage",
          backgroundColor: "#BE212F",
          data: calculatePercentages(pollData),
        },
      ],
    };
    setChartData(data);
    if (chartRef.current && chartRef.current.chartInstance) {
      chartRef.current.chartInstance.canvas.style.height = "50px"; // Adjust the height as needed
    }
  }, [pollData]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedOption) {
      try {
        console.log("Sending data to backend:", selectedOption);
        const url = `http://localhost:7000/api/poll?option=${selectedOption}`;
        const response = await fetch(url, {
          method: "POST",
        });

        if (response.ok) {
          setPollData((prevState) => ({
            ...prevState,
            [selectedOption]: (prevState[selectedOption] || 0) + 1,
          }));
          setSelectedOption("");
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
          }, 20000);
        } else {
          console.error("Failed to submit poll data");
        }
      } catch (error) {
        console.error("Error during poll submission:", error);
      }
    }
  };

  const calculatePercentages = (data) => {
    const totalVotes = Object.values(data).reduce(
      (a, b) => parseInt(a) + parseInt(b),
      0
    );
    return pollOptions.map((option) =>
      totalVotes ? ((data[option.name] || 0) / totalVotes) * 100 : 0
    );
  };

  const totalVotes = Object.values(pollData).reduce(
    (a, b) => parseInt(a) + parseInt(b),
    0
  );

  const pollOptions = [
    { name: "job", label: "Finding a Job" },
    { name: "networking", label: "Networking" },
    { name: "friends", label: "Finding Friends" },
    { name: "education", label: "Need to Continue Education" },
    { name: "language", label: "Language Barrier" },
    { name: "finance", label: "Financial Difficulties" },
    { name: "housing", label: "Rental/Home Purchase Price" },
    { name: "culture", label: "Cultural Differences" },
    { name: "daycare", label: "Daycare/Child Support" },
    { name: "other", label: "Other" },
  ];

  const chartOptions = {
    maintainAspectRatio: true,
    indexAxis: "y", // Set to 'y' for horizontal bars
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="text">
      <h2 className="header">
        What aspects of immigrating to Canada you personally find most
        challenging?
      </h2>
      <div>
        <form onSubmit={handleSubmit}>
          {pollOptions.map((option) => (
            <div key={option.name}>
              <label className="text" htmlFor={option.name}>
                <input
                  type="radio"
                  id={option.name}
                  name="selectedOption"
                  value={option.name}
                  checked={selectedOption === option.name}
                  onChange={handleOptionChange}
                />
                {option.label}
              </label>
            </div>
          ))}
          <p></p>
          <button type="submit" className="submit">
            Submit
          </button>
          <p></p>
        </form>
        {submitted && (
          <div className="results">
            <p className="other_text">Thank you for your opinion!</p>
            <h3 className="other_text">Poll Results:</h3>
            {chartData && (
              <Bar ref={chartRef} data={chartData} options={chartOptions} />
            )}
            <p className="text">Total Votes: {totalVotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImmigrationPoll;
