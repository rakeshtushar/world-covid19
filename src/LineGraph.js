import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";


  
  const buildGraph = (data, casesType = "cases") => {
    const allData = [];
    let lastData;
    for (let date in data[casesType]) {
      if (lastData) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastData,
        };
        allData.push(newDataPoint);
      }
      lastData = data[casesType][date];
    }
    return allData;
  };


function LineGraph({ casesType }) {



  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30")
        .then((response) => response.json())
        .then((data) => {
          const charData = buildGraph(data, casesType);
          setData(charData);
        });
    };

    fetchData();
  }, [casesType]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                label : casesType,
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

export default LineGraph;
