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
        service.crear = function (id) {

        switch (id) {
          case 0:
            service.entidad = {
              nombre: "Nuevo-Track",
              distancia: 0,
              desnivelP: 0,
              desnivelN:0,
              elevMax:0,
              elevMin:0,
              puntos:[],
              numero: service.tracks.length,
            };
            service.tracks.push(service.entidad);
            break;
          case 1:
          service.entidad = {
            nombre: "Nueva-Ruta",
            distancia: 0,
            desnivelP: 0,
            desnivelN:0,
            elevMax:0,
            elevMin:0,
            puntos:[],
            numero:service.rutas.length,
          };
          service.rutas.push(service.entidad);
            break;
          case 2:
          service.entidad = {
            nombre: "Nuevo-Waypoint",
            latitud: 0,
            longitud:0,
            elevacion:0,
            numero: service.waypoints.length,
          };
          service.waypoints.push(service.entidad);
            break;
        }
        return service.entidad;
      }

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
    module('Prueba');

  });


  var $controller;
var pruebaController;
var scope;
beforeEach(inject(function (_$controller_,$rootScope,EntidadesServiceErrorMock) {
  $controller = _$controller_;
  scope = $rootScope;
  pruebaController =
    $controller('PruebaController',
                {$scope:scope,EntidadesService: EntidadesServiceErrorMock});

}));

  it("Deberia crear un track", function() {

    expect(pruebaController.crear(0)['nombre']).toBe("Nuevo-Track");
  });
  it("Deberia crear una ruta", function() {

    expect(pruebaController.crear(1)['nombre']).toBe("Nueva-Ruta");
  });
  it("Deberia crear un waypoint", function() {

    expect(pruebaController.crear(2)['nombre']).toBe("Nuevo-Waypoint");
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
    expect(pruebaController.waypoints[201]['nombre']).toBe("Nuevo-Waypoint");
    expect(pruebaController.rutas[121]['nombre']).toBe("Nueva-Ruta");
    expect(pruebaController.tracks[78]['nombre']).toBe("Nuevo-Track");
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

});
