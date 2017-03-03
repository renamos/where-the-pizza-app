$(document).ready(function () {

    //Start Declarations    
    var pointA;

    var placeA;

    var latLngA;

    var service;

    var autocomplete;

    var results;

    var map;

    var latLng;

    var newMarker;

    var markersList = [];


    var fillList = function (places) {
        places.forEach(function (pizzaPlace, index) {
            $('#pizza').append(createPizzaHtml(pizzaPlace))
        })
    }

    var createPizzaHtml = function (pizzaInfo) {
        var html = ''
        html += '<li>'
        html += pizzaInfo.name

        if (pizzaInfo.opening_hours && pizzaInfo.opening_hours.open_now) {
            html += ' <img class="icon" src="images/open-icon.png"/>'
            html += '</br>'
        } else if (pizzaInfo.opening_hours && !pizzaInfo.opening_hours.open_now) {
            html += ' closed'
            html += '</br>'
        } else {
            html += ' ?'
            html += '</br>'
        }

        html += '</li>'

        return html
    }


    var createInfoWindowHtml = function (info) {
        var html = ''
        html += '<div class="info_window">'
        html += '<h1>'
        html += info.name
        html += '</h1>'
        html += '<p>'
        html += info.formatted_address
        html += '</p>'
        html += '<a target="_blank" href="'
        html += 'http://maps.google.com/maps?&z=10&q='
        html += info.name
        html += '+'
        html += info.formatted_address
        html += '">Click here to open in Google Maps</a>'
        html += '</div>'

        return html
    };

    var fillMarkers = function (markers) {

        var infowindow;

        markers.forEach(function (marker, index) {
            latLng = {
                lat: marker.geometry.location.lat(),
                lng: marker.geometry.location.lng()
            };


            //infowindow w/ content (ex.createInfoWindowHtml(marker))

            infowindow = new google.maps.InfoWindow({
                content: ''
            });

            newMarker = new google.maps.Marker({
                position: latLng,
                animation: google.maps.Animation.DROP,
                map: map,
                title: 'Click for more details!',
                icon: 'images/pizza_marker.png'
            });

            //add click listener

            newMarker.addListener('click', function () {
                infowindow.setContent(createInfoWindowHtml(marker));
                infowindow.open(map, this);
            });

            markersList.push(newMarker);

        })
    }


    var buildURL = function () {
        var url = ""
        url += "http://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="

        url += origin.geometry.location.lat();

        url += ","

        url += origin.geometry.location.lng();

        url += "&destinations="

        url += destination.geometry.location.lat();

        url += ","

        url += destination.geometry.location.lng();

        url += "&key=AIzaSyA_-tUgrtucFTD8P_1tc7MBY1bbhDJm5OI"

        return url;
    }

    //End declarations

    //Click Button event

    $("button").click(function () {
        pointA = $(".pointA").val();
        console.log(pointA)
        console.log(markersList)
        //Delete all markers
        markersList.forEach(function (marker, index) {
            marker.setMap(null);
            console.log(marker);
        })

        markersList = [];

        //If user doesn't write anything in input, alert error
        if (!placeA || placeA == undefined || placeA == null) {
            swal({
                title: "No pizza for you!",
                text: "Please enter a valid address or location",
                type: "error",
                confirmButtonText: "Okay!"
            });

            return
        }

    });


    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    var createMap = function (center) {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: center,
            styles: [{
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "lightness": 100
                }, {
                    "visibility": "simplified"
                }]
            }, {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "visibility": "on"
                }, {
                    "color": "#C6E2FF"
                }]
            }, {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#C5E3BF"
                }]
            }, {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#D1D1B8"
                }]
            }]
        });

        //Add center marker to map
        var marker = new google.maps.Marker({
            position: center,
            animation: google.maps.Animation.DROP,
            map: map
        });

        //Create 'places' autocomplete input
        var inputA = document.getElementById("A");

        autocomplete = new google.maps.places.Autocomplete(inputA);

        autocomplete.bindTo("bounds", map);

        autocomplete.addListener('place_changed', function () {
            //Get the location and lat/long


            placeA = autocomplete.getPlace();
            latLngA = new google.maps.LatLng(placeA.geometry.location.lat(), placeA.geometry.location.lng())
            //Clean the list
            $('#pizza > li').remove();


            //Change the position of the marker
            marker.setPosition(placeA.geometry.location);
            marker.setVisible(true);
            marker.setAnimation(google.maps.Animation.DROP)

            //Start request to get Pizza Places


            var request = {
                location: latLngA,
                radius: '3000',
                query: 'pizza'
            };

            service = new google.maps.places.PlacesService(map);

            service.textSearch(request, function (results) {

                if (results.length == 0) {
                    swal({
                        title: "No pizza for you!",
                        text: "Try another location.",
                        type: "error",
                        confirmButtonText: "Okay!"
                    });

                    return
                }
                fillList(results);
                fillMarkers(results);


                var myLatLng;

                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < results.length; i++) {
                    myLatLng = new google.maps.LatLng(results[i].geometry.location.lat(), results[i].geometry.location.lng());
                    bounds.extend(myLatLng);
                }


                map.fitBounds(bounds);

                placeA = null;

                console.log(results);


            });
        });

    }

    navigator.geolocation.getCurrentPosition(
        function (response) {
            //Create map
            $('#box').show();
            $('.loading').remove();

            var center = {
                lat: response.coords.latitude,
                lng: response.coords.longitude
            };
            createMap(center);

            //delete markers on new search
            //responsive


            //make markers clickable, show more info, click address opens new google maps window with directions

            //replace "open/close" with small icon
            //map styling
            //Pizza place info list: phone number. Pizza place name is URL to website


        },
        function (err) {
            $('#box').show();
            $('.loading').remove();
            var center = {
                lat: 47.608013,
                lng: -122.335167
            }
            createMap(center)
        });

});