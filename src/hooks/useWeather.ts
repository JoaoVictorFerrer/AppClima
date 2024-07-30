import axios from 'axios'
import {z} from 'zod'
// import {object,string,number, parse, InferOutput} from 'valibot'
import { SearchType } from '../types'
import { useMemo, useState } from 'react'

//TYPE GUARD O ASSERTION
// function isWeatherResponse(weather : unknown) : weather is Weather { //unknown no estoy seguro que tipo de dato es pero lo voy a verificar

//     return (
//         Boolean(weather) &&
//         typeof weather === 'object' &&
//         typeof (weather as Weather).name === 'string' &&
//         typeof (weather as Weather).main.temp === 'number' &&
//         typeof (weather as Weather).main.temp_max === 'number' &&
//         typeof (weather as Weather).main.temp_min === 'number'
//     )
// }

//ZOD TYPE

const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp:z.number(),
        temp_max:z.number(),
        temp_min:z.number(),
    })
})

export type Weather = z.infer<typeof Weather> // lo exporto para poder infererir el type que me da Zod y esta sincronizado apesar de que es el mismo type de index


//TYPE WITH VALIBOT

// const WeatherSchema = object({
//     name: string(),
//     main: object({
//        temp: number(),
//        temp_max:number(), 
//        temp_min:number(), 
//     }),
// })
// type Weather = InferOutput<typeof WeatherSchema>

const initialState = {
    name: '', 
    main: {
        temp: 0,
        temp_max: 0,
        temp_min:0,
    }

}

export default function useWeather() {

    const [weather, setWeather] = useState<Weather>(initialState);
    const [loading, setLoading] = useState(false)
    const [notFound,setNotFound] = useState(false)
    
    const fetchWeather = async (search: SearchType) => {
        const appId = import.meta.env.VITE_API_KEY
        setLoading(true)
        setWeather(initialState)

        try {
            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`
            const {data} = await axios(geoUrl)
            
            //COMPROBAR SI EXISTE 
            if (!data[0]) {
                setNotFound(true)
                return
            }

            const lat = data[0].lat
            const lon = data[0].lon

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`
    
            //CASTER type
            // const { data: weatherResult } = await axios<Weather>(weatherUrl)
            // console.log(weatherResult)

            //TYPE GUARDS
        //     const { data: weatherResult } = await axios<Weather>(weatherUrl)
        //     const result = isWeatherResponse(weatherResult)
        //     if (result) {
        //      console.log( weatherResult.name)
        //   }
        
            
            //TYPE CON ZOD
            
            const { data: weatherResult } = await axios(weatherUrl)
            const result = Weather.safeParse(weatherResult) // si corresponde al schema realizado me devulve un true de lo contrario false
            if (result.success) {
                setWeather(result.data)
                
            } else {
                console.log('respuesta mal formada')
            }


            //VALIBOT
            // const { data: weatherResult } = await axios(weatherUrl)
            // const result = parse(WeatherSchema, weatherResult)
            // if (result) {
                
            //     console.log(result)
            // } else {
            //     console.log('respuesta mal formada')
            // }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const hasWeatherData = useMemo(() => {
        if (weather.name === 'Sol') {
            setWeather({ ...weather, name: "Madrid" })
            return true
        }
        if (weather.name === 'Sant Pere, Santa Caterina i La Ribera') {
            setWeather({ ...weather, name: 'Barcelona' })
            return true
        }
        
        if (weather.name) return true
    } ,[weather]) // comprobar si el name en weather tiene algo 

    return {
        weather,
        hasWeatherData,
        loading,
        notFound,
        fetchWeather,
        
    }
}