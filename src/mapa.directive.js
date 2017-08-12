(function () {
'use strict';

angular.module('GPS')
.directive('myMap', Mymap);

function Mymap(EntidadesService,MapasService,GridService) {
    // directive link function
    var link = function(scope, element, attrs,controller) {
        var map;
        var poly;
        var elevator;
        var tile =0;
        function CoordMapType(tileSize) {
  this.tileSize = tileSize;
}

   


        // funcion que inicializa el mapa
        function initMap() {
            var mps =[];
            var nombre=[];
            nombre.push(google.maps.MapTypeId.ROADMAP);
            nombre.push(google.maps.MapTypeId.SATELLITE);


            //opciones de inicialización
            var mapOptions = {
                center: {lat: 40.41, lng: -3.70},
                zoom: 12,
               
                disableDefaultUI: true,
                mapTypeControl: true,
                scaleControl: true,
                visibleGridLines: true,
            };
            for (var i in MapasService.mapas){
                nombre.push(MapasService.mapas[i].nombre);
            }
            var getMps = function (nombre,i) {

                    return new google.maps.ImageMapType({

                        getTileUrl: function (coord, zoom) {
                            if(MapasService.mapas[i].nombre == nombre) {
                                if (MapasService.mapas[i].versionWMS == "1.3.0") {
                                    return WMS3GetCoord(coord, zoom, MapasService.mapas[i].url);
                                }
                                else if(MapasService.mapas[i].versionWMS == "1.1.1")
                                    return WMS1GetCoord(coord, zoom, MapasService.mapas[i].url);
                                else
                                    return NoWMSGetCoord(coord, zoom, MapasService.mapas[i].url);
                             }},
                        isPng: false,
                        maxZoom: 20,
                        minZoom: 1,
                        name: MapasService.mapas[i].nombre,
                        tileSize: new google.maps.Size(256, 256)
                    });

            };

            function WMS3GetCoord(tile, zoom,url) {

                var projection = map.getProjection();
                var zpow = Math.pow(2, zoom);
                var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
                var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
                var ulw = projection.fromPointToLatLng(ul);
                var lrw = projection.fromPointToLatLng(lr);

                var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();

                return url+"&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&CRS=EPSG:4326&WIDTH=250&HEIGHT=250&BBOX=" + bbox;
            }

            //Función que calcula las coordenadas y desvuelve la url para obtener las imagenes del mapa en esas coordenadas
            function WMS1GetCoord(tile, zoom,url) {

                var projection = map.getProjection();
                var zpow = Math.pow(2, zoom);
                var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
                var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
                var ulw = projection.fromPointToLatLng(ul);
                var lrw = projection.fromPointToLatLng(lr);

                var bbox = ulw.lng() + "," + ulw.lat() + "," + lrw.lng() + "," + lrw.lat();

                return url+"&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:4326&WIDTH=250&HEIGHT=250&BBOX=" + bbox + "&WIDTH=256&HEIGHT=256";
            }

            function NoWMSGetCoord(coord, zoom,url) {
                // "Wrap" x (logitude) at 180th meridian properly
                var tilesPerGlobe = 1 << zoom;
                var x = coord.x % tilesPerGlobe;
                if (x < 0) x = tilesPerGlobe+x;

                return url + zoom + "/" + x + "/" + coord.y + ".png";

            }


            //Creamos el mapa y le pasamos las opciones que definimos anteriormente
            map = new google.maps.Map(element[0], mapOptions);
            //servicio de elevacion
            elevator = new google.maps.ElevationService;

           //Le pasamos al mapa la cuadricula que creamos anteriormente
         //  map.overlayMapTypes.insertAt(
           //  0, new CoordMapType(new google.maps.Size(256, 256)));
           //Definimos los mapas creados como dos nuevos tipos de mapas
            for(var i in MapasService.mapas){
                map.mapTypes.set(MapasService.mapas[i].nombre, getMps(MapasService.mapas[i].nombre,i));
            }

           map.setOptions(
            {
              //cofiguramos las opciones de controles del mapa
              mapTypeControlOptions: {
              //lo vamos a colocar en la posicion arriba a la derecha (dentro del mapa)
              position: google.maps.ControlPosition.TOP_RIGHT,
              //menu desplegable
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              // por ultimo le añadimos los mapas que s epodran visualizar
              mapTypeIds: nombre,
              

              }
            }
          );
            var onOff = /** @type {!HTMLDivElement} */(
                document.getElementById('on/Off'));
          //botones de seleccion de entidad (T,R,W)
          var botont = /** @type {!HTMLDivElement} */(
          document.getElementById('botones'));
          //Botones de seleccion de función
          var funciones = /** @type {!HTMLDivElement} */(
          document.getElementById('funciones'));
          //Input de selección de ubicación
          var input = /** @type {!HTMLInputElement} */(
          document.getElementById('pac-input'));
          //Tabla de puntos
          var datos = /** @type {!HTMLDivElement} */(
          document.getElementById('datos'));
          // grafica
          var grafica = /** @type {!HTMLDivElement} */(
          document.getElementById('grafica'));
          //Lista de entidades disponibles o creadas
          var lista = /** @type {!HTMLDivElement} */(
          document.getElementById('lista'));
          //Selección el tipo de mapa
          var types = document.getElementById('type-selector');

          //A continuación colocamos cada elemento en la posición del mapa deseada

          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(types);
            map.controls[google.maps.ControlPosition.RIGHT_TOP].push(onOff);
          map.controls[google.maps.ControlPosition.RIGHT_TOP].push(botones);

          map.controls[google.maps.ControlPosition.RIGHT_TOP].push(funciones);

          map.controls[google.maps.ControlPosition.TOP_LEFT].push(datos);
          map.controls[google.maps.ControlPosition.TOP_CENTER].push(lista);
          map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(grafica);

          ////////////////////
          //Este codigo entre comentarios ha sido sacado de la documentación
          //de la API de google maps y realiza la funcion de autocompletado
          //en el buscador de lugares del mapa
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


    map.addListener('click', addLatLng,elevator);
    map.addListener('zoom_changed', function() {
        if(EntidadesService.markersT[EntidadesService.trackActivo]!=undefined )
            if(EntidadesService.markersT[EntidadesService.trackActivo].length>2)
        if(EntidadesService.isTrack == true &&  ((EntidadesService.mapa.getZoom()>=17 && EntidadesService.markersT[EntidadesService.trackActivo]
                [EntidadesService.markersT[EntidadesService.trackActivo].length-2].getVisible() == false) ||(
            EntidadesService.mapa.getZoom()<17 && EntidadesService.markersT[EntidadesService.trackActivo]
                [EntidadesService.markersT[EntidadesService.trackActivo].length-2].getVisible() == true))){
            EntidadesService.actualizarMarkerActivo();
        }
        EntidadesService.cuadricula = true;

            });
            google.maps.event.addListener(map, "idle", function() {

                            GridService.draw("idle-0", 1);

                });
            map.addListener('mousemove', function(event) {
                if(EntidadesService.coords==false) {
                    $('#map').tooltip();
                    $('#map').attr('title', "E: " + event.latLng.lat().toFixed(6) + "\n" + "N: " + event.latLng.lng().toFixed(6));
                    $('#map').tooltip();
                    $('#map').mouseover();
                }else{
                    $('#map').attr('title', "");
                }


            });

    EntidadesService.elevator = elevator;
    EntidadesService.mapa = map;
    GridService.mapa = map;

        }
        //Calcula la distancia entre dos puntos del mapa para los recortes de una ruta
        var calcularDistanciasRR = function (latlng) {
            if(EntidadesService.modoRecorte1 == true && EntidadesService.
                    rutas[EntidadesService.rutas.length-2].puntos.length>0){
                var _kCord = new google.maps.LatLng(EntidadesService.
                        rutas[EntidadesService.rutas.length-2].puntos[EntidadesService.
                        rutas[EntidadesService.rutas.length-2].puntos.length-1].latitud,
                    EntidadesService.
                        rutas[EntidadesService.rutas.length-2].puntos[EntidadesService.
                        rutas[EntidadesService.rutas.length-2].puntos.length-1].longitud);
                EntidadesService.distancia = google.maps.geometry.spherical.computeDistanceBetween(latlng, _kCord).toFixed(2);
            }else if(EntidadesService.modoRecorte2 == true && EntidadesService.
                    rutas[EntidadesService.rutas.length-1].puntos.length>0){
                var _kCord = new google.maps.LatLng(EntidadesService.
                        rutas[EntidadesService.rutas.length-1].puntos[EntidadesService.
                        rutas[EntidadesService.rutas.length-1].puntos.length-1].latitud,
                    EntidadesService.
                        rutas[EntidadesService.rutas.length-1].puntos[EntidadesService.
                        rutas[EntidadesService.rutas.length-1].puntos.length-1].longitud);
                EntidadesService.distancia = google.maps.geometry.spherical.computeDistanceBetween(latlng, _kCord).toFixed(2);
            } else {
                EntidadesService.distancia = 0;
            }
        };
        //Calcula la distancia entre dos puntos del mapa para los recortes de un track
        var calcularDistanciasR = function (latlng) {
            if(EntidadesService.modoRecorte1 == true && EntidadesService.
                    tracks[EntidadesService.tracks.length-2].puntos.length>0){
                var _kCord = new google.maps.LatLng(EntidadesService.
                        tracks[EntidadesService.tracks.length-2].puntos[EntidadesService.
                        tracks[EntidadesService.tracks.length-2].puntos.length-1].latitud,
                    EntidadesService.
                        tracks[EntidadesService.tracks.length-2].puntos[EntidadesService.
                        tracks[EntidadesService.tracks.length-2].puntos.length-1].longitud);
                EntidadesService.distancia = google.maps.geometry.spherical.computeDistanceBetween(latlng, _kCord).toFixed(2);
            }else if(EntidadesService.modoRecorte2 == true && EntidadesService.
                    tracks[EntidadesService.tracks.length-1].puntos.length>0){
                var _kCord = new google.maps.LatLng(EntidadesService.
                        tracks[EntidadesService.tracks.length-1].puntos[EntidadesService.
                        tracks[EntidadesService.tracks.length-1].puntos.length-1].latitud,
                    EntidadesService.
                        tracks[EntidadesService.tracks.length-1].puntos[EntidadesService.
                        tracks[EntidadesService.tracks.length-1].puntos.length-1].longitud);
                EntidadesService.distancia = google.maps.geometry.spherical.computeDistanceBetween(latlng, _kCord).toFixed(2);
            } else {
                EntidadesService.distancia = 0;
            }
        };
        //Calcula la distancia entre dos puntos del mapa
        var calcularDistancias = function (latlng) {
          if(EntidadesService.puntosTrackActivo.length>0){
          var _kCord = new google.maps.LatLng(EntidadesService.puntosTrackActivo[EntidadesService.puntosTrackActivo.length-1].latitud,
             EntidadesService.puntosTrackActivo[EntidadesService.puntosTrackActivo.length-1].longitud);
          EntidadesService.distancia = google.maps.geometry.spherical.computeDistanceBetween(latlng, _kCord).toFixed(2);
        }else{
            EntidadesService.distancia = 0;
        }
        };

        // puncion que crea las polilineas y los puntos
        function addLatLng(event,elevation) {
          if (EntidadesService.modoImportWP == true) {
            var evento =  new google.maps.LatLng(EntidadesService.latitudPInv, EntidadesService.longitudPInv);
            EntidadesService.latitud = EntidadesService.latitudPInv;
            EntidadesService.longitud = EntidadesService.longitudPInv;
            EntidadesService.elevacion = EntidadesService.elevacionP;
            controller.crear(2);


            var nombre = "Nuevo-Waypoint"+EntidadesService.cont;
            EntidadesService.cont = EntidadesService.cont+1;
            var marker = new google.maps.Marker({
              position: evento,
              title: "Latitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6),
              icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              map: map
            });
            EntidadesService.markers.push(marker);
              marker.addListener('click', function() {
                  for (var item in EntidadesService.waypoints) {

                      if (EntidadesService.waypoints[item].latitud+EntidadesService.waypoints[item].longitud
                          == marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6)) {
                       
                          var contentString = '<div id="content">'+
                              '<label for="nombre" style="    color: #8a9499;">'+
                              'Nombre:'+
                              '</label>'+
                              '<p id="nombre">'+EntidadesService.waypoints[item].nombre+'</p>'+
                              '<label for="descripcion" style="    color: #8a9499;">'+
                              'Descripción:'+
                              '</label>'+
                              '<p id="descripcion">'+EntidadesService.waypoints[item].descripcion+'</p>'+
                              '</div>';

                          var infowindow = new google.maps.InfoWindow({
                              content: contentString
                          });


                      }
                  }
                  infowindow.open(map, marker);
              });
              google.maps.event.addListener(marker, 'dragend', function (e) {

                  for (var item in EntidadesService.waypoints) {
                      if ("Latitud: "+
                          EntidadesService.waypoints[item].latitud+"\nLongitud: "+EntidadesService.waypoints[item].longitud
                          == marker.title) {

                          var posicion = item;
                          EntidadesService.waypoints[item].longitud = e.latLng.lng().toFixed(6);
                          EntidadesService.waypoints[item].latitud = e.latLng.lat().toFixed(6);
                          elevator.getElevationForLocations({
                              'locations': [e.latLng]
                          }, function(results, status) {
                              if (status === google.maps.ElevationStatus.OK) {
                                  if (results[0]) {
                                      EntidadesService.waypoints[posicion].elevacion = results[0].elevation.toFixed(2);
                                      scope.$apply();
                                  } else {
                                     
                                  }
                              } else {
                                 
                              }
                          });
                      }
                  }
                  marker.position = e.latLng;
                  marker.title= "Latitud: "+e.latLng.lat().toFixed(6)+"\nLongitud: "+e.latLng.lng().toFixed(6);
                  scope.$apply();
              });
          }


          if (EntidadesService.seleccion == true) {
            var evento =  new google.maps.LatLng(EntidadesService.latitudSelec, EntidadesService.longitudSelec);
            if(EntidadesService.markerPunto !=null){
              EntidadesService.markerPunto.setMap(null);
            }
            marker = new google.maps.Marker({
              map: map,
              draggable: true,
              animation: google.maps.Animation.DROP,
              position: evento,
              icon : "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
              zIndex:8
            });
            EntidadesService.markerPunto = marker;
          }
          if(EntidadesService.modoInsertar == true && EntidadesService.puntoElegido!=null && event!==undefined){

            //Servicio de elevaciones que nos da la elevacion del punto actual
            elevator.getElevationForLocations({
              'locations': [event.latLng]
            }, function(results, status) {
              if (status === google.maps.ElevationStatus.OK) {
                if (results[0]) {
                  EntidadesService.puntoN = {
                    numero:0,
                    latitud:0,
                    longitud: 0,
                    elevacion: 0,
                    fecha:0,
                    hora:0,
                    desnivel:0,
                    distancia: 0,
                    velocidad: 4
                  };

                  EntidadesService.puntoN.longitud = event.latLng.lng().toFixed(6);
                  EntidadesService.puntoN.latitud = event.latLng.lat().toFixed(6);
                  EntidadesService.puntoN.elevacion = results[0].elevation.toFixed(2);
                  EntidadesService.modoInsertar = false;
                  if(EntidadesService.isTrack==true){
                      // Creamos el marcador que indicara el punto creado en el mapa
                      var marker = new google.maps.Marker({
                          position: event.latLng,
                          title:"Latitud: "+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6),
                          icon: EntidadesService.myIcon,
                          draggable:true,
                          map: map,
                          zIndex:1
                      });

                                  EntidadesService.elevacionPtAnadido = results[0].elevation.toFixed(2);

                      marker.addListener('click', function() {
                         
                            
                          for(var i in EntidadesService.tracks){
                            if((marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.markersT[i][EntidadesService.markersT[i].length-1].position.lat().toFixed(6)+
                                  EntidadesService.markersT[i][EntidadesService.markersT[i].length-1].position.lng().toFixed(6))){
                                      EntidadesService.trackElegidoFinal=i;
                                        if(EntidadesService.trackElegidoFinalMarker !=null){
                              EntidadesService.trackElegidoFinalMarker.setMap(null);
                                 }
                                        var markerF = new google.maps.Marker({
                                          map: map,
                                          draggable: true,
                                          animation: google.maps.Animation.DROP,
                                          position:EntidadesService.markersT[i][EntidadesService.markersT[i].length-1].position,
                                          icon : "img/primero.png",
                                          zIndex:9
                                        });
                                        EntidadesService.trackElegidoFinalMarker = markerF;
                                  }
                                   if((marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.markersT[i][0].position.lat().toFixed(6)+
                                  EntidadesService.markersT[i][0].position.lng().toFixed(6))){
                                      EntidadesService.trackElegidoInicial=i;
                                       if(EntidadesService.trackElegidoInicialMarker !=null){
                              EntidadesService.trackElegidoInicialMarker.setMap(null);
                                 }
                                      var markerI = new google.maps.Marker({
                                          map: map,
                                          draggable: true,
                                          animation: google.maps.Animation.DROP,
                                          position: EntidadesService.markersT[i][0].position,
                                          icon : "img/segundo.png",
                                          zIndex:9
                                        });
                                        EntidadesService.trackElegidoInicialMarker = markerI;
                                  }
                          }
                          for(var i in EntidadesService.markersT[EntidadesService.trackActivo]){
                              if(marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.markersT[EntidadesService.trackActivo][i].position.lat().toFixed(6)+
                                  EntidadesService.markersT[EntidadesService.trackActivo][i].position.lng().toFixed(6)){
                                  controller.puntoSelec(i);
                              }
                          }
                      });
                      marker.addListener('dragend', function (e) {

                          for (var item in EntidadesService.markersT[EntidadesService.trackActivo]) {
                              if (EntidadesService.markersT[EntidadesService.trackActivo][item].title
                                  == marker.title) {

                                  var posicion = item;
                                  var longitud = e.latLng.lng().toFixed(6);
                                  var latitud= e.latLng.lat().toFixed(6);
                                  elevator.getElevationForLocations({
                                      'locations': [e.latLng]
                                  }, function(results, status) {
                                      if (status === google.maps.ElevationStatus.OK) {
                                          if (results[0]) {
                                              var elevacion = results[0].elevation.toFixed(2);
                                              EntidadesService.moverPuntoTrack2(posicion,longitud,latitud,elevacion);
                                              scope.$apply();
                                          } else {
                                             
                                          }
                                      } else {
                                          
                                      }
                                  });
                              }
                          }
                          scope.$apply();
                      });
                  EntidadesService.anadirPuntoTrack2(marker);
                      setTimeout(function () {
                          EntidadesService.actualizarPuntosT();
                          scope.$apply();
                      },15);

                }else {
                      var marker = new google.maps.Marker({
                          position: event.latLng,
                          title: "",
                          icon: EntidadesService.myIconR,
                          draggable:true,
                          map: map
                      });
                      marker.addListener('click', function() {
                               for(var i in EntidadesService.rutas){
                            if((marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.wpRta[i][EntidadesService.wpRta[i].length-1].position.lat().toFixed(6)+
                                  EntidadesService.wpRta[i][EntidadesService.wpRta[i].length-1].position.lng().toFixed(6))){
                                      EntidadesService.rutaElegidoFinal=i;
                                        if(EntidadesService.rutaElegidoFinalMarker !=null){
                              EntidadesService.rutaElegidoFinalMarker.setMap(null);
                                 }
                                        var markerF = new google.maps.Marker({
                                          map: map,
                                          draggable: true,
                                          animation: google.maps.Animation.DROP,
                                          position:EntidadesService.wpRta[i][EntidadesService.wpRta[i].length-1].position,
                                          icon : "img/primero.png",
                                          zIndex:9
                                        });
                                        EntidadesService.rutaElegidoFinalMarker = markerF;
                                  }
                                   if((marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.wpRta[i][0].position.lat().toFixed(6)+
                                  EntidadesService.wpRta[i][0].position.lng().toFixed(6))){
                                      EntidadesService.rutaElegidoInicial=i;
                                       if(EntidadesService.rutaElegidoInicialMarker !=null){
                              EntidadesService.rutaElegidoInicialMarker.setMap(null);
                                 }
                                      var markerI = new google.maps.Marker({
                                          map: map,
                                          draggable: true,
                                          animation: google.maps.Animation.DROP,
                                          position: EntidadesService.wpRta[i][0].position,
                                          icon : "img/segundo.png",
                                          zIndex:9
                                        });
                                        EntidadesService.rutaElegidoInicialMarker = markerI;
                                  }
                          }
                          for(var i in EntidadesService.wpRta[EntidadesService.rutaActiva]){
                              if(marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.wpRta[EntidadesService.rutaActiva][i].position.lat().toFixed(6)+
                                  EntidadesService.wpRta[EntidadesService.rutaActiva][i].position.lng().toFixed(6)){
                                  controller.puntoSelecR(i);
                              }
                          }
                      });
                      EntidadesService.elevacionPtAnadido = results[0].elevation.toFixed(2);
                      marker.addListener('dragend', function (e) {
                          for (var item in EntidadesService.wpRta[EntidadesService.rutaActiva]) {
                              if (EntidadesService.wpRta[EntidadesService.rutaActiva][item].title
                                  == marker.title) {

                                  var posicion = item;
                                  var longitud = e.latLng.lng().toFixed(6);
                                  var latitud= e.latLng.lat().toFixed(6);
                                  elevator.getElevationForLocations({
                                      'locations': [e.latLng]
                                  }, function(results, status) {
                                      if (status === google.maps.ElevationStatus.OK) {
                                          if (results[0]) {
                                              var elevacion = results[0].elevation.toFixed(2);
                                              EntidadesService.moverPuntoRuta2(posicion,longitud,latitud,elevacion);
                                              scope.$apply();
                                          } else {
                                             
                                          }
                                      } else {
                                          
                                      }
                                  });
                              }
                          }
                          scope.$apply();
                      });
                    EntidadesService.anadirPuntoRuta2(marker);
                      setTimeout(function () {
                          controller.actualizarPuntosR();
                          scope.$apply();
                      },15);

                  }
                } else {
                
                }
              } else {
              
              }
            });

          }
          if(EntidadesService.modoInvertir == true){

          var evento =  new google.maps.LatLng(EntidadesService.latitudPInv, EntidadesService.longitudPInv);
            //Depende de que entidad sea llamamos a un metodo u otro
            if (EntidadesService.isTrack == true) {
                    EntidadesService.elevacion = EntidadesService.elevacionP;
                    if(EntidadesService.modoRecorte1 == true || EntidadesService.modoRecorte2 == true)
                    calcularDistanciasR(evento);
                    else
                        calcularDistancias(evento);
                    if(EntidadesService.modoRecorte1 == true){
                      controller.anadirPuntoTForMapR(EntidadesService.tracks.length-2,evento.lat().toFixed(6),evento.lng().toFixed(6));
                    }
                    else if (EntidadesService.modoRecorte2 == true) {
                      controller.anadirPuntoTForMapR(EntidadesService.tracks.length-1,evento.lat().toFixed(6),evento.lng().toFixed(6));
                    }
                    else {
                      controller.anadirPuntoTForMapI(evento.lat().toFixed(6),evento.lng().toFixed(6));
                    }

            }
            else{
                    EntidadesService.elevacion = EntidadesService.elevacionP;
                    if(EntidadesService.modoRecorte1 == true || EntidadesService.modoRecorte2 == true)
                    calcularDistanciasRR(evento);
                    else
                    calcularDistancias(evento);
                    if(EntidadesService.modoRecorte1 == true){
                      controller.anadirPuntoRForMapR(EntidadesService.rutas.length-2,evento.lat().toFixed(6),evento.lng().toFixed(6));
                    }
                    else if (EntidadesService.modoRecorte2 == true) {
                      controller.anadirPuntoRForMapR(EntidadesService.rutas.length-1,evento.lat().toFixed(6),evento.lng().toFixed(6));
                    }
                    else {
                    controller.anadirPuntoRForMapI(evento.lat().toFixed(6),evento.lng().toFixed(6));
                    }
            }
            if (EntidadesService.modoRecorte1 == true) {
              var puntoRecorte1;
              if (EntidadesService.isTrack) {
                puntoRecorte1 = EntidadesService.tracks.length-2;
              } else {
                puntoRecorte1 = EntidadesService.rutas.length-2;
              }
              //Si no tiene polilinea la creamos
              if (EntidadesService.tienePolyFR(puntoRecorte1)==false) {
                var lineSymbolarrow = {
                       path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                       strokeColor : '#00FF00',
                       strokeOpacity : 0.7,
                       strokeWeight : 2.9,
                       scale : 2.7
                     };
                var arrow = {
                     icon : lineSymbolarrow,
                     offset : '50%',
                    repeat : '80px'
                    };
                poly = new google.maps.Polyline({
                  strokeColor: '#00FF00',
                  strokeOpacity: 1.0,
                  strokeWeight: 3,
                    icons : [arrow]
                });
                poly.setMap(map);
                //Añadimos la polilinea a la entidad actual
                EntidadesService.addPolyR(poly,puntoRecorte1);

                //Si ya la tiene pues la obtenemos
              } else {

              poly = EntidadesService.getPolyR(puntoRecorte1);
              }
            }else if (EntidadesService.modoRecorte2 == true) {
              var puntoRecorte2;
              if (EntidadesService.isTrack) {
                puntoRecorte2 = EntidadesService.tracks.length-1;
              } else {
                puntoRecorte2 = EntidadesService.rutas.length-1;
              }
              //Si no tiene polilinea la creamos
              if (EntidadesService.tienePolyFR(puntoRecorte2)==false) {
                var lineSymbolarrow = {
                       path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                       strokeColor : '#FF3399',
                       strokeOpacity : 0.7,
                       strokeWeight : 2.9,
                       scale : 2.7
                     };
                var arrow = {
                     icon : lineSymbolarrow,
                     offset : '50%',
                    repeat : '80px'
                    };
                poly = new google.maps.Polyline({
                  strokeColor: '#FF3399',
                  strokeOpacity: 1.0,
                  strokeWeight: 3,
                    icons : [arrow]
                });
                poly.setMap(map);
                //Añadimos la polilinea a la entidad actual
                EntidadesService.addPolyR(poly,puntoRecorte2);

                //Si ya la tiene pues la obtenemos
              } else {

              poly = EntidadesService.getPolyR(puntoRecorte2);
              }

            }
            else{
            //Si no tiene polilinea la creamos
            if (EntidadesService.tienePolyF()==false) {
              var lineSymbolarrow = {
                     path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                     strokeColor : EntidadesService.colorPolyNF,
                     strokeOpacity : 0.7,
                     strokeWeight : 2.9,
                     scale : 2.7
                   };
              var arrow = {
                   icon : lineSymbolarrow,
                   offset : '50%',
                  repeat : '80px'
                  };
              poly = new google.maps.Polyline({
                strokeColor: EntidadesService.colorPolyNF,
                strokeOpacity: 1.0,
                strokeWeight: 3,
                  icons : [arrow]
              });
              poly.setMap(map);
              //Añadimos la polilinea a la entidad actual
              EntidadesService.addPoly(poly);

              //Si ya la tiene pues la obtenemos
            } else {

            poly = EntidadesService.getPoly();
            }
}
            var path = poly.getPath();

            //Le pasamos las coordenadas a la polilinea
            path.push(evento);
            var image = {
              url: 'img/icono.png',

            };


            if (EntidadesService.isTrack == true) {


              // Creamos el marcador que indicara el punto creado en el mapa
              var marker = new google.maps.Marker({
                position: evento,
                title: "Inicio del track"+"\nLatitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6),
                icon: EntidadesService.myIconRIni,
                  draggable:true,
                map: map,
                zIndex:1
              });
                marker.addListener('click', function() {
                      for(var i in EntidadesService.tracks){
                            if((marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.markersT[i][EntidadesService.markersT[i].length-1].position.lat().toFixed(6)+
                                  EntidadesService.markersT[i][EntidadesService.markersT[i].length-1].position.lng().toFixed(6))){
                                      EntidadesService.trackElegidoFinal=i;
                                        if(EntidadesService.trackElegidoFinalMarker !=null){
                              EntidadesService.trackElegidoFinalMarker.setMap(null);
                                 }
                                        var markerF = new google.maps.Marker({
                                          map: map,
                                          draggable: true,
                                          animation: google.maps.Animation.DROP,
                                          position:EntidadesService.markersT[i][EntidadesService.markersT[i].length-1].position,
                                          icon : "img/primero.png",
                                          zIndex:9
                                        });
                                        EntidadesService.trackElegidoFinalMarker = markerF;
                                  }
                                   if((marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.markersT[i][0].position.lat().toFixed(6)+
                                  EntidadesService.markersT[i][0].position.lng().toFixed(6))){
                                      EntidadesService.trackElegidoInicial=i;
                                       if(EntidadesService.trackElegidoInicialMarker !=null){
                              EntidadesService.trackElegidoInicialMarker.setMap(null);
                                 }
                                      var markerI = new google.maps.Marker({
                                          map: map,
                                          draggable: true,
                                          animation: google.maps.Animation.DROP,
                                          position: EntidadesService.markersT[i][0].position,
                                          icon : "img/segundo.png",
                                          zIndex:9
                                        });
                                        EntidadesService.trackElegidoInicialMarker = markerI;
                                  }
                          }
                    for(var i in EntidadesService.markersT[EntidadesService.trackActivo]){
                        if(marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                            EntidadesService.markersT[EntidadesService.trackActivo][i].position.lat().toFixed(6)+
                            EntidadesService.markersT[EntidadesService.trackActivo][i].position.lng().toFixed(6)){
                            controller.puntoSelec(i);
                        }
                    }
                });
                marker.addListener('dragend', function (e) {
                    for (var item in EntidadesService.markersT[EntidadesService.trackActivo]) {
                        if (EntidadesService.markersT[EntidadesService.trackActivo][item].title
                            == marker.title) {

                            var posicion = item;
                            var longitud = e.latLng.lng().toFixed(6);
                            var latitud= e.latLng.lat().toFixed(6);
                            elevator.getElevationForLocations({
                                'locations': [e.latLng]
                            }, function(results, status) {
                                if (status === google.maps.ElevationStatus.OK) {
                                    if (results[0]) {
                                        var elevacion = results[0].elevation.toFixed(2);
                                        EntidadesService.moverPuntoTrack2(posicion,longitud,latitud,elevacion);
                                        scope.$apply();
                                    } else {
                                      
                                    }
                                } else {
                                    
                                }
                            });
                        }
                    }
                    scope.$apply();
                });
              if (EntidadesService.modoRecorte1 == true) {
                //Si no tiene ningun marcador todavia le añadimos el nuevo marcador
              if (EntidadesService.markersT[EntidadesService.tracks.length-2]===undefined) {
                var markers = [];
                markers.push(marker);
                EntidadesService.markersT[EntidadesService.tracks.length-2] = markers;
                //Si ya tiene un marcador(el de inicio) le añadimos el marcador de final
              } else if(EntidadesService.markersT[EntidadesService.tracks.length-2].length==1){
                marker.icon = EntidadesService.myIconRFin;
                marker.title = "Latitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6);
                EntidadesService.markersT[EntidadesService.tracks.length-2].push(marker);
                //Si ya tiene los dos marcadores pues sustituimos el marcador que indica el final por el nuevo marcador que inidicara el nuevo final del track
              }else{
                  marker.icon = EntidadesService.myIconRFin;
                  marker.title = "Latitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6);
                  EntidadesService.markersT[EntidadesService.tracks.length-2]
                      [EntidadesService.markersT[EntidadesService.tracks.length-2].length-1].setIcon(EntidadesService.myIcon);
                  if(map.getZoom()<17){
                      EntidadesService.markersT[EntidadesService.tracks.length-2]
                          [EntidadesService.markersT[EntidadesService.tracks.length-2].length-1].setVisible(false);
                  }
                  else{
                      EntidadesService.markersT[EntidadesService.tracks.length-2]
                          [EntidadesService.markersT[EntidadesService.tracks.length-2].length-1].setVisible(false);
                  }
                  EntidadesService.markersT[EntidadesService.tracks.length-2].push(marker);
              }
              }else if (EntidadesService.modoRecorte2 == true) {
                //Si no tiene ningun marcador todavia le añadimos el nuevo marcador
              if (EntidadesService.markersT[EntidadesService.tracks.length-1]===undefined) {
                var markers = [];
                markers.push(marker);
                EntidadesService.markersT[EntidadesService.tracks.length-1] = markers;
                //Si ya tiene un marcador(el de inicio) le añadimos el marcador de final
              } else if(EntidadesService.markersT[EntidadesService.tracks.length-1].length==1){
                marker.icon = EntidadesService.myIconRFin;
                marker.title = "Latitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6);
                EntidadesService.markersT[EntidadesService.tracks.length-1].push(marker);
                //Si ya tiene los dos marcadores pues sustituimos el marcador que indica el final por el nuevo marcador que inidicara el nuevo final del track
              }else{
                  marker.icon = EntidadesService.myIconRFin;
                  marker.title = "Latitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6);
                  EntidadesService.markersT[EntidadesService.tracks.length-1]
                      [EntidadesService.markersT[EntidadesService.tracks.length-1].length-1].setIcon(EntidadesService.myIcon);
                  if(map.getZoom()<17){
                      EntidadesService.markersT[EntidadesService.tracks.length-1]
                          [EntidadesService.markersT[EntidadesService.tracks.length-1].length-1].setVisible(false);
                  }
                  else{
                      EntidadesService.markersT[EntidadesService.tracks.length-1]
                          [EntidadesService.markersT[EntidadesService.tracks.length-1].length-1].setVisible(false);
                  }
                  EntidadesService.markersT[EntidadesService.tracks.length-1].push(marker);
              }
              }else{
              //Si no tiene ningun marcador todavia le añadimos el nuevo marcador
            if (EntidadesService.markersT[EntidadesService.trackActivo]===undefined) {
              var markers = [];
              markers.push(marker);
              EntidadesService.markersT[EntidadesService.trackActivo] = markers;
              //Si ya tiene un marcador(el de inicio) le añadimos el marcador de final
            } else if(EntidadesService.markersT[EntidadesService.trackActivo].length==1){
              marker.icon = EntidadesService.myIconRFin;
              marker.title = "Latitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6);
              EntidadesService.markersT[EntidadesService.trackActivo].push(marker);
              //Si ya tiene los dos marcadores pues sustituimos el marcador que indica el final por el nuevo marcador que inidicara el nuevo final del track
            }else{
                marker.icon = EntidadesService.myIconRFin;
                marker.title = "Latitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6);
                EntidadesService.markersT[EntidadesService.trackActivo]
                    [EntidadesService.markersT[EntidadesService.trackActivo].length-1].setIcon(EntidadesService.myIcon);
                if(map.getZoom()<17){
                    EntidadesService.markersT[EntidadesService.trackActivo]
                        [EntidadesService.markersT[EntidadesService.trackActivo].length-1].setVisible(false);
                }
                else{
                    EntidadesService.markersT[EntidadesService.trackActivo]
                        [EntidadesService.markersT[EntidadesService.trackActivo].length-1].setVisible(true);
                }
                EntidadesService.markersT[EntidadesService.trackActivo].push(marker);
            }
          }}else {
                var marker = new google.maps.Marker({
                    position: evento,
                    title: "",
                    icon: EntidadesService.myIconR,
                    draggable:true,
                    map: map
                });

            var rutaACortar;
            if (EntidadesService.modoRecorte1 == true) {
              rutaACortar = EntidadesService.rutas.length-2;
            } else if (EntidadesService.modoRecorte2 == true){
              rutaACortar = EntidadesService.rutas.length-1;
            }else {
              rutaACortar = EntidadesService.rutaActiva;
            }
                marker.addListener('click', function() {
                        for(var i in EntidadesService.rutas){
                            if((marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.wpRta[i][EntidadesService.wpRta[i].length-1].position.lat().toFixed(6)+
                                  EntidadesService.wpRta[i][EntidadesService.wpRta[i].length-1].position.lng().toFixed(6))){
                                      EntidadesService.rutaElegidoFinal=i;
                                        if(EntidadesService.rutaElegidoFinalMarker !=null){
                              EntidadesService.rutaElegidoFinalMarker.setMap(null);
                                 }
                                        var markerF = new google.maps.Marker({
                                          map: map,
                                          draggable: true,
                                          animation: google.maps.Animation.DROP,
                                          position:EntidadesService.wpRta[i][EntidadesService.wpRta[i].length-1].position,
                                          icon : "img/primero.png",
                                          zIndex:9
                                        });
                                        EntidadesService.rutaElegidoFinalMarker = markerF;
                                  }
                                   if((marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.wpRta[i][0].position.lat().toFixed(6)+
                                  EntidadesService.wpRta[i][0].position.lng().toFixed(6))){
                                      EntidadesService.rutaElegidoInicial=i;
                                       if(EntidadesService.rutaElegidoInicialMarker !=null){
                              EntidadesService.rutaElegidoInicialMarker.setMap(null);
                                 }
                                      var markerI = new google.maps.Marker({
                                          map: map,
                                          draggable: true,
                                          animation: google.maps.Animation.DROP,
                                          position: EntidadesService.wpRta[i][0].position,
                                          icon : "img/segundo.png",
                                          zIndex:9
                                        });
                                        EntidadesService.rutaElegidoInicialMarker = markerI;
                                  }
                          }
                    for(var i in EntidadesService.wpRta[rutaACortar]){
                        if(marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                            EntidadesService.wpRta[rutaACortar][i].position.lat().toFixed(6)+
                            EntidadesService.wpRta[rutaACortar][i].position.lng().toFixed(6)){
                            controller.puntoSelecR(i);
                        }
                    }
                });
                marker.addListener('dragend', function (e) {
                    for (var item in EntidadesService.wpRta[rutaACortar]) {
                        if (EntidadesService.wpRta[rutaACortar][item].title
                            == marker.title) {

                            var posicion = item;
                            var longitud = e.latLng.lng().toFixed(6);
                            var latitud= e.latLng.lat().toFixed(6);
                            elevator.getElevationForLocations({
                                'locations': [e.latLng]
                            }, function(results, status) {
                                if (status === google.maps.ElevationStatus.OK) {
                                    if (results[0]) {
                                        var elevacion = results[0].elevation.toFixed(2);
                                        EntidadesService.moverPuntoRuta2(posicion,longitud,latitud,elevacion);
                                        scope.$apply();
                                    } else {
                                      
                                    }
                                } else {
                                    
                                }
                            });
                        }
                    }
                    scope.$apply();
                });
                if (EntidadesService.wpRta[rutaACortar]===undefined) {
                    var nombre = "Waypoint Nº"+0;

                        marker.title= "Nombre: "+nombre+"\nLatitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6);
                        marker.icon= EntidadesService.myIconRIni;
                    var wpsruta = [];
                    wpsruta.push(marker);
                    EntidadesService.wpRta[rutaACortar] = wpsruta;
                }else {
                    if(EntidadesService.wpRta[rutaACortar].length==1){
                        var nombre = "Waypoint Nº"+EntidadesService.wpRta[rutaACortar].length;

                            marker.title="Nombre: "+nombre+"\nLatitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6);
                            marker.icon= EntidadesService.myIconRFin;

                        EntidadesService.wpRta[rutaACortar].push(marker);
                    }else{
                        EntidadesService.wpRta[rutaACortar]
                            [EntidadesService.wpRta[rutaACortar].length-1].setIcon(EntidadesService.myIconR);
                        var nombre = "Waypoint Nº"+EntidadesService.wpRta[EntidadesService.rutaActiva].length;

                            marker.title= "Nombre: "+nombre+"\nLatitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6);
                            marker.icon= EntidadesService.myIconRFin;

                            if(rutaACortar == EntidadesService.rutaActiva){
                                EntidadesService.wpRta[rutaACortar]
                                    [EntidadesService.wpRta[rutaACortar].length-1].setVisible(true);
                            }else{
                                EntidadesService.wpRta[rutaACortar]
                                    [EntidadesService.wpRta[rutaACortar].length-1].setVisible(false);
                            }


                        EntidadesService.wpRta[rutaACortar].push(marker);
                    }

                }
          }

  }

          if ((EntidadesService.modoEdicion==true && EntidadesService.modoInsertar == false && EntidadesService.modoImportWP == false
            && EntidadesService.modoInvertir == false && EntidadesService.seleccion==false && EntidadesService.hayEntidadesCreadas==true
            && (EntidadesService.isTrack==true || EntidadesService.rutas.length>0))
             || (EntidadesService.isWaypoint == true && EntidadesService.modoImportWP == false && EntidadesService.modoEdicion==true)) {
          //Depende de que entidad sea llamamos a un metodo u otro
          if (EntidadesService.isTrack == true) {
            //Servicio de elevaciones que nos da la elevacion del punto actual
            elevator.getElevationForLocations({
              'locations': [event.latLng]
            }, function(results, status) {
              if (status === google.maps.ElevationStatus.OK) {
                if (results[0]) {

                  EntidadesService.elevacion = results[0].elevation.toFixed(2);
                  calcularDistancias(event.latLng);
                  controller.anadirPuntoTForMap(event.latLng.lat().toFixed(6),event.latLng.lng().toFixed(6));
                } else {
                
                controller.anadirPuntoTForMap(event.latLng.lat().toFixed(6),event.latLng.lng().toFixed(6));
                }
              } else {
              
              controller.anadirPuntoTForMap(event.latLng.lat().toFixed(6),event.latLng.lng().toFixed(6));
              }
            });


          } else if(EntidadesService.isWaypoint == true){
            if(EntidadesService.modoInsertarWp == false){
            EntidadesService.latitud = event.latLng.lat().toFixed(6);
            EntidadesService.longitud = event.latLng.lng().toFixed(6);
            elevator.getElevationForLocations({
              'locations': [event.latLng]
            }, function(results, status) {
              if (status === google.maps.ElevationStatus.OK) {
                if (results[0]) {

                  EntidadesService.elevacion = results[0].elevation.toFixed(2);
                  controller.crear(2);
                   scope.$apply();
                } else {
               
                controller.crear(2);
                 scope.$apply();
                }
              } else {
              
              controller.crear(2);
               scope.$apply();
              }
            });}else{
                var latLng = new google.maps.LatLng(EntidadesService.latitud,EntidadesService.longitud);
                elevator.getElevationForLocations({
                    'locations': [latLng]
                }, function(results, status) {
                    if (status === google.maps.ElevationStatus.OK) {
                        if (results[0]) {

                            EntidadesService.elevacion = results[0].elevation.toFixed(2);
                            controller.crear(2);
                            scope.$apply();
                        } else {
                          
                            controller.crear(2);
                            scope.$apply();
                        }
                    } else {
                       
                        controller.crear(2);
                        scope.$apply();
                    }
                });
            }
          }
          else{
            elevator.getElevationForLocations({
              'locations': [event.latLng]
            }, function(results, status) {
              if (status === google.maps.ElevationStatus.OK) {
                if (results[0]) {

                  EntidadesService.elevacion = results[0].elevation.toFixed(2);
                  calcularDistancias(event.latLng);
                  controller.anadirPuntoRForMap(event.latLng.lat().toFixed(6),event.latLng.lng().toFixed(6));
                } else {
               
                controller.anadirPuntoRForMap(event.latLng.lat().toFixed(6),event.latLng.lng().toFixed(6));
                }
              } else {
             
              controller.anadirPuntoRForMap(event.latLng.lat().toFixed(6),event.latLng.lng().toFixed(6));
              }
            });
          }
          if(EntidadesService.isWaypoint == true){
            var nombre = "Nuevo-Waypoint"+EntidadesService.cont;
            EntidadesService.cont = EntidadesService.cont+1;
              if(EntidadesService.modoInsertarWp == true){
                  var latLng = new google.maps.LatLng(EntidadesService.latitud,EntidadesService.longitud);
                  var marker = new google.maps.Marker({
                      position: latLng,
                      title: "Latitud: "+ parseFloat(EntidadesService.latitud).toFixed(6)+"\nLongitud: "+parseFloat(EntidadesService.longitud).toFixed(6),
                      icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                      draggable:true,
                      map: map
                  });
                 }else {
                  var marker = new google.maps.Marker({
                      position: event.latLng,
                      title: "Latitud: " + event.latLng.lat().toFixed(6) + "\nLongitud: " + event.latLng.lng().toFixed(6),
                      icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                      draggable: true,
                      map: map
                  });
              }
              marker.addListener('click', function() {
                  for (var item in EntidadesService.waypoints) {

                      if (EntidadesService.waypoints[item].latitud+EntidadesService.waypoints[item].longitud
                          == marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6)) {

                          var contentString = '<div id="content">'+
                              '<label for="nombre" style="    color: #8a9499;">'+
                              'Nombre:'+
                              '</label>'+
                              '<p id="nombre">'+EntidadesService.waypoints[item].nombre+'</p>'+
                              '<label for="descripcion" style="    color: #8a9499;">'+
                              'Descripción:'+
                              '</label>'+
                              '<p id="descripcion">'+EntidadesService.waypoints[item].descripcion+'</p>'+
                              '</div>';

                          var infowindow = new google.maps.InfoWindow({
                              content: contentString
                          });


                      }
                  }
                  infowindow.open(map, marker);
              });
            google.maps.event.addListener(marker, 'dragend', function (e) {

              for (var item in EntidadesService.waypoints) {
                if ("Latitud: "+
                EntidadesService.waypoints[item].latitud+"\nLongitud: "+EntidadesService.waypoints[item].longitud
                 == marker.title) {

                   var posicion = item;
                  EntidadesService.waypoints[item].longitud = e.latLng.lng().toFixed(6);
                  EntidadesService.waypoints[item].latitud = e.latLng.lat().toFixed(6);
                  elevator.getElevationForLocations({
                    'locations': [e.latLng]
                  }, function(results, status) {
                    if (status === google.maps.ElevationStatus.OK) {
                      if (results[0]) {
                      EntidadesService.waypoints[posicion].elevacion = results[0].elevation.toFixed(2);
                      scope.$apply();
                      } else {
                      
                      }
                    } else {
                    
                    }
                  });
                }
              }
			           marker.position = e.latLng;
			          marker.title= "Latitud: "+e.latLng.lat().toFixed(6)+"\nLongitud: "+e.latLng.lng().toFixed(6);
                scope.$apply();
		                         });
            EntidadesService.markers.push(marker);
          }else{
          //Si no tiene polilinea la creamos
          if (EntidadesService.tienePolyF()==false) {
              var color = EntidadesService.colorPoly();
               if(EntidadesService.isTrack){
            $("#li"+EntidadesService.trackActivo)[0].style.color = color;}
            else{
                $("#lir"+EntidadesService.rutaActiva)[0].style.color = color;
            }
            var lineSymbolarrow = {
			             path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			             strokeColor : color,
			             strokeOpacity : 0.7,
			             strokeWeight : 2.9,
			             scale : 2.7
		             };
		        var arrow = {
			           icon : lineSymbolarrow,
			           offset : '50%',
			          repeat : '80px'
		            };
            poly = new google.maps.Polyline({
              strokeColor:color,
              strokeOpacity: 1.0,
              strokeWeight: 3,
              	icons : [arrow]
            });
            poly.setMap(map);
            //Añadimos la polilinea a la entidad actual
            EntidadesService.addPoly(poly);

            //Si ya la tiene pues la obtenemos
          } else {

          poly = EntidadesService.getPoly();
          }

          var path = poly.getPath();

          //Le pasamos las coordenadas a la polilinea
          path.push(event.latLng);
          var image = {
            url: 'img/icono.png',

          };


          if (EntidadesService.isTrack == true) {





            // Creamos el marcador que indicara el punto creado en el mapa
            var marker = new google.maps.Marker({
              position: event.latLng,
              title: "Inicio del track"+"\nLatitud: "+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6),
              icon: EntidadesService.myIconRIni,
                draggable:true,
              map: map,
              zIndex:1
            });
              marker.addListener('click', function() {
                     for(var i in EntidadesService.tracks){
                            if((marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.markersT[i][EntidadesService.markersT[i].length-1].position.lat().toFixed(6)+
                                  EntidadesService.markersT[i][EntidadesService.markersT[i].length-1].position.lng().toFixed(6))){
                                      EntidadesService.trackElegidoFinal=i;
                                        if(EntidadesService.trackElegidoFinalMarker !=null){
                              EntidadesService.trackElegidoFinalMarker.setMap(null);
                                 }
                                        var markerF = new google.maps.Marker({
                                          map: map,
                                          draggable: true,
                                          animation: google.maps.Animation.DROP,
                                          position:EntidadesService.markersT[i][EntidadesService.markersT[i].length-1].position,
                                          icon : "img/primero.png",
                                          zIndex:9
                                        });
                                        EntidadesService.trackElegidoFinalMarker = markerF;
                                  }
                                   if((marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.markersT[i][0].position.lat().toFixed(6)+
                                  EntidadesService.markersT[i][0].position.lng().toFixed(6))){
                                      EntidadesService.trackElegidoInicial=i;
                                       if(EntidadesService.trackElegidoInicialMarker !=null){
                              EntidadesService.trackElegidoInicialMarker.setMap(null);
                                 }
                                      var markerI = new google.maps.Marker({
                                          map: map,
                                          draggable: true,
                                          animation: google.maps.Animation.DROP,
                                          position: EntidadesService.markersT[i][0].position,
                                          icon : "img/segundo.png",
                                          zIndex:9
                                        });
                                        EntidadesService.trackElegidoInicialMarker = markerI;
                                  }
                          }
                  for(var i in EntidadesService.markersT[EntidadesService.trackActivo]){
                      if(marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                          EntidadesService.markersT[EntidadesService.trackActivo][i].position.lat().toFixed(6)+
                          EntidadesService.markersT[EntidadesService.trackActivo][i].position.lng().toFixed(6)){
                          controller.puntoSelec(i);
                      }
                  }
              });
              marker.addListener('dragend', function (e) {
                  for (var item in EntidadesService.markersT[EntidadesService.trackActivo]) {
                      if (EntidadesService.markersT[EntidadesService.trackActivo][item].title
                          == marker.title) {

                          var posicion = item;
                          var longitud = e.latLng.lng().toFixed(6);
                          var latitud= e.latLng.lat().toFixed(6);
                          elevator.getElevationForLocations({
                              'locations': [e.latLng]
                          }, function(results, status) {
                              if (status === google.maps.ElevationStatus.OK) {
                                  if (results[0]) {
                                      var elevacion = results[0].elevation.toFixed(2);
                                      EntidadesService.moverPuntoTrack2(posicion,longitud,latitud,elevacion);
                                      scope.$apply();
                                  } else {
                                      
                                  }
                              } else {
                                  
                              }
                          });
                      }
                  }
                  scope.$apply();
              });
            //Si no tiene ningun marcador todavia le añadimos el nuevo marcador
          if (EntidadesService.markersT[EntidadesService.trackActivo]===undefined) {
            var markers = [];
            markers.push(marker);
            EntidadesService.markersT[EntidadesService.trackActivo] = markers;
            //Si ya tiene un marcador(el de inicio) le añadimos el marcador de final
          } else if(EntidadesService.markersT[EntidadesService.trackActivo].length==1){
            marker.icon =EntidadesService.myIconRFin;
            marker.title = "Latitud:"+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6);
            EntidadesService.markersT[EntidadesService.trackActivo].push(marker);
            //Si ya tiene los dos marcadores pues sustituimos el marcador que indica el final por el nuevo marcador que inidicara el nuevo final del track
          }else{
            marker.icon =EntidadesService.myIconRFin;
            marker.title = "Latitud: "+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6);
            EntidadesService.markersT[EntidadesService.trackActivo]
                [EntidadesService.markersT[EntidadesService.trackActivo].length-1].setIcon(EntidadesService.myIcon);
            if(map.getZoom()<17){
                EntidadesService.markersT[EntidadesService.trackActivo]
                    [EntidadesService.markersT[EntidadesService.trackActivo].length-1].setVisible(false);
            }
            else{
                EntidadesService.markersT[EntidadesService.trackActivo]
                    [EntidadesService.markersT[EntidadesService.trackActivo].length-1].setVisible(true);
            }
            EntidadesService.markersT[EntidadesService.trackActivo].push(marker);


          }
        }else {
              var marker = new google.maps.Marker({
                  position: event.latLng,
                  title: "",
                  icon: EntidadesService.myIconR,
                  draggable:true,
                  map: map
              });
              marker.addListener('click', function() {
                      for(var i in EntidadesService.rutas){
                            if((marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.wpRta[i][EntidadesService.wpRta[i].length-1].position.lat().toFixed(6)+
                                  EntidadesService.wpRta[i][EntidadesService.wpRta[i].length-1].position.lng().toFixed(6))){
                                      EntidadesService.rutaElegidoFinal=i;
                                        if(EntidadesService.rutaElegidoFinalMarker !=null){
                              EntidadesService.rutaElegidoFinalMarker.setMap(null);
                                 }
                                        var markerF = new google.maps.Marker({
                                          map: map,
                                          draggable: true,
                                          animation: google.maps.Animation.DROP,
                                          position:EntidadesService.wpRta[i][EntidadesService.wpRta[i].length-1].position,
                                          icon : "img/primero.png",
                                          zIndex:9
                                        });
                                        EntidadesService.rutaElegidoFinalMarker = markerF;
                                  }
                                   if((marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                                  EntidadesService.wpRta[i][0].position.lat().toFixed(6)+
                                  EntidadesService.wpRta[i][0].position.lng().toFixed(6))){
                                      EntidadesService.rutaElegidoInicial=i;
                                       if(EntidadesService.rutaElegidoInicialMarker !=null){
                              EntidadesService.rutaElegidoInicialMarker.setMap(null);
                                 }
                                      var markerI = new google.maps.Marker({
                                          map: map,
                                          draggable: true,
                                          animation: google.maps.Animation.DROP,
                                          position: EntidadesService.wpRta[i][0].position,
                                          icon : "img/segundo.png",
                                          zIndex:9
                                        });
                                        EntidadesService.rutaElegidoInicialMarker = markerI;
                                  }
                          }
                  for(var i in EntidadesService.wpRta[EntidadesService.rutaActiva]){
                      if(marker.position.lat().toFixed(6)+marker.position.lng().toFixed(6) ==
                          EntidadesService.wpRta[EntidadesService.rutaActiva][i].position.lat().toFixed(6)+
                          EntidadesService.wpRta[EntidadesService.rutaActiva][i].position.lng().toFixed(6)){
                          controller.puntoSelecR(i);
                      }
                  }
              });
              marker.addListener('dragend', function (e) {
                  for (var item in EntidadesService.wpRta[EntidadesService.rutaActiva]) {
                      if (EntidadesService.wpRta[EntidadesService.rutaActiva][item].title
                          == marker.title) {

                          var posicion = item;
                          var longitud = e.latLng.lng().toFixed(6);
                          var latitud= e.latLng.lat().toFixed(6);
                          elevator.getElevationForLocations({
                              'locations': [e.latLng]
                          }, function(results, status) {
                              if (status === google.maps.ElevationStatus.OK) {
                                  if (results[0]) {
                                      var elevacion = results[0].elevation.toFixed(2);
                                      EntidadesService.moverPuntoRuta2(posicion,longitud,latitud,elevacion);
                                      scope.$apply();
                                  } else {
                                      
                                  }
                              } else {
                                 
                              }
                          });
                      }
                  }
                  scope.$apply();
              });
          if (EntidadesService.wpRta[EntidadesService.rutaActiva]===undefined) {
            var nombre = "Waypoint Nº"+0;

              marker.title= "Nombre: "+nombre+"\nLatitud: "+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6);
              marker.icon=EntidadesService.myIconRIni;

          var wpsruta = [];
          wpsruta.push(marker);
          EntidadesService.wpRta[EntidadesService.rutaActiva] = wpsruta;
        }else {
              if(EntidadesService.wpRta[EntidadesService.rutaActiva].length==1){
                  var nombre = "Waypoint Nº"+EntidadesService.wpRta[EntidadesService.rutaActiva].length;

                      marker.title= "Nombre: "+nombre+"\nLatitud: "+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6);
                      marker.icon=EntidadesService.myIconRFin;

                  EntidadesService.wpRta[EntidadesService.rutaActiva].push(marker);
              }else{
                  EntidadesService.wpRta[EntidadesService.rutaActiva]
                      [EntidadesService.wpRta[EntidadesService.rutaActiva].length-1].setIcon(EntidadesService.myIconR);
                  var nombre = "Waypoint Nº"+EntidadesService.wpRta[EntidadesService.rutaActiva].length;

                      marker.title= "Nombre: "+nombre+"\nLatitud: "+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6);
                      marker.icon= EntidadesService.myIconRFin;

                      EntidadesService.wpRta[EntidadesService.rutaActiva]
                          [EntidadesService.wpRta[EntidadesService.rutaActiva].length-1].setVisible(true);

                  EntidadesService.wpRta[EntidadesService.rutaActiva].push(marker);
              }

        }
        }
}





}

        }

        // LLamamos a la función que inicializa el mapa
        initMap();


    };

    return {
        restrict: 'E',
        template: '<div id="map"  title=""></div>',
        replace: true,
        controller: 'GPSController',
        link: link
    };
}

})();
