export default interface Item {
    dateStart: string;
    dateEnd: string;
    precipitation: string;
    humidity: string;
    clouds: string;
    temperature?: string;
    tempMin?: string;
    tempMax?: string;
    windSpeed?: string;
    windDirection?: string;
    pressure?: string;
    weatherDescription?: string;
}