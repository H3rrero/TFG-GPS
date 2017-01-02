(function () {
  'use strict'
angular.module('Prueba',["chart.js"])
.controller('PruebaController',PruebaController)
.controller("LineCtrl", function ($scope) {

  $scope.labels = ["1000", "2000", "3000", "5000", "7000", "9000", "10000"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [100, 250, 310, 600, 745, 864, 943]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        }
      ]
    }
  };
})
.directive('myMap', function() {
    // directive link function
    var link = function(scope, element, attrs) {
        var map

        // init the map
        function initMap() {
          map = new google.maps.Map(element[0], {
            center: {lat: 40.41, lng: -3.70},
            zoom: 8,
            disableDefaultUI: true,
            mapTypeControl: true,
          mapTypeControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          mapTypeIds: [
            google.maps.MapTypeId.ROADMAP,

            google.maps.MapTypeId.SATELLITE
          ]
          }
          });
          var botont = /** @type {!HTMLDivElement} */(
          document.getElementById('botones'));
          var funciones = /** @type {!HTMLDivElement} */(
          document.getElementById('funciones'));
          var input = /** @type {!HTMLInputElement} */(
          document.getElementById('pac-input'));
          var datos = /** @type {!HTMLDivElement} */(
          document.getElementById('datos'));
          var lista = /** @type {!HTMLDivElement} */(
          document.getElementById('lista'));


          var types = document.getElementById('type-selector');
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(types);
          map.controls[google.maps.ControlPosition.RIGHT_TOP].push(botones);
          map.controls[google.maps.ControlPosition.RIGHT_TOP].push(funciones);
          map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(datos);
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(lista);
          var autocomplete = new google.maps.places.Autocomplete(input);
          autocomplete.bindTo('bounds', map);

          var infowindow = new google.maps.InfoWindow();
          var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
          });

          autocomplete.addListener('place_changed', function() {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
          window.alert("Autocomplete's returned place contains no geometry");
          return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
          } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);  // Why 17? Because it looks good.
          }
          marker.setIcon(/** @type {google.maps.Icon} */({
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(35, 35)
          }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          var address = '';
          if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
          }

          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
          infowindow.open(map, marker);
          });


        }
        // show the map and place some markers
        initMap();

    };

    return {
        restrict: 'E',
        template: '<div id="map"></div>',
        replace: true,
        link: link
    };
});


function PruebaController(){
  var list1 = this;
      list1.funciones = false;
      list1.funcionesR = false;
      list1.funcionesW = false;
      list1.activarLista = false;
      list1.activarListaR = false;
      list1.activarListaW = false;
      list1.mostrarDatos = false;


      list1.verDatos = function () {
        if (list1.mostrarDatos==true) {
          list1.mostrarDatos = false;
        } else {
          list1.mostrarDatos=true;
        }

      }

      list1.listaActiva = function () {
        list1.activarListaR = false;
        list1.activarListaW = false;
        list1.activarLista=true;

      }
      list1.listaActivaR = function () {
        list1.activarLista = false;
        list1.activarListaW = false;
        list1.activarListaR=true;

      }
      list1.listaActivaW = function () {
        list1.activarListaR = false;
        list1.activarLista = false;
        list1.activarListaW=true;

      }

      list1.listaR = function () {
        list1.activarListaW = false;
        list1.activarLista = false;
        if (list1.activarListaR==true) {
          list1.activarListaR = false;
        } else {
          list1.activarListaR=true;
        }

      }
      list1.listaW = function () {
        list1.activarListaR = false;
        list1.activarLista = false;
        if (list1.activarListaW==true) {
          list1.activarListaW = false;
        } else {
          list1.activarListaW=true;
        }

      }
      list1.listaT = function () {
        list1.activarListaR = false;
        list1.activarListaW = false;
        if (list1.activarLista==true) {
          list1.activarLista = false;
        } else {
          list1.activarLista=true;
        }

      }

    list1.listarFunciones = function () {
      list1.funcionesR = false;
      list1.funcionesW = false;
      if (list1.funciones==true) {
        list1.funciones = false;
      } else {
        list1.funciones=true;
      }

    }
    list1.listarFuncionesR = function () {
      list1.funciones = false;
      list1.funcionesW = false;
      if (list1.funcionesR==true) {
        list1.funcionesR = false;
      } else {
        list1.funcionesR=true;
      }

    }

    list1.listarFuncionesW = function () {
      list1.funciones = false;
      list1.funcionesR = false;
      if (list1.funcionesW==true) {
        list1.funcionesW = false;
      } else {
        list1.funcionesW=true;
      }

    }

};
})();
