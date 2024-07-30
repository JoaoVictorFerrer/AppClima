import styles from'./app.module.css'
import Alert from './components/Alert/Alert'
import Form from './components/form/Form'
import Loading from './components/Loading/Loading'
import WeatherDetails from './components/WeatherDetails/WeatherDetails'
import useWeather from './hooks/useWeather'

function App() {

  const {fetchWeather,weather,hasWeatherData,loading,notFound} = useWeather()

  return (
    <>
      <h1 className={styles.title}>Buscador de Clima</h1>

      <div className={styles.container}>
        <Form fetchWeather={fetchWeather} />
        {loading && <Loading/>}
        {hasWeatherData && <WeatherDetails weather={weather} />}
        {notFound && <Alert>Ciudad no encontrada</Alert>}
      
      </div>
    </>

  )
}

export default App
