import './App.css';
import Grid from '@mui/material/Grid';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { borderRight } from '@mui/system';

interface Item {
  dateStart: string;
  dateEnd: string;
  precipitation: string;
  humidity: string;
  clouds: string;
  temperature: string;
  tempMin: string;
  tempMax: string;
  windSpeed: string;
  windDirection: string;
  pressure: string;
  weatherDescription: string;
}

interface Indicator {
  title?: string;
  subtitle?: string;
  value?: string;
}

function App() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedVariable, setSelectedVariable] = useState<string>('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      const API_KEY = "e415accb839161aa2fbfe4059d0588a2";
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`
        );
        const savedTextXML = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        // Set indicadores
        const name = xml.getElementsByTagName("name")[0]?.textContent || "";
        const location = xml.getElementsByTagName("location")[1];
        const latitude = location?.getAttribute("latitude") || "";
        const longitude = location?.getAttribute("longitude") || "";
        const altitude = location?.getAttribute("altitude") || "";

        setIndicators([
          { title: "Location", subtitle: "City", value: name },
          { title: "Location", subtitle: "Latitude", value: latitude },
          { title: "Location", subtitle: "Longitude", value: longitude },
          { title: "Location", subtitle: "Altitude", value: altitude },
        ]);

        // Set datos extendidos para la tabla
        const times = xml.getElementsByTagName("time");
        const dataToItems: Item[] = Array.from(times).map((time) => {
          const temperatureElement = time.getElementsByTagName("temperature")[0];
          const windSpeedElement = time.getElementsByTagName("windSpeed")[0];
          const windDirectionElement = time.getElementsByTagName("windDirection")[0];
          const pressureElement = time.getElementsByTagName("pressure")[0];
          const symbolElement = time.getElementsByTagName("symbol")[0];
        
          const kelvinToCelsius = (temp: string) =>
            temp ? (parseFloat(temp) - 273.15).toFixed(2) : "N/A";
        
          return {
            dateStart: time.getAttribute("from") || "N/A",
            dateEnd: time.getAttribute("to") || "N/A",
            precipitation: time.getElementsByTagName("precipitation")[0]?.getAttribute("value") || "0",
            humidity: time.getElementsByTagName("humidity")[0]?.getAttribute("value") || "0",
            clouds: time.getElementsByTagName("clouds")[0]?.getAttribute("all") || "0",
            temperature: kelvinToCelsius(temperatureElement?.getAttribute("value") || "N/A"),
            tempMin: kelvinToCelsius(temperatureElement?.getAttribute("min") || "N/A"),
            tempMax: kelvinToCelsius(temperatureElement?.getAttribute("max") || "N/A"),
            windSpeed: windSpeedElement?.getAttribute("mps") || "N/A",
            windDirection: windDirectionElement?.getAttribute("name") || "N/A",
            pressure: pressureElement?.getAttribute("value") || "N/A",
            weatherDescription: symbolElement?.getAttribute("name") || "N/A",
          };
        });

        setItems(dataToItems);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  const renderIndicators = () => {
    return (
      <div className="background-container">
        <div className="indicator-grid">
          <Grid container spacing={2} justifyContent="center" alignItems="center" columns={12} sx={{ width: '100%' }}>
            {indicators.map((indicator, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <IndicatorWeather title={indicator.title} subtitle={indicator.subtitle} value={indicator.value} />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <Grid container spacing={5}>
        {renderIndicators()}

        {/* Contenedor de métricas */}
        <Grid container justifyContent="center" sx={{ width: '100%', margin: 0 }}>
          <Grid item xs={12}>
            <Paper
              sx={{
                margin: '0 2rem',
                padding: 3,
                backgroundColor: '#e3f2fd',
                width: 'calc(100% - 4rem)',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h5"
                color="primary"
                gutterBottom
                textAlign="center"
                sx={{ marginBottom: 2 }}
              >
                Métricas
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={6}>
                  <ControlWeather onSelectVariable={setSelectedVariable} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <LineChartWeather items={items} selectedVariable={selectedVariable} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabla */}
        <Grid container spacing={3} mt={4} justifyContent="center">
        <Grid item xs={12}>
        <Paper
        sx={{
          padding: 3,
          backgroundColor: '#e3f2fd',
          borderRadius: 2,
          borderLeft: '2px solid #ddd',
          margin: '0 auto',
          width: 'calc(100% - 1rem)',
        }}
      >

      <TableWeather itemsIn={items} />
    </Paper>
  </Grid>
</Grid>
      </Grid>
    </>
  );
}

export default App;
