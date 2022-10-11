var API_KEY = 'c3a10042f63aca96d24e28df7e79d706';
var defaultCity = 'Tokyo';
//現在の天気を取得
function currentWeather() {
  $.ajax({
    url: '//api.openweathermap.org/data/2.5/weather?q=' + defaultCity + ',jp&units=metric&appid=' + API_KEY,
    dataType: 'json',
    type: 'GET'
  })
    .done(function (data) {
      //呼び出した時の処理
      // console.log(data);
      getWeatherData(data);
      createDate(city.date);
      getDiscription(city.description);
      domWeatherWrite();
    })
    .fail(function (data) {
      console.log('現在の天気を取得出来ませんでした。')
    });
}

//3時間ごとの天気を取得
function threeWeather() {
  $.ajax({
    url: '//api.openweathermap.org/data/2.5/forecast?q=' + defaultCity + ',jp&units=metric&appid=' + API_KEY,
    dataType: 'json',
    type: 'GET'
  })
    .done(function (data) {
      //呼び出した時の処理
      var insertHTML = '';
      for (var i = 0; i <= 12; i++) {
        insertHTML += domThreeWeatherWrite(data, i);
      }
      $('#weather-report').html(insertHTML);

      $('.weather-reportItem').click(function () {
        var targetNum = $(this).index();
        getWeatherData(data.list[targetNum]);
        createDate(new Date(data.list[targetNum].dt * 1000));
        getDiscription(city.description);
        domWeatherWrite();
        $('body, html').animate({
          scrollTop: 0
        }, 300, 'linear');
      })
    })

    .fail(function (data) {
      console.log('3時間ごとの天気を取得出来ませんでした。')
    });
}

var city = {
  name: '',
  date: '',
  time: '',
  weather: '',
  description: '',
  temp: '',
  tempMin: '',
  tempMax: '',
  feelsLike: '',
  pressure: '',
  humidity: '',
  windSpeed: '',
  WindSpeedUnit: '',
  windDeg: '',
  cloudsAll: '',
  sunriseDate: '',
  sunriseTime: '',
  sunsetDate: '',
  sunsetTime: '',
};
var current = {
  day: '',
  month: '',
  date: '',
  hours: '',
  minitutes: '',
  time: '',
  timeText: '',
}

//データ格納
function getWeatherData(data) {
  (data.name) ? city.name = data.name.toUpperCase() : city.name;
  city.description = data.weather[0].description;
  city.date = new Date(data.dt * 1000);
  city.temp = Math.round(data.main.temp);
  city.tempMin = Math.round(data.main.temp_min);
  city.tempMax = Math.round(data.main.temp_max);
  city.feelsLike = Math.round(data.main.feels_like);
  city.pressure = Math.round(data.main.pressure);
  city.humidity = Math.round(data.main.humidity);
  city.windSpeed = Math.round(data.wind.speed);
  city.windDeg = Math.round(data.wind.deg);
  city.cloudsAll = Math.round(data.clouds.all);
  (data.sys.sunrise) ? city.sunriseDate = new Date(data.sys.sunrise * 1000) : city.sunriseDate = undefined; //unixtime to date
  (data.sys.sunset) ? city.sunsetDate = new Date(data.sys.sunset * 1000) : city.sunsetDate = undefined; //unixtime to date
  if (city.sunriseDate && city.sunsetDate) {
    city.sunriseTime = city.sunriseDate.getHours() + ':' + city.sunriseDate.getMinutes();
    city.sunsetTime = city.sunsetDate.getHours() + ':' + city.sunsetDate.getMinutes();
  } else {
    city.sunriseTime = '-';
    city.sunsetTime = '-';
  }
}

//日付&時間取得
function createDate(date) {
  current.day = date;
  current.month = current.day.getMonth() + 1;
  current.date = current.month + '/' + current.day.getDate();
  current.hours = current.day.getHours();
  current.minitutes = ('0' + current.day.getMinutes()).slice(-2);
  current.time = current.hours + ':' + current.minitutes;
  current.timeText = current.date + ' ' + current.time;
}

var UNIT = {
  TEMP: '°',
  PRESSURE: 'hPa',
  HUMIDITY: '%',
  WINDSPEED: 'm/s',
  MIDDLE_DOT: ':'
}
//DOM要素に描写
function domWeatherWrite() {
  $('#city-name').html(city.name);
  $('#weather-temp').html(city.temp + UNIT.TEMP);
  $('#tempMin').html(city.tempMin + UNIT.TEMP);
  $('#tempMax').html(city.tempMax + UNIT.TEMP);
  $('#feelsLike').html(city.feelsLike + UNIT.TEMP);
  $('#humidity').html(city.humidity + UNIT.HUMIDITY);
  $('#sunrise').html(city.sunriseTime);
  $('#sunset').html(city.sunsetTime);
  $('#windSpeedUnit').html(city.windSpeed + UNIT.WINDSPEED);
  $('#pressure').html(city.pressure + UNIT.PRESSURE);
  $('#weather-date').html(current.timeText);
  $('.detail-list').css('display', 'flex');
}

//DOM要素に描写 3時間ごとver
function domThreeWeatherWrite(data, i) {
  var week = new Array("(日)", "(月)", "(火)", "(水)", "(木)", "(金)", "(土)");
  var dt = data.list[i].dt_txt;
  var date = new Date(dt.replace(/-/g, "/"));
  date.setHours(date.getHours() + 9);
  var month = date.getMonth() + 1;
  var day = month + "/" + date.getDate();
  var week = week[date.getDay()];
  var time = date.getHours() + "：00";
  var main = (data.list[i].weather[0].main).toLowerCase();
  var html =
    '<div class="weather-reportItem">' +
    '<div class="weather-day">' + day + '</div>' +
    '<div class="weather-week">' + week + '</div>' +
    '<div class="weather-time">' + time + '</div>' +
    '<div class="weather-main ' + main + '"></div>' +
    '<div class="weather-temp">' + Math.round(data.list[i].main.temp) + UNIT.TEMP + '</div>' +
    '</div>';
  return html
}

//天気情報分岐
function getDiscription(disc) {
  switch (disc) {
    case 'clear sky':
      return $('#weather-discription').html('快晴');
      break;
    case 'few clouds':
      return $('#weather-discription').html('くもり（雲少なめ）');
      break;
    case 'scattered clouds':
      return $('#weather-discription').html('くもり（雲ふつう）');
      break;
    case 'broken clouds':
      return $('#weather-discription').html('くもり（雲多め）');
      break;
    case 'overcast clouds':
      return $('#weather-discription').html('くもり（雲多め）');
      break;
    case 'light intensity shower rain':
      return $('#weather-discription').html('小雨のにわか雨');
      break;
    case 'shower rain':
      return $('#weather-discription').html('にわか雨');
      break;
    case 'heavy intensity shower rain':
      return $('#weather-discription').html('大雨のにわか雨');
      break;
    case 'light rain':
      return $('#weather-discription').html('小雨');
      break;
    case 'moderate rain':
      return $('#weather-discription').html('雨');
      break;
    case 'heavy intensity rain':
      return $('#weather-discription').html('大雨');
      break;
    case 'very heavy rain':
      return $('#weather-discription').html('激しい大雨');
      break;
    case 'rain':
      return $('#weather-discription').html('雨');
      break;
    case 'thunderstorm':
      return $('#weather-discription').html('雷雨');
      break;
    case 'snow':
      return $('#weather-discription').html('雪');
      break;
    case 'mist':
      return $('#weather-discription').html('靄');
      break;
    case 'tornado':
      return $('#weather-discription').html('強風');
      break;
    default:
      return disc;
  }
}

function weatherInit() {
  currentWeather();
  threeWeather();
}
weatherInit();
