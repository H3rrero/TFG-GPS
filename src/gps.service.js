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
  service.ver = true;
  service.modoInsertarWp = false;
  service.elevacionPtAnadido=0;
  service.segundosAnadir = 0;
  service.clicTabGraf = false;
  service.cuadricula = true;
  service.fin = false;
  service.mapas = [];
  service.colorGrafica = '#0062ff';
  service.infowindow2;
  service.ownerDo;
    service.coords = false;
    service.myIcon = {
        path : google.maps.SymbolPath.CIRCLE,
        scale : 3,
        strokeColor : '#000000',
        fillColor : "yellow",
        strokeOpacity : 1,
        strokeWeight : 2
    };
    service.myIconR = {
        path : google.maps.SymbolPath.CIRCLE,
        scale : 3,
        strokeColor : '#0C090C',
        fillColor : "yellow",
        strokeOpacity : 1,
        strokeWeight : 3
    };
    service.myIconRIni = {
        path : google.maps.SymbolPath.CIRCLE,
        scale : 6,
        strokeColor : '#FE0006',
        fillColor : "yellow",
        strokeOpacity : 1,
        strokeWeight : 3
    };
    service.myIconRFin = {
        path : google.maps.SymbolPath.CIRCLE,
        scale : 6,
        strokeColor : '#033FC9',
        fillColor : "yellow",
        strokeOpacity : 1,
        strokeWeight : 3
    };


    service.changedColor = function (color) {
        console.log(color);
        var lineSymbolarrow = {
            path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor : color,
            strokeOpacity : 0.7,
            strokeWeight : 2.9,
            scale : 2.7,

        };
        var arrow = {
            icon : lineSymbolarrow,
            offset : '50%',
            repeat : '80px'
        };
        service.getPoly().setOptions({
            strokeColor: color,
            icons : [arrow],
        });
    };
    service.superponerPolylineaR = function () {
        for(var i in service.polyLineasR){
            service.polyLineasR[i].setOptions({
                zIndex:1
            });
        }
        if(service.getPoly() != undefined){
        service.getPoly().setOptions({
            zIndex:4
        });}
    };
    service.superponerPolylinea = function () {
      for(var i in service.polyLineas){
          service.polyLineas[i].setOptions({
              zIndex:1
          });
      }
        if(service.getPoly() != undefined){
        service.getPoly().setOptions({
            zIndex:4
        });}

    };

    service.aleatorio= function(inferior,superior){ 
   var numPosibilidades = superior - inferior 
   var aleat = Math.random() * numPosibilidades 
   aleat = Math.floor(aleat) 
   return parseInt(inferior) + aleat 
}
   service.colorAleatorio= function (){ 
   var hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F") 
   var color_aleatorio = "#"; 
   for (var i=0;i<6;i++){ 
      var posarray = service.aleatorio(0,hexadecimal.length) 
      color_aleatorio += hexadecimal[posarray] 
   } 
   return color_aleatorio 
}
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
    };
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
};

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
      service.elevacionP = service.elevacionP.toFixed(2);
      //EL modo segundo recorte nos viene que ni pintado para esta situación
      service.modoRecorte2=true;

      //Simulamos el click para que se añada el punto al nuevo track y se pinte en el mapa
      google.maps.event.trigger(service.mapa, 'click');
    }}
    //Desactivamos los modos activados durante este metodo
    service.modoInvertir = false;
    service.modoRecorte2 = false;

      var lineSymbolarrow = {
          path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          strokeColor : service.colorPoly(),
          strokeOpacity : 0.7,
          strokeWeight : 2.9,
          scale : 2.7
      };
     var arrow = {
          icon : lineSymbolarrow,
          offset : '50%',
          repeat : '80px'
      };
    service.getPoly().setOptions({
        strokeColor:  lineSymbolarrow.strokeColor,
        icons : [arrow]
    });
    
  };
    service.importXMLRuta = function () {
        var puntos=service.xmlImportado.getElementsByTagName("rtept");
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

        var lineSymbolarrow = {
            path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor : service.colorPoly(),
            strokeOpacity : 0.7,
            strokeWeight : 2.9,
            scale : 2.7
        };
        var arrow = {
            icon : lineSymbolarrow,
            offset : '50%',
            repeat : '80px'
        };
        service.getPoly().setOptions({
            strokeColor: lineSymbolarrow.strokeColor,
            icons : [arrow]
        });
    };

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
        service.waypoints[item].nombre+"</name>\n"+"\t\t<desc>"+service.waypoints[item].descripcion+"</desc>\n"
        +"\t\t<sym>"+"generic"+"</sym>\n"+"\t\t<type>"+"Generic"+"</type>\n"+"\t</wpt>\n";
    }
    xml = xml+"</gpx>";
    return xml;
  };

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



        xml = xml+"\t<rte>\n"+"\t\t<name>"+service.rutas[service.rutaActiva].nombre+"</name>\n";
        //Se añade la ruta al gpx
        //Se añaden los puntos de la ruta a gpx como waypoints
        for (var item in service.rutas[service.rutaActiva].puntos) {
            xml = xml + "\t<rtept lat="+'"'+service.rutas[service.rutaActiva].puntos[item].latitud+'"'
                +" lon="+'"'+service.rutas[service.rutaActiva].puntos[item].longitud+'"'+">\n"+"\t\t<ele>"+
                service.rutas[service.rutaActiva].puntos[item].elevacion+"</ele>\n"+"\t\t<name>"+
                "Waypoint de ruta Nº"+item+"</name>\n"+"\t\t<desc>"+"prueba"+"</desc>\n"
                +"\t\t<sym>"+"generic"+"</sym>\n"+"\t\t<type>"+"Generic"+"</type>\n"+"\t</rtept>\n";
        }
        xml = xml+"\t</rte>\n"+"</gpx>";
  }
    return xml;
  };

  service.anadirPuntoRuta2 = function (marker) {
      setTimeout(function () {

          service.puntoN.elevacion = service.elevacionPtAnadido;
          var cooPAnterior = new google.maps.LatLng(service.rutas[service.rutaActiva]["puntos"][(parseInt(service.puntoElegido))].latitud
              , service.rutas[service.rutaActiva]["puntos"][(parseInt(service.puntoElegido))].longitud);
          var coorPSelec = new google.maps.LatLng(service.puntoN.latitud,service.puntoN.longitud);
          var cooPPosterior = new google.maps.LatLng(service.rutas[service.rutaActiva]["puntos"][(parseInt(service.puntoElegido)+1)].latitud
              ,service.rutas[service.rutaActiva]["puntos"][(parseInt(service.puntoElegido)+1)].longitud);
          service.puntoN.distancia= google.maps.geometry.spherical.computeDistanceBetween(cooPAnterior , coorPSelec).toFixed(2);
          service.rutas[service.rutaActiva]["puntos"][(parseInt(service.puntoElegido)+1)].distancia=
              google.maps.geometry.spherical.computeDistanceBetween(coorPSelec , cooPPosterior).toFixed(2);
          //Calculamos los nuevos desniveles
          service.puntoN.desnivel = (service.puntoN.elevacion-service.rutas[service.rutaActiva]["puntos"][(parseInt(service.puntoElegido))].elevacion).toFixed(2);
          service.rutas[service.rutaActiva]["puntos"][parseInt(service.puntoElegido)+1].desnivel = (service.rutas
              [service.rutaActiva]["puntos"][parseInt(service.puntoElegido)+1].elevacion-service.puntoN.elevacion).toFixed(2);
          service.getPoly().getPath().insertAt(parseInt(service.puntoElegido)+1,new google.maps.LatLng(service.puntoN.latitud,service.puntoN.longitud));
          service.wpRta[service.rutaActiva].splice(parseInt(service.puntoElegido)+1,0,marker);
          service.rutas[service.rutaActiva].puntos.splice(parseInt(service.puntoElegido)+1,0,service.puntoN);
          service.puntosTrackActivo = service.rutas[service.rutaActiva].puntos;

          //Actulizamos el track
          service.rutas[service.rutaActiva].fecha = new Date();
          service.rutas[service.rutaActiva].distancia = 0;
          service.rutas[service.rutaActiva].desnivelP = 0;
          service.rutas[service.rutaActiva].desnivelN = 0;
          service.rutas[service.rutaActiva].elevMax = 0;
          service.rutas[service.rutaActiva].elevMin = 9999999;
          for (var i in service.rutas[service.rutaActiva]["puntos"]) {
              service.rutas[service.rutaActiva]["puntos"][i].numero=i;
              service.calcularDatosTrack(1, service.rutas[service.rutaActiva]["puntos"][i], service.rutaActiva);
          }
      },10);

  };

    service.moverPuntoRuta2 = function(posicion,longitud,latitud,elevacion){
        service.getPoly().getPath().setAt(posicion, new google.maps.LatLng(latitud,longitud));
        service.rutas[service.rutaActiva]["puntos"][posicion].latitud = latitud;
        service.rutas[service.rutaActiva]["puntos"][posicion].longitud = longitud;
        service.rutas[service.rutaActiva]["puntos"][posicion].elevacion = elevacion;
        service.puntosTrackActivo = service.rutas[service.rutaActiva]["puntos"];
        //Calcular las nuevas distancias entre el punto que se ha movido y sus hermanos
        if(posicion == 0){
            var coorPSelec = new google.maps.LatLng(latitud,longitud);
            var cooPPosterior = new google.maps.LatLng(service.rutas[service.rutaActiva]["puntos"][(parseInt(posicion)+1)].latitud
                ,service.rutas[service.rutaActiva]["puntos"][(parseInt(posicion)+1)].longitud);
            service.rutas[service.rutaActiva]["puntos"][(parseInt(posicion)+1)].distancia=
                google.maps.geometry.spherical.computeDistanceBetween(coorPSelec , cooPPosterior).toFixed(2);
            //Calculamos los nuevos desniveles
            service.rutas[service.rutaActiva]["puntos"][parseInt(posicion)+1].desnivel = (service.rutas
                [service.rutaActiva]["puntos"][parseInt(posicion)+1].elevacion-elevacion).toFixed(2);
        }else if(posicion == service.rutas[service.rutaActiva]["puntos"].length-1){
            var cooPAnterior = new google.maps.LatLng(service.rutas[service.rutaActiva]["puntos"][(parseInt(posicion)-1)].latitud
                ,service.rutas[service.rutaActiva]["puntos"][(parseInt(posicion)-1)].longitud);
            var coorPSelec = new google.maps.LatLng(latitud,longitud);
            service.rutas[service.rutaActiva]["puntos"][posicion].distancia=
                google.maps.geometry.spherical.computeDistanceBetween(cooPAnterior , coorPSelec).toFixed(2);
            //Calculamos los nuevos desniveles
            service.rutas[service.rutaActiva]["puntos"][posicion].desnivel = (elevacion-service.rutas
                [service.rutaActiva]["puntos"][(parseInt(posicion)-1)].elevacion).toFixed(2);
        }else{
            var cooPAnterior = new google.maps.LatLng(service.rutas[service.rutaActiva]["puntos"][(parseInt(posicion)-1)].latitud
                ,service.rutas[service.rutaActiva]["puntos"][(parseInt(posicion)-1)].longitud);
            var coorPSelec = new google.maps.LatLng(latitud,longitud);
            var cooPPosterior = new google.maps.LatLng(service.rutas[service.rutaActiva]["puntos"][(parseInt(posicion)+1)].latitud
                ,service.rutas[service.rutaActiva]["puntos"][(parseInt(posicion)+1)].longitud);
            service.rutas[service.rutaActiva]["puntos"][posicion].distancia=
                google.maps.geometry.spherical.computeDistanceBetween(cooPAnterior , coorPSelec).toFixed(2);
            service.rutas[service.rutaActiva]["puntos"][(parseInt(posicion)+1)].distancia=
                google.maps.geometry.spherical.computeDistanceBetween(coorPSelec , cooPPosterior).toFixed(2);
            //Calculamos los nuevos desniveles
            service.rutas[service.rutaActiva]["puntos"][posicion].desnivel = (elevacion-service.rutas
                [service.rutaActiva]["puntos"][(parseInt(posicion)-1)].elevacion).toFixed(2);
            service.rutas[service.rutaActiva]["puntos"][parseInt(posicion)+1].desnivel = (service.rutas
                [service.rutaActiva]["puntos"][parseInt(posicion)+1].elevacion-elevacion).toFixed(2);}
        service.rutas[service.rutaActiva].fecha = new Date();
        service.rutas[service.rutaActiva].distancia=0;
        service.rutas[service.rutaActiva].desnivelP= 0;
        service.rutas[service.rutaActiva].desnivelN=0;
        service.rutas[service.rutaActiva].elevMax=0;
        service.rutas[service.rutaActiva].elevMin=9999999;
        for(var i in service.rutas[service.rutaActiva]["puntos"]){
            service.calcularDatosTrack(1,service.rutas[service.rutaActiva]["puntos"][i],service.rutaActiva);
        }

        service.actualizarPuntosR();
    };

    service.moverPuntoTrack2 = function(posicion,longitud,latitud,elevacion){
        service.getPoly().getPath().setAt(posicion, new google.maps.LatLng(latitud,longitud));
        service.tracks[service.trackActivo]["puntos"][posicion].latitud = latitud;
        service.tracks[service.trackActivo]["puntos"][posicion].longitud = longitud;
        service.tracks[service.trackActivo]["puntos"][posicion].elevacion = elevacion;
        service.puntosTrackActivo = service.tracks[service.trackActivo]["puntos"];
        //Calcular las nuevas distancias entre el punto que se ha movido y sus hermanos
        if(posicion == 0){
            var coorPSelec = new google.maps.LatLng(latitud,longitud);
            var cooPPosterior = new google.maps.LatLng(service.tracks[service.trackActivo]["puntos"][(parseInt(posicion)+1)].latitud
                ,service.tracks[service.trackActivo]["puntos"][(parseInt(posicion)+1)].longitud);
            service.tracks[service.trackActivo]["puntos"][(parseInt(posicion)+1)].distancia=
                google.maps.geometry.spherical.computeDistanceBetween(coorPSelec , cooPPosterior).toFixed(2);
            //Calculamos los nuevos desniveles
            service.tracks[service.trackActivo]["puntos"][parseInt(posicion)+1].desnivel = (service.tracks
                [service.trackActivo]["puntos"][parseInt(posicion)+1].elevacion-elevacion).toFixed(2);
        }else if(posicion == service.tracks[service.trackActivo]["puntos"].length-1){
            var cooPAnterior = new google.maps.LatLng(service.tracks[service.trackActivo]["puntos"][(parseInt(posicion)-1)].latitud
                ,service.tracks[service.trackActivo]["puntos"][(parseInt(posicion)-1)].longitud);
            var coorPSelec = new google.maps.LatLng(latitud,longitud);
            service.tracks[service.trackActivo]["puntos"][posicion].distancia=
                google.maps.geometry.spherical.computeDistanceBetween(cooPAnterior , coorPSelec).toFixed(2);
            //Calculamos los nuevos desniveles
            service.tracks[service.trackActivo]["puntos"][posicion].desnivel = (elevacion-service.tracks
                [service.trackActivo]["puntos"][(parseInt(posicion)-1)].elevacion).toFixed(2);
        }else{
        var cooPAnterior = new google.maps.LatLng(service.tracks[service.trackActivo]["puntos"][(parseInt(posicion)-1)].latitud
                                                ,service.tracks[service.trackActivo]["puntos"][(parseInt(posicion)-1)].longitud);
        var coorPSelec = new google.maps.LatLng(latitud,longitud);
        var cooPPosterior = new google.maps.LatLng(service.tracks[service.trackActivo]["puntos"][(parseInt(posicion)+1)].latitud
            ,service.tracks[service.trackActivo]["puntos"][(parseInt(posicion)+1)].longitud);
        service.tracks[service.trackActivo]["puntos"][posicion].distancia=
            google.maps.geometry.spherical.computeDistanceBetween(cooPAnterior , coorPSelec).toFixed(2);
        service.tracks[service.trackActivo]["puntos"][(parseInt(posicion)+1)].distancia=
            google.maps.geometry.spherical.computeDistanceBetween(coorPSelec , cooPPosterior).toFixed(2);
        //Calculamos los nuevos desniveles
        service.tracks[service.trackActivo]["puntos"][posicion].desnivel = (elevacion-service.tracks
                                                    [service.trackActivo]["puntos"][(parseInt(posicion)-1)].elevacion).toFixed(2);
        service.tracks[service.trackActivo]["puntos"][parseInt(posicion)+1].desnivel = (service.tracks
                                    [service.trackActivo]["puntos"][parseInt(posicion)+1].elevacion-elevacion).toFixed(2);}
        service.tracks[service.trackActivo].fecha = new Date();
        service.tracks[service.trackActivo].distancia=0;
            service.tracks[service.trackActivo].desnivelP= 0;
            service.tracks[service.trackActivo].desnivelN=0;
            service.tracks[service.trackActivo].elevMax=0;
            service.tracks[service.trackActivo].elevMin=9999999;
            service.tracks[service.trackActivo].duracionIda=0;
            service.tracks[service.trackActivo].duracionVuelta=0;
        for(var i in service.tracks[service.trackActivo]["puntos"]){
            service.calcularDatosTrack(0,service.tracks[service.trackActivo]["puntos"][i],service.trackActivo);
            service.tracks[service.trackActivo].duracionIda = parseFloat(service.calcularDuracion(true,service.trackActivo)).toFixed(2);
            service.tracks[service.trackActivo].duracionVuelta = parseFloat(service.calcularDuracion(false,service.trackActivo)).toFixed(2);
            service.calcularFecha(service.trackActivo,service.calcularDuracionPuntos(service.tracks[service.trackActivo]["puntos"][i]));
            service.tracks[service.trackActivo]["puntos"][i].fecha
                =service.tracks[service.trackActivo].fecha.getDate()+"/"+service.tracks[service.trackActivo].fecha.getMonth()+"/"+service.tracks[service.trackActivo].fecha.getFullYear();
            service.tracks[service.trackActivo]["puntos"][i].hora
                =service.tracks[service.trackActivo].fecha.getHours()+":"+service.ordenarMinutos();
        }

        service.actualizarPuntosT();
    };


  service.anadirPuntoTrack2 = function (marker) {


      setTimeout(function () {

          service.puntoN.elevacion = service.elevacionPtAnadido;
          var cooPAnterior = new google.maps.LatLng(service.tracks[service.trackActivo]["puntos"][(parseInt(service.puntoElegido))].latitud
              , service.tracks[service.trackActivo]["puntos"][(parseInt(service.puntoElegido))].longitud);
          var coorPSelec = new google.maps.LatLng(service.puntoN.latitud,service.puntoN.longitud);
          var cooPPosterior = new google.maps.LatLng(service.tracks[service.trackActivo]["puntos"][(parseInt(service.puntoElegido)+1)].latitud
              ,service.tracks[service.trackActivo]["puntos"][(parseInt(service.puntoElegido)+1)].longitud);
          service.puntoN.distancia= google.maps.geometry.spherical.computeDistanceBetween(cooPAnterior , coorPSelec).toFixed(2);
          service.tracks[service.trackActivo]["puntos"][(parseInt(service.puntoElegido)+1)].distancia=
              google.maps.geometry.spherical.computeDistanceBetween(coorPSelec , cooPPosterior).toFixed(2);
          //Calculamos los nuevos desniveles
          service.puntoN.desnivel = (service.puntoN.elevacion-service.tracks[service.trackActivo]["puntos"][(parseInt(service.puntoElegido))].elevacion).toFixed(2);
          service.tracks[service.trackActivo]["puntos"][parseInt(service.puntoElegido)+1].desnivel = (service.tracks
              [service.trackActivo]["puntos"][parseInt(service.puntoElegido)+1].elevacion-service.puntoN.elevacion).toFixed(2);
          service.getPoly().getPath().insertAt(parseInt(service.puntoElegido)+1,new google.maps.LatLng(service.puntoN.latitud,service.puntoN.longitud));
          service.markersT[service.trackActivo].splice(parseInt(service.puntoElegido)+1,0,marker);
          service.tracks[service.trackActivo].puntos.splice(parseInt(service.puntoElegido)+1,0,service.puntoN);
          service.puntosTrackActivo = service.tracks[service.trackActivo].puntos;

          //Actulizamos el track
          service.tracks[service.trackActivo].fecha = new Date();
          service.tracks[service.trackActivo].distancia = 0;
          service.tracks[service.trackActivo].desnivelP = 0;
          service.tracks[service.trackActivo].desnivelN = 0;
          service.tracks[service.trackActivo].elevMax = 0;
          service.tracks[service.trackActivo].elevMin = 9999999;
          service.tracks[service.trackActivo].duracionIda = 0;
          service.tracks[service.trackActivo].duracionVuelta = 0;
          for (var i in service.tracks[service.trackActivo]["puntos"]) {
              service.tracks[service.trackActivo]["puntos"][i].numero=i;
              service.calcularDatosTrack(0, service.tracks[service.trackActivo]["puntos"][i], service.trackActivo);
              service.tracks[service.trackActivo].duracionIda = parseFloat(service.calcularDuracion(true, service.trackActivo)).toFixed(2);
              service.tracks[service.trackActivo].duracionVuelta = parseFloat(service.calcularDuracion(false, service.trackActivo)).toFixed(2);
              service.calcularFecha(service.trackActivo, service.calcularDuracionPuntos(service.tracks[service.trackActivo]["puntos"][i]));
              service.tracks[service.trackActivo]["puntos"][i].fecha
                  = service.tracks[service.trackActivo].fecha.getDate() + "/" + service.tracks[service.trackActivo].fecha.getMonth() + "/" + service.tracks[service.trackActivo].fecha.getFullYear();
              service.tracks[service.trackActivo]["puntos"][i].hora
                  = service.tracks[service.trackActivo].fecha.getHours() + ":" + service.ordenarMinutos();
          }
      },10);





  };


    service.eliminarPuntoRuta2 = function () {
        service.getPoly().getPath().removeAt(service.puntoElegido);
        service.wpRta[service.rutaActiva][service.puntoElegido].setMap(null);
        service.wpRta[service.rutaActiva].splice(service.puntoElegido,1);
        service.rutas[service.rutaActiva].puntos.splice(service.puntoElegido,1);
        service.puntosTrackActivo = service.rutas[service.rutaActiva].puntos;
        if(service.rutas[service.rutaActiva].puntos.length>0){
            if (service.puntoElegido == 0) {

                service.wpRta[service.rutaActiva][service.puntoElegido].setIcon(service.myIconRIni);
                service.wpRta[service.rutaActiva][service.puntoElegido].setVisible(true);
                service.rutas[service.rutaActiva]["puntos"][service.puntoElegido].distancia = 0;
                //Calculamos los nuevos desniveles
                service.rutas[service.rutaActiva]["puntos"][service.puntoElegido].desnivel = 0;
            } else if ((parseInt(service.puntoElegido) - 1) == service.rutas[service.rutaActiva]["puntos"].length - 1 &&
                service.rutas[service.rutaActiva].puntos.length>1) {
                service.wpRta[service.rutaActiva][service.rutas[service.rutaActiva]["puntos"].length - 1].setIcon(service.myIconRFin);
                service.wpRta[service.rutaActiva][service.rutas[service.rutaActiva]["puntos"].length - 1].setVisible(true);

            } else if( service.rutas[service.rutaActiva].puntos.length>1){
                var cooPAnterior = new google.maps.LatLng(service.rutas[service.rutaActiva]["puntos"][(parseInt(service.puntoElegido) - 1)].latitud
                    , service.rutas[service.rutaActiva]["puntos"][(parseInt(service.puntoElegido) - 1)].longitud);
                var coorPSelec = new google.maps.LatLng(service.rutas[service.rutaActiva]["puntos"][(parseInt(service.puntoElegido))].latitud
                    , service.rutas[service.rutaActiva]["puntos"][(parseInt(service.puntoElegido))].longitud);

                service.rutas[service.rutaActiva]["puntos"][service.puntoElegido].distancia =
                    google.maps.geometry.spherical.computeDistanceBetween(cooPAnterior, coorPSelec).toFixed(2);
                //Calculamos los nuevos desniveles
                service.rutas[service.rutaActiva]["puntos"][service.puntoElegido].desnivel = (service.rutas[service.rutaActiva]
                    ["puntos"][(parseInt(service.puntoElegido))].elevacion - service.rutas[service.rutaActiva]["puntos"][(parseInt(service.puntoElegido) - 1)].elevacion).toFixed(2);
            }
            service.rutas[service.rutaActiva].fecha = new Date();
            service.rutas[service.rutaActiva].distancia = 0;
            service.rutas[service.rutaActiva].desnivelP = 0;
            service.rutas[service.rutaActiva].desnivelN = 0;
            service.rutas[service.rutaActiva].elevMax = 0;
            service.rutas[service.rutaActiva].elevMin = 9999999;
            for (var i in service.rutas[service.rutaActiva]["puntos"]) {
                service.calcularDatosTrack(1, service.rutas[service.rutaActiva]["puntos"][i], service.rutaActiva);
            }
            service.actualizarPuntosR();
        }else{
            service.wpRta[service.rutaActiva]=undefined;
        }
    };
    service.eliminarPuntoTrack2 = function () {
        service.getPoly().getPath().removeAt(service.puntoElegido);
        service.markersT[service.trackActivo][service.puntoElegido].setMap(null);
        service.markersT[service.trackActivo].splice(service.puntoElegido, 1);
        service.tracks[service.trackActivo].puntos.splice(service.puntoElegido, 1);
        service.puntosTrackActivo = service.tracks[service.trackActivo].puntos;
        if(service.tracks[service.trackActivo].puntos.length>0){
        if (service.puntoElegido == 0) {

            service.markersT[service.trackActivo][service.puntoElegido].setIcon("img/icono.png");
            service.markersT[service.trackActivo][service.puntoElegido].setVisible(true);
            service.tracks[service.trackActivo]["puntos"][service.puntoElegido].distancia = 0;
            //Calculamos los nuevos desniveles
            service.tracks[service.trackActivo]["puntos"][service.puntoElegido].desnivel = 0;
        } else if ((parseInt(service.puntoElegido) - 1) == service.tracks[service.trackActivo]["puntos"].length - 1 &&
             service.tracks[service.trackActivo].puntos.length>1) {
            service.markersT[service.trackActivo][service.tracks[service.trackActivo]["puntos"].length - 1].setIcon("img/iconoFin.png");
            service.markersT[service.trackActivo][service.tracks[service.trackActivo]["puntos"].length - 1].setVisible(true);

        } else if( service.tracks[service.trackActivo].puntos.length>1){
            var cooPAnterior = new google.maps.LatLng(service.tracks[service.trackActivo]["puntos"][(parseInt(service.puntoElegido) - 1)].latitud
                , service.tracks[service.trackActivo]["puntos"][(parseInt(service.puntoElegido) - 1)].longitud);
            var coorPSelec = new google.maps.LatLng(service.tracks[service.trackActivo]["puntos"][(parseInt(service.puntoElegido))].latitud
                , service.tracks[service.trackActivo]["puntos"][(parseInt(service.puntoElegido))].longitud);

            service.tracks[service.trackActivo]["puntos"][service.puntoElegido].distancia =
                google.maps.geometry.spherical.computeDistanceBetween(cooPAnterior, coorPSelec).toFixed(2);
            //Calculamos los nuevos desniveles
            service.tracks[service.trackActivo]["puntos"][service.puntoElegido].desnivel = (service.tracks[service.trackActivo]
                ["puntos"][(parseInt(service.puntoElegido))].elevacion - service.tracks[service.trackActivo]["puntos"][(parseInt(service.puntoElegido) - 1)].elevacion).toFixed(2);
        }
        service.tracks[service.trackActivo].fecha = new Date();
        service.tracks[service.trackActivo].distancia = 0;
        service.tracks[service.trackActivo].desnivelP = 0;
        service.tracks[service.trackActivo].desnivelN = 0;
        service.tracks[service.trackActivo].elevMax = 0;
        service.tracks[service.trackActivo].elevMin = 9999999;
        service.tracks[service.trackActivo].duracionIda = 0;
        service.tracks[service.trackActivo].duracionVuelta = 0;
        for (var i in service.tracks[service.trackActivo]["puntos"]) {
            service.calcularDatosTrack(0, service.tracks[service.trackActivo]["puntos"][i], service.trackActivo);
            service.tracks[service.trackActivo].duracionIda = parseFloat(service.calcularDuracion(true, service.trackActivo)).toFixed(2);
            service.tracks[service.trackActivo].duracionVuelta = parseFloat(service.calcularDuracion(false, service.trackActivo)).toFixed(2);
            service.calcularFecha(service.trackActivo, service.calcularDuracionPuntos(service.tracks[service.trackActivo]["puntos"][i]));
            service.tracks[service.trackActivo]["puntos"][i].fecha
                = service.tracks[service.trackActivo].fecha.getDate() + "/" + service.tracks[service.trackActivo].fecha.getMonth() + "/" + service.tracks[service.trackActivo].fecha.getFullYear();
            service.tracks[service.trackActivo]["puntos"][i].hora
                = service.tracks[service.trackActivo].fecha.getHours() + ":" + service.ordenarMinutos();
        }
            service.actualizarPuntosT();
    }else{
            service.markersT[service.trackActivo]=undefined;
        }
    };

 //Metodo que devuelve la posicion de una ruta a partir de su nombre
  service.buscarRutaPorNombre = function (nombre) {
    for (var item in service.tracks) {
      if(service.rutas[item].nombre ==nombre){
        return item;
      }
    }
    return null;
  };
   //Metodo que devuelve la posicion de un track a partir de su nombre
  service.buscarTrackPorNombre = function (nombre) {
    for (var item in service.tracks) {
      if(service.tracks[item].nombre ==nombre){
        return item;
      }
    }
    return null;
  };
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
    setTimeout(function(){
         $("#lir"+(service.rutas.length-1))[0].style.color = '#FF3399';
    },500);
    
    //Desactivamos los modos activados durante el metodo
    service.modoInvertir = false;
    service.modoRecorte2 = false;
  };

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
     setTimeout(function(){
         $("#li"+(service.tracks.length-1))[0].style.color = '#FF3399';
    },500);
    //Desactivamos los modos activados durante este metodo
    service.modoInvertir = false;
    service.modoRecorte2 = false;
  };
  service.recortarTrack = function () {
    //Recorremos los puntos del track seleccionado
    for (var item in service.tracks[service.trackActivo].puntos) {


      //Recorremos los punto anteriores al punto elegido
      if (parseInt(item)<=parseInt(service.puntoElegido)) {

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
      if (parseInt(item)>=parseInt(service.puntoElegido)) {
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
    setTimeout(function(){
    $("#li"+(service.trackActivo+1))[0].style.color = '#00FF00';
    $("#li"+(service.trackActivo+2))[0].style.color = '#FF3399';
},500);
service.fin = true;
    //Desactivamos todos los modos y ponemos a null el punto elegido
    service.modoInvertir = false;
    service.modoRecorte1 = false;
    service.modoRecorte2 = false;
    service.puntoElegido = null;

  };
  service.recortarRuta = function () {
    for (var item in service.rutas[service.rutaActiva].puntos) {
      //Recorremos los puntos antes del punto elegido
      if (parseInt(item)<=parseInt(service.puntoElegido)) {
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
      if (parseInt(item)>=parseInt(service.puntoElegido)) {
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
     setTimeout(function(){
    $("#lir"+(service.rutaActiva+1))[0].style.color = '#00FF00';
    $("#lir"+(service.rutaActiva+2))[0].style.color = '#FF3399';
    },500);
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
        if(service.clicTabGraf){
            service.mapa.setCenter(new google.maps.LatLng(service.latitudSelec,service.longitudSelec));
            service.mapa.setZoom(17);}
    }else{
      //Guardamos los datos del punto
      service.latitudSelec = service.rutas[service.rutaActiva].puntos[index].latitud;
      service.longitudSelec = service.rutas[service.rutaActiva].puntos[index].longitud;
      //Simulamos un click el mapa para añadir el marcado del punto elegido
      google.maps.event.trigger(service.mapa, 'click');
      if(service.clicTabGraf){
        service.mapa.setCenter(new google.maps.LatLng(service.latitudSelec,service.longitudSelec));
        service.mapa.setZoom(17);}

    }
    //Desactivamos el modo selecion
    service.seleccion = false;
      service.clicTabGraf = false;
  };

    service.cambiarDescripcion = function (descripcion) {
        service.waypoints[service.wpActivo].descripcion = descripcion;
    };
  //metodo que cambia el nombre a un track elegido
  service.renombrarT = function (nombre) {
    if(service.isTrack == true)
    service.tracks[service.trackActivo].nombre = nombre;
  };

  service.anadirWaypoint = function (lat,lng) {
      var latlng = new google.maps.LatLng(lat,lng);
       if(!isNaN(latlng.lat())&&!isNaN(latlng.lng())){
      service.latitud = parseFloat(lat).toFixed(6);
      service.longitud =parseFloat(lng).toFixed(6);
      service.modoInsertarWp = true;
      google.maps.event.trigger(service.mapa, 'click');
      service.modoInsertarWp = false;
       }
  };

    service.grosor = function (grosor) {
        var lineSymbolarrow;
        var arrow;
        console.log("grosor");
        lineSymbolarrow = {
            path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor : service.getPoly().strokeColor,
            strokeOpacity : 0.7,
            strokeWeight : grosor,
            scale : 2.7
        };
        arrow = {
            icon : lineSymbolarrow,
            offset : '50%',
            repeat : '80px'
        };
        var poly = service.getPoly();
        poly.setOptions({
            strokeColor: service.getPoly().strokeColor,
            strokeOpacity: 1.0,
            strokeWeight:grosor,
            icons : [arrow]
        });
    };
  //Metodo que cambia el nombre a una ruta elegida
  service.renombrarR = function (nombre) {
    if (service.isTrack == false)
    service.rutas[service.rutaActiva].nombre = nombre;
  };
  //Metodo que cambia el nombre a un wayPoint elegido
  service.renombrarW = function (nombre) {

    service.waypoints[service.wpActivo].nombre = nombre;
  };

  service.changeMarkerPosition = function (latitud,longitud) {
      var posicion = service.wpActivo;
      var elevator = new google.maps.ElevationService;
      var latlng = new google.maps.LatLng(latitud,longitud);
     if(!isNaN(latlng.lat())&&!isNaN(latlng.lng())){
      service.waypoints[posicion].longitud = parseFloat(longitud).toFixed(6);
      service.waypoints[posicion].latitud = parseFloat(latitud).toFixed(6);
      service.markers[posicion].setPosition(latlng);
      elevator.getElevationForLocations({
          'locations': [latlng]
      }, function(results, status) {
          if (status === google.maps.ElevationStatus.OK) {
              if (results[0]) {
                  service.waypoints[posicion].elevacion = results[0].elevation.toFixed(2);
              } else {
                  console.log("no result found");
              }
          } else {
              console.log("elevation service failed");
          }
      });
      service.markers[posicion].title= "Latitud: "+parseFloat(latitud).toFixed(6)+"\nLongitud: "+parseFloat(longitud).toFixed(6);
  }
  };

  service.invertirRuta2 = function () {
      var lineSymbolarrow;
      var arrow;
      if(service.rutas[service.rutaActiva].direccionOriginal){
          lineSymbolarrow = {
              path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              strokeColor : service.getPoly().strokeColor,
              strokeOpacity : 0.7,
              strokeWeight : 2.9,
              scale : 2.7
          };
          arrow = {
              icon : lineSymbolarrow,
              offset : '50%',
              repeat : '80px'
          };
          service.rutas[service.rutaActiva].direccionOriginal = false;
      }else{
          lineSymbolarrow = {
              path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              strokeColor : service.getPoly().strokeColor,
              strokeOpacity : 0.7,
              strokeWeight : 2.9,
              scale : 2.7
          };
          arrow = {
              icon : lineSymbolarrow,
              offset : '50%',
              repeat : '80px'
          };
          service.rutas[service.rutaActiva].direccionOriginal = true;
      }

      var puntos =new Array();
      var markers = new Array();
      var poly = service.getPoly();
      poly.setOptions({
          strokeColor: service.getPoly().strokeColor,
          strokeOpacity: 1.0,
          strokeWeight: 3,
          icons : [arrow]
      });
      for (var i = service.rutas[service.rutaActiva]["puntos"].length-1; i >= 0; i--) {
          puntos.push(service.rutas[service.rutaActiva]["puntos"][i]);
          markers.push(service.wpRta[service.rutaActiva][i]);
      }
      //Booramos los puntos actuales
      for (var i = service.rutas[service.rutaActiva].puntos.length-1; i>=0; i--) {
          service.rutas[service.rutaActiva].puntos.splice(i,1);
          service.puntosTrackActivo.splice(i,1);
          service.wpRta[service.rutaActiva][i].setMap(null);
          service.wpRta[service.rutaActiva].splice(i,1);
      }
      for(var i in puntos){
          if(i == 0){
              puntos[i].desnivel = 0;
              puntos[i].distancia = 0;
              puntos[i].numero = 0;
              markers[i].setIcon(service.myIconRIni);
          }else{
              var pActual = new google.maps.LatLng(puntos[i].latitud,puntos[i].longitud);
              var pAnterior = new google.maps.LatLng(puntos[i-1].latitud,puntos[i-1].longitud);
              puntos[i].distancia = google.maps.geometry.spherical.computeDistanceBetween(pAnterior,pActual).toFixed(2);
              puntos[i].numero = i;
              puntos[i].desnivel = (puntos[i].elevacion-puntos[i-1].elevacion).toFixed(2);
          }

          if(i == puntos.length-1)
              markers[i].setIcon(service.myIconRFin);
          service.wpRta[service.rutaActiva].push(markers[i]);
          service.wpRta[service.rutaActiva][i].setMap(service.mapa);
          service.rutas[service.rutaActiva]["puntos"].push(puntos[i]);
          service.getPoly().getPath().setAt(i, new google.maps.LatLng(service.wpRta[service.rutaActiva][i].position.lat(),service.wpRta[service.rutaActiva][i].position.lng()));

      }

      service.puntosTrackActivo = service.rutas[service.rutaActiva]["puntos"];

      service.rutas[service.rutaActiva].fecha = new Date();
      service.rutas[service.rutaActiva].distancia= 0;
      service.rutas[service.rutaActiva].desnivelP= 0;
      service.rutas[service.rutaActiva].desnivelN=0;
      service.rutas[service.rutaActiva].elevMax=0;
      service.rutas[service.rutaActiva].elevMin=9999999;
      for(var i in service.rutas[service.rutaActiva]["puntos"]){
          service.calcularDatosTrack(1,service.rutas[service.rutaActiva]["puntos"][i],service.rutaActiva);
      }
      service.actualizarPuntosR();


  };

  service.invertirTrack2 = function () {
         var lineSymbolarrow;
         var arrow;
        if(service.tracks[service.trackActivo].direccionOriginal){
             lineSymbolarrow = {
                path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor : service.getPoly().strokeColor,
                strokeOpacity : 0.7,
                strokeWeight : 2.9,
                scale : 2.7
            };
             arrow = {
                icon : lineSymbolarrow,
                offset : '50%',
                repeat : '80px'
            };
            service.tracks[service.trackActivo].direccionOriginal = false;
        }else{
            lineSymbolarrow = {
                path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor : service.getPoly().strokeColor,
                strokeOpacity : 0.7,
                strokeWeight : 2.9,
                scale : 2.7
            };
            arrow = {
                icon : lineSymbolarrow,
                offset : '50%',
                repeat : '80px'
            };
            service.tracks[service.trackActivo].direccionOriginal = true;
        }

      var puntos =new Array();
      var markers = new Array();
      var poly = service.getPoly();
      poly.setOptions({
          strokeColor: service.getPoly().strokeColor,
          strokeOpacity: 1.0,
          strokeWeight: 3,
          icons : [arrow]
      });
      for (var i = service.tracks[service.trackActivo]["puntos"].length-1; i >= 0; i--) {
        puntos.push(service.tracks[service.trackActivo]["puntos"][i]);
        markers.push(service.markersT[service.trackActivo][i]);
      }
      //Booramos los puntos actuales
      for (var i = service.tracks[service.trackActivo].puntos.length-1; i>=0; i--) {
          service.tracks[service.trackActivo].puntos.splice(i,1);
          service.puntosTrackActivo.splice(i,1);
          service.markersT[service.trackActivo][i].setMap(null);
          service.markersT[service.trackActivo].splice(i,1);
      }
      for(var i in puntos){
          if(i == 0){
              puntos[i].desnivel = 0;
              puntos[i].distancia = 0;
              puntos[i].numero = 0;
             markers[i].setIcon('img/icono.png');
          }else{
              var pActual = new google.maps.LatLng(puntos[i].latitud,puntos[i].longitud);
              var pAnterior = new google.maps.LatLng(puntos[i-1].latitud,puntos[i-1].longitud);
             puntos[i].distancia = google.maps.geometry.spherical.computeDistanceBetween(pAnterior,pActual).toFixed(2);
                puntos[i].numero = i;
             puntos[i].desnivel = (puntos[i].elevacion-puntos[i-1].elevacion).toFixed(2);
          }

          if(i == puntos.length-1)
              markers[i].setIcon('img/iconoFin.png');
          service.markersT[service.trackActivo].push(markers[i]);
          service.markersT[service.trackActivo][i].setMap(service.mapa);
          service.tracks[service.trackActivo]["puntos"].push(puntos[i]);
          service.getPoly().getPath().setAt(i, new google.maps.LatLng(service.markersT[service.trackActivo][i].position.lat(),service.markersT[service.trackActivo][i].position.lng()));
      }

      service.puntosTrackActivo = service.tracks[service.trackActivo]["puntos"];
      //Asignamos una nueva fecha
      service.tracks[service.trackActivo].fecha = new Date();
      service.tracks[service.trackActivo].distancia= 0;
      service.tracks[service.trackActivo].desnivelP= 0;
      service.tracks[service.trackActivo].desnivelN=0;
      service.tracks[service.trackActivo].elevMax=0;
      service.tracks[service.trackActivo].elevMin=9999999;
      service.tracks[service.trackActivo].duracionIda=0;
      service.tracks[service.trackActivo].duracionVuelta=0;
      for(var i in service.tracks[service.trackActivo]["puntos"]){
          service.calcularDatosTrack(0,service.tracks[service.trackActivo]["puntos"][i],service.trackActivo);
          service.tracks[service.trackActivo].duracionIda = parseFloat(service.calcularDuracion(true,service.trackActivo)).toFixed(2);
          service.tracks[service.trackActivo].duracionVuelta = parseFloat(service.calcularDuracion(false,service.trackActivo)).toFixed(2);
          service.calcularFecha(service.trackActivo,service.calcularDuracionPuntos(service.tracks[service.trackActivo]["puntos"][i]));
          service.tracks[service.trackActivo]["puntos"][i].fecha
              =service.tracks[service.trackActivo].fecha.getDate()+"/"+service.tracks[service.trackActivo].fecha.getMonth()+"/"+service.tracks[service.trackActivo].fecha.getFullYear();
          service.tracks[service.trackActivo]["puntos"][i].hora
              =service.tracks[service.trackActivo].fecha.getHours()+":"+service.ordenarMinutos();
      }
      service.actualizarPuntosT();



  };
  service.borrarTrack = function () {
    //Eliminapos la polilinea actual
    if(service.polyLineas[service.trackActivo]!==undefined){
    service.getPoly().setMap(null);
    service.polyLineas.splice(service.trackActivo,1);
    }
    //ELiminamos los marcadores de inicion y fin actuales
    if(service.markersT[service.trackActivo]!==undefined){
      for(var i in service.markersT[service.trackActivo]){
          service.markersT[service.trackActivo][i].setMap(null);
      }
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
  };
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
  };
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

  };

//Funcion que recalcula la duracion del track y de sus puntos en funcion de una velocidad y fecha dadas.
service.cambiarTiempos = function (velocidad,fecha,num) {
    console.log(velocidad);
  service.velocidad = velocidad;
  service.tracks[service.trackActivo].duracionIda=service.calcularDuracion(true,num).toFixed(2);
  service.tracks[service.trackActivo].duracionVuelta=service.calcularDuracion(false,num).toFixed(2);
  service.tracks[service.trackActivo].fecha = fecha;
  //Se recorren todos los puntos y se les asiogna la nueva fecha y velocidad
  for (var item in service.puntosTrackActivo) {
    service.calcularDuracionPuntos(service.puntosTrackActivo[item]);
    service.calcularFecha(service.trackActivo,service.calcularDuracionPuntos(service.puntosTrackActivo[item]));
    service.puntosTrackActivo[item].fecha=service.tracks[service.trackActivo].fecha.getDate()+"/"+service.tracks[service.trackActivo].fecha.getMonth()+"/"+service.tracks[service.trackActivo].fecha.getFullYear();
    service.puntosTrackActivo[item].hora =service.tracks[service.trackActivo].fecha.getHours()+":"+service.ordenarMinutos();
    service.puntosTrackActivo[item].velocidad=(60/service.velocidad);
  }
};

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
    var hDesnivelSubida = Math.abs((parseFloat(service.tracks[num].desnivelN)/400)).toFixed(2);
    var hDesnivelBajada = (parseFloat(service.tracks[num].desnivelP)/600).toFixed(2);
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
};

service.calcularDuracionPuntos= function (punto) {
    var hDesnivelSubida = (parseFloat(punto.desnivel)/400);
    var hDesnivelBajada = (Math.abs(parseFloat(punto.desnivel)/600));
    if (punto.desnivel>0) {
        hDesnivelBajada = 0;
    } else {
        hDesnivelSubida = 0;
    }
    var distanciakm =punto.distancia/1000;
    var hDistanciaHori = (parseFloat(distanciakm)/parseFloat(service.velocidad));
    var hdesnivelGeneral = parseFloat(hDesnivelBajada)+parseFloat(hDesnivelSubida);
    if (hDistanciaHori>=hdesnivelGeneral ) {
        var menor = parseFloat(hdesnivelGeneral*0.5);
        if (menor=="NaN") {
            menor=0;
        }
        var horasFinales = parseFloat(hDistanciaHori)+parseFloat(menor);
        var minutosDescanso = horasFinales*10;
        var minutosFInales = (horasFinales*60)+minutosDescanso;
        var duracionRecorrido = minutosFInales/60;
        return duracionRecorrido;
    } else {
        var menor = parseFloat(hDistanciaHori*0.5);
        var horasFinales = parseFloat(hdesnivelGeneral)+parseFloat(menor);
        var minutosDescanso = horasFinales*10;
        var minutosFInales = (horasFinales*60)+minutosDescanso;
        var duracionRecorrido = minutosFInales/60;
        return duracionRecorrido;
    }

};
//Suma a la fecha del track activo la horas que recibe como parametro
service.calcularFecha = function (num,horas) {
  service.segundosAnadir = service.segundosAnadir+(parseFloat(horas)*parseFloat(3600));
  if(service.segundosAnadir>=60){
  service.tracks[num].fecha.setSeconds(service.segundosAnadir);
  service.segundosAnadir =0;}

};
//Calcula la fecha a partir de una velocidad
service.calcularFechaR = function (ritmo) {
  var smet = ritmo/1000;
  var min = service.distancia*smet;
  var segundos = parseInt(min*60);
  service.rutas[service.rutaActiva].fecha.setSeconds(segundos);
};
//Añade un cero a los minutos que son menores de 10
service.ordenarMinutos = function () {
  var minutos;
  if(service.tracks[service.trackActivo].fecha.getMinutes()<10)
      minutos="0"+service.tracks[service.trackActivo].fecha.getMinutes();
  else
      minutos=service.tracks[service.trackActivo].fecha.getMinutes();
  return minutos;
};
//Añade un cero a los minutos que son menores de 10
service.ordenarMinutosR = function () {
  var minutos;
  if(service.rutas[service.rutaActiva].fecha.getMinutes()<10)
      minutos="0"+service.rutas[service.rutaActiva].fecha.getMinutes();
  else
      minutos=service.rutas[service.rutaActiva].fecha.getMinutes();
  return minutos;
};
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
};
//FUncion que retorna true o false si la entidad activa actual ya tiene
// una polilinea asignada o no la tiene
service.tienePolyF = function () {
  if (service.isTrack) {
    return service.tienePoly[service.trackActivo];
  } else {
    return service.tienePolyR[service.rutaActiva];
  }
};
//FUncion que retorna true o false si la entidad activa actual ya tiene
// una polilinea asignada o no la tiene
service.tienePolyFR = function (num) {
  if (service.isTrack) {
    return service.tienePoly[num];
  } else {
    return service.tienePolyR[num];
  }
};
//Cambia el color de las polilineas de los track y las rutas
service.colorPoly= function () {
  if (service.isTrack) {
    return service.colorAleatorio();
  } else {
    return service.colorAleatorio();
  }
};
//Añade una polilinea a la entidad que esta activa actualmente
service.addPolyR = function (poly,num) {
  if (service.isTrack) {

    service.polyLineas[num]= poly;

    service.tienePoly[num]=true;
  } else {

    service.polyLineasR[num]= poly;

    service.tienePolyR[num]=true;
  }
};
//Añade una polilinea a la entidad que esta activa actualmente
service.addPoly = function (poly) {
  if (service.isTrack) {

    service.polyLineas[service.trackActivo]= poly;

    service.tienePoly[service.trackActivo]=true;
  } else {

    service.polyLineasR[service.rutaActiva]= poly;

    service.tienePolyR[service.rutaActiva]=true;
  }
};
//devuelve la polilinea de la entidad activa actualmente
service.getPolyR = function (num) {
  if (service.isTrack) {

    return service.polyLineas[num];
  } else {


    return service.polyLineasR[num];
  }
};
//devuelve la polilinea de la entidad activa actualmente
service.getPoly = function () {
  if (service.isTrack) {
    return service.polyLineas[service.trackActivo];
  } else {


    return service.polyLineasR[service.rutaActiva];
  }
};
service.vermarkers = function () {
    if( service.mapa.getZoom()>=17 ){
        for(var j in service.markersT[service.trackActivo]){
            service.markersT[service.trackActivo][j].setVisible(service.ver);
        }
    }

};
//Actualiza los puntos del track activo
    service.actualizarMarkerActivo = function() {

        if(service.ver && service.mapa.getZoom()>=17 && service.markersT[service.trackActivo][service.markersT[service.trackActivo].length-2].getVisible() == false){
            for(var j in service.markersT[service.trackActivo]){
                service.markersT[service.trackActivo][j].setVisible(true);
            }
        }
        if(service.ver && service.mapa.getZoom()<17 && service.markersT[service.trackActivo][service.markersT[service.trackActivo].length-2].getVisible() == true){
            for(var j in service.markersT[service.trackActivo]){
                if(j!=0 && j!= service.markersT[service.trackActivo].length-1)
                    service.markersT[service.trackActivo][j].setVisible(false);
            }
        }


    };
    //Actualiza los puntos del track activo
    service.actualizarMarkerActivoR = function() {

        if(  service.wpRta[service.rutaActiva][service.wpRta[service.rutaActiva].length-2].getVisible() == false){
            for(var j in service.wpRta[service.rutaActiva]){
                service.wpRta[service.rutaActiva][j].setVisible(true);
            }
        }
        if( service.wpRta[service.rutaActiva][service.wpRta[service.rutaActiva].length-2].getVisible() == true){
            for(var j in service.wpRta[service.rutaActiva]){
                if(j!=0 && j!= service.wpRta[service.rutaActiva].length-1)
                    service.wpRta[service.rutaActiva][j].setVisible(false);
            }
        }



    };
    service.actualizarMarkersR2 = function() {
        var hacerInvisible = -1;
        for(var i in service.rutas){
            if(service.wpRta[i] != undefined)
                if(service.wpRta[i].length>1)
                    if(service.wpRta[i][1].getVisible()){
                        hacerInvisible = i;
                    }}
                   
        for(var i in service.wpRta[service.rutaActiva]){
            if( service.isTrack==false){
                service.wpRta[service.rutaActiva][i].setVisible(true);
                 console.log("dentro");}
        }
        if(hacerInvisible!=-1)
        for(var i in service.wpRta[hacerInvisible]){

            if(i!=0 && i!= service.wpRta[hacerInvisible].length-1)
                service.wpRta[hacerInvisible][i].setVisible(false);
        }


    };

    //Actualiza los puntos del track activo
    service.actualizarMarkers2 = function() {
        var hacerInvisible = -1;
        for(var i in service.tracks){
            if(service.markersT[i] != undefined)
            if(service.markersT[i].length>1)
            if(service.markersT[i][1].getVisible()){
                hacerInvisible = i;
            }}

        for(var i in service.markersT[service.trackActivo]){
            if(service.mapa.getZoom()>=17 && service.isTrack==true)
                    service.markersT[service.trackActivo][i].setVisible(true);

            }

            if(hacerInvisible!=-1)
        for(var i in service.markersT[hacerInvisible]){

            if(i!=0 && i!= service.markersT[hacerInvisible].length-1)
                    service.markersT[hacerInvisible][i].setVisible(false);
            }


    };

//Actualiza los puntos del track activo
service.actualizarPuntosT = function() {

      if (service.tracks.length>0){
      service.puntosTrackActivo= service.tracks[service.trackActivo]["puntos"];
      service.actualizarPuntos();
      }

};

//Actualiza los puntos de la ruta activa
service.actualizarPuntosR = function() {
    if (service.rutas.length>0){
       service.puntosTrackActivo= service.rutas[service.rutaActiva]["puntos"];
       service.actualizarPuntos();
     }
};
//Actualiza una lista de distacias que es necesaria para actualizar la grafica
  service.actualizarDistancias= function () {
    service.distancias.length = 0;
    for (var item in service.puntosTrackActivo) {
      service.distancias.push(service.puntosTrackActivo[item]['distancia']);

    }
    return service.distancias;
  };
  //Actualiza una lista de elevaciones(de los puntos) que es necesaria para la grafica
  service.actualizarElevaciones= function () {
    service.elevaciones.length = 0;
    for (var item in service.puntosTrackActivo) {
      service.elevaciones.push(service.puntosTrackActivo[item]['elevacion']);
    }
    return service.elevaciones;
  };

  //LLama a las dos funciones anteriores
  service.actualizarPuntos= function () {
    service.elevaciones2 = service.actualizarElevaciones();
    service.distancias2 = service.actualizarDistancias();
    service.calcularPuntosGrafico();
  };
  service.calcularPuntosGrafico = function () {
      var distancia = 0;
      service.puntosGrafico.length = 0;
      for(var item in service.distancias){
        distancia = parseFloat(distancia )+ parseFloat(service.distancias[item]);
      var obj = {x:parseFloat(distancia/1000).toFixed(2),y:service.elevaciones[item]};
      service.puntosGrafico.push(obj);
      }
  };
  service.getPuntosGrafico = function () {
      return service.puntosGrafico;
  };
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
          direccionOriginal: true
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
        direccionOriginal: true
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
          //Le metemos un tiempo de espera para que el input se cree antes d eque este metodo se ejecute
          setTimeout(function () {
              for(var i in service.waypoints){
                  if(i!= service.waypoints.length-1){
                      $("#inw"+i).attr('checked', false);}
                  else{
                      $("#inw"+i).prop("checked",true);
                      $("#inw"+i).click();

                  }
              }
          },10);
        break;
    }
    return service.entidad;
  };

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
    };
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
  };
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
        velocidad: 15
      };
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
        fecha:service.rutas[num].fecha.getDate()+"/"+service.rutas[num].fecha.getMonth()+"/"+service.rutas[num].fecha.getFullYear(),
        hora:service.rutas[num].fecha.getHours()+":"+service.ordenarMinutosR(),
        desnivel:service.calcularDesnivelR(),
        distancia: service.distancia,
        velocidad: 4
      };
          if (service.rutas.length>0){
            service.punto.numero = service.rutas[num]["puntos"].length;
            service.rutas[num]["puntos"].push(service.punto);
            service.calcularDatosTrack(1,service.punto,num);
      }
        break;
    }

    return service.punto;
  }


}


})();
