const Wform = document.querySelector('.Wform')
const inputCity = document.querySelector('.inputCity')
const Wcard = document.querySelector('.Wcard')
const apiKey = '29e973370f98f29c2563a2dc17a9d981'
const btnMore = document.getElementById('btnMore')
let MoreData = document.querySelector('.MoreData')

Wform.addEventListener('submit', async event => {
    event.preventDefault()

    const city = inputCity.value

    if (city) {
        try {
            const weatherData = await getWeatherData(city)
            displayWeatherInfo(weatherData)
            showAdditionalData(weatherData)

        }
        catch (error) {
            console.error(error)
            displayError(error)
        }

    }
    else {
        displayError()
    }
})

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

    const response = await fetch(apiUrl)

    if (!response.ok) {
        throw new Error('Could not fetch the data')
    }

    return await response.json()
}

function displayWeatherInfo(data) {
    const { name: city, main: { temp, humidity }, weather: [{ description, id }] } = data

    // Clear previous data before adding new data
    Wcard.textContent = ""
    Wcard.style.display = 'flex'

    const CDisplay = document.createElement('h1')
    CDisplay.classList.add('CDisplay')
    CDisplay.textContent = city
    Wcard.appendChild(CDisplay)

    const TDisplay = document.createElement('p')
    TDisplay.classList.add('TDisplay')
    TDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`
    Wcard.appendChild(TDisplay)

    const HDisplay = document.createElement('p')
    HDisplay.classList.add('HDisplay')
    HDisplay.textContent = `Humidity: ${humidity}%`
    Wcard.appendChild(HDisplay)

    const DeDisplay = document.createElement('p')
    DeDisplay.classList.add('DeDisplay')
    DeDisplay.textContent = description
    Wcard.appendChild(DeDisplay)

    const WEmoji = document.createElement('p')
    WEmoji.classList.add('WEmoji')
    WEmoji.textContent = getWeatherEmoji(id)
    Wcard.appendChild(WEmoji)

    if(id >= 200 && id < 600){
        document.body.style.backgroundImage = 'url(Pictures/rain.jpg)'
    }
    else if(id >=600 && id < 700){
        document.body.style.backgroundImage = 'url(Pictures/snow.jpg)'
    }
    else if(id === 800){
        document.body.style.backgroundImage = 'url(Pictures/sun.jpg)'
        
    }
    else if(id >=801 && id < 810){
        document.body.style.backgroundImage = 'url(Pictures/clouds.jpg)'
        
    }
    else{
        document.body.style.backgroundImage = 'url(Pictures/default.jpg)'
    }
}

function showAdditionalData(data) {
    const { main: { feels_like, temp_max, temp_min } } = data

    // Create and display the "More Data" button
    btnMore.style.display = 'block'

    // Remove any previous event listener (if any) before attaching a new one
    btnMore.removeEventListener('click', showMoreData)
    
    // Add new event listener for the button
    btnMore.addEventListener('click', showMoreData)

    function showMoreData() {
        MoreData.remove()
        MoreData = document.createElement('p')
        MoreData.classList.add('MoreData')
        MoreData.textContent = `Relative feeling is ${(feels_like - 273.15).toFixed(1)}°C; Min Temp: ${(temp_min - 273.15).toFixed(1)}°C; Max Temp ${(temp_max - 273.15).toFixed(1)}°C`
        Wcard.appendChild(MoreData)
    }
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return '⚡'

        case (weatherId >= 300 && weatherId < 400):
            return '😰'

        case (weatherId >= 500 && weatherId < 600):
            return '⛈'

        case (weatherId >= 600 && weatherId < 700):
            return '❄'

        case (weatherId >= 700 && weatherId < 800):
            return '🌫'

        case (weatherId === 800):
            return '💥'

        case (weatherId >= 801 && weatherId < 810):
            return '☁'

        default:
            return '❓'
    }
}

function displayError() {
    const errorDisplay = document.createElement('p')
    errorDisplay.textContent = 'Please Enter the City!'
    errorDisplay.classList.add('errDisplay')

    Wcard.textContent = ""
    Wcard.style.display = 'flex'
    Wcard.appendChild(errorDisplay)
}
