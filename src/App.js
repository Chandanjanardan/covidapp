import React,{useState} from "react";
import {useEffect} from "react";
import{MenuItem,FormControl,Select,Card,CardContent, Table} from "@material-ui/core";
import Infobox from "./InfoBox";

import covidTable from "./covidTable";
import LineGraph  from "./LineGraph";
import "leaflet/dist/leaflet.css";

import './App.css';
import MapShow from "./MapShow";
import {prettyPrintStat} from "./util";



function App() {
  const [countries,setCounties]=useState([]);
  const [country,setCountry]=useState("worldwide");
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries,setmapcountries]=useState([]);
  const [casesType,setCasesType]=useState("cases");
 
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data=>{
      setCountryInfo(data);
    })
  },[])

  useEffect(()=>{
    // async=> send a request, wait for it,do something
    const getCountriesData=async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then ((response)=>response.json())
      .then((data)=>{
        const countries=data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2
      }));
        setTableData(data);
        setmapcountries(data);
        setCounties(countries);
      });
    };
    getCountriesData();
  },[]); 

  const onCountryChange=async(event)=>{
    const countryCode=event.target.value;
    
    setCountry(countryCode);

    const url=countryCode==='worldwide' ?'https://disease.sh/v3/covid-19/all'
    :` https://disease.sh/v3/covid-19/countries/${countryCode}`;
   

    await fetch(url)
    .then(response =>response.json())
    .then(data=>{
      setCountry(countryCode);
      //All of the data...
      //from the country response
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(1);
      
    })
  }
  console.log(Table);
  return (
  <div className="app">
    <div className="app__left">
            <div className="app__header">
         <h1>
           Covid Tracker
          </h1>
            <FormControl className="app__dropdown">
              <Select variant="outlined"
              onChange={onCountryChange}
                value={country}>
                <MenuItem value="worldwide">Worldwide</MenuItem>    

                  {countries.map((country)=>
                    <MenuItem value={country.value}>{country.name}</MenuItem>)

                  }
        
       
              </Select>
            </FormControl>
      </div>
  

    <div className="app__stats" >

    <Infobox
    onClick={(e)=>setCasesType("cases")} title="Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={countryInfo.cases}/>
    <Infobox
    onClick={(e)=>setCasesType("Recovered")} className="middle__box" title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={countryInfo.recovered}/>
    <Infobox 
    onClick={(e)=>setCasesType("Deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths}/>
    </div>
   

   
    <MapShow
    // casesType={casesType}
    countries={mapCountries}
    center={mapCenter}
    zoom={mapZoom}
    />


   
      
  
    </div>

    <Card className="app__right">
      <CardContent>
        
        <p><covidTable countries={tableData}/></p>
        <h3>Worldwide new Cases</h3>
        <h1> Graph</h1>
      <LineGraph/>
      </CardContent>
  
    </Card>
    
</div>


    

  );
}

export default App;

