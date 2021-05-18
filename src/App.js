import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Table from "./Table";
import { sortData } from "./utils";
import "./App.css";
import LineGraph from "./LineGraph";
import CountryGraph from "./CountryGraph";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCLickDropDown = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Worlwide covid 19 statistics</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCLickDropDown}
              value={country}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="Current Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases?countryInfo.cases:0}
          />
          
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.todayRecovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths?countryInfo.deaths:0}
          />
        </div>

        {/* graph section countryWIse */}
        <CountryGraph country={country === 'worldwide'?'IN':country} caseType="cases"/>
        <CountryGraph country={country === 'worldwide'?'IN':country} caseType="recovered"/>
        <CountryGraph country={country === 'worldwide'?'IN':country} caseType="deaths"/>

      </div>

      <Card className="app__right">
        <CardContent>
          <h2>Live cases in country</h2>
          <Table countries={tableData} />
          <h2>New Cases</h2>
          <LineGraph casesType='cases'/>
          <h2>Recovered Cases</h2>
          <LineGraph casesType='recovered'/>
          <h2>Death Cases</h2>
          <LineGraph casesType='deaths'/>
          <img src="../corona.jpg"/>
        </CardContent>
      </Card>

      
    </div>
  );
}

export default App;
