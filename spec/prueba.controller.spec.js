describe("test de: PruebaController", function() {

  beforeEach(function () {
    module(function ($provide) {
      $provide.service('EntidadesServiceErrorMock', function () {
        var service = this;
        service.trackActivo = 0;
        service.rutaActiva = 0;
        service.tracks = [];
        service.rutas = [];
        service.waypoints = [];
        service.puntosTrackActivo=[];
        service.distancias2 = [];
        service.elevaciones2 = [];
        service.distancias = [];
        service.elevaciones = [];
        service.tienePoly = [];
        service.tienePolyR = [];
        service.polyLineas = [];
        service.polyLineasR = [];
        service.isTrack = true;
        service.hayEntidadesCreadas = false;
        service.wps=0;
        service.puntoElegido=0;
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
          //metodo que cambia el nombre a un track elegido
          service.renombrarT = function (nombre) {

                  service.tracks[service.trackActivo].nombre = nombre;
          }
          //Metodo que cambia el nombre a una ruta elegida
          service.renombrarR = function (nombre) {

                  service.rutas[service.rutaActiva].nombre = nombre;
          }
          //Metodo que cambia el nombre a un wayPoint elegido
          service.renombrarW = function (nombre) {

              service.waypoints[service.wpActivo].nombre = nombre;
          }
          //Metodo que permote borrar un waypoint
          service.borrarWp = function () {


              //ELiminamos el waypoint
              service.waypoints.splice(service.wpActivo,1);
              //Si no hubiera ninguna entidad creada se pone a false el boolean que lo indica
              if(service.tracks.length<1 && service.rutas.length<1 && service.waypoints.length<1)
              {
                  service.hayEntidadesCreadas=false;
              }
              service.wps = service.waypoints.length;
          }
          service.borrarRuta = function () {


              //Marcamos la ruta como que no tiene polilinea
              service.tienePolyR[service.rutaActiva]=false;
              service.tienePolyR.splice(service.rutaActiva,1)
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
          service.borrarTrack = function () {
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
          service.anadirPuntoRuta = function () {
              var puntos =new Array();
              service.puntoN = {
                  numero:0,
                  latitud:"43.083333",
                  longitud: "-5.804077",
                  elevacion: 600,
                  fecha:"26/01/2017",
                  hora:"1:04",
                  desnivel:50,
                  distancia: 1.5,
                  velocidad: "4km/h",
              }
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
              for (var i =0; i < puntos.length; i++) {
                  service.rutas[service.rutaActiva].puntos.push(puntos[i]);
              }
          }
          service.anadirPuntoTrack = function () {
              var puntos =new Array();
              service.puntoN = {
                  numero:0,
                  latitud:"43.083333",
                  longitud: "-5.804077",
                  elevacion: 600,
                  fecha:"26/01/2017",
                  hora:"1:04",
                  desnivel:50,
                  distancia: 1.5,
                  velocidad: "4km/h",
              }
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
              for (var i =0; i < puntos.length; i++) {
                  service.tracks[service.trackActivo].puntos.push(puntos[i]);
              }
              //Desactivamos el modo invertir
              service.modoInvertir = false;
          }

          service.eliminarPuntoTrack = function () {
              var puntos =new Array();

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
              for (var i =0; i < puntos.length; i++) {
                  service.tracks[service.trackActivo].puntos.push(puntos[i]);
              }

          }
          service.eliminarPuntoRuta = function () {
              var puntos =new Array();

              for (var variable in service.rutas[service.rutaActiva].puntos) {
                  puntos.push(service.rutas[service.rutaActiva].puntos[variable]);
              }
              //Eliminamos el punto elegido d ela lista de punto a pintar
              puntos.splice(service.puntoElegido,1);
              //Booramos los puntos actuales
              for (var i = service.rutas[service.rutaActiva].puntos.length-1; i>=0; i--) {
                  service.rutas[service.rutaActiva].puntos.splice(i,1);
                  service.puntosTrackActivo.splice(i,1);
              }
              for (var i =0; i < puntos.length; i++) {
                  service.rutas[service.rutaActiva].puntos.push(puntos[i]);
              }

          }
          service.recortarTrack = function () {
              //Recorremos los puntos del track seleccionado
              for (var item in service.tracks[service.trackActivo].puntos) {
                  //Recorremos los punto anteriores al punto elegido
                  if (item<=service.puntoElegido) {
                     service.tracks[service.tracks.length-2].puntos.push(service.tracks[service.trackActivo].puntos[item]);

                  }
                  //Recorremos los punto a partir del punto elegido
                  if (item>=service.puntoElegido) {
                      service.tracks[service.tracks.length-1].puntos.push(service.tracks[service.trackActivo].puntos[item]);
                  }
              }


          }
          service.recortarRuta = function () {
              //Recorremos los puntos del track seleccionado
              for (var item in service.rutas[service.rutaActiva].puntos) {
                  //Recorremos los punto anteriores al punto elegido
                  if (item<=service.puntoElegido) {
                      service.rutas[service.rutas.length-2].puntos.push(service.rutas[service.rutaActiva].puntos[item]);

                  }
                  //Recorremos los punto a partir del punto elegido
                  if (item>=service.puntoElegido) {
                      service.rutas[service.rutas.length-1].puntos.push(service.rutas[service.rutaActiva].puntos[item]);
                  }
              }


          }
          //metodo que une dos tracks
          service.unirTrack = function (trackElegido) {

              //Recorremos los puntos del primer track
              for (var item in service.tracks[service.trackActivo].puntos) {
                  service.tracks[service.tracks.length-1].puntos.push(service.tracks[service.trackActivo].puntos[item]);
              }
              //Recorremos el segundo track
              for (var item in service.tracks[trackElegido].puntos) {
                  service.tracks[service.tracks.length-1].puntos.push(service.tracks[trackElegido].puntos[item]);
              }
          }
          service.unirRuta = function (rutaElegida) {


              for (var item in service.rutas[service.rutaActiva].puntos) {
                  service.rutas[service.rutas.length-1].puntos.push(service.rutas[service.rutaActiva].puntos[item]);
              }

              for (var item in service.rutas[rutaElegida].puntos) {
                  service.rutas[service.rutas.length-1].puntos.push(service.rutas[rutaElegida].puntos[item]);
              }
          }
          //FUncion para invertir un track
          service.invertirTrack = function () {

              var puntos =new Array();

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
                  service.tracks[service.trackActivo].puntos.push(puntos[i]);

              }
      }
          service.invertirRuta = function () {

              var puntos =new Array();

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
                  service.rutas[service.rutaActiva].puntos.push(puntos[i]);

              }
          }
        service.anadirPunto = function (id,num,nump) {
          service.punto = {
            numero:nump,
            latitud:"43.083333",
            longitud: "-5.804077",
            elevacion: 600,
            fecha:"26/01/2017",
            hora:"1:04",
            desnivel:50,
            distancia: 1.5,
            velocidad: "4km/h",
          }
          switch (id) {
            case 0:
              if (service.tracks.length>0)
              service.tracks[num]["puntos"].push(service.punto);

              break;
            case 1:
                if (service.rutas.length>0)
              service.rutas[num]["puntos"].push(service.punto);

              break;
          }

          return service.punto;
        }

      });
    });
      module('ngDialog');
     module('angularSpinner');
    
  module('GPS');
  });


  var $controller;
var pruebaController;
var scope;
var documentt;
var service;
var spin;
var ngDialogInstance;
beforeEach(inject(function (_$controller_,$rootScope,EntidadesServiceErrorMock,$document,_usSpinnerService_) {
  
  $controller = _$controller_;
  
  scope = $rootScope;
  service = EntidadesServiceErrorMock;
  documentt = $document;
  spin = _usSpinnerService_;
  pruebaController =
    $controller('PruebaController',
                {$scope:scope,EntidadesService: service,$document:documentt,_usSpinnerService_:spin,ngDialog:ngDialogInstance});

}));

  it("Deberia crear un track", function() {
      pruebaController.crear(0)
    expect(pruebaController.tracks[0].nombre).toBe("Nuevo-Track"+(pruebaController.tracks.length-1));
  });
  it("Deberia crear una ruta", function() {
      pruebaController.crear(1)
    expect(pruebaController.rutas[0].nombre).toBe("Nueva-Ruta"+(pruebaController.rutas.length-1));
  });
  it("Deberia crear un waypoint", function() {
      pruebaController.crear(2)
    expect(pruebaController.waypoints[0].nombre).toBe("Nuevo-Waypoint"+(pruebaController.waypoints.length-1));
  });
  it("Deberia crear 100 tracks", function() {
    for (var i = 0; i < 100; i++) {
      pruebaController.crear(0);
    }
    expect(pruebaController.tracks.length).toBe(100);
  });
  it("Deberia crear 100 rutas", function() {
    for (var i = 0; i < 100; i++) {
      pruebaController.crear(1);
    }
    expect(pruebaController.rutas.length).toBe(100);
  });
  it("Deberia crear 100 waypoints", function() {
    for (var i = 0; i < 100; i++) {
      pruebaController.crear(2);
    }
    expect(pruebaController.waypoints.length).toBe(100);
  });
  it("Creacion intercalada de multiples entidades", function() {
    for (var i = 0; i < 100; i++) {
      pruebaController.crear(0);
    }
    for (var i = 0; i < 100; i++) {
      pruebaController.crear(1);
    }
    for (var i = 0; i < 100; i++) {
      pruebaController.crear(2);
    }
    for (var i = 0; i < 23; i++) {
      pruebaController.crear(0);
    }
    for (var i = 0; i < 54; i++) {
      pruebaController.crear(1);
    }
    for (var i = 0; i < 123; i++) {
      pruebaController.crear(2);
    }
    expect(pruebaController.waypoints[201].nombre).toBe("Nuevo-Waypoint201");
    expect(pruebaController.rutas[121].nombre).toBe("Nueva-Ruta121");
    expect(pruebaController.tracks[78].nombre).toBe("Nuevo-Track78");
    expect(pruebaController.tracks.length).toBe(123);
    expect(pruebaController.rutas.length).toBe(154);
    expect(pruebaController.waypoints.length).toBe(223);
  });
  it("Deberia crear 100 puntos para un track", function() {

      pruebaController.crear(0);
      for (var i = 0; i < 100; i++) {
          pruebaController.anadirPuntoTForMap();
      }


    expect(pruebaController.tracks[0]['puntos'].length).toBe(100);
  });
  it("Deberia crear 100 puntos para una ruta", function() {

      pruebaController.crear(1);
      for (var i = 0; i < 100; i++) {
          pruebaController.anadirPuntoRForMap();
      }


    expect(pruebaController.rutas[0]['puntos'].length).toBe(100);
  });
  it("Creamos ruta con 203 puntos y track con 149 puntos", function() {
      pruebaController.crear(0);
      pruebaController.crear(1);
      for (var i = 0; i < 203; i++) {
          pruebaController.anadirPuntoRForMap();
      }
      for (var i = 0; i < 149; i++) {
          pruebaController.anadirPuntoTForMap();
      }

    expect(pruebaController.rutas[0]['puntos'].length).toBe(203);
    expect(pruebaController.tracks[0]['puntos'].length).toBe(149);
  });
  it("Creamos 100 puntos para una ruta y comprobamos que  la lista de puntos de la entidad activa se actualiza correctamente", function() {

      pruebaController.crear(1);
      for (var i = 0; i < 100; i++) {
          pruebaController.anadirPuntoRForMap();
      }


    expect(pruebaController.puntosTrackActivo.length).toBe(100);
  });
  it("Creamos 100 puntos para un track y comprobamos que  la lista de puntos de la entidad activa se actualiza correctamente", function() {

      pruebaController.crear(0);
      for (var i = 0; i < 100; i++) {
          pruebaController.anadirPuntoTForMap();
      }


    expect(pruebaController.puntosTrackActivo.length).toBe(100);
  });
  it("Creamos varias entidades y comprobamos que la lista de puntos de la entidad activa se actualiza correctamente", function() {

      pruebaController.crear(1);
      for (var i = 0; i < 100; i++) {
          pruebaController.anadirPuntoRForMap();
      }


    expect(pruebaController.puntosTrackActivo.length).toBe(100);
    pruebaController.crear(0);
    for (var i = 0; i < 245; i++) {
        pruebaController.anadirPuntoTForMap();
    }


  expect(pruebaController.puntosTrackActivo.length).toBe(245);
  });
    it("Creamos un track y lo borramos", function() {

        pruebaController.crear(0);
        for (var i = 0; i < 100; i++) {
            pruebaController.anadirPuntoTForMap();
        }
        pruebaController.trackActivo=0;
        pruebaController.borrarTrack();
        expect(pruebaController.tracks.length).toBe(0);
    });
    it("Creamos varios tracks y comprobamos que se borren ", function() {


        for (var i = 0; i < 100; i++) {
            pruebaController.crear(0);
        }
        pruebaController.trackActivo=35;
        pruebaController.borrarTrack();
        expect(pruebaController.tracks.length).toBe(99);
        for (var i = 0; i < 35; i++) {
            pruebaController.trackActivo=i;
            pruebaController.borrarTrack();
        }
        expect(pruebaController.tracks.length).toBe(64);
        for (var i = 0; i < 64; i++) {
            pruebaController.trackActivo=i;
            pruebaController.borrarTrack();
        }
        expect(pruebaController.tracks.length).toBe(0);
    });
    it("Creamos una ruta y la borramos", function() {

        pruebaController.crear(1);
        for (var i = 0; i < 100; i++) {
            pruebaController.anadirPuntoRForMap();
        }
        pruebaController.rutaActiva=0;
        pruebaController.borrarRuta();
        expect(pruebaController.rutas.length).toBe(0);
    });
    it("Creamos varias rutas y comprobamos que se borren ", function() {


        for (var i = 0; i < 100; i++) {
            pruebaController.crear(1);
        }
        pruebaController.rutaActiva=35;
        pruebaController.borrarRuta();
        expect(pruebaController.rutas.length).toBe(99);
        for (var i = 0; i < 35; i++) {
            pruebaController.rutaActiva=i;
            pruebaController.borrarRuta();
        }
        expect(pruebaController.rutas.length).toBe(64);
        for (var i = 0; i < 64; i++) {
            pruebaController.rutaActiva=i;
            pruebaController.borrarRuta();
        }
        expect(pruebaController.rutas.length).toBe(0);
    });
    it("Creamos un waypoint y lo borramos", function() {

        pruebaController.crear(2);

        pruebaController.wpActivo=0;
        pruebaController.borrarWp();
        expect(pruebaController.waypoints.length).toBe(0);
    });
    it("Creamos varios waypoints y comprobamos que se borren ", function() {


        for (var i = 0; i < 100; i++) {
            pruebaController.crear(2);
        }
        pruebaController.wpActivo=35;
        pruebaController.borrarWp();
        expect(pruebaController.waypoints.length).toBe(99);
        for (var i = 0; i < 35; i++) {
            pruebaController.wpActivo=i;
            pruebaController.borrarWp();
        }
        expect(pruebaController.waypoints.length).toBe(64);
        for (var i = 63; i >=0; i--) {
            pruebaController.wpActivo=i;
            pruebaController.borrarWp();
        }
        expect(pruebaController.waypoints.length).toBe(0);
    });

    it("Creamos varias entidades de los tres tipos y comprobamos que se borren correctamente", function() {


        for (var i = 0; i < 100; i++) {

            pruebaController.crear(2);
            pruebaController.crear(1);
        }

        pruebaController.wpActivo=35;
        pruebaController.borrarWp();


        pruebaController.rutaActiva=38;
        pruebaController.borrarRuta();
        expect(pruebaController.waypoints.length).toBe(99);
        expect(pruebaController.rutas.length).toBe(99);
        for (var i = 0; i < 35; i++) {
            pruebaController.wpActivo=i;
            pruebaController.borrarWp();
        }
        for (var i = 0; i < 23; i++) {
            pruebaController.rutaActiva=i;
            pruebaController.borrarRuta();
        }

        expect(pruebaController.waypoints.length).toBe(64);
        expect(pruebaController.rutas.length).toBe(76);

        for (var i = 63; i >=0; i--) {
            pruebaController.wpActivo=i;
            pruebaController.borrarWp();
        }
        for (var i = 75; i >=0; i--) {
            pruebaController.rutaActiva=i;
            pruebaController.borrarRuta();
        }

        expect(pruebaController.waypoints.length).toBe(0);
        expect(pruebaController.rutas.length).toBe(0);

    });
    it("Creamos varias entidades de los tres tipos y comprobamos que se borren correctamente", function() {


        for (var i = 0; i < 100; i++) {
            pruebaController.crear(2);

        }


        pruebaController.wpActivo=35;
        pruebaController.borrarWp();
        expect(service.waypoints.length).toBe(99);
        for (var i = 0; i < 35; i++) {
            pruebaController.wpActivo=i;
            pruebaController.borrarWp();
        }

        expect(service.wps).toBe(64);

        for (var i = 63; i >=0; i--) {
            pruebaController.wpActivo=i;
            pruebaController.borrarWp();
        }

        expect(service.waypoints.length).toBe(0);


        for (var i = 0; i < 100; i++) {
            pruebaController.crear(0);
        }
        pruebaController.trackActivo=35;
        pruebaController.borrarTrack();
        expect(pruebaController.tracks.length).toBe(99);
        for (var i = 0; i < 35; i++) {
            pruebaController.trackActivo=i;
            pruebaController.borrarTrack();
        }
        expect(pruebaController.tracks.length).toBe(64);
        for (var i = 0; i < 64; i++) {
            pruebaController.trackActivo=i;
            pruebaController.borrarTrack();
        }
        expect(pruebaController.tracks.length).toBe(0);
        for (var i = 0; i < 100; i++) {
            pruebaController.crear(1);
        }
        pruebaController.rutaActiva=35;
        pruebaController.borrarRuta();
        expect(pruebaController.rutas.length).toBe(99);
        for (var i = 0; i < 35; i++) {
            pruebaController.rutaActiva=i;
            pruebaController.borrarRuta();
        }
        expect(pruebaController.rutas.length).toBe(64);
        for (var i = 0; i < 64; i++) {
            pruebaController.rutaActiva=i;
            pruebaController.borrarRuta();
        }
        expect(pruebaController.rutas.length).toBe(0);
    });
    it("comprobacion de renombramiento", function() {
        for (var i = 0; i < 100; i++) {
            pruebaController.crear(0);
        }

        expect(pruebaController.tracks[78].nombre).toBe("Nuevo-Track78");
        expect(pruebaController.tracks.length).toBe(100);
        pruebaController.trackActivo=78;
        service.trackActivo=78;
        service.renombrarT("pedro");
        expect(pruebaController.tracks[78].nombre).toBe("pedro");
        for (var i = 0; i < 100; i++) {
            pruebaController.crear(1);
        }

        expect(pruebaController.rutas[64].nombre).toBe("Nueva-Ruta64");
        expect(pruebaController.rutas.length).toBe(100);
        pruebaController.rutaActiva=64;
        service.rutaActiva=64;
        service.renombrarR("pedro");
        expect(pruebaController.rutas[64].nombre).toBe("pedro");
        for (var i = 0; i < 100; i++) {
            pruebaController.crear(2);
        }

        expect(pruebaController.waypoints[68].nombre).toBe("Nuevo-Waypoint68");
        expect(pruebaController.waypoints.length).toBe(100);
        pruebaController.wpActivo=68;
        service.wpActivo=68;
        service.renombrarW("pedro");
        expect(pruebaController.waypoints[68].nombre).toBe("pedro");
    });
    it("Eliminacion de puntos en track", function() {

        pruebaController.crear(0);
        for (var i = 0; i < 100; i++) {
            pruebaController.anadirPuntoTForMap();
        }


        expect(pruebaController.tracks[0]['puntos'].length).toBe(100);
        service.trackActivo=0;
        service.puntoElegido=50;
        service.eliminarPuntoTrack()
        ;expect(pruebaController.tracks[0]['puntos'].length).toBe(99);
        service.trackActivo=0;
        service.puntoElegido=56;
        service.eliminarPuntoTrack()
        ;expect(pruebaController.tracks[0]['puntos'].length).toBe(98);
        service.trackActivo=0;
        service.puntoElegido=57;
        service.eliminarPuntoTrack()
        ;expect(pruebaController.tracks[0]['puntos'].length).toBe(97);
        service.trackActivo=0;
        service.puntoElegido=60;
        service.eliminarPuntoTrack()
        ;expect(pruebaController.tracks[0]['puntos'].length).toBe(96);


    });
    it("Eliminacion de puntos en ruta", function() {

        pruebaController.crear(1);
        for (var i = 0; i < 100; i++) {
            pruebaController.anadirPuntoRForMap();
        }


        expect(pruebaController.rutas[0]['puntos'].length).toBe(100);
        service.rutaActiva=0;
        service.puntoElegido=64;
        service.eliminarPuntoRuta();
        expect(pruebaController.rutas[0]['puntos'].length).toBe(99);
        service.rutaActiva=0;
        service.puntoElegido=67;
        service.eliminarPuntoRuta();
        expect(pruebaController.rutas[0]['puntos'].length).toBe(98);
        service.rutaActiva=0;
        service.puntoElegido=68;
        service.eliminarPuntoRuta();
        expect(pruebaController.rutas[0]['puntos'].length).toBe(97);
        service.rutaActiva=0;
        service.puntoElegido=72;
        service.eliminarPuntoRuta();
        expect(pruebaController.rutas[0]['puntos'].length).toBe(96);
        service.rutaActiva=0;
        service.puntoElegido=75;
        service.eliminarPuntoRuta();
        expect(pruebaController.rutas[0]['puntos'].length).toBe(95);

    });
    it("Añadir puntos intermedios al track", function() {

        pruebaController.crear(0);
        for (var i = 0; i < 100; i++) {
            pruebaController.anadirPuntoTForMap();
        }


        expect(pruebaController.tracks[0]['puntos'].length).toBe(100);
        service.trackActivo=0;
        service.puntoElegido=50;
        service.anadirPuntoTrack();
        expect(pruebaController.tracks[0]['puntos'].length).toBe(101);
        service.trackActivo=0;
        service.puntoElegido=56;
        service.anadirPuntoTrack()
        ;expect(pruebaController.tracks[0]['puntos'].length).toBe(102);
        service.trackActivo=0;
        service.puntoElegido=57;
        service.anadirPuntoTrack()
        ;expect(pruebaController.tracks[0]['puntos'].length).toBe(103);
        service.trackActivo=0;
        service.puntoElegido=60;
        service.anadirPuntoTrack()
        ;expect(pruebaController.tracks[0]['puntos'].length).toBe(104);


    });
    it("Añadir  puntos intermedios a la ruta", function() {

        pruebaController.crear(1);
        for (var i = 0; i < 100; i++) {
            pruebaController.anadirPuntoRForMap();
        }


        expect(pruebaController.rutas[0]['puntos'].length).toBe(100);
        service.rutaActiva=0;
        service.puntoElegido=64;
        service.anadirPuntoRuta();
        expect(pruebaController.rutas[0]['puntos'].length).toBe(101);
        service.rutaActiva=0;
        service.puntoElegido=67;
        service.anadirPuntoRuta();
        expect(pruebaController.rutas[0]['puntos'].length).toBe(102);
        service.rutaActiva=0;
        service.puntoElegido=68;
        service.anadirPuntoRuta();
        expect(pruebaController.rutas[0]['puntos'].length).toBe(103);
        service.rutaActiva=0;
        service.puntoElegido=72;
        service.anadirPuntoRuta();
        expect(pruebaController.rutas[0]['puntos'].length).toBe(104);
        service.rutaActiva=0;
        service.puntoElegido=75;
        service.anadirPuntoRuta();
        expect(pruebaController.rutas[0]['puntos'].length).toBe(105);

    });
    it("Recortar un track", function() {

        pruebaController.crear(0);
        for (var i = 0; i < 100; i++) {
            pruebaController.anadirPuntoTForMap();
        }

        pruebaController.crear(0);
        pruebaController.crear(0);
        service.puntoElegido=50;
        service.recortarTrack();

        expect(service.tracks[service.tracks.length-1].puntos.length).toBe(50);
        expect(service.tracks[service.tracks.length-2].puntos.length).toBe(51);
        expect(service.tracks[0].puntos.length).toBe(100);


    });
    it("Recortar una ruta", function() {

        pruebaController.crear(1);
        for (var i = 0; i < 100; i++) {
            pruebaController.anadirPuntoRForMap();
        }

        pruebaController.crear(1);
        pruebaController.crear(1);
        service.puntoElegido=85;
        service.recortarRuta();

        expect(service.rutas[service.rutas.length-1].puntos.length).toBe(15);
        expect(service.rutas[service.rutas.length-2].puntos.length).toBe(86);
        expect(service.rutas[0].puntos.length).toBe(100);



    });
    it("Unir dos tracks", function() {

        pruebaController.crear(0);
        for (var i = 0; i < 50; i++) {
            pruebaController.anadirPuntoTForMap();
        }
        pruebaController.crear(0);
        service.trackActivo=1;
        for (var i = 0; i < 50; i++) {
            pruebaController.anadirPuntoTForMap();
        }

        pruebaController.crear(0);
        service.trackActivo=0;
        service.unirTrack(1);

        expect(service.tracks[service.tracks.length-1].puntos.length).toBe(100);
        expect(service.tracks[service.tracks.length-2].puntos.length).toBe(50);
        expect(service.tracks[0].puntos.length).toBe(50);


    });
    it("Unir dos rutas", function() {

        pruebaController.crear(1);
        for (var i = 0; i < 50; i++) {
            pruebaController.anadirPuntoRForMap();
        }
        pruebaController.crear(1);
        service.rutaActiva=1;
        for (var i = 0; i < 50; i++) {
            pruebaController.anadirPuntoRForMap();
        }

        pruebaController.crear(1);
        service.rutaActiva=0;
        service.unirRuta(1);

        expect(service.rutas[service.rutas.length-1].puntos.length).toBe(100);
        expect(service.rutas[service.rutas.length-2].puntos.length).toBe(50);
        expect(service.rutas[0].puntos.length).toBe(50);


    });
    it("Invertir un track", function() {

        pruebaController.crear(0);
        for (var i = 0; i < 50; i++) {
            service.anadirPunto(0,0,i);
        }
            console.log(service.tracks[0].puntos);
        expect(service.tracks[0].puntos[45].numero).toBe(45);
        expect(service.tracks[0].puntos.length).toBe(50);
        service.trackActivo=0;
        service.invertirTrack();

        expect(service.tracks[0].puntos[49].numero).toBe(0);
        expect(service.tracks[0].puntos[0].numero).toBe(49);
        expect(service.tracks[0].puntos.length).toBe(50);


    });
    it("Invertir una ruta", function() {

        pruebaController.crear(1);
        for (var i = 0; i < 50; i++) {
            service.anadirPunto(1,0,i);
        }
        console.log(service.rutas[0].puntos);
        expect(service.rutas[0].puntos[45].numero).toBe(45);
        expect(service.rutas[0].puntos.length).toBe(50);
        service.rutaActiva=0;
        service.invertirRuta();

        expect(service.rutas[0].puntos[49].numero).toBe(0);
        expect(service.rutas[0].puntos[0].numero).toBe(49);
        expect(service.rutas[0].puntos.length).toBe(50);


    });
    it("Prueba completa con distintos tracks y rutas con las distintas funciones (union,rocorte,borrar,añadir puntos)", function() {

        //Probamos a invertir una ruta y un track
        pruebaController.crear(1);
        for (var i = 0; i < 50; i++) {
            service.anadirPunto(1,0,i);
        }
        pruebaController.crear(0);
        for (var i = 0; i < 50; i++) {
            service.anadirPunto(0,0,i);
        }
        expect(service.rutas[0].puntos[45].numero).toBe(45);
        expect(service.rutas[0].puntos.length).toBe(50);
        service.rutaActiva=0;
        service.invertirRuta();

        expect(service.rutas[0].puntos[49].numero).toBe(0);
        expect(service.rutas[0].puntos[0].numero).toBe(49);
        expect(service.rutas[0].puntos.length).toBe(50);

        expect(service.tracks[0].puntos[45].numero).toBe(45);
        expect(service.tracks[0].puntos.length).toBe(50);
        service.trackActivo=0;
        service.invertirTrack();

        expect(service.tracks[0].puntos[49].numero).toBe(0);
        expect(service.tracks[0].puntos[0].numero).toBe(49);
        expect(service.tracks[0].puntos.length).toBe(50);

        //Probamos a unir dos rutas y dos tracks
        pruebaController.crear(1);
        service.rutaActiva=1;
        for (var i = 0; i < 50; i++) {
            service.anadirPunto(1,1,i);
        }
        service.rutaActiva=0;
        pruebaController.crear(1);
        service.unirRuta(1);

        expect(service.rutas[service.rutas.length-1].puntos.length).toBe(100);
        expect(service.rutas[service.rutas.length-2].puntos.length).toBe(50);
        expect(service.rutas[0].puntos.length).toBe(50);

        pruebaController.crear(0);
        service.trackActivo=1;
        for (var i = 0; i < 50; i++) {
            service.anadirPunto(0,1,i);
        }
        service.trackActivo=0;
        pruebaController.crear(0);
        service.unirTrack(1);

        expect(service.tracks[service.tracks.length-1].puntos.length).toBe(100);
        expect(service.tracks[service.tracks.length-2].puntos.length).toBe(50);
        expect(service.tracks[0].puntos.length).toBe(50);

        //Probamos a crear dos nuevos tracks y rutas y unirlos
        pruebaController.crear(0);
        service.trackActivo=3;
        for (var i = 0; i < 50; i++) {
            service.anadirPunto(0,3,i);
        }
        service.trackActivo=3;
        pruebaController.crear(0);
        service.unirTrack(1);

        expect(service.tracks[service.tracks.length-1].puntos.length).toBe(100);
        expect(service.tracks[service.tracks.length-2].puntos.length).toBe(50);
        expect(service.tracks[0].puntos.length).toBe(50);

        //Vamos a unir los dos tracks que han salido d elas dos uniones anteriores


        pruebaController.crear(0);
        service.trackActivo=4;
        service.unirTrack(2);
        expect(service.tracks[5].puntos.length).toBe(200);

        //Vamos a recortar el track que acabamos de unir

        pruebaController.crear(0);
        pruebaController.crear(0);
        service.puntoElegido=125;
        service.trackActivo=5;
        service.recortarTrack();

        expect(service.tracks[service.tracks.length-1].puntos.length).toBe(75);
        expect(service.tracks[service.tracks.length-2].puntos.length).toBe(126);
        expect(service.tracks[5].puntos.length).toBe(200);
        //Vamos a borrar todas las entidades
        service.trackActivo =7;
        service.borrarTrack();
        service.trackActivo =6;
        service.borrarTrack();
        service.trackActivo =5;
        service.borrarTrack();
        service.trackActivo =4;
        service.borrarTrack();
        service.trackActivo =3;
        service.borrarTrack();
        service.trackActivo =2;
        service.borrarTrack();
        service.trackActivo =1;
        service.borrarTrack();
        service.trackActivo =0;
        service.borrarTrack();
        expect(service.tracks.length).toBe(0);
        service.rutaActiva =2;
        service.borrarRuta();
        service.rutaActiva =1;
        service.borrarRuta();
        service.rutaActiva =0;
        service.borrarRuta();
        expect(service.rutas.length).toBe(0);
        //Volvemos a crear tracks y rutas y vamos a probar a recortalos y luego unirlos
        pruebaController.crear(1);
        for (var i = 0; i < 100; i++) {
            service.anadirPunto(1,0,i);
        }
        pruebaController.crear(0);
        for (var i = 0; i < 100; i++) {
            service.anadirPunto(0,0,i);
        }
        pruebaController.crear(0);
        pruebaController.crear(0);
        service.puntoElegido=54;
        service.trackActivo=0;
        service.recortarTrack();

        expect(service.tracks[service.tracks.length-1].puntos.length).toBe(46);
        expect(service.tracks[service.tracks.length-2].puntos.length).toBe(55);

        pruebaController.crear(1);
        pruebaController.crear(1);
        service.puntoElegido=54;
        service.rutaActiva=0;
        service.recortarRuta();

        expect(service.rutas[service.rutas.length-1].puntos.length).toBe(46);
        expect(service.rutas[service.rutas.length-2].puntos.length).toBe(55);

        pruebaController.crear(0);
        service.trackActivo=2;
        service.unirTrack(1);
        expect(service.tracks[3].puntos.length).toBe(101);

        pruebaController.crear(1);
        service.rutaActiva=2;
        service.unirRuta(1);
        expect(service.rutas[3].puntos.length).toBe(101);

        service.trackActivo=3;
        service.invertirTrack();
        console.log(service.tracks[3].puntos);
        expect(service.tracks[3].puntos[99].numero).toBe(55);
        expect(service.tracks[3].puntos[0].numero).toBe(54);
        service.trackActivo =3;
        service.borrarTrack();
        service.trackActivo =2;
        service.borrarTrack();
        service.trackActivo =1;
        service.borrarTrack();
        service.trackActivo =0;
        service.borrarTrack();
        expect(service.tracks.length).toBe(0);
        service.rutaActiva =3;
        service.borrarRuta();
        service.rutaActiva =2;
        service.borrarRuta();
        service.rutaActiva =1;
        service.borrarRuta();
        service.rutaActiva =0;
        service.borrarRuta();
        expect(service.rutas.length).toBe(0);
    });
});
