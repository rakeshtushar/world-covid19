import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./CountryGraph.css";

const buildGraph = (data, country = "India", caseType) => {
  const allData = [];
  let lastData;
  if (data) {
    for (let date in data[caseType]) {
      if (lastData) {
        const newDataPoint = {
          x: date,
          y: data[caseType][date] - lastData,
        };
        allData.push(newDataPoint);
      }
      lastData = data[caseType][date];
    }
  }

  return allData;
};
function CountryGraph({ country, caseType }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `https://disease.sh/v3/covid-19/historical/${country}?lastdays=30`
      )
        .then((response) => response.json())
        .then((data) => {
          const countryData = buildGraph(data["timeline"], country, caseType);
          setData(countryData);
        });
    };

    fetchData();
  }, [country]);

  return (
    <div className="countryGraph">
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                label: `${country} ${caseType}`,
                backgroundColor: "rgba(75, 192, 192, 1)",
                borderColor: "black",
                borderWidth: 2,
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default CountryGraph;
