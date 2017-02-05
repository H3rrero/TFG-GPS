(function () {
  'use strict'
angular.module('Prueba',['chart.js','ngAnimate','ngSanitize', 'ngCsv'])
//Contrador encargado de la visualización de contenido en el html.
.controller('PruebaController',PruebaController)
//COntroldor encargado de crear la gráfica d ela aplicación
.controller('LineCtrl',LineCtrl)
//Directiva que se encarga d ela creacion del mapa de la aplicación
.directive('myMap', Mymap)
//servicio que manejara y proporcionara las entidades (tracks,rutas y waypoints)
.service('EntidadesService',EntidadesService);


  function PruebaController($scope,EntidadesService){
    var list1 = this;
    console.log("holii");
    console.log(this);
    //track seleccionado por el usuario
    list1.trackActivo = 0;
    list1.rutaActiva = 0;
    //identificadores que usamos en los swich-case del servicio
    list1.numTrack=0;
    list1.numRuta=1;
    list1.numWaypoint=2;

    //Actulizamos los elementos del controlador con los del servicio
    list1.tracks = EntidadesService.tracks;
    list1.rutas = EntidadesService.rutas;
    list1.waypoints = EntidadesService.waypoints;
    list1.puntosTrackActivo = EntidadesService.puntosTrackActivo;
    list1.modoCreacion = false;
    EntidadesService.modoCreacion = false;
    list1.mostrarMensaje =false;

    list1.invertirTrack = function () {
      EntidadesService.invertirTrack();
    }

    //FUncion que activa o desactiva el modo creacion de los waypoints
    list1.crearWaypoint = function () {
      if(EntidadesService.isWaypoint == false || EntidadesService.isWaypoint == undefined){
      EntidadesService.isWaypoint = true;
      EntidadesService.isTrack = false;
      list1.modoCreacion = true;
      EntidadesService.modoCreacion = true;
    }else {
        EntidadesService.isWaypoint = false;
        list1.modoCreacion = false;
        EntidadesService.modoCreacion = false;
      }
    }

    //Detectamos si pulsa la tecla escape y si el modo creacion de waypoints esta actuivado pues lo desactivamos
    document.onkeydown = function (e) {
      if ( !e.metaKey ) {
        e.preventDefault();
      }
      var boton = document.getElementById("botonCrearW");
      console.log(EntidadesService.modoCreacion);
      if (EntidadesService.modoCreacion == true) {
        boton.click();
      }
    };

    //FUncion que pide al usuario una fecha y una velocidad y calcula los tiempos del track a partir de esos datos
    list1.cambiarTiempos = function () {
      //Solo ejecutamos la funcion si hay algun tracl creado y si en el momento actual se esta modificando un track
      if(EntidadesService.tracks.length>0 && EntidadesService.isTrack == true){
      var velocidad = prompt("Velocidad del recorrido en km/h (no incluya la unidad, solo el numero)", "4");
      var velocidadInt = parseInt(velocidad);
      //Si la velocidad introducida no es correcta y la operacion no se ha cancelado se vuelve a pedir la velocidad
      while (isNaN(velocidadInt) == true && velocidad != null) {
          velocidad = prompt("Por favor introduzca una velocidad correcta en km/h (no incluya la unidad, solo el numero)", "4");
          velocidadInt = parseInt(velocidad);
          //Si la operacion es cancelada por el usuario se sale del while
          if (velocidad==null) {
            break;
          }
      }
      console.log(velocidadInt);
      //Si la operacion no ha sido cancelada se pide la fecha al ususario
      if(velocidad!= null)
      var fechas = prompt("Introduca año,mes,dia,hora,minutos separados por comas","2017,01,01,00,00");
      //Si la operacion ha sido cancelada no se ejecutara este if
      if(fechas!=null && velocidad != null){
      var cadena = fechas.split(",");
      console.log(velocidad);
      console.log(fechas);
      var fecha = new Date(cadena[0],cadena[1],cadena[2],cadena[3],cadena[4],"00","00");
      console.log(fecha);
      //Si la fecha es incorrecta  se vuelve a pedir
      while (fecha == "Invalid Date") {
        fechas = prompt("La fecha no se ha introducido en el formato indicado por favor introduca año,mes,dia,hora,minutos separados por comas","2017,01,01,00,00");
        //Si se cancela la operacion se sale del while
        if (fechas == null) {
          break;
        }else {
          cadena = fechas.split(",");
          fecha = new Date(cadena[0],cadena[1],cadena[2],cadena[3],cadena[4],"00","00");
        }
      }
      //Si la operacio ha sido cancelada no se ejecutara el metodo
      if (fechas !=null) {
        EntidadesService.cambiarTiempos(parseInt(velocidad),fecha);
        list1.actualizarPuntosT();
      }
    }}
}
    //Metodo que crea entidades
    list1.crear = function (id) {
      //Actualizamos la entidad que esta activa antes de llamar al servicio
      EntidadesService.trackActivo = list1.trackActivo;
      EntidadesService.rutaActiva = list1.rutaActiva;
      if(EntidadesService.isWaypoint==true)
      {
        list1.mostrarMensaje = true;
      }else {
        list1.mostrarMensaje = false;
      }
      //llamamos al metodo crear del servicio
       EntidadesService.crear(id);
       if (id==0) {
         if(list1.mostrarTabla==true)
            list1.mostrarTabla = false;
          else {
            list1.mostrarTabla = true;
          }
         list1.verTablaT();
       }
       if (id==1) {
         if(list1.mostrarTabla==true)
            list1.mostrarTabla = false;
            else {
              list1.mostrarTabla = true;
            }
         list1.verTablaR();
       }
    }

    //Es llamado desde el evento click del mapa y añade un punto al track activo
    list1.anadirPuntoTForMapI = function (latitud,longitud) {
        //Actualizamos el track activo antes de realizar las operaciones
        list1.trackActivo = EntidadesService.trackActivo;
       //llamamos al metodo del servicio que se encarga de añadir los puntos
       EntidadesService.anadirPunto(list1.numTrack,EntidadesService.trackActivo,latitud,longitud);
       //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
       list1.actualizarPuntosT();



    }

    //Es llamado desde el evento click del mapa y añade un punto al track activo
    list1.anadirPuntoTForMap = function (latitud,longitud) {
        //Actualizamos el track activo antes de realizar las operaciones
        list1.trackActivo = EntidadesService.trackActivo;
       //llamamos al metodo del servicio que se encarga de añadir los puntos
       EntidadesService.anadirPunto(list1.numTrack,EntidadesService.trackActivo,latitud,longitud);
       //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
       list1.actualizarPuntosT();
       $scope.$apply();


    }
    //Es llamado desde el evento click del mapa y añade un punto a la ruta activa
  list1.anadirPuntoRForMapI = function (latitud,longitud) {
    //Actualizamosla ruta activa antes de realizar las operaciones
      list1.rutaActiva = EntidadesService.rutaActiva;
    //llamamos al metodo del servicio que se encarga de añadir los puntos
     EntidadesService.anadirPunto(list1.numRuta,EntidadesService.rutaActiva,latitud,longitud);
     //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
     list1.actualizarPuntosR();
     $scope.$apply();


  }
      //Es llamado desde el evento click del mapa y añade un punto a la ruta activa
    list1.anadirPuntoRForMap = function (latitud,longitud) {
      //Actualizamosla ruta activa antes de realizar las operaciones
        list1.rutaActiva = EntidadesService.rutaActiva;
      //llamamos al metodo del servicio que se encarga de añadir los puntos
       EntidadesService.anadirPunto(list1.numRuta,EntidadesService.rutaActiva,latitud,longitud);
       //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
       list1.actualizarPuntosR();
       $scope.$apply();


    }
    //Actualiza los puntos de los tracks para que los componenetes que los
    // necesiten tengan la ultima version de los puntos
    list1.actualizarPuntosT = function() {
      //Es necesario para que el el servicio sepa que tipo de entidad esta manejando
      EntidadesService.isTrack = true;
      EntidadesService.isWaypoint = false;
      list1.modoCreacion = false;
      EntidadesService.modoCreacion = false;
        EntidadesService.trackActivo = list1.trackActivo;
         EntidadesService.actualizarPuntosT();
         list1.puntosTrackActivo = EntidadesService.puntosTrackActivo;

    }
    //Actualiza los puntos de las rutas para que los componenetes que los
    // necesiten tengan la ultima version de los puntos
    list1.actualizarPuntosR = function() {
      //Es necesario para que el el servicio sepa que tipo de entidad esta manejando
      EntidadesService.isTrack = false;
      EntidadesService.isWaypoint = false;
      list1.modoCreacion = false;
      EntidadesService.modoCreacion = false;
      EntidadesService.rutaActiva = list1.rutaActiva;
       EntidadesService.actualizarPuntosR();
       list1.puntosTrackActivo = EntidadesService.puntosTrackActivo;
    }
    //Comprobamos desde que navegador accede el usuario a nuestra aplicación
    list1.esIE = /*@cc_on!@*/false || !!document.documentMode;
    list1.isEdge = !list1.isIE && !!window.StyleMedia;
    list1.isChrome = !!window.chrome && !!window.chrome.webstore;
    list1.isFirefox = typeof InstallTrigger !== 'undefined';
    list1.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
    if (  list1.isIE || list1.isEdge) {
      list1.esIE=true;
      list1.isSafari = false;
      list1.isChrome = false;
      list1.isFirefox = false;
    } else if (  list1.isChrome) {
      list1.esIE=false;
      list1.isSafari = false;
      list1.isChrome = true;
      list1.isFirefox = false;
    }else if ( list1.isFirefox) {
      list1.esIE=false;
      list1.isSafari = false;
      list1.isChrome = false;
      list1.isFirefox = true;
    }else if (  list1.isSafari) {

      list1.esIE=false;
      list1.isSafari = true;
      list1.isChrome = false;
      list1.isFirefox = false;
  }

    //Funcion para la descarga de la imagen de tabla
    list1.dowImage = function () {
      var isIE = /*@cc_on!@*/false || !!document.documentMode;
      //Si el navegador es explorer se hace de manera diferente ya que no es compatible con el atributo download de html5
      if (isIE || list1.isEdge) {
        //Accedemos al canvas que tiene la imagen
        var canvas = document.getElementById("canvas");
        //Obtenemos su url
        list1.dataUrl = canvas.toDataURL("image/webp");
        var data = atob( list1.dataUrl.substring( "data:image/png;base64,".length ) ),
        asArray = new Uint8Array(data.length);

        for( var i = 0, len = data.length; i < len; ++i ) {
          asArray[i] = data.charCodeAt(i);
        }
        //creamos un objeto blob cuyo parámetro es una matriz que incluye el contenido deseado y el tipo del contenido
        var blob = new Blob( [ asArray.buffer ], {type: "image/png"} );
        //Usamos msSaveBlob para proporcionar la opción de descarga d ela imagen
        window.navigator.msSaveBlob(blob, 'prueba.png');
      }else if (list1.isSafari) {
        var canvas = document.getElementById("canvas");
        var link = document.getElementById("btn-downloadSA");
        list1.dataUrl = canvas.toDataURL("image/png");
      }
      else{
        //en los navegadores chroome y mozilla hacemos uso de la propiedad download para descargar la imagen
        var canvas = document.getElementById("canvas");
        list1.dataUrl = canvas.toDataURL("image/png");
      }
    }

      //Array que tiene el contenido de la tabla para ser descargado en formato csv
      $scope.getArray = [{a: "1", b:"43.083333",c:"-5.804077",d:"600m",e:"09:07",f:"0",g:"0",h:"4km/h"},
                        {a: "2", b:"43.207578",c:"-6.474243",d:"650m",e:"09:25",f:"50m",g:"1km",h:"4km/h"}
                        ,{a: "3", b:"42.982951",c:"-5.957886",d:"630m",e:"09:50",f:"-20m",g:"1.5km",h:"4km/h"},
                        {a: "4", b:"43.083333",c:"-5.804077",d:"600m",e:"09:07",f:"56m",g:"1,3km",h:"4km/h"},
                        {a: "5", b:"43.207578",c:"-6.474243",d:"650m",e:"09:25",f:"50m",g:"1km",h:"4km/h"}
                        ,{a: "6", b:"42.982951",c:"-5.957886",d:"630m",e:"09:50",f:"-20m",g:"1.5km",h:"4km/h"},
                        {a: "7", b:"43.083333",c:"-5.804077",d:"600m",e:"09:07",f:"-35m",g:"1.9km",h:"4km/h"},
                        {a: "8", b:"43.207578",c:"-6.474243",d:"650m",e:"09:25",f:"50m",g:"1km",h:"4km/h"}
                        ,{a: "9", b:"42.982951",c:"-5.957886",d:"630m",e:"09:50",f:"-20m",g:"1.5km",h:"4km/h"},
                        {a: "10", b:"43.083333",c:"-5.804077",d:"600m",e:"09:07",f:"50m",g:"1.0km",h:"4km/h"},
                        {a: "11", b:"43.207578",c:"-6.474243",d:"650m",e:"09:25",f:"50m",g:"1km",h:"4km/h"}
                        ,{a: "12", b:"42.982951",c:"-5.957886",d:"630m",e:"09:50",f:"-20m",g:"1.5km",h:"4km/h"},
                        {a: "13", b:"43.083333",c:"-5.804077",d:"600m",e:"09:07",f:"33m",g:"2.5km",h:"4km/h"},
                        {a: "14", b:"43.207578",c:"-6.474243",d:"650m",e:"09:25",f:"50m",g:"1km",h:"4km/h"}
                        ,{a: "15", b:"42.982951",c:"-5.957886",d:"630m",e:"09:50",f:"-20m",g:"1.5km",h:"4km/h"},
                        {a: "16", b:"43.083333",c:"-5.804077",d:"600m",e:"09:07",f:"76m",g:"3.4km",h:"4km/h"},
                        {a: "17", b:"43.207578",c:"-6.474243",d:"650m",e:"09:25",f:"50m",g:"1km",h:"4km/h"}
                        ,{a: "18", b:"42.982951",c:"-5.957886",d:"630m",e:"09:50",f:"-20m",g:"1.5km",h:"4km/h"},
                        {a: "19", b:"43.207578",c:"-6.474243",d:"650m",e:"09:25",f:"50m",g:"1km",h:"4km/h"}
                        ,{a: "20", b:"42.982951",c:"-5.957886",d:"630m",e:"09:50",f:"-20m",g:"1.5km",h:"4km/h"},
                        {a: "21", b:"43.083333",c:"-5.804077",d:"600m",e:"09:07",f:"98m",g:"0.9",h:"4km/h"},
                        {a: "22", b:"43.207578",c:"-6.474243",d:"650m",e:"09:25",f:"50m",g:"1km",h:"4km/h"}
                        ,{a: "23", b:"42.982951",c:"-5.957886",d:"630m",e:"09:50",f:"-20m",g:"1.5km",h:"4km/h"},
                        {a: "24", b:"43.083333",c:"-5.804077",d:"600m",e:"09:07",f:"45",g:"1.2",h:"4km/h"},
                        {a: "25", b:"43.207578",c:"-6.474243",d:"650m",e:"09:25",f:"50m",g:"1km",h:"4km/h"}
                        ,{a: "26", b:"42.982951",c:"-5.957886",d:"630m",e:"09:50",f:"-20m",g:"1.5km",h:"4km/h"},
                        {a: "27", b:"43.083333",c:"-5.804077",d:"600m",e:"09:07",f:"32",g:"2.0",h:"4km/h"},
                        {a: "28", b:"43.207578",c:"-6.474243",d:"650m",e:"09:25",f:"50m",g:"1km",h:"4km/h"}
                        ,{a: "29", b:"42.982951",c:"-5.957886",d:"630m",e:"09:50",f:"-20m",g:"1.5km",h:"4km/h"},
                        {a: "30", b:"43.207578",c:"-6.474243",d:"650m",e:"09:25",f:"50m",g:"1km",h:"4km/h"}];
       //Cabecera que tendrá la tabla en formato csv
       $scope.getHeader = function () {return ["Punto nº","Latitud","Longitud","Elevación","Hora","Desnivel","Distancia","Velocidad"]};

       //Activar la funciones de los track
       list1.funciones = false;
       //Activar la funciones de las rutas
       list1.funcionesR = false;
       //Activar la funciones de los waypoints
       list1.funcionesW = false;
       //Activar la lista de los track
       list1.activarLista = false;
       //Activar la lista de las rutas
       list1.activarListaR = false;
       //Activar la lista de los waypoints
       list1.activarListaW = false;
       //Mostrar la tabla puntos
       list1.mostrarTabla = false;
       //Mostrar la gráfica
       list1.mostrarGrafica = false;
       //Mostrar los botones que estan dentro de archivo en los track
       list1.mostrarBotones = false;
       //Mostrar los botones que estan dentro de archivo en las rutas
       list1.mostrarBotonesW=false;
       //Mostrar los botones que estan dentro de archivo en los waypoints
       list1.mostrarBotonesR = false;
       list1.mostrarAlert = true;

//Funcion que oculta el alerte que indica si el modoc reacion esta activado o desactivado
list1.noVerAlert = function () {
 list1.mostrarAlert = false;
}
       //oculta los botones que estan en archivo
       list1.noVerBotones = function () {
        list1.mostrarBotones = false;
        list1.mostrarBotonesR = false;
        list1.mostrarBotonesW = false;
      }
      //Mostar botones de rutas
      list1.verBotonesR = function () {
        if (list1.mostrarBotonesR==true) {
          list1.mostrarBotonesR = false;
        } else {
          list1.mostrarBotonesR=true;
        }

      }
      //Mostar botones de waypoints
      list1.verBotonesW = function () {
        if (list1.mostrarBotonesW==true) {
          list1.mostrarBotonesW = false;
        } else {
          list1.mostrarBotonesW=true;
        }

      }
      //Mostrar botones de track
      list1.verBotones = function () {
        if (list1.mostrarBotones==true) {
          list1.mostrarBotones = false;
        } else {
          list1.mostrarBotones=true;
        }

      }
      //superpone la tabla a la gráfica
      list1.superponerLista = function () {
          $("#lista").css("z-index", 2);
        $("#datos").css("z-index", 1);
         $("#grafica").css("z-index", 0);
      }
      //superpone la tabla a la gráfica
      list1.superponerTabla = function () {
          $("#lista").css("z-index", 0);
        $("#datos").css("z-index", 1);
         $("#grafica").css("z-index", 0);
      }
      //Superpone la gráfica a la tabla
      list1.superponerGrafica = function () {
        $("#datos").css("z-index", 0);
         $("#grafica").css("z-index", 1);
      }
      //Mostar u ocultar la tabla
      list1.verTablaT = function () {
        if (list1.mostrarTabla==true) {
          list1.mostrarTabla = false;
        } else {
          if(list1.tracks.length>0){
              list1.puntosTrackActivo= list1.tracks[list1.trackActivo]["puntos"];
              EntidadesService.puntosTrackActivo= list1.puntosTrackActivo;
              list1.actualizarPuntosT();
          }
          list1.mostrarTabla=true;
          list1.superponerTabla();
        }

      }
      //Mostar u ocultar la tabla
      list1.verTablaR = function () {

        if (list1.mostrarTabla==true) {
          list1.mostrarTabla = false;
        } else {

          if(list1.rutas.length>0){
              list1.puntosTrackActivo= list1.rutas[list1.rutaActiva]["puntos"];
              EntidadesService.puntosTrackActivo= list1.puntosTrackActivo;
              list1.actualizarPuntosR();
            }
          list1.mostrarTabla=true;
          list1.superponerTabla();
        }

      }
      //Mostar u ocultar la gráfica
      list1.verGrafica = function () {
        if (list1.mostrarGrafica==true) {
          list1.mostrarGrafica = false;
        } else {
          list1.mostrarGrafica=true;
          list1.superponerGrafica();
        }

      }
      //Mostar la lista de track
      list1.listaActiva = function () {
        list1.crear(0);
        list1.activarListaR = false;
        list1.activarListaW = false;
        list1.activarLista=true;

      }
      //Mostrar la lista de rutas
      list1.listaActivaR = function () {
        list1.crear(1);
        list1.activarLista = false;
        list1.activarListaW = false;
        list1.activarListaR=true;

      }
      //Mostrar la lista de waypoints
      list1.listaActivaW = function () {
        list1.activarListaR = false;
        list1.activarLista = false;
        list1.activarListaW=true;
        list1.crearWaypoint();

      }
      //Mostrar u ocultar la lista de rutas
      list1.listaR = function () {
        list1.activarListaW = false;
        list1.activarLista = false;
        if(EntidadesService.isWaypoint==true)
        {
          list1.mostrarMensaje = true;
        }else {
          list1.mostrarMensaje = false;
        }
        if (list1.activarListaR==true) {
          list1.activarListaR = false;
        } else {
          list1.activarListaR=true;
          EntidadesService.isTrack = false;

          console.log("mostrarMensaje");
          console.log(list1.mostrarMensaje);
          EntidadesService.isWaypoint = false;
          if(list1.mostrarTabla==true)
             list1.mostrarTabla = false;
           else {
             list1.mostrarTabla = true;
           }
          list1.verTablaR();
        }

      }
      //Mostar u ocultar la lista de waypoints
      list1.listaW = function () {
        list1.activarListaR = false;
        list1.activarLista = false;
        if (list1.activarListaW==true) {
          list1.activarListaW = false;
        } else {
          list1.activarListaW=true;
          EntidadesService.isWaypoint = false;
        }

      }
      //Mostrar u ocultar la lista de track
      list1.listaT = function () {
        list1.activarListaR = false;
        list1.activarListaW = false;
        if(EntidadesService.isWaypoint==true)
        {
          list1.mostrarMensaje = true;
        }else {
          list1.mostrarMensaje = false;
        }
        if (list1.activarLista==true) {
          list1.activarLista = false;
        } else {
          list1.activarLista=true;
          EntidadesService.isTrack = true;

          EntidadesService.isWaypoint = false;
          list1.modoCreacion = false;
          EntidadesService.modoCreacion = false;
          if(list1.mostrarTabla==true)
             list1.mostrarTabla = false;
           else {
             list1.mostrarTabla = true;
           }
          list1.verTablaT();
        }

      }
      //Muestra u coulta la lista de botones relacionados con los track
      list1.listarFunciones = function () {
        list1.funcionesR = false;
        list1.funcionesW = false;
        list1.mostrarBotones = false;
        list1.mostrarBotonesR = false;
        list1.mostrarBotonesw = false;
        if (list1.funciones==true) {
          list1.funciones = false;
        } else {
          list1.funciones=true;
        }

      }
      //Muestra u coulta la lista de botones relacionados con las rutas
      list1.listarFuncionesR = function () {
        list1.funciones = false;
        list1.funcionesW = false;
        list1.mostrarBotones = false;
        list1.mostrarBotonesR = false;
        list1.mostrarBotonesw = false;
        if (list1.funcionesR==true) {
          list1.funcionesR = false;
        } else {
          list1.funcionesR=true;
        }

      }
      //Muestra u coulta la lista de botones relacionados con los waypoints
      list1.listarFuncionesW = function () {
        list1.funciones = false;
        list1.funcionesR = false;
        list1.mostrarBotones = false;
        list1.mostrarBotonesR = false;
        list1.mostrarBotonesw = false;
        if (list1.funcionesW==true) {
          list1.funcionesW = false;
        } else {
          list1.funcionesW=true;
        }

      }
}

//funcion del servicio de entidades que se encarga de gestionar las distintas entidades de la aplicación
function EntidadesService (){
  var service = this;
  service.cont = 0;
  service.trackActivo = 0;
  service.rutaActiva = 0;
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

  //FUncion para invertir un track
  service.invertirTrack = function () {

    var puntos =new Array();
    console.log(puntos);
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
      console.log("Puntos antes de anteeeeeessss de seerrrr eliminarlos");
      console.log(service.tracks[service.trackActivo].puntos[variable]);
      puntos.push(service.tracks[service.trackActivo].puntos[variable]);
    }
    //Booramos los puntos actuales
    for (var i = service.tracks[service.trackActivo].puntos.length-1; i>=0; i--) {
      service.tracks[service.trackActivo].puntos.splice(i,1);
      service.puntosTrackActivo.splice(i,1);
    }
    //Asignamos una nueva fecha
    service.tracks[service.trackActivo].fecha = new Date();
    //Recorremos los puntos al reves para volver a añadirlos
    for (var i = puntos.length-1; i >= 0; i--) {
      console.log("Puntos mientras son anadidos");
      console.log(puntos[i]);
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

//Funcion que recalcula la duracion del track y de sus puntos en funcion de una velocidad y fecha dadas.
service.cambiarTiempos = function (velocidad,fecha) {
  service.velocidad = velocidad;
  service.tracks[service.trackActivo].duracionIda=service.calcularDuracion(true).toFixed(2);
  service.tracks[service.trackActivo].duracionVuelta=service.calcularDuracion(false).toFixed(2);
  service.tracks[service.trackActivo].fecha = fecha;
  //Se recorren todos los puntos y se les asiogna la nueva fecha y velocidad
  for (var item in service.puntosTrackActivo) {
    service.calcularDuracionPuntos(service.puntosTrackActivo[item]);
    service.calcularFecha(service.calcularDuracionPuntos(service.puntosTrackActivo[item]));
    service.puntosTrackActivo[item].fecha=service.tracks[service.trackActivo].fecha.getDate()+"/"+service.tracks[service.trackActivo].fecha.getMonth()+"/"+service.tracks[service.trackActivo].fecha.getFullYear();
    service.puntosTrackActivo[item].hora =service.tracks[service.trackActivo].fecha.getHours()+":"+service.ordenarMinutos();
    service.puntosTrackActivo[item].velocidad=service.velocidad;
  }
}

//Calcula la duracion de la ida y de la velta de un track
service.calcularDuracion= function (ida) {
  if (ida) {
    var hDesnivelSubida = (parseFloat(service.tracks[service.trackActivo].desnivelP)/400).toFixed(2);
    var hDesnivelBajada = (Math.abs(parseFloat(service.tracks[service.trackActivo].desnivelN)/600)).toFixed(2);
  } else {
    var hDesnivelSubida = (parseFloat(service.tracks[service.trackActivo].desnivelN)/400).toFixed(2);
    var hDesnivelBajada = (Math.abs(parseFloat(service.tracks[service.trackActivo].desnivelP)/600)).toFixed(2);
  }
  var hDistanciaHori = (parseFloat(service.tracks[service.trackActivo].distancia)/parseFloat(service.velocidad)).toFixed(2);
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
service.calcularDuracionPuntos= function (punto) {//desnivel  distancia
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
service.calcularFecha = function (horas) {
  var segundos = parseFloat(horas)*parseFloat(3600);
  service.tracks[service.trackActivo].fecha.setSeconds(segundos);
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
service.calcularDatosTrack = function (id,punto) {
  if (id==0) {
    service.tracks[service.trackActivo].distancia = (parseFloat(service.tracks[service.trackActivo].distancia)+(parseFloat(punto.distancia)/1000)).toFixed(2);
    if (parseFloat(punto.desnivel)>=0) {
        service.tracks[service.trackActivo].desnivelP = (parseFloat(punto.desnivel) + parseFloat(  service.tracks[service.trackActivo].desnivelP)).toFixed(2);
    }else {
      service.tracks[service.trackActivo].desnivelN = (parseFloat(punto.desnivel) + parseFloat(service.tracks[service.trackActivo].desnivelN)).toFixed(2);
    }
    if (parseFloat(punto.elevacion)>parseFloat(service.tracks[service.trackActivo].elevMax)) {
      service.tracks[service.trackActivo].elevMax=parseFloat(punto.elevacion).toFixed(2);
    }
    if (parseFloat(punto.elevacion)<parseFloat(service.tracks[service.trackActivo].elevMin)) {
     service.tracks[service.trackActivo].elevMin=parseFloat(punto.elevacion).toFixed(2);
    }
  } else {
    service.rutas[service.rutaActiva].distancia = (parseFloat(service.rutas[service.rutaActiva].distancia)+(parseFloat(punto.distancia)/1000)).toFixed(2);
    if (parseFloat(punto.desnivel)>=0) {
        service.rutas[service.rutaActiva].desnivelP = (parseFloat(punto.desnivel) + parseFloat(service.rutas[service.rutaActiva].desnivelP)).toFixed(2);
    }else {
      service.rutas[service.rutaActiva].desnivelN = (parseFloat(punto.desnivel) + parseFloat(service.rutas[service.rutaActiva].desnivelN)).toFixed(2);
    }
    if (parseFloat(punto.elevacion)>parseFloat(service.rutas[service.rutaActiva].elevMax)) {
      service.rutas[service.rutaActiva].elevMax=parseFloat(punto.elevacion).toFixed(2);
    }
    if (parseFloat(punto.elevacion)<parseFloat(service.rutas[service.rutaActiva].elevMin)) {
     service.rutas[service.rutaActiva].elevMin=parseFloat(punto.elevacion).toFixed(2);
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
//Cambia el color de las polilineas de los track y las rutas
service.colorPoly= function () {
  if (service.isTrack) {
    return '#3D04F9';
  } else {
    return '#C004F9';
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
      };
      service.waypoints.push(service.entidad);
      service.isWaypoint = true;
      service.isTrack = false;
        break;
    }
    return service.entidad;
  }

  service.calcularDesnivel = function ()
  {
    if(service.puntosTrackActivo.length>0){
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
        fecha:service.tracks[service.trackActivo].fecha.getDate()+"/"+service.tracks[service.trackActivo].fecha.getMonth()+"/"+service.tracks[service.trackActivo].fecha.getFullYear(),
        hora:service.tracks[service.trackActivo].fecha.getHours()+":"+service.ordenarMinutos(),
        desnivel:service.calcularDesnivel(),
        distancia: service.distancia,
        velocidad: 4,
      }
        if (service.tracks.length>0){
          console.log("Que punto llega?");
          console.log(service.punto);
          service.punto.numero = service.tracks[num]["puntos"].length;
        service.tracks[num]["puntos"].push(service.punto);
        service.calcularDatosTrack(0,service.punto);
        service.tracks[service.trackActivo].duracionIda = parseFloat(service.calcularDuracion(true)).toFixed(2);
        service.tracks[service.trackActivo].duracionVuelta = parseFloat(service.calcularDuracion(false)).toFixed(2);
        service.calcularFecha(service.calcularDuracionPuntos(service.punto));
        service.tracks[num]["puntos"][service.tracks[num]["puntos"].length-1].fecha=service.tracks[service.trackActivo].fecha.getDate()+"/"+service.tracks[service.trackActivo].fecha.getMonth()+"/"+service.tracks[service.trackActivo].fecha.getFullYear();
        service.tracks[num]["puntos"][service.tracks[num]["puntos"].length-1].hora =service.tracks[service.trackActivo].fecha.getHours()+":"+service.ordenarMinutos();
      }
        break;
      case 1:
      console.log("distancia");
      console.log(service.distancia);
      service.calcularFechaR(15);
      service.punto = {
        numero:0,
        latitud:latitud,
        longitud: longitud,
        elevacion: service.elevacion,
        fecha:service.rutas[service.rutaActiva].fecha.getDate()+"/"+service.rutas[service.rutaActiva].fecha.getMonth()+"/"+service.rutas[service.rutaActiva].fecha.getFullYear(),
        hora:service.rutas[service.rutaActiva].fecha.getHours()+":"+service.ordenarMinutosR(),
        desnivel:service.calcularDesnivel(),
        distancia: service.distancia,
        velocidad: 4,
      }
          if (service.rutas.length>0){
            service.punto.numero = service.rutas[num]["puntos"].length;
            service.rutas[num]["puntos"].push(service.punto);
            service.calcularDatosTrack(1,service.punto);
      }
        break;
    }

    return service.punto;
  }


}
function Mymap(EntidadesService) {
    // directive link function
    var link = function(scope, element, attrs,controller) {
        var map
        var poly
        var elevator
        function CoordMapType(tileSize) {
  this.tileSize = tileSize;
}
    //Creamos la cuadricula que se superpondra al mapa
    CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
      var div = ownerDocument.createElement('div');
      div.innerHTML = coord;
      div.style.width = this.tileSize.width + 'px';
      div.style.height = this.tileSize.height + 'px';
      div.style.fontSize = '10';
      div.style.borderStyle = 'solid';
      div.style.borderWidth = '1px';
      div.style.borderColor = '#AAAAAA';
      return div;
    };
        // funcion que inicializa el mapa
        function initMap() {
          //opciones de inicialización
          var mapOptions = {
            center: {lat: 40.41, lng: -3.70},
            zoom: 8,
            disableDefaultUI: true,
            mapTypeControl: true,
            scaleControl: true,
            visibleGridLines:true,
          };

          //objeto mapType d ela API de google maps para la creacion de mapas basados en mosaicos
          //en este caso estamos creando el mapa PNOA (ortofotomapa)
          var PNOAWMTS = new google.maps.ImageMapType({
            alt: "WMTS del PNOA",
            getTileUrl: function(coord, zoom) {

              return PNOAGetCoordUrl(coord, zoom);
            },
            isPng: false,
            maxZoom: 20,
            minZoom: 1,
            name: "PNOA ES",
            tileSize: new google.maps.Size(256, 256)
          });

          //objeto mapType d ela API de google maps para la creacion de mapas basados en mosaicos
          //en este caso estamos creando el mapa  Raster
          var RASTERWMTS = new google.maps.ImageMapType({
            alt: "RasterIGN",
            getTileUrl: function(coord, zoom) {
              console.log(RasterGetCoordUrl(coord, zoom));
              return RasterGetCoordUrl(coord, zoom);
            },
            isPng: false,
            maxZoom: 20,
            minZoom: 1,
            name: "Raster ES",
            tileSize: new google.maps.Size(256, 256)
          });

          //objeto mapType d ela API de google maps para la creacion de mapas basados en mosaicos
          //en este caso estamos creando el mapa Raster de francia
          var RASTERFR = new google.maps.ImageMapType({
            alt: "WMTS del PNOA",
            getTileUrl: function(coord, zoom) {

              return RasterFrGetCoordUrl(coord, zoom);
            },
            isPng: false,
            maxZoom: 20,
            minZoom: 1,
            name: "Raster FR",
            tileSize: new google.maps.Size(256, 256)
          });
          //Función que calcula las coordenadas y desvuelve la url para obtener las imagenes del mapa en esas coordenadas
          function RasterGetCoordUrl(tile, zoom) {

	           var projection = map.getProjection();
	           var zpow = Math.pow(2, zoom);
	           var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
	           var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
	           var ulw = projection.fromPointToLatLng(ul);
	           var lrw = projection.fromPointToLatLng(lr);

	           var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();

	           return "http://www.ign.es/wms-inspire/mapa-raster?request=GetMap&service=WMS&VERSION=1.3.0&LAYERS=mtn_rasterizado&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&CRS=EPSG:4326&WIDTH=250&HEIGHT=250&BBOX=" + bbox;
           }
           //Función que calcula las coordenadas y desvuelve la url para obtener las imagenes del mapa en esas coordenadas
           function PNOAGetCoordUrl(tile, zoom) {

 	           var projection = map.getProjection();
 	           var zpow = Math.pow(2, zoom);
 	           var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
 	           var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
 	           var ulw = projection.fromPointToLatLng(ul);
 	           var lrw = projection.fromPointToLatLng(lr);

 	           var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();

 	           return "http://www.ign.es/wms-inspire/pnoa-ma?request=GetMap&service=WMS&VERSION=1.3.0&LAYERS=OI.OrthoimageCoverage&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&CRS=EPSG:4326&WIDTH=250&HEIGHT=250&BBOX=" + bbox;
           }
           //Función que calcula las coordenadas y desvuelve la url para obtener las imagenes del mapa en esas coordenadas
           function RasterFrGetCoordUrl(tile, zoom) {

              var projection = map.getProjection();
              var zpow = Math.pow(2, zoom);
              var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
              var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
              var ulw = projection.fromPointToLatLng(ul);
              var lrw = projection.fromPointToLatLng(lr);

              var bbox = ulw.lng() + "," + ulw.lat() + "," + lrw.lng() + "," + lrw.lat();

              return "http://mapsref.brgm.fr/WMS-C-REF/?request=GetMap&service=WMS&VERSION=1.1.1&LAYERS=REF93&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:4326&WIDTH=250&HEIGHT=250&BBOX="+bbox+"&WIDTH=256&HEIGHT=256";
           }
           //Creamos el mapa y le pasamos las opciones que definimos anteriormente
           map = new google.maps.Map(element[0],mapOptions);
           //servicio de elevacion
            elevator = new google.maps.ElevationService;
           //Le pasamos al mapa la cuadricula que creamos anteriormente
           map.overlayMapTypes.insertAt(
             0, new CoordMapType(new google.maps.Size(256, 256)));
           //Definimos los mapas creados como dos nuevos tipos de mapas
           map.mapTypes.set('PNOA ES', PNOAWMTS);
           map.mapTypes.set('Raster ES', RASTERWMTS);
           map.mapTypes.set('Raster FR', RASTERFR);

           map.setOptions(
            {
              //cofiguramos las opciones de controles del mapa
              mapTypeControlOptions: {
              //lo vamos a colocar en la posicion arriba a la derecha (dentro del mapa)
              position: google.maps.ControlPosition.TOP_RIGHT,
              //menu desplegable
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              // por ultimo le añadimos los mapas que s epodran visualizar
              mapTypeIds: [  google.maps.MapTypeId.ROADMAP,

                google.maps.MapTypeId.SATELLITE
                ,'PNOA ES','Raster ES','Raster FR'

              ]
              }
            }
          );



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



    // evento click para añadir puntos
    map.addListener('click', addLatLng,elevator);
    EntidadesService.mapa = map;
        }
        //Calcula la distancia entre dos puntos del mapa
        var calcularDistancias = function (latlng) {
          if(EntidadesService.puntosTrackActivo.length>0){
          var _kCord = new google.maps.LatLng(EntidadesService.puntosTrackActivo[EntidadesService.puntosTrackActivo.length-1].latitud,
             EntidadesService.puntosTrackActivo[EntidadesService.puntosTrackActivo.length-1].longitud);
          EntidadesService.distancia = google.maps.geometry.spherical.computeDistanceBetween(latlng, _kCord).toFixed(2);
        }else{
            EntidadesService.distancia = 0;
        }
        }
        // puncion que crea las polilineas y los puntos
        function addLatLng(event,elevation) {

          if(EntidadesService.modoInvertir == true){
            console.log("estoy en invertir");
          var evento =  new google.maps.LatLng(EntidadesService.latitudPInv, EntidadesService.longitudPInv);

            //Depende de que entidad sea llamamos a un metodo u otro
            if (EntidadesService.isTrack == true) {
                    EntidadesService.elevacion = EntidadesService.elevacionP;
                    calcularDistancias(evento);
                    console.log("latitud y longotud que llegan");
                    console.log(EntidadesService.latitudPInv);
                    console.log(EntidadesService.longitudPInv);
                    controller.anadirPuntoTForMapI(evento.lat().toFixed(6),evento.lng().toFixed(6));
            }
            else{
                    EntidadesService.elevacion = EntidadesService.elevacionP;
                    calcularDistancias(evento);
                    controller.anadirPuntoRForMapI(evento.lat().toFixed(6),evento.lng().toFixed(6));
            }

            //Si no tiene polilinea la creamos
            if (EntidadesService.tienePolyF()==false) {
              var lineSymbolarrow = {
                     path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                     strokeColor : EntidadesService.colorPoly(),
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
                strokeColor: EntidadesService.colorPoly(),
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
            path.push(evento);
            var image = {
              url: 'icono.png',

            };


            if (EntidadesService.isTrack == true) {
              // Creamos el marcador que indicara el punto creado en el mapa
              var marker = new google.maps.Marker({
                position: evento,
                title: "Inicio del track"+"\nLatitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6),
                icon: image,
                map: map
              });
              //Si no tiene ningun marcador todavia le añadimos el nuevo marcador
            if (EntidadesService.markersT[EntidadesService.trackActivo]===undefined) {
              var markers = [];
              markers.push(marker);
              EntidadesService.markersT[EntidadesService.trackActivo] = markers;
              //Si ya tiene un marcador(el de inicio) le añadimos el marcador de final
            } else if(EntidadesService.markersT[EntidadesService.trackActivo].length==1){
              marker.icon = "iconoFin.png";
              marker.title = "Final del track"+"\nLatitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6);
              EntidadesService.markersT[EntidadesService.trackActivo].push(marker);
              //Si ya tiene los dos marcadores pues sustituimos el marcador que indica el final por el nuevo marcador que inidicara el nuevo final del track
            }else{
              marker.icon = "iconoFin.png";
              marker.title = "Final del track"+"\nLatitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6);
              EntidadesService.markersT[EntidadesService.trackActivo][1].setMap(null);
              EntidadesService.markersT[EntidadesService.trackActivo][1]=marker;
            }
          }else {
            if (EntidadesService.wpRta[EntidadesService.rutaActiva]===undefined) {
              var nombre = "Waypoint Nº"+0;
              var marker = new google.maps.Marker({
                position: evento,
                title: "Nombre: "+nombre+"\nLatitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6),
                icon: 'iconowp.png',
                map: map
              });
            var wpsruta = [];
            wpsruta.push(marker);
            EntidadesService.wpRta[EntidadesService.rutaActiva] = wpsruta;
          }else {
            var nombre = "Waypoint Nº"+EntidadesService.wpRta[EntidadesService.rutaActiva].length;
            var marker = new google.maps.Marker({
              position: evento,
              title: "Nombre: "+nombre+"\nLatitud: "+evento.lat().toFixed(6)+"\nLongitud: "+evento.lng().toFixed(6),
              icon: 'iconowp.png',
              map: map
            });
            EntidadesService.wpRta[EntidadesService.rutaActiva].push(marker);
          }
          }

  }

          if ((EntidadesService.modoInvertir == false && EntidadesService.hayEntidadesCreadas==true && (EntidadesService.isTrack==true || EntidadesService.rutas.length>0)) || EntidadesService.isWaypoint == true) {
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
                console.log("no result found");
                controller.anadirPuntoTForMap(event.latLng.lat().toFixed(6),event.latLng.lng().toFixed(6));
                }
              } else {
              console.log("elevation service failed");
              controller.anadirPuntoTForMap(event.latLng.lat().toFixed(6),event.latLng.lng().toFixed(6));
              }
            });


          } else if(EntidadesService.isWaypoint == true){
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
                console.log("no result found");
                controller.crear(2);
                 scope.$apply();
                }
              } else {
              console.log("elevation service failed");
              controller.crear(2);
               scope.$apply();
              }
            });
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
                console.log("no result found");
                controller.anadirPuntoRForMap(event.latLng.lat().toFixed(6),event.latLng.lng().toFixed(6));
                }
              } else {
              console.log("elevation service failed");
              controller.anadirPuntoRForMap(event.latLng.lat().toFixed(6),event.latLng.lng().toFixed(6));
              }
            });
          }
          if(EntidadesService.isWaypoint == true){
            var nombre = "Nuevo-Waypoint"+EntidadesService.cont;
            EntidadesService.cont = EntidadesService.cont+1;
            var marker = new google.maps.Marker({
              position: event.latLng,
              title: "Nombre: "+nombre+"\nLatitud: "+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6),
              icon: 'iconowp.png',
              map: map
            });
            EntidadesService.markers.push(marker);
            console.log(EntidadesService.markers);
          }else{
          //Si no tiene polilinea la creamos
          if (EntidadesService.tienePolyF()==false) {
            var lineSymbolarrow = {
			             path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			             strokeColor : EntidadesService.colorPoly(),
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
              strokeColor: EntidadesService.colorPoly(),
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
            url: 'icono.png',

          };


          if (EntidadesService.isTrack == true) {
            // Creamos el marcador que indicara el punto creado en el mapa
            var marker = new google.maps.Marker({
              position: event.latLng,
              title: "Inicio del track"+"\nLatitud: "+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6),
              icon: image,
              map: map
            });
            //Si no tiene ningun marcador todavia le añadimos el nuevo marcador
          if (EntidadesService.markersT[EntidadesService.trackActivo]===undefined) {
            var markers = [];
            markers.push(marker);
            EntidadesService.markersT[EntidadesService.trackActivo] = markers;
            //Si ya tiene un marcador(el de inicio) le añadimos el marcador de final
          } else if(EntidadesService.markersT[EntidadesService.trackActivo].length==1){
            marker.icon = "iconoFin.png";
            marker.title = "Final del track"+"\nLatitud: "+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6);
            EntidadesService.markersT[EntidadesService.trackActivo].push(marker);
            //Si ya tiene los dos marcadores pues sustituimos el marcador que indica el final por el nuevo marcador que inidicara el nuevo final del track
          }else{
            marker.icon = "iconoFin.png";
            marker.title = "Final del track"+"\nLatitud: "+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6);
            EntidadesService.markersT[EntidadesService.trackActivo][1].setMap(null);
            EntidadesService.markersT[EntidadesService.trackActivo][1]=marker;
          }
        }else {
          if (EntidadesService.wpRta[EntidadesService.rutaActiva]===undefined) {
            var nombre = "Waypoint Nº"+0;
            var marker = new google.maps.Marker({
              position: event.latLng,
              title: "Nombre: "+nombre+"\nLatitud: "+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6),
              icon: 'iconowp.png',
              map: map
            });
          var wpsruta = [];
          wpsruta.push(marker);
          EntidadesService.wpRta[EntidadesService.rutaActiva] = wpsruta;
        }else {
          var nombre = "Waypoint Nº"+EntidadesService.wpRta[EntidadesService.rutaActiva].length;
          var marker = new google.maps.Marker({
            position: event.latLng,
            title: "Nombre: "+nombre+"\nLatitud: "+event.latLng.lat().toFixed(6)+"\nLongitud: "+event.latLng.lng().toFixed(6),
            icon: 'iconowp.png',
            map: map
          });
          EntidadesService.wpRta[EntidadesService.rutaActiva].push(marker);
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
        template: '<div id="map"></div>',
        replace: true,
        controller: PruebaController,
        link: link
    };
}
function LineCtrl($scope,EntidadesService) {
 var line = this;

 //Funcion que superpone la gráfica por encima de la tabla de puntos cuando pinchas sobre la gráfica
 line.superponerGrafica = function () {
   $("#datos").css("z-index", 0);
    $("#grafica").css("z-index", 1);
 }

 //Creacion de la gráfica
 $scope.series = ['Series A'];
 $scope.labels = EntidadesService.distancias;
 $scope.data = [EntidadesService.elevaciones];


 $scope.onClick = function (points, evt) {
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
}

})();
