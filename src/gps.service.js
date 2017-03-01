(function () {
'use strict';

angular.module('GPS')
.service('EntidadesService',EntidadesService);

//funcion del servicio de entidades que se encarga de gestionar las distintas entidades de la aplicación
function EntidadesService (){
  var service = this;
  service.cont = 0;
  service.trackActivo = 0;
  service.rutaActiva = 0;
  service.wpActivo = 0;
  service.tracks = [];
  service.rutas = [];
  service.waypoints = [];
  service.markers = [];
  service.puntosTrackActivo=[];
  service.distancias2 = [];
  service.elevaciones2 = [];
  service.distancias = [];
  service.elevaciones = [];
  service.tienePoly = [];
  service.tienePolyR = [];
  service.polyLineas = [];
  service.polyLineasR = [];
  service.isTrack = false;
  service.isWaypoint;
  service.hayEntidadesCreadas = false;
  service.elevacion=0;
  service.distancia=0;
  service.latitud = 0;
  service.longitud = 0;
  service.markersT = [];
  service.wpRta = [];
  service.velocidad = 4;
  service.modoCreacion = false;
  service.latitudPInv = 0;
  service.longitudPInv = 0;
  service.elevacionP = 0;
  service.modoInvertir = false;
  service.mapa;
  service.seleccion = false;
  service.latitudSelec = 0;
  service.longitudSelec = 0;
  service.markerPunto;
  service.puntoElegido;
  service.modoRecorte1 = false;
  service.modoRecorte2 = false;
  service.colorPolyNF = "";
  service.modoUnion = false;
  service.modoInsertar = false;
  service.puntoN={};
  service.xmlImportado;
  service.modoImportWP = false;
  service.puntoborrado = false;
  service.isTrackImport = false;
  service.isRuteImport = false;
  service.isWpImport = false;
  service.puntosGrafico = [];
  service.modoEdicion = true;
  service.conection = false;
  service.mapas = [];

  //Centra el mapa segun el track importado
  service.centrarMapa = function () {
      //Inicializamos el elemento bounds de google maps
      var bounds = new google.maps.LatLngBounds();
      //Recorremos los puntos del track
      for (var item in service.tracks[service.tracks.length-1].puntos) {
          var coor =  new google.maps.LatLng(service.tracks[service.tracks.length-1].puntos[item].latitud,
              service.tracks[service.tracks.length-1].puntos[item].longitud);
          //Añadimos las coordenadas del punto al bound
          bounds.extend(coor);
      }
      //Calculamos y cambiamos el entro del mapa
      service.mapa.setCenter(bounds.getCenter());
      //Aplicamos el zoom en relazion al track importado
      service.mapa.setZoom(service.getZoomByBounds(service.mapa,bounds));
  };
    //Centra el mapa en la ruta importada
    service.centrarRuta = function () {
        var bounds = new google.maps.LatLngBounds();
        for (var item in service.rutas[service.rutas.length-1].puntos) {
            var coor =  new google.maps.LatLng(service.rutas[service.rutas.length-1].puntos[item].latitud,
                service.rutas[service.rutas.length-1].puntos[item].longitud);
            bounds.extend(coor);
        }
        service.mapa.setCenter(bounds.getCenter());
        service.mapa.setZoom(service.getZoomByBounds(service.mapa,bounds));
    };
    //centra el mapa en los waypoints importados
    service.centrarWP = function () {
        var puntos=service.xmlImportado.getElementsByTagName("wpt");
        var bounds = new google.maps.LatLngBounds();
        for (var item in puntos) {
          if(item<puntos.length){
            var coor =  new google.maps.LatLng(puntos[item].attributes.lat.nodeValue,puntos[item].attributes.lon.nodeValue);
            bounds.extend(coor);
        }}
        service.mapa.setCenter(bounds.getCenter());
        service.mapa.setZoom(service.getZoomByBounds(service.mapa,bounds));
    };
    //Funcion que calcula y ajusta el zoom del mapa al track importado
    service.getZoomByBounds = function ( map, bounds ){
        var MAX_ZOOM = map.mapTypes.get( map.getMapTypeId() ).maxZoom || 21 ;
        var MIN_ZOOM = map.mapTypes.get( map.getMapTypeId() ).minZoom || 0 ;

        var ne= map.getProjection().fromLatLngToPoint( bounds.getNorthEast() );
        var sw= map.getProjection().fromLatLngToPoint( bounds.getSouthWest() );

        var worldCoordWidth = Math.abs(ne.x-sw.x);
        var worldCoordHeight = Math.abs(ne.y-sw.y);

        //Fit padding in pixels
        var FIT_PAD = 40;

        for( var zoom = MAX_ZOOM; zoom >= MIN_ZOOM; --zoom ){
            if( worldCoordWidth*(1<<zoom)+2*FIT_PAD < $(map.getDiv()).width() &&
                worldCoordHeight*(1<<zoom)+2*FIT_PAD < $(map.getDiv()).height() )
                return zoom;
        }
        return 0;
    }
service.importXMLWp = function () {
  var puntos=service.xmlImportado.getElementsByTagName("wpt");
  service.modoImportWP = true;
  //Recorremos los puntos del primer track
  for (var item in puntos) {
    if(item <puntos.length){

    //Guardamos los datos de los puntos
    service.longitudPInv =  puntos[item].attributes.lon.nodeValue;
    service.latitudPInv =  puntos[item].attributes.lat.nodeValue;
    service.elevacionP = parseFloat(puntos[item].firstElementChild.textContent);

    //Simulamos el click para que se añada el punto
    google.maps.event.trigger(service.mapa, 'click');
  }}
  //Desactivamos los modos activados durante este metodo
    service.modoImportWP = false;
}

  service.importXML = function () {
    var puntos=service.xmlImportado.getElementsByTagName("trkpt");
    //Activamos el modo invertir (aunque sea el modo invertir nos vale tambien para esta situacion)
    service.modoInvertir = true;
    //Recorremos los puntos del primer track
    for (var item in puntos) {
      if(item <puntos.length){
      //Guardamos los datos de los puntos
      service.longitudPInv =  puntos[item].attributes.lon.nodeValue;
      service.latitudPInv =  puntos[item].attributes.lat.nodeValue;
      service.elevacionP = parseFloat(puntos[item].firstElementChild.textContent);
      //EL modo segundo recorte nos viene que ni pintado para esta situación
      service.modoRecorte2=true;

      //Simulamos el click para que se añada el punto al nuevo track y se pinte en el mapa
      google.maps.event.trigger(service.mapa, 'click');
    }}
    //Desactivamos los modos activados durante este metodo
    service.modoInvertir = false;
    service.modoRecorte2 = false;
  }

  //Funcion que genera y devuelve un gpx con los waypoints
  service.getWaypoints = function () {
    //Esta serie la cabecera del gpx
    var xml = "<?xml version="+'"1.0"'+" encoding="+'"UTF-8"'+"?>\n"
    +"<gpx xmlns="+'"http://www.topografix.com/GPX/1/1"'+" creator="+'"Alejandro Fernández Herrero"'
    +" version="+'"1.1"'+" xmlns:xsi="+'"http://www.w3.org/2001/XMLSchema-instance"'+">\n"+
    "\t<metadata>\n"+"\t\t<name>TFG Tracks GPS</name>\n"+"\t\t<link href="+'"https://h3rrero.github.io/TFG-GPS/"'+">\n"+
    "\t\t\t<text>TFG-GPS</text>\n"+"\t\t</link>\n"+"\t</metadata>\n";

    //Se recorren los waypoints y se añaden al gpx
    for (var item in service.waypoints) {
        xml = xml + "\t<wpt lat="+'"'+service.waypoints[item].latitud+'"'
        +" lon="+'"'+service.waypoints[item].longitud+'"'+">\n"+"\t\t<ele>"+
        service.waypoints[item].elevacion+"</ele>\n"+"\t\t<name>"+
        service.waypoints[item].nombre+"</name>\n"+"\t\t<desc>"+"prueba"+"</desc>\n"
        +"\t\t<sym>"+"generic"+"</sym>\n"+"\t\t<type>"+"Generic"+"</type>\n"+"\t</wpt>\n";
    }
    xml = xml+"</gpx>";
    return xml;
  }

  //FUncion que crea un gpx para un track o una ruta segun sea el caso
  service.getXml = function (track) {
    //Cabecera del gpx
    var xml = "<?xml version="+'"1.0"'+" encoding="+'"UTF-8"'+"?>\n"
    +"<gpx xmlns="+'"http://www.topografix.com/GPX/1/1"'+" creator="+'"Alejandro Fernández Herrero"'
    +" version="+'"1.1"'+" xmlns:xsi="+'"http://www.w3.org/2001/XMLSchema-instance"'+">\n"+
    "\t<metadata>\n"+"\t\t<name>TFG Tracks GPS</name>\n"+"\t\t<link href="+'"https://h3rrero.github.io/TFG-GPS/"'+">\n"+
    "\t\t\t<text>TFG-GPS</text>\n"+"\t\t</link>\n"+"\t</metadata>\n";

    //Si es track
    if (track == true) {

    xml = xml+"\t<trk>\n"+"\t\t<name>"+service.tracks[service.trackActivo].nombre+"</name>\n"+
          "\t\t<trkseg>\n";

    //Se recorren los puntos del track para crear el gpx
    for (var item in service.tracks[service.trackActivo].puntos) {
    xml = xml+"\t\t\t<trkpt lat="+'"'+service.tracks[service.trackActivo].puntos[item].latitud+'"'+" lon="+'"'+
          service.tracks[service.trackActivo].puntos[item].longitud+'"'+">\n"+
          "\t\t\t\t<ele>"+service.tracks[service.trackActivo].puntos[item].elevacion+"</ele>\n"+
          "\t\t\t\t<time>"+service.tracks[service.trackActivo].puntos[item].fecha+"T"+
          service.tracks[service.trackActivo].puntos[item].hora+"</time>\n"+
          "\t\t\t</trkpt>\n";
    }
    xml = xml+"\t\t</trkseg>\n"+"\t</trk>\n"+"</gpx>";

  //Si es una ruta
  }else {
    //Se añaden los puntos de la ruta a gpx como waypoints
    for (var item in service.rutas[service.rutaActiva].puntos) {
        xml = xml + "\t<wpt lat="+'"'+service.rutas[service.rutaActiva].puntos[item].latitud+'"'
        +" lon="+'"'+service.rutas[service.rutaActiva].puntos[item].longitud+'"'+">\n"+"\t\t<ele>"+
        service.rutas[service.rutaActiva].puntos[item].elevacion+"</ele>\n"+"\t\t<name>"+
        "Waypoint de ruta Nº"+item+"</name>\n"+"\t\t<desc>"+"prueba"+"</desc>\n"
        +"\t\t<sym>"+"generic"+"</sym>\n"+"\t\t<type>"+"Generic"+"</type>\n"+"\t</wpt>\n";
    }


        xml = xml+"\t<trk>\n"+"\t\t<name>"+service.rutas[service.rutaActiva].nombre+"</name>\n"+
              "\t\t<trkseg>\n";
        //Se añade la ruta al gpx
        for (var item in service.rutas[service.rutaActiva].puntos) {
        xml = xml+"\t\t\t<trkpt lat="+'"'+service.rutas[service.rutaActiva].puntos[item].latitud+'"'+" lon="+'"'+
              service.rutas[service.rutaActiva].puntos[item].longitud+'"'+">\n"+
              "\t\t\t\t<ele>"+service.rutas[service.rutaActiva].puntos[item].elevacion+"</ele>\n"+
              "\t\t\t\t<time>"+service.rutas[service.rutaActiva].puntos[item].fecha+"T"+
              service.rutas[service.rutaActiva].puntos[item].hora+"</time>\n"+
              "\t\t\t</trkpt>\n";
        }
        xml = xml+"\t\t</trkseg>\n"+"\t</trk>\n"+"</gpx>";
  }
    return xml;
  }

  service.anadirPuntoRuta = function () {
    var puntos =new Array();
    service.colorPolyNF = service.getPoly().strokeColor;
    //Eliminapos la polilinea actual
    service.getPoly().setMap(null);
    //ELiminamos los marcadores actuales
    for (var item in service.wpRta[service.rutaActiva]) {
        service.wpRta[service.rutaActiva][item].setMap(null);
    }


    //Marcamos la ruta como que no tiene polilinea
    service.tienePolyR[service.rutaActiva]=false;
    //Y tambien como que no tiene marcadores
      service.wpRta[service.rutaActiva] = undefined;
    for (var variable in service.rutas[service.rutaActiva].puntos) {
      puntos.push(service.rutas[service.rutaActiva].puntos[variable]);
    }
    //Añadimos el nuevo punto
    puntos.splice(service.puntoElegido+1,0,service.puntoN);
    //Booramos los puntos actuales
    for (var i = service.rutas[service.rutaActiva].puntos.length-1; i>=0; i--) {
      service.rutas[service.rutaActiva].puntos.splice(i,1);
      service.puntosTrackActivo.splice(i,1);
    }
    //Asignamos una nueva fecha
    service.rutas[service.rutaActiva].fecha = new Date();
    //Recorremos los puntos para volver a añadirlos
    for (var i = 0; i <puntos.length; i++) {
      //Guardamos la longitud y laltitud para pasarsela al mapa
      service.longitudPInv = puntos[i].longitud;
      service.latitudPInv = puntos[i].latitud;
      service.elevacionP = puntos[i].elevacion;
      //Activamos el modo invertir
        service.modoInvertir = true;

      //Simulamos un click el mapa para añadir el punto
      google.maps.event.trigger(service.mapa, 'click');
    }
    //Desactivamos el modo invertir
    service.modoInvertir = false;
  }

  service.anadirPuntoTrack = function () {
    var puntos =new Array();
    service.colorPolyNF = service.getPoly().strokeColor;
    //Eliminapos la polilinea actual
    service.getPoly().setMap(null);
    //ELiminamos los marcadores de inicion y fin actuales
    service.markersT[service.trackActivo][0].setMap(null);
    service.markersT[service.trackActivo][1].setMap(null);
    //Marcamos al track como que no tiene polilinea
    service.tienePoly[service.trackActivo]=false;
    //Y tambien como que no tiene marcadores
    service.markersT[service.trackActivo] = undefined;
    for (var variable in service.tracks[service.trackActivo].puntos) {
      puntos.push(service.tracks[service.trackActivo].puntos[variable]);
    }
    //Añadimos el nuevo punto
    puntos.splice(service.puntoElegido+1,0,service.puntoN);

    //Booramos los puntos actuales
    for (var i = service.tracks[service.trackActivo].puntos.length-1; i>=0; i--) {
      service.tracks[service.trackActivo].puntos.splice(i,1);
      service.puntosTrackActivo.splice(i,1);
    }
    //Asignamos una nueva fecha
    service.tracks[service.trackActivo].fecha = new Date();
    for (var i =0; i < puntos.length; i++) {
      //Guardamos la longitud y laltitud para pasarsela al mapa
      service.longitudPInv = puntos[i].longitud;
      service.latitudPInv = puntos[i].latitud;
      service.elevacionP = puntos[i].elevacion;
      //Activamos el modo invertir (usamos este modo ya que nos sirve
      //perfectamente simplemente llamandolo sin invertir los puntos anteriormente)
        service.modoInvertir = true;

      //Simulamos un click el mapa para añadir el punto
      google.maps.event.trigger(service.mapa, 'click');
    }
    //Desactivamos el modo invertir
    service.modoInvertir = false;
  }

  //Metodo que elimina un punto de una ruta
  service.eliminarPuntoRuta = function () {
    var puntos =new Array();
    //Guardamos el color de la ruta
    service.colorPolyNF = service.getPoly().strokeColor;
    //Eliminapos la polilinea actual
    service.getPoly().setMap(null);
    //ELiminamos los marcadores actuales
    for (var item in service.wpRta[service.rutaActiva]) {
        service.wpRta[service.rutaActiva][item].setMap(null);
    }


    //Marcamos la ruta como que no tiene polilinea
    service.tienePolyR[service.rutaActiva]=false;
    //Y tambien como que no tiene marcadores
      service.wpRta[service.rutaActiva] = undefined;
    for (var variable in service.rutas[service.rutaActiva].puntos) {
      puntos.push(service.rutas[service.rutaActiva].puntos[variable]);
    }
    //Booramos los puntos actuales
    for (var i = service.rutas[service.rutaActiva].puntos.length-1; i>=0; i--) {
      service.rutas[service.rutaActiva].puntos.splice(i,1);
      service.puntosTrackActivo.splice(i,1);
    }
    //Eliminamos el punto seleccionado
    puntos.splice(service.puntoElegido,1);
    //Asignamos una nueva fecha
    service.rutas[service.rutaActiva].fecha = new Date();
    //Recorremos los puntos para volver a añadirlos
    for (var i = 0; i <puntos.length; i++) {
      //Guardamos la longitud y laltitud para pasarsela al mapa
      service.longitudPInv = puntos[i].longitud;
      service.latitudPInv = puntos[i].latitud;
      service.elevacionP = puntos[i].elevacion;
      //Activamos el modo invertir
        service.modoInvertir = true;

      //Simulamos un click el mapa para añadir el punto
      google.maps.event.trigger(service.mapa, 'click');
    }
    //Desactivamos el modo invertir
    service.modoInvertir = false;
  }

 service.eliminarPuntoTrack = function () {
   var puntos =new Array();
   //Guardamos el color de la polilinea
   service.colorPolyNF = service.getPoly().strokeColor;
   //Eliminapos la polilinea actual
   service.getPoly().setMap(null);
   //ELiminamos los marcadores de inicion y fin actuales
   service.markersT[service.trackActivo][0].setMap(null);
   //En caso de que no tenga marcador de final no accedemos a el
   if(service.markersT[service.trackActivo].length>1)
   service.markersT[service.trackActivo][1].setMap(null);
   //Marcamos al track como que no tiene polilinea
   service.tienePoly[service.trackActivo]=false;
   //Y tambien como que no tiene marcadores
   service.markersT[service.trackActivo] = undefined;
   for (var variable in service.tracks[service.trackActivo].puntos) {
     puntos.push(service.tracks[service.trackActivo].puntos[variable]);
   }
   //Eliminamos el punto elegido d ela lista de punto a pintar
   puntos.splice(service.puntoElegido,1);
   //Booramos los puntos actuales
   for (var i = service.tracks[service.trackActivo].puntos.length-1; i>=0; i--) {
     service.tracks[service.trackActivo].puntos.splice(i,1);
     service.puntosTrackActivo.splice(i,1);
   }
   //Asignamos una nueva fecha
   service.tracks[service.trackActivo].fecha = new Date();
   for (var i =0; i < puntos.length; i++) {
     //Guardamos la longitud y laltitud para pasarsela al mapa
     service.longitudPInv = puntos[i].longitud;
     service.latitudPInv = puntos[i].latitud;
     service.elevacionP = puntos[i].elevacion;
     //Activamos el modo invertir (usamos este modo ya que nos sirve
     //perfectamente simplemente llamandolo sin invertir los puntos anteriormente)
       service.modoInvertir = true;

     //Simulamos un click el mapa para añadir el punto
     google.maps.event.trigger(service.mapa, 'click');
   }
   //Desactivamos el modo invertir
   service.modoInvertir = false;
 }
 //Metodo que devuelve la posicion de una ruta a partir de su nombre
  service.buscarRutaPorNombre = function (nombre) {
    for (var item in service.tracks) {
      if(service.rutas[item].nombre ==nombre){
        return item;
      }
    }
    return null;
  }
   //Metodo que devuelve la posicion de un track a partir de su nombre
  service.buscarTrackPorNombre = function (nombre) {
    for (var item in service.tracks) {
      if(service.tracks[item].nombre ==nombre){
        return item;
      }
    }
    return null;
  }
  //Metodo que une dos rutas
  service.unirRuta = function (rutaElegida) {
    //Activamos el modo invertir (aunque sea el modo invertir nos vale tambien para esta situacion)
    service.modoInvertir = true;
    //Recorremos los puntos de la primera ruta
    for (var item in service.rutas[service.rutaActiva].puntos) {
      //Guardamos los datos de los puntos
      service.longitudPInv = service.rutas[service.rutaActiva].puntos[item].longitud;
      service.latitudPInv = service.rutas[service.rutaActiva].puntos[item].latitud;
      service.elevacionP = service.rutas[service.rutaActiva].puntos[item].elevacion;
      //Activamos el modo segundo recorte
      service.modoRecorte2=true;
      //Simulamos el click para añadir los puntos a la nueva ruta y al mapa
      google.maps.event.trigger(service.mapa, 'click');
    }
    //Recorremos la segunda ruta
    for (var item in service.rutas[rutaElegida].puntos) {
      //Guardamos los datos de los puntos
      service.longitudPInv = service.rutas[rutaElegida].puntos[item].longitud;
      service.latitudPInv = service.rutas[rutaElegida].puntos[item].latitud;
      service.elevacionP = service.rutas[rutaElegida].puntos[item].elevacion;
        //Simulamos el click para añadir los puntos a la nueva ruta y al mapa
      google.maps.event.trigger(service.mapa, 'click');
    }
    //Desactivamos los modos activados durante el metodo
    service.modoInvertir = false;
    service.modoRecorte2 = false;
  }

  //metodo que une dos tracks
  service.unirTrack = function (trackElegido) {
    //Activamos el modo invertir (aunque sea el modo invertir nos vale tambien para esta situacion)
    service.modoInvertir = true;
    //Recorremos los puntos del primer track
    for (var item in service.tracks[service.trackActivo].puntos) {
      //Guardamos los datos de los puntos
      service.longitudPInv = service.tracks[service.trackActivo].puntos[item].longitud;
      service.latitudPInv = service.tracks[service.trackActivo].puntos[item].latitud;
      service.elevacionP = service.tracks[service.trackActivo].puntos[item].elevacion;
      //EL modo segundo recorte nos viene que ni pintado para esta situación
      service.modoRecorte2=true;
      //Simulamos el click para que se añada el punto al nuevo track y se pinte en el mapa
      google.maps.event.trigger(service.mapa, 'click');
    }
    //Recorremos el segundo track
    for (var item in service.tracks[trackElegido].puntos) {
        //Guardamos los datos de los puntos
      service.longitudPInv = service.tracks[trackElegido].puntos[item].longitud;
      service.latitudPInv = service.tracks[trackElegido].puntos[item].latitud;
      service.elevacionP = service.tracks[trackElegido].puntos[item].elevacion;
      //Simulamos el click para que se añada el punto al nuevo track y se pinte en el mapa
      google.maps.event.trigger(service.mapa, 'click');
    }
    //Desactivamos los modos activados durante este metodo
    service.modoInvertir = false;
    service.modoRecorte2 = false;
  }
  service.recortarTrack = function () {
    //Recorremos los puntos del track seleccionado
    for (var item in service.tracks[service.trackActivo].puntos) {
      //Recorremos los punto anteriores al punto elegido
      if (item<=service.puntoElegido) {
        //Guardamos sus datos porque los necesitaremos cuando los pintemos en el mapa
        service.longitudPInv = service.tracks[service.trackActivo].puntos[item].longitud;
        service.latitudPInv = service.tracks[service.trackActivo].puntos[item].latitud;
        service.elevacionP = service.tracks[service.trackActivo].puntos[item].elevacion;
        //Activamos el modo invertir y el modo primer recorte
          service.modoInvertir = true;
          service.modoRecorte1 = true;
          //Simulamos un click en el mapa para que se añada el punto
          google.maps.event.trigger(service.mapa, 'click');

      }
      service.modoRecorte1 = false;
      //Recorremos los punto a partir del punto elegido
      if (item>=service.puntoElegido) {
        //Guardamos sus datos
        service.longitudPInv = service.tracks[service.trackActivo].puntos[item].longitud;
        service.latitudPInv = service.tracks[service.trackActivo].puntos[item].latitud;
        service.elevacionP = service.tracks[service.trackActivo].puntos[item].elevacion;
        //Activamos el modo invertir y el modo segundo recorte
          service.modoInvertir = true;
          service.modoRecorte2 = true;
          //Simulamos un click en el mapa para que se añada el punto
          google.maps.event.trigger(service.mapa, 'click');
      }
    }
    //Desactivamos todos los modos y ponemos a null el punto elegido
    service.modoInvertir = false;
    service.modoRecorte1 = false;
    service.modoRecorte2 = false;
    service.puntoElegido = null;

  }
  service.recortarRuta = function () {
    for (var item in service.rutas[service.rutaActiva].puntos) {
      //Recorremos los puntos antes del punto elegido
      if (item<=service.puntoElegido) {
        //Guardamos sus datos
        service.longitudPInv = service.rutas[service.rutaActiva].puntos[item].longitud;
        service.latitudPInv = service.rutas[service.rutaActiva].puntos[item].latitud;
        service.elevacionP = service.rutas[service.rutaActiva].puntos[item].elevacion;
        //Activamos el modo invertir y el modo primer recorde
          service.modoInvertir = true;
          service.modoRecorte1 = true;
          //simulamos click en el mapa
          google.maps.event.trigger(service.mapa, 'click');

      }
      service.modoRecorte1 = false;
      //Recorremos los puntos despues del punto elegido
      if (item>=service.puntoElegido) {
        //guardamos sus datos
        service.longitudPInv = service.rutas[service.rutaActiva].puntos[item].longitud;
        service.latitudPInv = service.rutas[service.rutaActiva].puntos[item].latitud;
        service.elevacionP = service.rutas[service.rutaActiva].puntos[item].elevacion;
        //Activamos el modo invertir y el modo segundo recorte
          service.modoInvertir = true;
          service.modoRecorte2 = true;
          google.maps.event.trigger(service.mapa, 'click');
      }
    }
    //Deesactivamos todos los modos y ponemos el punto elegido como null
    service.modoInvertir = false;
    service.modoRecorte1 = false;
    service.modoRecorte2 = false;
    service.puntoElegido = null;
  }

  //Metodo que guarda el punto seleccionado en la tabla de puntos
  service.puntoSelec = function (index) {
    //Guardamos el index del punto elegido
    service.puntoElegido = index;
    //Activamos el modo seleccion
    service.seleccion = true;
    if(service.isTrack == true){
      //Guardamos los datos del punto
      service.latitudSelec = service.tracks[service.trackActivo].puntos[index].latitud;
      service.longitudSelec = service.tracks[service.trackActivo].puntos[index].longitud;
      //Simulamos un click el mapa para añadir el marcado del punto elegido
      google.maps.event.trigger(service.mapa, 'click');
    }else{
      //Guardamos los datos del punto
      service.latitudSelec = service.rutas[service.rutaActiva].puntos[index].latitud;
      service.longitudSelec = service.rutas[service.rutaActiva].puntos[index].longitud;
      //Simulamos un click el mapa para añadir el marcado del punto elegido
      google.maps.event.trigger(service.mapa, 'click');
    }
    //Desactivamos el modo selecion
    service.seleccion = false;
  }

    service.cambiarDescripcion = function (descripcion) {
        service.waypoints[service.wpActivo].descripcion = descripcion;
    }
  //metodo que cambia el nombre a un track elegido
  service.renombrarT = function (nombre) {
    if(service.isTrack == true)
    service.tracks[service.trackActivo].nombre = nombre;
  }
  //Metodo que cambia el nombre a una ruta elegida
  service.renombrarR = function (nombre) {
    if (service.isTrack == false)
    service.rutas[service.rutaActiva].nombre = nombre;
  }
  //Metodo que cambia el nombre a un wayPoint elegido
  service.renombrarW = function (nombre) {

    service.waypoints[service.wpActivo].nombre = nombre;
  }

  //FUncion para invertir un track
  service.invertirRuta = function () {

    var puntos =new Array();

    service.colorPolyNF = service.getPoly().strokeColor;
    //Eliminapos la polilinea actual
    service.getPoly().setMap(null);
    //ELiminamos los marcadores actuales
    for (var item in service.wpRta[service.rutaActiva]) {
        service.wpRta[service.rutaActiva][item].setMap(null);
    }


    //Marcamos la ruta como que no tiene polilinea
    service.tienePolyR[service.rutaActiva]=false;
    //Y tambien como que no tiene marcadores
      service.wpRta[service.rutaActiva] = undefined;
    for (var variable in service.rutas[service.rutaActiva].puntos) {
      puntos.push(service.rutas[service.rutaActiva].puntos[variable]);
    }
    //Booramos los puntos actuales
    for (var i = service.rutas[service.rutaActiva].puntos.length-1; i>=0; i--) {
      service.rutas[service.rutaActiva].puntos.splice(i,1);
      service.puntosTrackActivo.splice(i,1);
    }
    //Asignamos una nueva fecha
    service.rutas[service.rutaActiva].fecha = new Date();
      service.rutas[service.rutaActiva].distancia= 0;
      service.rutas[service.rutaActiva].desnivelP= 0;
      service.rutas[service.rutaActiva].desnivelN=0;
      service.rutas[service.rutaActiva].elevMax=0;
      service.rutas[service.rutaActiva].elevMin=9999999;
      service.rutas[service.rutaActiva].duracionIda=0;
      service.rutas[service.rutaActiva].duracionVuelta=0;
    //Recorremos los puntos al reves para volver a añadirlos
    for (var i = puntos.length-1; i >= 0; i--) {
      //Guardamos la longitud y laltitud para pasarsela al mapa
      service.longitudPInv = puntos[i].longitud;
      service.latitudPInv = puntos[i].latitud;
      service.elevacionP = puntos[i].elevacion;
      //Activamos el modo invertir
        service.modoInvertir = true;

      //Simulamos un click el mapa para añadir el punto
      google.maps.event.trigger(service.mapa, 'click');



    }

    //Desactivamos el modo invertir
    service.modoInvertir = false;
  }

  //FUncion para invertir un track
  service.invertirTrack = function () {

    var puntos =new Array();
    service.colorPolyNF = service.getPoly().strokeColor;
    //Eliminapos la polilinea actual
    service.getPoly().setMap(null);
    //ELiminamos los marcadores de inicion y fin actuales
    service.markersT[service.trackActivo][0].setMap(null);
    service.markersT[service.trackActivo][1].setMap(null);
    //Marcamos al track como que no tiene polilinea
    service.tienePoly[service.trackActivo]=false;
    //Y tambien como que no tiene marcadores
    service.markersT[service.trackActivo] = undefined;
    for (var variable in service.tracks[service.trackActivo].puntos) {
      puntos.push(service.tracks[service.trackActivo].puntos[variable]);
    }
    //Booramos los puntos actuales
    for (var i = service.tracks[service.trackActivo].puntos.length-1; i>=0; i--) {
      service.tracks[service.trackActivo].puntos.splice(i,1);
      service.puntosTrackActivo.splice(i,1);
    }
    //Asignamos una nueva fecha
    service.tracks[service.trackActivo].fecha = new Date();
      service.tracks[service.trackActivo].distancia= 0;
      service.tracks[service.trackActivo].desnivelP= 0;
      service.tracks[service.trackActivo].desnivelN=0;
      service.tracks[service.trackActivo].elevMax=0;
      service.tracks[service.trackActivo].elevMin=9999999;
      service.tracks[service.trackActivo].duracionIda=0;
      service.tracks[service.trackActivo].duracionVuelta=0;
    //Recorremos los puntos al reves para volver a añadirlos
    for (var i = puntos.length-1; i >= 0; i--) {
      //Guardamos la longitud y laltitud para pasarsela al mapa
      service.longitudPInv = puntos[i].longitud;
      service.latitudPInv = puntos[i].latitud;
      service.elevacionP = puntos[i].elevacion;
      //Activamos el modo invertir
        service.modoInvertir = true;

      //Simulamos un click el mapa para añadir el punto
      google.maps.event.trigger(service.mapa, 'click');



    }

    //Desactivamos el modo invertir
    service.modoInvertir = false;
  }
  service.borrarTrack = function () {
    //Eliminapos la polilinea actual
    if(service.polyLineas[service.trackActivo]!==undefined){
    service.getPoly().setMap(null);
    service.polyLineas.splice(service.trackActivo,1);
    }
    //ELiminamos los marcadores de inicion y fin actuales
    if(service.markersT[service.trackActivo]!==undefined){
    service.markersT[service.trackActivo][0].setMap(null);
    service.markersT[service.trackActivo][1].setMap(null);
    }
    //Marcamos al track como que no tiene polilinea
    service.tienePoly[service.trackActivo]=false;
    service.tienePoly.splice(service.trackActivo,1);
    //Y tambien como que no tiene marcadores
    service.markersT[service.trackActivo] = undefined;
    service.markersT.splice(service.trackActivo,1);
    //Booramos los puntos actuales
    for (var i = service.tracks[service.trackActivo].puntos.length-1; i>=0; i--) {
      service.tracks[service.trackActivo].puntos.splice(i,1);
      service.puntosTrackActivo.splice(i,1);
    }
    //Borramos el track por completo
    service.tracks.splice(service.trackActivo,1);
    if(service.tracks.length<1 && service.rutas.length<1 && service.waypoints.length<1)
    {
      service.hayEntidadesCreadas=false;
    }
  }
  service.borrarRuta = function () {
    //Eliminapos la polilinea actual
  service.polyLineasR[service.rutaActiva].setMap(null);
    service.polyLineasR.splice(service.rutaActiva,1);
    //ELiminamos los marcadores actuales
    for (var item in service.wpRta[service.rutaActiva]) {
        service.wpRta[service.rutaActiva][item].setMap(null);
    }
    //Marcamos la ruta como que no tiene polilinea
    service.tienePolyR[service.rutaActiva]=false;
    service.tienePolyR.splice(service.rutaActiva,1);
    //Y tambien como que no tiene marcadores
      service.wpRta[service.rutaActiva] = undefined;
      service.wpRta.splice(service.rutaActiva,1);
    //Booramos los puntos actuales
    for (var i = service.rutas[service.rutaActiva].puntos.length-1; i>=0; i--) {
      service.rutas[service.rutaActiva].puntos.splice(i,1);
      service.puntosTrackActivo.splice(i,1);
    }
    service.rutas.splice(service.rutaActiva,1);
    if(service.tracks.length<1 && service.rutas.length<1 && service.waypoints.length<1)
    {
      service.hayEntidadesCreadas=false;
    }
  }
  //Metodo que permote borrar un waypoint
  service.borrarWp = function () {

        //Quitamos el marcador del mapa
        service.markers[service.wpActivo].setMap(null);
        //Despues lo eliminamos del array
        service.markers.splice(service.wpActivo,1);
    //ELiminamos el waypoint
    service.waypoints.splice(service.wpActivo,1);
    //Si no hubiera ninguna entidad creada se pone a false el boolean que lo indica
    if(service.tracks.length<1 && service.rutas.length<1 && service.waypoints.length<1)
    {
      service.hayEntidadesCreadas=false;
    }

  }

//Funcion que recalcula la duracion del track y de sus puntos en funcion de una velocidad y fecha dadas.
service.cambiarTiempos = function (velocidad,fecha) {
  service.velocidad = velocidad;
  service.tracks[service.trackActivo].duracionIda=service.calcularDuracion(true).toFixed(2);
  service.tracks[service.trackActivo].duracionVuelta=service.calcularDuracion(false).toFixed(2);
  service.tracks[service.trackActivo].fecha = fecha;
  //Se recorren todos los puntos y se les asiogna la nueva fecha y velocidad
  for (var item in service.puntosTrackActivo) {
    service.calcularDuracionPuntos(service.puntosTrackActivo[item]);
    service.calcularFecha(service.trackActivo,service.calcularDuracionPuntos(service.puntosTrackActivo[item]));
    service.puntosTrackActivo[item].fecha=service.tracks[service.trackActivo].fecha.getDate()+"/"+service.tracks[service.trackActivo].fecha.getMonth()+"/"+service.tracks[service.trackActivo].fecha.getFullYear();
    service.puntosTrackActivo[item].hora =service.tracks[service.trackActivo].fecha.getHours()+":"+service.ordenarMinutos();
    service.puntosTrackActivo[item].velocidad=service.velocidad;
  }
}

//Calcula la duracion del tramo entre dos puntos de un track
//Usamos una formula de montañismo
//Se calcula el tiempo en subida y bajada  y se suman
//Se calcula el tiempo en recorrer la distancia del track en linea recta sin elevaciones
//Despues se comprueba cual de los dos tiempos calculados es mayor
// Y el resultado seria la suma del mayor mas la mitad del menor
service.calcularDuracion= function (ida,num) {
  if (ida) {
    var hDesnivelSubida = (parseFloat(service.tracks[num].desnivelP)/400).toFixed(2);
    var hDesnivelBajada = (Math.abs(parseFloat(service.tracks[num].desnivelN)/600)).toFixed(2);
  } else {
    var hDesnivelSubida = (parseFloat(service.tracks[num].desnivelN)/400).toFixed(2);
    var hDesnivelBajada = (Math.abs(parseFloat(service.tracks[num].desnivelP)/600)).toFixed(2);
  }
  var hDistanciaHori = (parseFloat(service.tracks[num].distancia)/parseFloat(service.velocidad)).toFixed(2);
  var hdesnivelGeneral = parseFloat(hDesnivelBajada)+parseFloat(hDesnivelSubida);
  if (hDistanciaHori>=hdesnivelGeneral ) {
    var menor = parseFloat(hdesnivelGeneral*0.5).toFixed(2);
    if (menor=="NaN") {
      menor=0;
    }
    var horasFinales = parseFloat(hDistanciaHori)+parseFloat(menor);
    var minutosDescanso = horasFinales*10;
    var minutosFInales = (horasFinales*60)+minutosDescanso;
    var duracionRecorrido = minutosFInales/60;
    if (ida) {

    } else {

    }
    return duracionRecorrido;
  } else {
    var menor = parseFloat(hDistanciaHori*0.5).toFixed(2);
    var horasFinales = parseFloat(hdesnivelGeneral)+parseFloat(menor);
    var minutosDescanso = horasFinales*10;
    var minutosFInales = (horasFinales*60)+minutosDescanso;
    var duracionRecorrido = minutosFInales/60;
    if (ida) {

    } else {

    }
    return duracionRecorrido;
  }
}
//Calcula la duracion del tramo entre dos puntos de un track
//Usamos una formula de montañismo
//Se calcula el tiempo en subida y bajada  y se suman
//Se calcula el tiempo en recorrer la distancia del track en linea recta sin elevaciones
//Despues se comprueba cual de los dos tiempos calculados es mayor
// Y el resultado seria la suma del mayor mas la mitad del menor
service.calcularDuracionPuntos= function (punto) {
  var hDesnivelSubida = (parseFloat(punto.desnivel)/400).toFixed(2);
  var hDesnivelBajada = (Math.abs(parseFloat(punto.desnivel)/600)).toFixed(2);
  if (punto.desnivel>0) {
    hDesnivelBajada = 0;
  } else {
    hDesnivelSubida = 0;
  }
  var distanciakm =punto.distancia/1000;
  var hDistanciaHori = (parseFloat(distanciakm)/parseFloat(service.velocidad)).toFixed(2);
  var hdesnivelGeneral = parseFloat(hDesnivelBajada)+parseFloat(hDesnivelSubida);
  if (hDistanciaHori>=hdesnivelGeneral ) {
    var menor = parseFloat(hdesnivelGeneral*0.5).toFixed(2);
    if (menor=="NaN") {
      menor=0;
    }
    var horasFinales = parseFloat(hDistanciaHori)+parseFloat(menor);
    var minutosDescanso = horasFinales*10;
    var minutosFInales = (horasFinales*60)+minutosDescanso;
    var duracionRecorrido = minutosFInales/60;
    return duracionRecorrido;
  } else {
    var menor = parseFloat(hDistanciaHori*0.5).toFixed(2);
    var horasFinales = parseFloat(hdesnivelGeneral)+parseFloat(menor);
    var minutosDescanso = horasFinales*10;
    var minutosFInales = (horasFinales*60)+minutosDescanso;
    var duracionRecorrido = minutosFInales/60;
    return duracionRecorrido;
  }
}
//Suma a la fecha del track activo la horas que revibe como parametro
service.calcularFecha = function (num,horas) {
  var segundos = parseFloat(horas)*parseFloat(3600);
  service.tracks[num].fecha.setSeconds(segundos);
}
//Calcula la fecha a partir de una velocidad
service.calcularFechaR = function (ritmo) {
  var smet = ritmo/1000;
  var min = service.distancia*smet;
  var segundos = parseInt(min*60);
  service.rutas[service.rutaActiva].fecha.setSeconds(segundos);
}
//Añade un cero a los minutos que son menores de 10
service.ordenarMinutos = function () {
  var minutos;
  if(service.tracks[service.trackActivo].fecha.getMinutes()<10)
      minutos="0"+service.tracks[service.trackActivo].fecha.getMinutes();
  else
      minutos=service.tracks[service.trackActivo].fecha.getMinutes();
  return minutos;
}
//Añade un cero a los minutos que son menores de 10
service.ordenarMinutosR = function () {
  var minutos;
  if(service.rutas[service.rutaActiva].fecha.getMinutes()<10)
      minutos="0"+service.rutas[service.rutaActiva].fecha.getMinutes();
  else
      minutos=service.rutas[service.rutaActiva].fecha.getMinutes();
  return minutos;
}
//Calcula todos los datos del track que son mostrados en la lista al lado de su nombre
service.calcularDatosTrack = function (id,punto,track) {
  if (id==0) {
    service.tracks[track].distancia = (parseFloat(service.tracks[track].distancia)+(parseFloat(punto.distancia)/1000)).toFixed(2);
    if (parseFloat(punto.desnivel)>=0) {
        service.tracks[track].desnivelP = (parseFloat(punto.desnivel) + parseFloat(  service.tracks[track].desnivelP)).toFixed(2);
    }else {
      service.tracks[track].desnivelN = (parseFloat(punto.desnivel) + parseFloat(service.tracks[track].desnivelN)).toFixed(2);
    }
    if (parseFloat(punto.elevacion)>parseFloat(service.tracks[track].elevMax)) {
      service.tracks[track].elevMax=parseFloat(punto.elevacion).toFixed(2);
    }
    if (parseFloat(punto.elevacion)<parseFloat(service.tracks[track].elevMin)) {
     service.tracks[track].elevMin=parseFloat(punto.elevacion).toFixed(2);
    }
  } else {
    service.rutas[track].distancia = (parseFloat(service.rutas[track].distancia)+(parseFloat(punto.distancia)/1000)).toFixed(2);
    if (parseFloat(punto.desnivel)>=0) {
        service.rutas[track].desnivelP = (parseFloat(punto.desnivel) + parseFloat(service.rutas[track].desnivelP)).toFixed(2);
    }else {
      service.rutas[track].desnivelN = (parseFloat(punto.desnivel) + parseFloat(service.rutas[track].desnivelN)).toFixed(2);
    }
    if (parseFloat(punto.elevacion)>parseFloat(service.rutas[track].elevMax)) {
      service.rutas[track].elevMax=parseFloat(punto.elevacion).toFixed(2);
    }
    if (parseFloat(punto.elevacion)<parseFloat(service.rutas[track].elevMin)) {
     service.rutas[track].elevMin=parseFloat(punto.elevacion).toFixed(2);
    }
  }
}
//FUncion que retorna true o false si la entidad activa actual ya tiene
// una polilinea asignada o no la tiene
service.tienePolyF = function () {
  if (service.isTrack) {
    return service.tienePoly[service.trackActivo];
  } else {
    return service.tienePolyR[service.rutaActiva];
  }
}
//FUncion que retorna true o false si la entidad activa actual ya tiene
// una polilinea asignada o no la tiene
service.tienePolyFR = function (num) {
  if (service.isTrack) {
    return service.tienePoly[num];
  } else {
    return service.tienePolyR[num];
  }
}
//Cambia el color de las polilineas de los track y las rutas
service.colorPoly= function () {
  if (service.isTrack) {
    return '#3D04F9';
  } else {
    return '#C004F9';
  }
}
//Añade una polilinea a la entidad que esta activa actualmente
service.addPolyR = function (poly,num) {
  if (service.isTrack) {

    service.polyLineas[num]= poly;

    service.tienePoly[num]=true;
  } else {

    service.polyLineasR[num]= poly;

    service.tienePolyR[num]=true;
  }
}
//Añade una polilinea a la entidad que esta activa actualmente
service.addPoly = function (poly) {
  if (service.isTrack) {

    service.polyLineas[service.trackActivo]= poly;

    service.tienePoly[service.trackActivo]=true;
  } else {

    service.polyLineasR[service.rutaActiva]= poly;

    service.tienePolyR[service.rutaActiva]=true;
  }
}
//devuelve la polilinea de la entidad activa actualmente
service.getPolyR = function (num) {
  if (service.isTrack) {

    return service.polyLineas[num];
  } else {


    return service.polyLineasR[num];
  }
}
//devuelve la polilinea de la entidad activa actualmente
service.getPoly = function () {
  if (service.isTrack) {

    return service.polyLineas[service.trackActivo];
  } else {


    return service.polyLineasR[service.rutaActiva];
  }
}

//Actualiza los puntos del track activo
service.actualizarPuntosT = function() {

      if (service.tracks.length>0){
      service.puntosTrackActivo= service.tracks[service.trackActivo]["puntos"];
      service.actualizarPuntos();
      }
}

//Actualiza los puntos de la ruta activa
service.actualizarPuntosR = function() {
    if (service.rutas.length>0){
       service.puntosTrackActivo= service.rutas[service.rutaActiva]["puntos"];
       service.actualizarPuntos();
     }
}
//Actualiza una lista de distacias que es necesaria para actualizar la grafica
  service.actualizarDistancias= function () {
    service.distancias.length = 0;
    for (var item in service.puntosTrackActivo) {
      service.distancias.push(service.puntosTrackActivo[item]['distancia']);

    }
    return service.distancias;
  }
  //Actualiza una lista de elevaciones(de los puntos) que es necesaria para la grafica
  service.actualizarElevaciones= function () {
    service.elevaciones.length = 0;
    for (var item in service.puntosTrackActivo) {
      service.elevaciones.push(service.puntosTrackActivo[item]['elevacion']);
    }
    return service.elevaciones;
  }

  //LLama a las dos funciones anteriores
  service.actualizarPuntos= function () {
    service.elevaciones2 = service.actualizarElevaciones();
    service.distancias2 = service.actualizarDistancias();
    service.calcularPuntosGrafico();
  }
  service.calcularPuntosGrafico = function () {
      var distancia = 0;
      service.puntosGrafico.length = 0;
      for(var item in service.distancias){
        distancia = parseFloat(distancia )+ parseFloat(service.distancias[item]);
      var obj = {x:parseFloat(distancia/1000).toFixed(2),y:service.elevaciones[item]};
      service.puntosGrafico.push(obj);
      }
  }
  service.getPuntosGrafico = function () {
      return service.puntosGrafico;
  }
  //funcion que crea una entidad
  service.crear = function (id) {
    //Boolean necesario para en caso de que no haya ninguna entidad
    // creada no se activara el evento click del mapa

    switch (id) {
      case 0:
      service.hayEntidadesCreadas = true;
        service.entidad = {
          nombre: "Nuevo-Track"+service.tracks.length,
          distancia: 0,
          desnivelP: 0,
          desnivelN:0,
          elevMax:0,
          elevMin:9999999,
          puntos:[],
          numero: service.tracks.length,
          fecha: new Date(),
          duracionIda:0,
          duracionVuelta:0,
        };

        service.tracks.push(service.entidad);
        service.tienePoly.push(false);
        service.isTrack = true;
        service.isWaypoint = false;
        break;
      case 1:
      service.hayEntidadesCreadas = true;
      service.entidad = {
        nombre: "Nueva-Ruta"+service.rutas.length,
        distancia: 0,
        desnivelP: 0,
        desnivelN:0,
        elevMax:0,
        elevMin:9999999,
        puntos:[],
        numero:service.rutas.length,
        fecha: new Date(),
        duracion:0,
      };
      service.rutas.push(service.entidad);
      service.tienePolyR.push(false);
      service.isTrack = false;
      service.isWaypoint = false;
        break;
      case 2:
      service.entidad = {
        nombre: "Nuevo-Waypoint"+service.waypoints.length,
        latitud: service.latitud,
        longitud:service.longitud,
        elevacion:service.elevacion,
        numero: service.waypoints.length,
        descripcion:"Añade una descripción",
      };
      service.waypoints.push(service.entidad);
      service.isWaypoint = true;
      service.isTrack = false;
        break;
    }
    return service.entidad;
  }

    service.calcularDesnivelR = function ()
    { if(service.modoRecorte1 == true ){
      if(service.
              rutas[service.rutas.length-2].puntos.length>0)
        return (service.elevacion-service.
            rutas[service.rutas.length-2].puntos[service.
            rutas[service.rutas.length-2].puntos.length-1].elevacion).toFixed(2);
      else
        return 0;
    }else if(service.modoRecorte2 == true ){
      if(service.
              rutas[service.rutas.length-1].puntos.length>0)
        return (service.elevacion-service.
            rutas[service.rutas.length-1].puntos[service.
            rutas[service.rutas.length-1].puntos.length-1].elevacion).toFixed(2);
      else
        return 0;
    }else if(service.puntosTrackActivo.length>0){
        return (service.elevacion-service.puntosTrackActivo[service.puntosTrackActivo.length-1].elevacion).toFixed(2);}
    else {
        return 0;
    }
    }
  service.calcularDesnivel = function ()
  { if(service.modoRecorte1 == true ){
      if(service.
          tracks[service.tracks.length-2].puntos.length>0)
      return (service.elevacion-service.
          tracks[service.tracks.length-2].puntos[service.
          tracks[service.tracks.length-2].puntos.length-1].elevacion).toFixed(2);
      else
        return 0;
  }else if(service.modoRecorte2 == true  ){
    if(service.
            tracks[service.tracks.length-1].puntos.length>0)
      return (service.elevacion-service.
          tracks[service.tracks.length-1].puntos[service.
          tracks[service.tracks.length-1].puntos.length-1].elevacion).toFixed(2);
    else
      return 0;
  }else if(service.puntosTrackActivo.length>0){
    return (service.elevacion-service.puntosTrackActivo[service.puntosTrackActivo.length-1].elevacion).toFixed(2);}
    else {
      return 0;
    }
  }
  //Añade un punto a la entidad activada actualmente
  service.anadirPunto = function (id,num,latitud,longitud) {

    switch (id) {
      case 0:
      service.punto = {
        numero:0,
        latitud:latitud,
        longitud: longitud,
        elevacion: service.elevacion,
        fecha:service.tracks[num].fecha.getDate()+"/"+service.tracks[num].fecha.getMonth()+"/"+service.tracks[num].fecha.getFullYear(),
        hora:service.tracks[num].fecha.getHours()+":"+service.ordenarMinutos(),
        desnivel:service.calcularDesnivel(),
        distancia: service.distancia,
        velocidad: 4,
      }
        if (service.tracks.length>0){
          service.punto.numero = service.tracks[num]["puntos"].length;
        service.tracks[num]["puntos"].push(service.punto);
        service.calcularDatosTrack(0,service.punto,num);
        service.tracks[num].duracionIda = parseFloat(service.calcularDuracion(true,num)).toFixed(2);
        service.tracks[num].duracionVuelta = parseFloat(service.calcularDuracion(false,num)).toFixed(2);
        service.calcularFecha(num,service.calcularDuracionPuntos(service.punto));
        service.tracks[num]["puntos"][service.tracks[num]["puntos"].length-1].fecha=service.tracks[num].fecha.getDate()+"/"+service.tracks[num].fecha.getMonth()+"/"+service.tracks[num].fecha.getFullYear();
        service.tracks[num]["puntos"][service.tracks[num]["puntos"].length-1].hora =service.tracks[num].fecha.getHours()+":"+service.ordenarMinutos();
      }
        break;
      case 1:
      service.calcularFechaR(15);
      service.punto = {
        numero:0,
        latitud:latitud,
        longitud: longitud,
        elevacion: service.elevacion,
        fecha:service.rutas[service.rutaActiva].fecha.getDate()+"/"+service.rutas[service.rutaActiva].fecha.getMonth()+"/"+service.rutas[service.rutaActiva].fecha.getFullYear(),
        hora:service.rutas[service.rutaActiva].fecha.getHours()+":"+service.ordenarMinutosR(),
        desnivel:service.calcularDesnivelR(),
        distancia: service.distancia,
        velocidad: 4,
      }
          if (service.rutas.length>0){
            service.punto.numero = service.rutas[num]["puntos"].length;
            service.rutas[num]["puntos"].push(service.punto);
            service.calcularDatosTrack(1,service.punto,service.rutaActiva);
      }
        break;
    }

    return service.punto;
  }


}


})();
