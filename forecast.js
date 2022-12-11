
const BASE_URL = 'http://api.weatherapi.com/v1/forecast.json';
const API_KEY = '7cfeb8969f08499890d224655223011';

const list = document.querySelector('.js-list')
const form = document.querySelector('.js-search');

form.addEventListener('submit', onSearch);

function onSearch(evt) {
    evt.preventDefault()
    // console.dir(evt.currentTarget)
    const { query : {value : searchValue}, days : {value : daysValue} } = evt.currentTarget.elements;
    // console.log(searchValue);
    // console.log(daysValue);

    if (!searchValue) {
        alert('pole puste');
        return;
    }

    forecastApi(searchValue, daysValue).then(data => {
        console.log(data.forecast.forecastday);
        createMarkup(data.forecast.forecastday);
    })

}

function createMarkup(arr) {
    const markup = arr.map(item => `<li>
    <img src="${item.day.condition.icon}" alt="">
    <span>${item.day.condition.text}</span>
    <h2>Day: ${item.date}</h2>
    <h3>Temp: ${item.day.avgtemp_c}&#8451;</h3>
</li>`).join('');
    list.innerHTML = markup;
}

function forecastApi(name = "Brovary", value=7) {
    // console.log(name);
    return fetch(`${BASE_URL}?key=${API_KEY}&q=${name}&days=${value}`).then(resp => {
        console.log(resp);
        if(!resp.ok) {
            throw new Error(resp.statusText);
        }
        return resp.json()
    }).catch(err => console.error(err))
}
            

