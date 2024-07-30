
export const formatTemperature = (temperature: number): number => {
   
   const kelvin = 273.15
    return parseInt((temperature - kelvin).toString()) // lo paso a un string para que no me salte error de tipado

}