const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&';
const cities = [];
const apiKey = '8e4bd22bc72bb65bf25986e6ca80adc6';

if (typeof apiKey === 'undefined') {
    alert('API key is not defined');
}

function addCity(query, b = false) {
    cityfound('', false);
    $.getJSON(apiUrl + 'q=' + query + '&appid=' + apiKey)
        .done(function(data) {
            if (data.cod === 200) {
                if (!cities.includes(data.name) || !b) {
                    cities.push(data.name);
                    const li_background = data.weather[0].main.toLowerCase() === 'clear' ? 'clear' : 'haze';
                    $(".citylist_div ul").append('<li id="' + data.id + '" class="' + li_background + '"><span class="list_item list_delete">×</span><span class="list_item list_cityname">' + data.name + ', ' + data.sys.country + '</span><span class="list_item list_forecast">' + data.weather[0].main + '</span><span class="list_item list_celsius">' + parseInt(data.main.temp) + ' °C</span></li>');
                    $('#addcity').val('').focus();
                } else {
                    cityfound('City already added', true);
                }
            } else if (data.cod === 404) {
                cityfound('City not found', true);
            }
        })
        .fail(function(fail) {
            if (fail.status === 404) {
                cityfound('City not found', true);
            }
        });
}

cities.forEach(function(element) {
    addCity(element, false);
});

$('#addcity').keyup(function(e) {
    cityfound('', false);
    searchfound(false);
    if (e.keyCode === 13) {
        addCity($(this).val(), true);
    }
});

$('#addcity_button').on('click', function() {
    addCity($('#addcity').val());
});

$("#search").keyup(function() {
    const filter = $(this).val().toLowerCase();
    let count = 0;
    cityfound('', false);
    $(".citylist_div ul li").each(function() {
        const text = $(this).text().toLowerCase();
        if (text.indexOf(filter) === -1) {
            $(this).hide();
        } else {
            $(this).show();
            count++;
        }
    });
    if (count === 0) {
        searchfound(true);
    } else {
        searchfound(false);
    }
});

$(document).on('click', '.list_delete', function() {
    const newCities = [];
    const id = $(this).parent().attr('id');
    $.getJSON(apiUrl + 'id=' + id + '&appid=' + apiKey)
        .done(function(data) {
            cities.forEach(function(element) {
                if (element !== data.name) {
                    newCities.push(element);
                }
            });
            cities = newCities;
        });
    $(this).closest('li').remove();
});

function searchfound(b) {
    const searchInfo = $('#search_info');
    if (b) {
        if (!searchInfo.length) {
            $(".search_div").append('<span id="search_info" class="search_error"></span>');
        }
        searchInfo.removeClass('err_out').html('No Results').addClass('err_in');
    } else {
        searchInfo.removeClass('err_in').addClass('err_out');
    }
}

function cityfound(s, b) {
    const addInfo = $('#add_info');
    if (b) {
        if (!addInfo.length) {
            $(".addcity_div").append('<span id="add_info" class="add_error"></span>');
        }
        addInfo.removeClass('err_out').html(s).addClass('err_in');
    } else {
        addInfo.removeClass('err_in').addClass('err_out');
    }
}

$(document).on("click", function() {
    cityfound('', false);
    searchfound(false);
});
