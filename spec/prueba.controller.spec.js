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
        service.anadirPunto = function (id,num) {
          service.punto = {
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
    module('chart.js');
    module('ngAnimate');
    module('ngSanitize');
    module('ngCsv');
    module('GPS');

  });


  var $controller;
var pruebaController;
var scope;
var documentt;
var service;
beforeEach(inject(function (_$controller_,$rootScope,EntidadesServiceErrorMock,$document) {
  $controller = _$controller_;
  scope = $rootScope;
  documentt = $document;
  service = EntidadesServiceErrorMock;
  pruebaController =
    $controller('PruebaController',
                {$scope:scope,EntidadesService: service,$document:documentt});

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
});
