document.addEventListener("DOMContentLoaded", () => {

    const API_KEY = "";
    const URL_FORECAST = "https://api.openweathermap.org/data/2.5/forecast?q="
    const SEARCHBOX = document.querySelector(".search input");
    const SEARCHBTN = document.querySelector(".search button");
    const IMAGE = document.querySelector(".weather-icon");
    const FORECAST_DAYS = document.querySelectorAll(".day");
    const FORECAST_TEMP = document.querySelectorAll(".forecast_temp");
    const FORECAST_IMAGE = document.querySelectorAll(".forecast_image");
    const DAY_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    SEARCHBTN.addEventListener("click", () => {

        if (!SEARCHBOX.value) {

            return alert("introduzca una ciudad");
        }
        else
            checkWeather(SEARCHBOX.value);
    });
    
    async function checkWeather(city) {

        try {
            const RESPONSE_FORECAST = await fetch(URL_FORECAST + city + `&units=metric&appid=${API_KEY}`);

            if (!RESPONSE_FORECAST.ok){

                RESPONSE_FORECAST.json().then(data => document.querySelector(".city").innerHTML = data.message);
                return;
            }

            const DATA_FORECAST = await RESPONSE_FORECAST.json();
            const FILTER_FORECAST = filterDaysForecast(DATA_FORECAST); //Array con los dias inicial y posteriores al inicial con la misma hora de busqueda.
            const SLICE_FILTER_FORECAST = FILTER_FORECAST.slice(1); //Array ya con los dias posteriores.

            nowData(DATA_FORECAST);

            daysForecast(SLICE_FILTER_FORECAST);

            tempForecast(SLICE_FILTER_FORECAST);

            imageForecast(SLICE_FILTER_FORECAST);


        } catch (error) {

            console.log("Has been occurred a error: " + error.message);
            document.querySelector(".city").innerHTML = "An occurred a error";
            return;
        }

    }

    function filterDaysForecast(DATA_FORECAST) { //Función para filtrar de todos los datos solo la misma hora actual de los días posteriores, ya que datos que proviene la API vienen en lapsos de 3 horas.

        let date = new Date(DATA_FORECAST.list[0].dt_txt);

        let hour = date.getHours();

        let hourFilter = DATA_FORECAST.list.filter((hr) => {

            let dateFilter = new Date(hr.dt_txt);

            return dateFilter.getHours() == hour;
        });

        return hourFilter;

    }

    function imageForecast(DATA_FORECAST) { //Función para colocar las imágenes de los días posteriores provenientes de la API.
        FORECAST_IMAGE.forEach((image, index) => {

            image.setAttribute("src", `https://openweathermap.org/img/wn/${DATA_FORECAST[index].weather[0].icon}@2x.png`);
        });
    }

    function tempForecast(DATA_FORECAST) { //Función para colocar en la interfaz las temperaturas de los días posteriores.

        FORECAST_TEMP.forEach((temp, index) => {

            temp.innerHTML = Math.round(DATA_FORECAST[index].main.temp) + "º";

        });
    }

    function daysForecast(FILTER_FORECAST) { //Función para colocar en la interfaz los nombres de los días posteriores al actual.

        FORECAST_DAYS.forEach((day, index) => {

            let dayFilter = new Date(FILTER_FORECAST[index].dt_txt);

            day.innerHTML = DAY_OF_WEEK[dayFilter.getDay()];

        });
    }

    function nowData(DATA_FORECAST) { //Función para indicar en la interfaz principal el nombre de la ciudad y los valores actuales.

        document.querySelector(".city").innerHTML = DATA_FORECAST.city.name;
        document.querySelector(".temp").innerHTML = Math.round(DATA_FORECAST.list[0].main.temp) + "º";
        document.querySelector(".humidity").innerHTML = DATA_FORECAST.list[0].main.humidity + "%";
        document.querySelector(".wind").innerHTML = DATA_FORECAST.list[0].wind.speed + " Km/h";

        IMAGE.setAttribute("src", `https://openweathermap.org/img/wn/${DATA_FORECAST.list[0].weather[0].icon}@2x.png`);
    }
});







