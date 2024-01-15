import React, { useState, useEffect } from "react";
import Rating from "./Rating";
import "../Pages/ImmigrationPage.css";

function UsefulLinks() {
  const [averageRatings, setAverageRatings] = useState({});
  const links = [
    {
      websiteId: 1,
      websiteName: "Canada.ca",
      websiteDescription:
        "Official website by the Government of Canada. Its IRCC (Immigration Refugees and Citizenship Canada) portion has the most accurate, exhaustive and up-to-date information with respect to explanations of the immigration system, immigration programs, and frequently asked questions. This is a great starting point for beginning your information collection and planning of the immigration process.",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
      text: "Canada.ca",
      averageRating: 0.0,
    },
    {
      websiteId: 2,
      websiteName: "Moving2Canada",
      websiteDescription:
        "Platform designed to help newcomers make their move to Canada. Its goal is to empower migrants and their families to build their Canadian dream",
      url: "https://moving2canada.com/about-us/",
      text: "Moving2Canada",
      averageRating: 0.0,
    },
    {
      websiteId: 3,
      websiteName: "Settlement.org",
      websiteDescription:
        "The Settlement.Org website provwebsiteIdes newcomers with information and resources to settle in Ontario, Canada. It does so by provwebsiteIding accurate, reliable and timely content, links to the websites containing authoritative information and Referrals to local services",
      url: "https://settlement.org/",
      text: "Settlement.org",
      averageRating: 0.0,
    },
    {
      websiteId: 4,
      websiteName: "Skilled Immigrant InfoCentre",
      websiteDescription:
        "Skilled Immigrant InfoCentre is an online and in-person resource centre that helps newcomers to Canada find the information they need to get a job, explore careers or start a businesss",
      url: "https://www.vpl.ca/siic",
      text: "Skilled Immigrant InfoCentre",
      averageRating: 0.0,
    },
    {
      websiteId: 5,
      websiteName: "YMCA",
      websiteDescription:
        "Thanks to the YMCA, Canadians are more physically fit, better connected in their communities, and building the skills needed to achieve success in work and life",
      url: "https://www.ymca.ca/who-we-are/about-us",
      text: "YMCA",
      averageRating: 0.0,
    },
    {
      websiteId: 6,
      websiteName: "WES (World Education Services)",
      websiteDescription:
        "Independent credential evaluation agency based in California and serving customers throughout the US and Canada",
      url: "https://credentialevaluations.org",
      text: "WES (World Education Services)",
      averageRating: 0.0,
    },
    {
      websiteId: 7,
      websiteName: "Canadian Council for Refugees",
      websiteDescription:
        "The Canadian Council for Refugees is a national non-profit umbrella organization committed to the rights and protection of refugees and other vulnerable migrants in Canada and around the world and to the settlement of refugees and immigrants in Canada.",
      url: "https://www.ccrweb.ca/en",
      text: "Canadian Council for Refugees",
      averageRating: 0.0,
    },
    {
      websiteId: 8,
      websiteName: "Canadahelpers.org",
      websiteDescription:
        "For more than 22 years, CanadaHelps has been a trusted charity, informing, inspiring and connecting charities and donors, with the causes they care about. It envisions a society in which all Canadians are committed to giving and participating in the charitable sector",
      url: "https://www.canadahelps.org/",
      text: "Canadahelpers.org",
      averageRating: 0.0,
    },
  ];

  useEffect(() => {
    const sendAllWebsitesToBackend = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/websites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Change content type to JSON
          },
          body: JSON.stringify(links), // Send the entire array as JSON
        });
      } catch (error) {
        console.error("Error during send all websites:", error);
      }
    };

    const fetchAllAverageRatings = async () => {
      try {
        const response = await fetch(
          "http://localhost:7000/api/websites/all-average-ratings"
        );
        if (response.ok) {
          const rawText = await response.text();
          const ratingsArray = rawText
            .split(", ")
            .map((entry) => entry.split("="));
          const allAverageRatings = Object.fromEntries(
            ratingsArray.map(([key, value]) => [key, parseFloat(value)])
          );
          setAverageRatings(allAverageRatings);
        } else {
          console.error("Failed to fetch all average ratings");
        }
      } catch (error) {
        console.error("Error during fetch all average ratings:", error);
      }
    };

    sendAllWebsitesToBackend(); // Call the function here
    fetchAllAverageRatings(); // Call the function here
  }, [links]);

  const updateAverageRating = async (websiteId, averageRating) => {
    try {
      const response = await fetch(
        `http://localhost:7000/api/websites/${websiteId}/average-rating`
      );
      if (response.ok) {
        const updatedAverageRating = await response.json();
        setAverageRatings((prevRatings) => ({
          ...prevRatings,
          [websiteId]: updatedAverageRating,
        }));
      } else {
        console.error("Failed to update average rating");
      }
    } catch (error) {
      console.error("Error during average rating update:", error);
    }
  };

  return (
    <div>
      <h2 className="header">Links to Useful Resources</h2>
      <div className="text">
        {links.map((link) => (
          <div key={link.websiteId}>
            <h3>{link.websiteName}</h3>
            <p className="other_text">{link.websiteDescription}</p>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.text}
            </a>
            <p>How would you rate this Website?</p>
            <Rating
              websiteId={link.websiteId}
              updateAverageRating={(averageRating) =>
                updateAverageRating(link.websiteId, averageRating)
              }
            />
            <p>Average Rating: {averageRatings[link.websiteId]}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsefulLinks;
