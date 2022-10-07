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
    })

    .fail(function (data) {
      console.log('3時間ごとの天気を取得出来ませんでした。')
    });
}
