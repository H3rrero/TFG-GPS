(function () {
'use strict';

angular.module('GPS')
.controller('GPSController',GPSController)
.config(function (ngDialogProvider) {
    ngDialogProvider.setForceHtmlReload(true);
     ngDialogProvider.setForceBodyReload(true);
});;

function GPSController($scope,EntidadesService,$document,usSpinnerService,ngDialog) {
    var list1 = this;
    //track seleccionado por el usuario
    list1.trackActivo = 0;
    list1.rutaActiva = 0;
    list1.wpActivo = 0;
    //identificadores que usamos en los swich-case del servicio
    list1.numTrack = 0;
    list1.numRuta = 1;
    list1.numWaypoint = 2;

    //Actulizamos los elementos del controlador con los del servicio
    list1.tracks = EntidadesService.tracks;
    list1.rutas = EntidadesService.rutas;
    list1.waypoints = EntidadesService.waypoints;
    list1.puntosTrackActivo = EntidadesService.puntosTrackActivo;
    list1.modoCreacion = false;
    EntidadesService.modoCreacion = false;
    list1.mostrarMensaje = false;
    list1.mensajeError = "";
    list1.error = false;
    list1.puntoBorrado = false;
    list1.fichero;
    list1.noError = false;
    list1.mensajeVerTabla = "ver tabla";
    list1.mensajeVerGrafica = "ver gráfica";
    list1.mensajeVerlista = "ver lista";
    list1.mensajeVerlistaR = "ver lista";
    list1.mensajeVerlistaW = "ver lista";
    list1.modoEdicion = EntidadesService.modoEdicion;
    list1.apiMaps = true;
    list1.conection = false;
    list1.coordV ="ocultar coor";
    list1.verMarker ="ocultar pts";
    list1.tablaT = false;
    list1.escala = "5km";
    list1.capturaUrl="";
    list1.pant = true;
    list1.whyCvsExport = false;
    list1.colorTrack = "";
    list1.nombre = "";
    list1.descrip = "";
    $scope.color = '#FF0000';
    list1.grosor = 0;
    list1.lng="";
    list1.lat ="";
    list1.lngNW;
    list1.latNW ;
    list1.velocidad;
    list1.fecha;
    list1.cuenta=2;
    $scope.options = {
        format:'hex'
    };
    $scope.eventApi = {
        onChange:  function (api, color, $event) {
            if(EntidadesService.isTrack){
            EntidadesService.changedColor(color);
            $("#li"+EntidadesService.trackNombre)[0].style.color = color;}
            else{
                EntidadesService.changedColorR(color);
                $("#lir"+EntidadesService.rutaNombre)[0].style.color = color;
            }

        }

    };
    list1.desSubrayar = function(i){
        $("#pt"+i)[0].style = "";
    }
    list1.subrayar = function(i){
        $("#pt"+i)[0].style = "text-decoration: underline; cursor:pointer;";
    }
     list1.desSubrayarr = function(i){
        $("#pr"+i)[0].style = "";
    }
    list1.subrayarr = function(i){
        $("#pr"+i)[0].style = "text-decoration: underline; cursor:pointer;";
    }
      list1.desSubrayarw = function(i){
        $("#pw"+i)[0].style = "";
    }
    list1.subrayarw = function(i){
        $("#pw"+i)[0].style = "text-decoration: underline; cursor:pointer;";
    }
    list1.openPopup = function (track) {
        list1.noError = false;
        list1.error = false;
         
        if (EntidadesService.isTrack == false
            || EntidadesService.tracks[EntidadesService.trackActivo] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona un track";
            //Se comprueba que se haya selccionado un punto
        } else if (list1.tracks[list1.trackActivo].puntos.length < 2) {
            list1.error = true;
            list1.mensajeError = "El track necesita tener al menos dos puntos para que exista una polilinea a la cual cambiar el color";
        }else{
             EntidadesService.trackNombre=track;
             $scope.myJSONObject={
            name: EntidadesService.tracks[track].nombre,
            };
            setTimeout(function(){ngDialog.open({
            template:
            '<div style="height: 210px;">'+
            '<label for="nombre" class="prlabel">Nombre:</label>'+
            '<input type="text"   id="nombre" style="width: 100%;" placeholder="{{ngDialogData.name}}" ng-model="list1.nombre" ng-change="list1.renombrarT()">'+
            '<label for="grosor" class="prlabel" style="margin-top: 1%;">Grosor:</label>'+
            '<input type="number"   id="grosor" style="width: 100%;" ng-model="list1.grosor" ng-change="list1.cambiarGrosor()">'+
            '<label for="picker" class="prlabel" style="margin-top: 1%;">Color:</label>'+
            '<color-picker id="picker" ng-model="color" options="options"  event-api="eventApi" ></color-picker>'+
             '<button id="botoncerrardialog" type="button"  style="right: 0 !important;position: absolute; bottom: 4%;" ' +
                'ng-click="closeThisDialog(0)" class="bttn-unite bttn-xs bttn-primary stiloBtns">cerrar</button>'+
            '</div>',
            plain:true,
            closeByEscape: true,
            controllerAs: 'list1',
            data: $scope.myJSONObject,
            controller: 'GPSController'
        });},10);
        }
    };

    list1.openPopupR = function (track) {
        list1.noError = false;
        list1.error = false;
        if (EntidadesService.isTrack == true
            || EntidadesService.rutas[EntidadesService.rutaActiva] === undefined
            || EntidadesService.modoCreacion == true) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona una ruta";

        } else if (list1.rutas[list1.rutaActiva].puntos.length < 2) {
            list1.error = true;
            list1.mensajeError = "La ruta necesita tener al menos dos puntos para que exista una polilinea a la cual cambiar las propiedades";
        }else{
            EntidadesService.rutaNombre = track;
              $scope.myJSONObjectR={
            name: EntidadesService.rutas[track].nombre,
            };
            ngDialog.open({
                template:
                '<div style="height: 210px;">'+
                '<label for="nombre" class="prlabel">Nombre:</label>'+
                '<input type="text"   id="nombre" style="width: 100%;" placeholder="{{ngDialogData.name}}" ng-model="list1.nombre" ng-change="list1.renombrarR()">'+
                '<label for="grosor" class="prlabel" style="margin-top: 1%;">Grosor:</label>'+
                '<input type="number"   id="grosor" style="width: 100%;" ng-model="list1.grosor" ng-change="list1.cambiarGrosorR()">'+
                '<label for="grosor" class="prlabel" style="margin-top: 1%;">Color:</label>'+
                '<color-picker id="picker" ng-model="color" options="options"  event-api="eventApi" ></color-picker>'+
                '<button id="botoncerrardialogR" type="button"  style="right: 0 !important;position: absolute; bottom: 4%;" ' +
                'ng-click="closeThisDialog(0)" class="bttn-unite bttn-xs bttn-primary stiloBtns">cerrar</button>'+
                '</div>',
                plain:true,
               data: $scope.myJSONObjectR,
                controllerAs: 'list1',
                controller: 'GPSController'
            });}
    };

    list1.openPopupW = function (track) {
        list1.noError = false;
        list1.error = false;
        if (EntidadesService.isTrack == true
            || EntidadesService.waypoints[list1.wpActivo] === undefined) {

            list1.error = true;
            list1.mensajeError = "Por favor selecciona un waypoint";

        } else if (EntidadesService.waypoints.length < 1) {
            list1.error = true;
            list1.mensajeError = "Necesitas tener waypoints creados para poder editarlos";
        }else{
             EntidadesService.wptNombre = track;
              $scope.myJSONObjectW={
            name: EntidadesService.waypoints[track].nombre,
            desc: EntidadesService.waypoints[track].descripcion,
             lat: EntidadesService.waypoints[track].latitud,
              lng: EntidadesService.waypoints[track].longitud,
            };
            ngDialog.open({
                template:
                '<div style="height: 215px;">'+
                '<label for="nombre" class="prlabel">Nombre:</label>'+
                '<input type="text"   id="nombre" style="width: 100%;" placeholder="{{ngDialogData.name}}" ng-model="list1.nombre" ng-change="list1.renombrarW()">'+
                '<label for="descripcion" class="prlabel" style="margin-top: 1%;">Descripción:</label>'+
                '<input type="text"   id="descripcion" style="width: 100%;" placeholder="{{ngDialogData.desc}}"  ng-model="list1.descrip" ng-change="list1.descripcion()">'+
                '<label for="coord" class="prlabel" style="margin-top: 1%;">Latitud y longitud:</label>'+
                '<input type="text"   id="coord" style="width: 45%;" placeholder="{{ngDialogData.lat}}"  ng-model="list1.lat" ng-change="list1.changeMarkerPosition()" >'+
                '<input type="text"  style="margin-left: 2%;width: 45%;"  placeholder="{{ngDialogData.lng}}"   id="coordlng" ng-model="list1.lng" ng-change="list1.changeMarkerPosition()" >'+
                 '<button id="cerrarwp" type="button" ng-click="closeThisDialog(0)" style="float:right;margin-top: 5% !important"  class="bttn-unite bttn-xs bttn-primary stiloBtns">cerrar</button>'+
                 '</div>',
               
                plain:true,
                data: $scope.myJSONObjectW,
                controllerAs: 'list1',
                controller: 'GPSController'
            });}
    };

    list1.openPopupNW = function () {

            ngDialog.open({
                template:
                '<label for="coord" class="prlabel">Latitud y longitud:</label>'+
                '<input type="text"   id="coord" style="width: 45%;"  placeholder="43.324228"   ng-model="list1.latNW" >'+
                '<input type="text"  style="margin-left: 2%;width: 45%;"  placeholder="-5.629051"  id="coordlng" ng-model="list1.lngNW" >'+
                '<button id="botonAnadirWp" type="button"  style="margin-top: 4% !important" ' +
                'ng-click="list1.anadirWaypoint()" class="bttn-unite bttn-xs bttn-success stiloBtns">crear</button>',
                plain:true,
                showClose: true,
                controllerAs: 'list1',
                controller: 'GPSController'
            });
    };

    list1.anadirWaypoint = function () {


                list1.activarListaR = false;
                list1.activarLista = false;
                list1.activarListaW = true;
                list1.mensajeVerlista = "ver lista";
                list1.mensajeVerlistaR = "ver lista";
                list1.mensajeVerlistaW = "ocultar lista";
                EntidadesService.isWaypoint = true;
                EntidadesService.isTrack = false;
                list1.modoCreacion = true;
                EntidadesService.modoCreacion = true;


            if(list1.latNW!=null && list1.lngNW!=null)
            EntidadesService.anadirWaypoint(list1.latNW,list1.lngNW);
            ngDialog.close();

    };
    list1.cambiarGrosor = function () {
        if (list1.grosor != null && list1.grosor>0 && EntidadesService.tracks.length > 0) {

            EntidadesService.grosor(list1.grosor);
        }
    };

    list1.changeMarkerPosition = function () {
        if (list1.lat != null && list1.lng!=null  && EntidadesService.waypoints.length > 0) {

            EntidadesService.changeMarkerPosition(list1.lat,list1.lng);
        }
    };

    list1.cambiarGrosorR = function () {
        if (list1.grosor != null && list1.grosor>0 && EntidadesService.rutas.length > 0) {

            EntidadesService.grosorR(list1.grosor);
        }
    };

    list1.startSpin = function() {

            usSpinnerService.spin('spinner-1');
    };

    list1.stopSpin = function() {
            usSpinnerService.stop('spinner-1');
    };
    //Cuando el documento este listo aumentamos el tamaño de la escala
    angular.element(document).ready(function () {
        setTimeout(list1.actuTamano,500);

    });
    list1.actuTamano = function () {
        list1.gr =$('#map');
        list1.gr.children().children().children()[16].style.right='220px';
        list1.gr.children().children().children()[16].childNodes[1].childNodes[0].style.fontSize='16px';
        list1.gr.children().children().children()[16].childNodes[1].childNodes[0].style.fontWeight='bold';
    };
    list1.vermarkers = function () {
        if(EntidadesService.ver){
            EntidadesService.ver = false;
            list1.verMarker ="ver pts";
            EntidadesService.vermarkers();
        }else{
            EntidadesService.ver = true;
            list1.verMarker ="ocultar pts";
            EntidadesService.vermarkers();
        }
    };

    list1.capPant = function (isTrack) {
        if(list1.pant){
            list1.capturaUrl = "";
        list1.startSpin();
        var divs = $('div.tile');
            if(list1.isChrome || list1.isFirefox)
            for(var i in divs){
                if(i<divs.length)
                    divs[i].style.borderWidth = '2px';
            }
           
            html2canvas($(".gm-style")[0].childNodes[0], {
                useCORS: true,
                onrendered: function(canvas) {
                    if( list1.isFirefox){
                        list1.pant = false;
                        
                    list1.capturaUrl = canvas.toDataURL("image/jpg");
                    //window.open(list1.capturaUrl );
                    list1.pant = false;
                    $scope.$apply();
                    list1.stopSpin();
                    if(isTrack)
                    $("#downPt").click();
                    else
                        $("#downPtR").click()
                    }
                    if (list1.esIE || list1.isEdge) {
                        list1.capturaUrl = canvas.toDataURL("image/webp");
                        var data = atob(list1.capturaUrl.substring("data:image/png;base64,".length)),
                            asArray = new Uint8Array(data.length);

                        for (var i = 0, len = data.length; i < len; ++i) {
                            asArray[i] = data.charCodeAt(i);
                        }
                        //creamos un objeto blob cuyo parámetro es una matriz que incluye el contenido deseado y el tipo del contenido
                        var blob = new Blob([asArray.buffer], {type: "image/png"});
                        //Usamos msSaveBlob para proporcionar la opción de descarga d ela imagen
                        window.navigator.msSaveBlob(blob, 'prueba.png');
                        list1.stopSpin();
                    }
                    if(list1.isSafari){
                       
                        list1.capturaUrl = canvas.toDataURL("image/png");
                       $('#btn-downloadTS').attr('href', list1.capturaUrl);
                        list1.stopSpin();
                    }
                    if(list1.isChrome ){
                        list1.capturaUrl = canvas.toDataURL("image/jpg");
                         list1.stopSpin();
                        window.open( list1.capturaUrl);
                    }
                }
            });
        for(var i in divs){
            if(i<divs.length)
                divs[i].style.borderWidth = '1px';
        }}else{
            list1.pant = true;
        }
    };

    list1.modoEdicionF = function () {
        list1.noError = false;
        list1.error = false;
        if (list1.modoEdicion == true) {
            list1.error = true;
            list1.modoEdicion = false;
            EntidadesService.modoEdicion = false;
            list1.mensajeError = "Has desativado el modo edición";
        }
        else {
            list1.noError = true;
            list1.mensajeError = "Has activado el modo edición";
            list1.modoEdicion = true;
            EntidadesService.modoEdicion = true;
        }
    };

    list1.activarImportWp = function functionName() {
        list1.error = false;
        if (EntidadesService.xmlImportado == undefined) {
            list1.error = true;
            list1.mensajeError = "Antes de importar selecciona un archivo con el boton seleccione fichero ";

        } else {
            EntidadesService.importXMLWp();
        }
    };

    list1.activarImportRuta = function () {
        list1.error = false;
        if (EntidadesService.xmlImportado == undefined) {
            list1.error = true;
            list1.mensajeError = "Antes de importar selecciona un archivo con el boton seleccione fichero ";

        } else {
            list1.crear(1);
            EntidadesService.importXML();
        }
    };
    list1.activarImport = function () {
        list1.error = false;
        if (EntidadesService.xmlImportado == undefined) {
            list1.error = true;
            list1.mensajeError = "Antes de importar selecciona un archivo con el boton seleccione fichero ";

        } else {
            list1.crear(0);
            EntidadesService.importXML();
        }
    };

    //Metodo que llama al metodo unir del service
    list1.unirRutas = function () {
        list1.startSpin();
        //Desactivamos el boolean error
        list1.noError = false;
        list1.error = false;
        EntidadesService.modoInsertar = false;
        //Si ninguna ruta fuera seleccionada activamos el error y pasamos el mensaje
        if (EntidadesService.isTrack == true
            || EntidadesService.rutas[EntidadesService.rutaActiva] === undefined
            || EntidadesService.modoCreacion == true) {
            list1.error = true;
            list1.mensajeError ="Por favor muestra la lista de rutas(ver lista) para activar el modo ruta y poder acceder a sus funcionalidades";
            //SI la ruta no tiene al menos dos puntos activamos el error
        } else if (EntidadesService.rutas.length < 2) {
            list1.error = true;
            list1.mensajeError = "Se necesitan al menos dos rutas para poder realizar la unión";
        }  else if(EntidadesService.rutaElegidoInicial==-1||EntidadesService.rutaElegidoFinal==-1){
             list1.error = true;
            list1.mensajeError = "Debes seleccionar el punto final de la primera ruta de la uniónn y el punto inicial de la segunda ruta de la unión y despues darle a unir"
        }
        else {
           var elegido = EntidadesService.rutaElegidoInicial;
            var elegidoFinal = EntidadesService.rutaElegidoFinal;
            //Activamos el error si el track no exitiera
            if (elegido == null || EntidadesService.rutas[elegido] == undefined) {
                list1.error = true;
                list1.mensajeError = "La ruta elegida no existe";
                //Activamos el error si el track no tiene al menos dos puntos
            } else if (EntidadesService.rutas[elegidoFinal].puntos.length < 2 || EntidadesService.rutas[elegido].puntos.length < 2) {
                list1.error = true;
                list1.mensajeError = "Alguna de las dos rutas no dispone de al menos dos puntos creados";
                //Activamos el error si el usuario ha intentado unir el track con el mismo
            } else if (elegido == elegidoFinal) {
                list1.error = true;
                list1.mensajeError = "Elige otra ruta, no se puede unir una ruta con ella misma";
            }
            else {
                           //Creamos el track que almacenara los puntos de la union
                list1.crear(1);
                
                 setTimeout(function(){
           //llamamos al metodo unir del service
             if( EntidadesService.rutaElegidoFinalMarker!=null)
        EntidadesService.rutaElegidoFinalMarker.setMap(null);
        if( EntidadesService.rutaElegidoInicialMarker!=null)
        EntidadesService.rutaElegidoInicialMarker.setMap(null);
                EntidadesService.unirRuta(elegido,elegidoFinal);
                $scope.$apply();
                  list1.stopSpin();
            },100);
            }
        }
        if(list1.error == true)
        list1.stopSpin();
        EntidadesService.rutaElegidoFinal=-1;
        EntidadesService.rutaElegidoInicial=-1;
        if( EntidadesService.rutaElegidoFinalMarker!=null)
        EntidadesService.rutaElegidoFinalMarker.setMap(null);
        if( EntidadesService.rutaElegidoInicialMarker!=null)
        EntidadesService.rutaElegidoInicialMarker.setMap(null);
    };
    //metodo que llama a la funcion unir tracks del service
    list1.unirTracks = function () {
        list1.startSpin();
        //Desactivamos el error
        list1.noError = false;
        list1.error = false;
        EntidadesService.modoInsertar = false;
        //Activamos el error si el usuario no ha seleccionado un track
        if (EntidadesService.isTrack == false
            || EntidadesService.tracks[EntidadesService.trackActivo] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor muestra la lista de tracks(ver lista) para activar el modo track y poder acceder a sus funcionalidades";
            //Activamos el error si el track no dispone de al menos dos puntos
        } else if (EntidadesService.tracks.length < 2) {
            list1.error = true;
            list1.mensajeError = "Se necesitan al menos dos tracks para poder realizar la unión";
        }
        else if(EntidadesService.trackElegidoInicial==-1||EntidadesService.trackElegidoFinal==-1){
             list1.error = true;
            list1.mensajeError = "Debes seleccionar el punto final del primer track de la uniónn y el punto inicial del segundo track de la unión y despues darle a unir"
        }
        else {
          
            var elegido = EntidadesService.trackElegidoInicial;
            var elegidoFinal = EntidadesService.trackElegidoFinal;
          
            //Activamos el error si el track no exitiera
            if (elegido == null || EntidadesService.tracks[elegido] == undefined) {
                list1.error = true;
                list1.mensajeError = "El track elegido no existe";
                //Activamos el error si el track no tiene al menos dos puntos
            } else if (EntidadesService.tracks[elegidoFinal].puntos.length < 2 || EntidadesService.tracks[elegido].puntos.length < 2) {
                list1.error = true;
                list1.mensajeError = "Alguno de los dos tracks no dispone de al menos dos puntos creados";
                //Activamos el error si el usuario ha intentado unir el track con el mismo
            } else if (elegido == elegidoFinal) {
                list1.error = true;
                list1.mensajeError = "Elige otro track, no puedes unir un track con el mismo";
            }
            else {
                //Creamos el track que almacenara los puntos de la union
                list1.crear(0);
                
                 setTimeout(function(){
           //llamamos al metodo unir del service
             if( EntidadesService.trackElegidoFinalMarker!=null)
        EntidadesService.trackElegidoFinalMarker.setMap(null);
        if( EntidadesService.trackElegidoInicialMarker!=null)
        EntidadesService.trackElegidoInicialMarker.setMap(null);
                EntidadesService.unirTrack(elegido,elegidoFinal);
                $scope.$apply();
                  list1.stopSpin();
            },100);
            }
        }
        if(list1.error== true)
        list1.stopSpin();
        EntidadesService.trackElegidoFinal=-1;
        EntidadesService.trackElegidoInicial=-1;
        if( EntidadesService.trackElegidoFinalMarker!=null)
        EntidadesService.trackElegidoFinalMarker.setMap(null);
        if( EntidadesService.trackElegidoInicialMarker!=null)
        EntidadesService.trackElegidoInicialMarker.setMap(null);
    };

    //Metodo que permite borrar una ruta
    list1.borrarRuta = function () {
        //Se pone el error a false para resetearlo
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //Se comprueba que se ha seleccionado una ruta y si no es asi salta un error
        if (EntidadesService.isTrack == true
            || EntidadesService.modoCreacion == true
            || EntidadesService.rutas[EntidadesService.rutaActiva] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona una ruta para eliminar";
            //Nos aseguramos de que tenga rutas creadas
        } else if (EntidadesService.rutas.length < 1) {
            list1.error = true;
            list1.mensajeError = "Necesitas tener rutas creadas para poder eliminarlas";
        }
        //En caso de estar todo correcto llamamos al metodo del service
        else {
            if( EntidadesService.rutaElegidoFinalMarker!=null)
        EntidadesService.rutaElegidoFinalMarker.setMap(null);
        if( EntidadesService.rutaElegidoInicialMarker!=null)
        EntidadesService.rutaElegidoInicialMarker.setMap(null);
            EntidadesService.borrarRuta();
        }

    };
    //Metodo que permite borrar una ruta
    list1.borrarWp = function () {
        //Se pone el error a false para resetearlo
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //Se comprueba que se ha seleccionado una ruta y si no es asi salta un error
        if (EntidadesService.isTrack == true
            || EntidadesService.waypoints[list1.wpActivo] === undefined) {

            list1.error = true;
            list1.mensajeError = "Por favor selecciona un waypoint para eliminar";
            //Nos aseguramos de que tenga rutas creadas
        } else if (EntidadesService.waypoints.length < 1) {
            list1.error = true;
            list1.mensajeError = "Necesitas tener waypoints creados para poder eliminarlos";
        } else if (EntidadesService.modoCreacion == true) {

            list1.error = true;
            list1.mensajeError = "Sal del modo creacion para poder eliminar waypoints";
        }
        //En caso de estar todo correcto llamamos al metodo del service
        else {
            EntidadesService.wpActivo = list1.wpActivo;
            EntidadesService.borrarWp();
        }

    };

    list1.verCoord= function () {


        if(EntidadesService.coords){
            EntidadesService.coords=false;
            list1.coordV="ocultar coord";

        }
        else{
            EntidadesService.coords=true;
            list1.coordV="ver coord";
        }
    };

    //Metodo que borra un track
    list1.borrarTrack = function () {
        //Reseteamos el error
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //Comprobamos que haya seleccionado un track
        if (EntidadesService.isTrack == false
            || EntidadesService.tracks[EntidadesService.trackActivo] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona un track para eliminar";
            //Comprobamos que tenga tracks creados
        } else if (EntidadesService.tracks.length < 1) {
            list1.error = true;
            list1.mensajeError = "Necesitas tener tracks creados para poder eliminarlos";
        }
        //Si todo esta correcto llamamos al metodo del service
        else {
            if( EntidadesService.trackElegidoFinalMarker!=null)
        EntidadesService.trackElegidoFinalMarker.setMap(null);
        if( EntidadesService.trackElegidoInicialMarker!=null)
        EntidadesService.trackElegidoInicialMarker.setMap(null);
            EntidadesService.borrarTrack();
        }

    };

    //Metodo que recorta una ruta
    list1.recortarRuta = function () {
        list1.startSpin();
        //Reseteamos el error
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //Punto que usuario a seleccionado en la tabla a partir del cual se recorta
        var punto = EntidadesService.puntoElegido;
        //Se comprueba que se haya seleccionado una ruta
        if (EntidadesService.isTrack == true
            || EntidadesService.modoCreacion == true
            || EntidadesService.rutas[EntidadesService.rutaActiva] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona una ruta para recortar";
            //Se comprueba que se haya seleccionado el punto a partir del cual se recorta
        } else if (EntidadesService.puntoElegido == null) {
            list1.error = true;
            list1.mensajeError = "Antes de cortar tienes que seleccionar en la tabla o sobre el track el punto a partir del cual quieres realizar el corte";
            //Se comprueba que la ruta tenga mas de un punto creado
        } else if (list1.rutas[list1.rutaActiva].puntos.length < 2) {
            list1.error = true;
            list1.mensajeError = "La ruta necesita tener mas de un punto creado para poder ser cortada";
        }
        //S todo esta bien...
        else {
            //Creamos dos nuevas rutas que almacenaran los dos recortes creados
            list1.crear(1);
            list1.crear(1);
             setTimeout(function(){
           //Guardamos el punto elegido
            EntidadesService.puntoElegido = punto;
            if( EntidadesService.rutaElegidoFinalMarker!=null)
        EntidadesService.rutaElegidoFinalMarker.setMap(null);
        if( EntidadesService.rutaElegidoInicialMarker!=null)
        EntidadesService.rutaElegidoInicialMarker.setMap(null);
            // Y llamamos al metodo del service
            EntidadesService.recortarRuta();
                $scope.$apply();
                  list1.stopSpin();
            },100);
            
        }
         if(list1.error == true)
    list1.stopSpin();
    };

    //Metodo que recorta un track
    list1.recortarTrack = function () {
        list1.startSpin();
        //Reseteamos el error
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //Punto elegido a partir del cual se recorta
        var punto = EntidadesService.puntoElegido;
        //Se comprueba que se haya seleccionado un track
        if (EntidadesService.isTrack == false
            || EntidadesService.tracks[EntidadesService.trackActivo] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona un track para recortar";
            //Se comprueba que se haya selccionado un punto
        } else if (EntidadesService.puntoElegido == null) {
            list1.error = true;
            list1.mensajeError = "Antes de cortar tienes que seleccionar en la tabla o sobre el track el punto a partir del cual quieres realizar el corte";
            //Se comprueba que el track tiene al menos dos puntos creados
        } else if (list1.tracks[list1.trackActivo].puntos.length < 2) {
            list1.error = true;
            list1.mensajeError = "El track necesita tener mas de un punto creado para poder ser cortado";
        }
        //Si  esta bien...
        else {
            //Creamos dos tracks para almacenar los dos recortes
            list1.crear(0);
            list1.crear(0);
             setTimeout(function(){
            //Guardamos el punto elegido
            EntidadesService.puntoElegido = punto;
            //Y llamaos al metodo del service
              if( EntidadesService.trackElegidoFinalMarker!=null)
        EntidadesService.trackElegidoFinalMarker.setMap(null);
        if( EntidadesService.trackElegidoInicialMarker!=null)
        EntidadesService.trackElegidoInicialMarker.setMap(null);
                 EntidadesService.recortarTrack();
                $scope.$apply();
                  list1.stopSpin();
            },100);
        }
   
    if(list1.error == true)
    list1.stopSpin();

    };
    //Funcion que obtiene de la tabla el punto seleccionado por el usuario
    list1.puntoSelecTG = function (index) {
        EntidadesService.clicTabGraf = true;
        EntidadesService.puntoSelec(index);
        EntidadesService.puntoBorrado = true;
    };
    //Funcion que obtiene de la tabla el punto seleccionado por el usuario
    list1.puntoSelec = function (index) {

        EntidadesService.puntoSelec(index);
        EntidadesService.puntoBorrado = true;
    };

     //Funcion que obtiene de la tabla el punto seleccionado por el usuario
    list1.puntoSelecR = function (index) {

        EntidadesService.puntoSelecR(index);
        EntidadesService.puntoBorrado = true;
    };

    list1.descripcion = function () {
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //Se comprueba que tenga algun waypoint creado
        if (EntidadesService.waypoints.length <= 0) {
            list1.error = true;
            list1.mensajeError = "No tienes ningun waypoint creado";
        }
        if (list1.descrip != null && EntidadesService.waypoints.length > 0) {
            //Se llama al metodo del service para cambiar la descripción
            EntidadesService.cambiarDescripcion(list1.descrip);
        }
    };
    //funcion que permite cambiar el nombre a un track
    list1.renombrarT = function () {
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //Se comprueba que tenga algun track creado
        if (EntidadesService.tracks.length <= 0) {
            list1.error = true;
            list1.mensajeError = "No tienes ningun track creado";
        }
        if (list1.nombre != null && EntidadesService.tracks.length > 0) {
         
            //Se llama al metodo del service para cambiar el nombre
            EntidadesService.renombrarT(list1.nombre);
        }

    };
    //Metodo que cambia el nombre a una ruta
    list1.renombrarR = function () {
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //Se comprueba que tenga rutas creadas
        if (EntidadesService.rutas.length <= 0) {
            list1.error = true;
            list1.mensajeError = "No tienes ninguna ruta creada";
        }
        if (list1.nombre != null && EntidadesService.rutas.length > 0) {
            //Se llama al metodo del service para cambiar el nombre
            EntidadesService.renombrarR(list1.nombre);
        }

    };
    //Metodo que cambia el nombre a un waypoint
    list1.renombrarW = function () {
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //Se comprueba que se tengan waypoints creados
        if (EntidadesService.waypoints.length <= 0) {
            list1.error = true;
            list1.mensajeError = "No tienes ningun waypoint creado";
        }
        else if (EntidadesService.isTrack == true
            || EntidadesService.waypoints[list1.wpActivo] === undefined) {
            list1.error = true;
            list1.mensajeError = "No tienes ningun waypoint seleccionado";
        } else {
            if (list1.nombre != null && EntidadesService.waypoints.length > 0) {
                EntidadesService.renombrarW(list1.nombre);
            }
        }

    };

    //Metodo que permite eliminar un punto de una ruta
    list1.eliminarPuntoRuta = function () {
        //Se resetea el error
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //Se comprueba que se haya seleccionado una ruta
        if (EntidadesService.isTrack == true
            || EntidadesService.rutas[EntidadesService.rutaActiva] === undefined
            || EntidadesService.modoCreacion == true) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona una ruta";
            //Se comprueba que se haya seleccionado el punto a borrar
        } else if (EntidadesService.puntoBorrado == false || EntidadesService.puntoElegido == null) {
            list1.error = true;
            list1.mensajeError = "Debes seleccionar un punto en la tabla de puntos o sobre el track  para poder borrarlo";
            //Se comprueba que la ruta tenga puntos creados
        } else if (EntidadesService.rutas[EntidadesService.rutaActiva].puntos.length < 1) {
            list1.error = true;
            list1.mensajeError = "La ruta no dispone de puntos que eliminar";
            //En caso de ir todo bien...
        } else {
            if( EntidadesService.rutaElegidoFinalMarker!=null)
        EntidadesService.rutaElegidoFinalMarker.setMap(null);
        if( EntidadesService.rutaElegidoInicialMarker!=null)
        EntidadesService.rutaElegidoInicialMarker.setMap(null);
            //se llama al metodo del service
            EntidadesService.eliminarPuntoRuta2();
            //Se quita el modo borrar
            EntidadesService.puntoBorrado = false;
            //Se resetea el punto elegido
            EntidadesService.puntoElegido = null;
        }

    };

    //Metodo que añade un punto intermedio a una ruta
    list1.anadirPuntoRuta = function () {
        //Se resetea el error
        list1.noError = false;
        list1.error = false;
        //SI el modo insertar esta activado se desactiva
        if (EntidadesService.modoInsertar == true) {
            EntidadesService.modoInsertar = false;
            list1.error = true;
            list1.mensajeError = "Acabas de salir del modo insertar punto intermedio";
        }//Se comprueba que se haya seleccionado una ruta
        else if (EntidadesService.isTrack == true
            || EntidadesService.rutas[EntidadesService.rutaActiva] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona una ruta ";
            //Se comprueba que se haya selccionado el punto a partir
            // del cual se insertara el nuevo punto
        } else if (EntidadesService.puntoElegido == null) {
            list1.error = true;
            list1.mensajeError = "Debes seleccionar un punto en la tabla de puntos o sobre el track para poder insertar a continuación";
            //Se comprueba que la ruta tenga puntos creados
        } else if (EntidadesService.rutas[EntidadesService.rutaActiva].puntos.length < 2) {
            list1.error = true;
            list1.mensajeError = "La ruta no dispone de puntos entre los que insertar";
        }else if (EntidadesService.puntoElegido == EntidadesService.rutas[EntidadesService.rutaActiva].puntos.length -1) {
            list1.error = true;
            list1.mensajeError = "Para añadir un punto a continuacion del ultimo simplemente haga click en el mapa" +
                ", este modo es para añadir un punto intermedio";
        }
        //Si no hay errores activamos el modo inserccion y avisamos al usuario
        else {
            if( EntidadesService.rutaElegidoFinalMarker!=null)
        EntidadesService.rutaElegidoFinalMarker.setMap(null);
        if( EntidadesService.rutaElegidoInicialMarker!=null)
        EntidadesService.rutaElegidoInicialMarker.setMap(null);
            EntidadesService.modoInsertar = true;
            list1.noError = true;
            list1.mensajeError = "Has entrado en el modo insertar punto intermedio, " +
                "para salir pulse otra vez insertar punto. " +
                "Para insertar un punto haga clic en el mapa";
        }

    };

    //Metodo que añade un punto a un track
    list1.anadirPuntoTrack = function () {
        //Reseteamos el error
        list1.noError = false;
        list1.error = false;
        //Si esta activado el modo insertar pues lo desactivamos
        if (EntidadesService.modoInsertar == true) {
            EntidadesService.modoInsertar = false;
            list1.error = true;
            list1.mensajeError = "Acabas de salir del modo insertar punto intermedio";
        }
        //Comprobamos que tenga seleccionado un track
        else if (EntidadesService.isTrack == false
            || EntidadesService.tracks[EntidadesService.trackActivo] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona un track ";
            //Comprobamos que tenga un punto seleccionado
        } else if (EntidadesService.puntoElegido == null) {
            list1.error = true;
            list1.mensajeError = "Debes seleccionar un punto en la tabla de puntos o sobre el track para poder insertar a continuación";
            //COmprobamos que el track tenga puntos creados
        } else if (EntidadesService.tracks[EntidadesService.trackActivo].puntos.length < 2) {
            list1.error = true;
            list1.mensajeError = "El track no dispone de puntos entre los que insertar";
        }else if (EntidadesService.puntoElegido == EntidadesService.tracks[EntidadesService.trackActivo].puntos.length -1) {
            list1.error = true;
            list1.mensajeError = "Para añadir un punto a continuacion del ultimo simplemente haga click en el mapa" +
                ", este modo es para añadir un punto intermedio";
        }
        //Si  esta bien activamos el modo insertar y avisamos al usuario
        else {
              if( EntidadesService.trackElegidoFinalMarker!=null)
        EntidadesService.trackElegidoFinalMarker.setMap(null);
        if( EntidadesService.trackElegidoInicialMarker!=null)
        EntidadesService.trackElegidoInicialMarker.setMap(null);
            EntidadesService.modoInsertar = true;
            list1.noError = true;
            list1.mensajeError = "Has entrado en el modo insertar punto intermedio, " +
                "para salir pulse otra vez insertar punto. " +
                "Selecciona el punto de origen y después pincha donde " +
                "quieras añadir el nuevo punto";
        }
    };

    //Metodo que elimina un punto de un track
    list1.eliminarPuntoTrack = function () {
        list1.noError = false;
        list1.error = false;
        EntidadesService.modoInsertar = false;
        //Comprobamos que se haya selccionado un track
        if (EntidadesService.isTrack == false
            || EntidadesService.tracks[EntidadesService.trackActivo] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona un track ";
            //Comprobamos que se haya seleccionado un punto
        } else if (EntidadesService.puntoBorrado == false || EntidadesService.puntoElegido == null) {
            list1.error = true;
            list1.mensajeError = "Debes seleccionar un punto en la tabla de puntos o sobre el track para poder borrarlo";
            //Comprobamos que el track tenga puntos creados
        } else if (EntidadesService.tracks[EntidadesService.trackActivo].puntos.length < 1) {
            list1.error = true;
            list1.mensajeError = "El track no dispone de puntos que eliminar";
            //SI  esta bien llamamos al metodo del service
        } else {
              if( EntidadesService.trackElegidoFinalMarker!=null)
        EntidadesService.trackElegidoFinalMarker.setMap(null);
        if( EntidadesService.trackElegidoInicialMarker!=null)
        EntidadesService.trackElegidoInicialMarker.setMap(null);
            EntidadesService.eliminarPuntoTrack2();
            EntidadesService.puntoBorrado = false;
            EntidadesService.puntoElegido = null;
        }

    };
    //Metodo que invierte el sentido de un track
    list1.invertirTrack = function () {
        //Reseteamos el error
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //COmprobamos que se haya seleccionado un track para invertir
        if (EntidadesService.isTrack == false
            || EntidadesService.tracks[EntidadesService.trackActivo] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona un track para invertir";
            //Se comprueba que el track tenga puntos creados
        } else if (EntidadesService.tracks[EntidadesService.trackActivo].puntos.length < 2) {
            list1.error = true;
            list1.mensajeError = "El track no dispone de puntos que invertir";
        } else {
              if( EntidadesService.trackElegidoFinalMarker!=null)
        EntidadesService.trackElegidoFinalMarker.setMap(null);
        if( EntidadesService.trackElegidoInicialMarker!=null)
        EntidadesService.trackElegidoInicialMarker.setMap(null);
            //Si todo es correcto llamamos al metodo del service
            EntidadesService.invertirTrack2();
        }
    };

    list1.actualizarError = function () {
        list1.error = true;
       
        list1.mensajeError = "La especificación del archivo no se corresponde con la de una ruta";
    };
    //Metodo que permite invertir el sentido de una ruta
    list1.invertirRuta = function () {
        //Reseteamos el error
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //Comprobamos que se haya seleccionado una ruta
        if (EntidadesService.isTrack == true
            || EntidadesService.rutas[EntidadesService.rutaActiva] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona una ruta para invertir";
            //Se comprueba que tenga los puntos suficientes para invertir
        } else if (EntidadesService.rutas[EntidadesService.rutaActiva].puntos.length < 2) {
            list1.error = true;
            list1.mensajeError = "La ruta no dispone de puntos que invertir";
        } else {
            if( EntidadesService.rutaElegidoFinalMarker!=null)
        EntidadesService.rutaElegidoFinalMarker.setMap(null);
        if( EntidadesService.rutaElegidoInicialMarker!=null)
        EntidadesService.rutaElegidoInicialMarker.setMap(null);
            //Si todo esta bien se llam al metodo dek service
            EntidadesService.invertirRuta2();
        }
    };

    //FUncion que activa o desactiva el modo creacion de los waypoints
    list1.crearWaypoint = function () {
        if (EntidadesService.isWaypoint == false || EntidadesService.isWaypoint == undefined) {
            EntidadesService.isWaypoint = true;
            EntidadesService.isTrack = false;
            list1.modoCreacion = true;
            EntidadesService.modoCreacion = true;
        } else {
            EntidadesService.isWaypoint = false;
            list1.modoCreacion = false;
            EntidadesService.modoCreacion = false;
        }
    };

    //Detectamos si pulsa la tecla escape y si el modo creacion de waypoints esta actuivado pues lo desactivamos
    $document.bind("keydown", function (e) {

        var boton = $('#botonCrearW');

        if (EntidadesService.modoCreacion == true && e.key == "Escape") {
            boton.click();
        }

    });

    list1.cargarElevaciones =  function (){
     
       list1.cargarElevaciones1()
     
       
    }
    list1.cargarElevaciones1 =  function(){
          list1.startSpin();
         list1.noError = false;
        list1.error = false;
        if (EntidadesService.isTrack == false
            || EntidadesService.tracks[EntidadesService.trackActivo] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona un track";
            //Se comprueba que el track tenga puntos creados
           
        } else if (EntidadesService.tracks[EntidadesService.trackActivo].puntos.length < 2) {
            list1.error = true;
            list1.mensajeError = "El track no dispone de puntos";
            
        } else {
            EntidadesService.cargarElevaciones();
            setTimeout(function() {
                 list1.actualizarPuntosT();
                 $scope.$apply();
                  list1.stopSpin();
            }, 2000);
            
            
         
        }
        
    }
     list1.openPopupTiempos = function () {
        list1.noError = false;
        list1.error = false;
        if (EntidadesService.isTrack == false
            || EntidadesService.tracks[EntidadesService.trackActivo] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona un track";
            //Se comprueba que se haya selccionado un punto
        } else{
             $scope.myJSONObjectTm={
            velo: EntidadesService.tracks[EntidadesService.trackActivo]["puntos"][0].velocidad,
           
            };
        ngDialog.open({
            template:
            '<div style="height: 180px;">'+
            '<label for="velocidad" class="prlabel">Velocidad:</label>'+
            '<input type="number"   id="velocidad" placeholder="{{ngDialogData.velo}}" ng-model="list1.velocidad" style="margin-top: 1%">min/km'+
            '<label for="fecha" class="prlabel" style="margin-top: 3%">Fecha:</label>'+
            '<datepicker>'+
            '<input ng-model="date" placeholder="Puedes cambiar la hora a mano tras elegir la fecha" style="width:100%" type="text"/>'+
            '</datepicker>'+
            '<button id="actTiem" type="button" ng-click="list1.cambiarTiempos()" style="float:right;margin-top: 5% !important"  class="bttn-unite bttn-xs bttn-primary stiloBtns">Actualizar datos</button>'
               +'</div>',
            plain:true,
            showClose: true,
            data: $scope.myJSONObjectTm,
            controllerAs: 'list1',
            controller: 'GPSController'
        });}
    };


    //FUncion que pide al usuario una fecha y una velocidad y calcula los tiempos del track a partir de esos datos
    list1.cambiarTiempos = function () {
        list1.error = false;
        list1.noError = false;
        //Solo ejecutamos la funcion si hay algun tracl creado y si en el momento actual se esta modificando un track
        if (EntidadesService.tracks.length > 0 && EntidadesService.isTrack == true) {
            var velocidad = list1.velocidad;
            var velocidadInt = parseFloat(velocidad);
            var fechas = $scope.date;
            //Si la velocidad introducida no es introducida se usa la velocidad por defecto
            
            //si la fecha no es introducida se usa la fecha por defecto
            if(fechas == null || isNaN(fechas)){
              fechas = new Date();}
              else{
                  var fechas =new Date($scope.date);
              }
               
                    
                    
                    if (velocidad== null || isNaN(velocidad)|| velocidad == undefined) {
              velocidad = EntidadesService.tracks[EntidadesService.trackActivo]["puntos"][0].velocidad;
              velocidadInt = parseFloat(velocidad);
            
            }
                    velocidad = (60/velocidad);
                    fechas.setMonth(fechas.getMonth()+1);
                    EntidadesService.cambiarTiempos(parseFloat(velocidad), fechas,list1.trackActivo);
                    list1.actualizarPuntosT();
                     ngDialog.close();
           
            
        }
    };
    //Metodo que crea entidades
    list1.crear = function (id) {
        //Actualizamos la entidad que esta activa antes de llamar al servicio
        EntidadesService.trackActivo = list1.trackActivo;
        EntidadesService.rutaActiva = list1.rutaActiva;
        if (EntidadesService.isWaypoint == true) {
            list1.mostrarMensaje = true;
        } else {
            list1.mostrarMensaje = false;
        }
        //llamamos al metodo crear del servicio
        EntidadesService.crear(id);
        if (id == 0) {
            if (list1.mostrarTabla == true)
                list1.mostrarTabla = false;
            else {
                list1.mostrarTabla = true;
            }
            EntidadesService.puntoElegido = null;
            list1.verTablaT();
        }
        if (id == 1) {
            if (list1.mostrarTabla == true)
                list1.mostrarTabla = false;
            else {
                list1.mostrarTabla = true;
            }
            EntidadesService.puntoElegido = null;
            list1.verTablaR();
        }
    };
    //Es llamado desde el evento click del mapa y añade un punto al track activo
    list1.anadirPuntoTForMapR = function (track, latitud, longitud) {
        //Actualizamos el track activo antes de realizar las operaciones
        list1.trackActivo = EntidadesService.trackActivo;
        //llamamos al metodo del servicio que se encarga de añadir los puntos
        EntidadesService.anadirPunto(list1.numTrack, track, latitud, longitud);
        //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
       // list1.actualizarPuntosT();


    };

    //Es llamado desde el evento click del mapa y añade un punto al track activo
    list1.anadirPuntoTForMapI = function (latitud, longitud) {
        //Actualizamos el track activo antes de realizar las operaciones
        list1.trackActivo = EntidadesService.trackActivo;
        //llamamos al metodo del servicio que se encarga de añadir los puntos
        EntidadesService.anadirPunto(list1.numTrack, EntidadesService.trackActivo, latitud, longitud);
        //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
        list1.actualizarPuntosT();


    };

    //Es llamado desde el evento click del mapa y añade un punto al track activo
    list1.anadirPuntoTForMap = function (latitud, longitud) {
        //Actualizamos el track activo antes de realizar las operaciones
        list1.trackActivo = EntidadesService.trackActivo;
        //llamamos al metodo del servicio que se encarga de añadir los puntos
        EntidadesService.anadirPunto(list1.numTrack, EntidadesService.trackActivo, latitud, longitud);
        //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
        list1.actualizarPuntosT();
        $scope.$apply();


    };
    //Es llamado desde el evento click del mapa y añade un punto a la ruta activa
    list1.anadirPuntoRForMapR = function (ruta, latitud, longitud) {
        //Actualizamosla ruta activa antes de realizar las operaciones
        list1.rutaActiva = EntidadesService.rutaActiva;
        //llamamos al metodo del servicio que se encarga de añadir los puntos
        EntidadesService.anadirPunto(list1.numRuta, ruta, latitud, longitud);
        //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
        list1.actualizarPuntosR();


    };
    //Es llamado desde el evento click del mapa y añade un punto a la ruta activa
    list1.anadirPuntoRForMapI = function (latitud, longitud) {
        //Actualizamosla ruta activa antes de realizar las operaciones
        list1.rutaActiva = EntidadesService.rutaActiva;
        //llamamos al metodo del servicio que se encarga de añadir los puntos
        EntidadesService.anadirPunto(list1.numRuta, EntidadesService.rutaActiva, latitud, longitud);
        //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
        list1.actualizarPuntosR();


    };
    //Es llamado desde el evento click del mapa y añade un punto a la ruta activa
    list1.anadirPuntoRForMap = function (latitud, longitud) {
        //Actualizamosla ruta activa antes de realizar las operaciones
        list1.rutaActiva = EntidadesService.rutaActiva;
        //llamamos al metodo del servicio que se encarga de añadir los puntos
        EntidadesService.anadirPunto(list1.numRuta, EntidadesService.rutaActiva, latitud, longitud);
        //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
        list1.actualizarPuntosR();
        $scope.$apply();


    };
    list1.changedT = function () {
        list1.actualizarPuntosT();
        if(EntidadesService.mapa.getZoom()>=17 && EntidadesService.ver)
        EntidadesService.actualizarMarkers2();
        EntidadesService.superponerPolylinea();
        EntidadesService.puntoElegido = null;

    };
    list1.changedR = function () {
        list1.actualizarPuntosR();
        if( EntidadesService.ver)
        EntidadesService.actualizarMarkersR2();
        EntidadesService.superponerPolylineaR();
        EntidadesService.puntoElegido = null;
    };
    list1.changedW = function () {
        EntidadesService.wpActivo = list1.wpActivo;
        list1.lng=EntidadesService.waypoints[EntidadesService.wpActivo].longitud;
        list1.lat =EntidadesService.waypoints[EntidadesService.wpActivo].latitud;
    };
    //Actualiza los puntos de los tracks para que los componenetes que los
    // necesiten tengan la ultima version de los puntos
    list1.actualizarPuntosT = function () {
        //Es necesario para que el el servicio sepa que tipo de entidad esta manejando
        EntidadesService.isTrack = true;
        EntidadesService.isWaypoint = false;
        list1.modoCreacion = false;
        EntidadesService.modoCreacion = false;

        EntidadesService.trackActivo = list1.trackActivo;
        EntidadesService.actualizarPuntosT();
        list1.puntosTrackActivo = EntidadesService.puntosTrackActivo;
        list1.exportTabla();


    };
    //Actualiza los puntos de las rutas para que los componenetes que los
    // necesiten tengan la ultima version de los puntos
    list1.actualizarPuntosR = function () {
        //Es necesario para que el el servicio sepa que tipo de entidad esta manejando
        EntidadesService.isTrack = false;
        EntidadesService.isWaypoint = false;
        list1.modoCreacion = false;
        EntidadesService.modoCreacion = false;
        EntidadesService.rutaActiva = list1.rutaActiva;
        EntidadesService.actualizarPuntosR();
        list1.puntosTrackActivo = EntidadesService.puntosTrackActivo;
        list1.exportTabla();
    };
    //Comprobamos desde que navegador accede el usuario a nuestra aplicación
    list1.esIE = /*@cc_on!@*/false || !!document.documentMode;
    list1.isEdge = /Edge\/\d./i.test(navigator.userAgent);
    list1.isChrome = !!window.chrome && !!window.chrome.webstore;
    list1.isFirefox = typeof InstallTrigger !== 'undefined';
    list1.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window['safari'] || safari.pushNotification);
    if (list1.esIE) {
        list1.esIE = true;
        list1.isSafari = false;
        list1.isChrome = false;
        list1.isFirefox = false;
        list1.isEdge = false;
    } else if (list1.isEdge) {
        list1.esIE = false;
        list1.isSafari = false;
        list1.isChrome = false;
        list1.isFirefox = false;
        list1.isEdge = true;
    } else if (list1.isChrome) {
        list1.esIE = false;
        list1.isSafari = false;
        list1.isChrome = true;
        list1.isFirefox = false;
        list1.isEdge = false;
    } else if (list1.isFirefox) {
        list1.esIE = false;
        list1.isSafari = false;
        list1.isChrome = false;
        list1.isFirefox = true;
        list1.isEdge = false;
    } else if (list1.isSafari) {

        list1.esIE = false;
        list1.isSafari = true;
        list1.isChrome = false;
        list1.isFirefox = false;
        list1.isEdge = false;
    }
    list1.dowXmlForWp = function () {
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        list1.noError = false;
        list1.error = false;
        EntidadesService.modoInsertar = false;
        list1.dataUrl = "";
        if (EntidadesService.waypoints.length < 1) {
            list1.error = true;
            list1.mensajeError = "Necesitas tener waypoints creados para poder descargarlos";
        } else if (isIE || list1.isEdge) {
            var xml = EntidadesService.getWaypoints();
            list1.dataUrl = 'data:application/xml,'
                + encodeURIComponent(xml);
            window.navigator.msSaveBlob(new Blob([xml], {type: 'application/xml'}), "myfile.gpx")
        }
        else if (list1.isSafari) {
            list1.error = false;
            var xml = EntidadesService.getWaypoints();
            list1.dataUrl = 'data:xml/plain,'
                + encodeURIComponent(xml);
            list1.error = true;
            list1.mensajeError = 'Al usar safari puede que te baje sin extension,cuando ' +
                'lo tengas renombra el archivo y añadele la extension ".gpx"';
        }
        else {
            var xml = EntidadesService.getWaypoints();
            //en los navegadores chroome y mozilla hacemos uso de la propiedad download para descargar la imagen
            list1.dataUrl = 'data:xml/plain;charset=utf-8,'
                + encodeURIComponent(xml);

        }
    };
    list1.dowXmlForR = function () {
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        list1.noError = false;
        list1.error = false;
        EntidadesService.modoInsertar = false;
        list1.dataUrl = "";
        if (EntidadesService.rutas.length < 1) {
            list1.error = true;
            list1.mensajeError = "Necesitas tener rutas creadas para poder descargar una";
        }
        else if (EntidadesService.isTrack == true || EntidadesService.modoCreacion == true) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona una ruta para descargar";
        }//Si el navegador es explorer se hace de manera diferente ya que no es compatible con el atributo download de html5
        else if (isIE || list1.isEdge) {
            var xml = EntidadesService.getXml(false);
            list1.dataUrl = 'data:application/xml,'
                + encodeURIComponent(xml);
            window.navigator.msSaveBlob(new Blob([xml], {type: 'application/xml'}), "myfile.gpx")
        }
        else if (list1.isSafari) {
            list1.error = false;
            var xml = EntidadesService.getXml(false);
            list1.dataUrl = 'data:xml/plain,'
                + encodeURIComponent(xml);
            list1.error = true;
            list1.mensajeError = 'Al usar safari puede que te baje sin extension,cuando ' +
                'lo tengas renombra el archivo y añadele la extension ".gpx"';
        } else {
            var xml = EntidadesService.getXml(false);
            //en los navegadores chroome y mozilla hacemos uso de la propiedad download para descargar la imagen
            list1.dataUrl = 'data:xml/plain;charset=utf-8,'
                + encodeURIComponent(xml);

        }

    };
    list1.dowXml = function () {
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        list1.noError = false;
        list1.error = false;
        EntidadesService.modoInsertar = false;
        list1.dataUrl = "";
        if (EntidadesService.tracks.length < 1) {
            list1.error = true;
            list1.mensajeError = "Necesitas tener tracks creados para poder descargar uno";
        }
        else if (EntidadesService.isTrack == false) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona un track para descargar";
        }
        //Si el navegador es explorer se hace de manera diferente ya que no es compatible con el atributo download de html5
        else if (isIE || list1.isEdge) {
            var xml = EntidadesService.getXml(true);
            list1.dataUrl = 'data:application/xml,'
                + encodeURIComponent(xml);
            window.navigator.msSaveBlob(new Blob([xml], {type: 'application/xml'}), "myfile.gpx")
        }
        else if (list1.isSafari) {
            list1.error = false;
            var xml = EntidadesService.getXml(true);
            list1.dataUrl = 'data:xml/plain;charset=utf-8,'
                + encodeURIComponent(xml);
            list1.error = true;
            list1.mensajeError = 'Al usar safari puede que te baje sin extension,cuando ' +
                'lo tengas renombra el archivo y añadele la extension ".gpx"';
            //window.open('data:application/octet-stream,' +encodeURIComponent(xml));
        }
        else {
            var xml = EntidadesService.getXml(true);
            //en los navegadores chroome y mozilla hacemos uso de la propiedad download para descargar la imagen
            list1.dataUrl = 'data:xml/plain;charset=utf-8,'
                + encodeURIComponent(xml);

        }

    };

    //Funcion para la descarga de la imagen de tabla
    list1.dowImage = function () {
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        //Si el navegador es explorer se hace de manera diferente ya que no es compatible con el atributo download de html5
        if (isIE || list1.isEdge) {
            //Accedemos al canvas que tiene la imagen
            var canvas = document.getElementById("canvas");
            //Obtenemos su url
            list1.dataUrl = canvas.toDataURL("image/webp");
            var data = atob(list1.dataUrl.substring("data:image/png;base64,".length)),
                asArray = new Uint8Array(data.length);

            for (var i = 0, len = data.length; i < len; ++i) {
                asArray[i] = data.charCodeAt(i);
            }
            //creamos un objeto blob cuyo parámetro es una matriz que incluye el contenido deseado y el tipo del contenido
            var blob = new Blob([asArray.buffer], {type: "image/png"});
            //Usamos msSaveBlob para proporcionar la opción de descarga d ela imagen
            window.navigator.msSaveBlob(blob, 'prueba.png');
        } else if (list1.isSafari) {
            var canvas = document.getElementById("canvas");
            var link = document.getElementById("btn-downloadSA");
            list1.dataUrl = canvas.toDataURL("image/png");
        }
        else {

            var canvas = document.getElementById("canvas");
            list1.dataUrl = canvas.toDataURL("image/png");
        }
    };

    list1.exportTabla = function () {
        var array = [];
        for (var item in list1.puntosTrackActivo) {
            var e = {
                a: item, b: list1.puntosTrackActivo[item].latitud,
                c: list1.puntosTrackActivo[item].longitud,
                d: list1.puntosTrackActivo[item].elevacion,
                e: list1.puntosTrackActivo[item].fecha,
                f: list1.puntosTrackActivo[item].hora,
                g: list1.puntosTrackActivo[item].desnivel,
                h: list1.puntosTrackActivo[item].distancia,
                i: list1.puntosTrackActivo[item].velocidad
            };
            array.push(e);
        }
        $scope.getArray = array;
    };


    //Cabecera que tendrá la tabla en formato csv
    $scope.getHeader = function () {
        return ["Punto nº", "Latitud", "Longitud", "Elevación", "Fecha", "Hora", "Desnivel", "Distancia", "Velocidad"]
    };

    list1.exportTablaR = function () {
        var array = [];
       
        for (var item in list1.puntosTrackActivo) {
            var e = {
                a: item,
                b: list1.puntosTrackActivo[item].latitud,
                c: list1.puntosTrackActivo[item].longitud,
                d: list1.puntosTrackActivo[item].elevacion,
                e: list1.puntosTrackActivo[item].desnivel,
                f: list1.puntosTrackActivo[item].distancia
            };
            array.push(e);
        }
        $scope.getArray = array;
    };


    //Cabecera que tendrá la tabla en formato csv
    $scope.getHeaderR = function () {
        return ["Punto nº", "Latitud", "Longitud", "Elevación","Desnivel", "Distancia"]
    };

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
    list1.mostrarBotonesW = false;
    //Mostrar los botones que estan dentro de archivo en los waypoints
    list1.mostrarBotonesR = false;
    list1.mostrarAlert = true;

//Funcion que oculta el alerte que indica si el modoc reacion esta activado o desactivado
    list1.noVerAlert = function () {
        list1.mostrarAlert = false;
    };
    //oculta los botones que estan en archivo
    list1.noVerBotones = function () {
        list1.mostrarBotones = false;
        list1.mostrarBotonesR = false;
        list1.mostrarBotonesW = false;
        $("#funciones").css("width", "150px");
    };
    //Mostar botones de rutas
    list1.verBotonesR = function () {
        if (list1.mostrarBotonesR == true) {
            list1.mostrarBotonesR = false;
            $("#funciones").css("width", "150px");
        } else {
            list1.mostrarBotonesR = true;
            $("#funciones").css("width", "270px");
        }

    };
    //Mostar botones de waypoints
    list1.verBotonesW = function () {
        if (list1.mostrarBotonesW == true) {
            list1.mostrarBotonesW = false;
            $("#funciones").css("width", "150px");
        } else {
            list1.mostrarBotonesW = true;
            $("#funciones").css("width", "270px");
        }

    };
    //Mostrar botones de track
    list1.verBotones = function () {
        if (list1.mostrarBotones == true) {
            list1.mostrarBotones = false;
            $("#funciones").css("width", "150px");
        } else {
            list1.mostrarBotones = true;
            $("#funciones").css("width", "270px");
        }

    };
    //superpone la tabla a la gráfica
    list1.superponerLista = function () {
        $("#lista").css("z-index", 2);
        $("#datos").css("z-index", 1);
        $("#grafica").css("z-index", 0);
    };
    //superpone la tabla a la gráfica
    list1.superponerTabla = function () {
        $("#lista").css("z-index", 0);
        $("#datos").css("z-index", 1);
        $("#grafica").css("z-index", 0);
    };
    //Superpone la gráfica a la tabla
    list1.superponerGrafica = function () {
        $("#datos").css("z-index", 0);
        $("#grafica").css("z-index", 1);
    };
    //Mostar u ocultar la tabla
    list1.verTablaT = function () {
        list1.tablaT = true;
        list1.whyCvsExport = true;
        if (list1.mostrarTabla == true) {
            list1.mostrarTabla = false;
            list1.mensajeVerTabla = "ver tabla"
        } else {
            if (list1.tracks.length > 0) {
                list1.puntosTrackActivo = list1.tracks[list1.trackActivo]["puntos"];
                EntidadesService.puntosTrackActivo = list1.puntosTrackActivo;
                list1.actualizarPuntosT();
            }
            list1.mostrarTabla = true;
            list1.mensajeVerTabla = "ocultar tabla"
            list1.superponerTabla();
        }

    };
    //Mostar u ocultar la tabla
    list1.verTablaR = function () {
        list1.tablaT=false;
        list1.whyCvsExport = false;
        if (list1.mostrarTabla == true) {
            list1.mostrarTabla = false;
            list1.mensajeVerTabla = "ver tabla"
        } else {

            if (list1.rutas.length > 0) {
                list1.puntosTrackActivo = list1.rutas[list1.rutaActiva]["puntos"];
                EntidadesService.puntosTrackActivo = list1.puntosTrackActivo;
                list1.actualizarPuntosR();
            }
            list1.mostrarTabla = true;
            list1.mensajeVerTabla = "ocultar tabla"
            list1.superponerTabla();
        }

    };
    //Mostar u ocultar la gráfica
    list1.verGrafica = function () {
        if (list1.mostrarGrafica == true) {
            list1.mostrarGrafica = false;
            list1.mensajeVerGrafica = "ver gráfica";
        } else {
            list1.mostrarGrafica = true;
            list1.mensajeVerGrafica = "ocultar gráfica";
            list1.superponerGrafica();
        }

    };
    //Mostar la lista de track
    list1.listaActiva = function () {
         list1.noError = false;
        list1.error = false;
       
            list1.noError = true;
            list1.mensajeError = "Has creado un track, para añadir puntos por favor pincha en el mapa";
        list1.crear(0);
        list1.activarListaR = false;
        list1.activarListaW = false;
        list1.activarLista = true;
        list1.mensajeVerlista = "ocultar lista";
        list1.mensajeVerlistaR = "ver lista";
        list1.mensajeVerlistaW = "ver lista";
        EntidadesService.actualizarMarkersR2();
        //Le metemos un tiempo de espera para que el input se cree antes d eque este metodo se ejecute
        setTimeout(function () {
            for(var i in list1.tracks){
                if(i!= list1.tracks.length-1){
                    $("#in"+i).attr('checked', false);}
                else{
                    $("#in"+i).prop("checked",true);
                    $("#in"+i).click();
                }
            }
        },10);


    };
    //Mostrar la lista de rutas
    list1.listaActivaR = function () {
         list1.noError = false;
        list1.error = false;
       
            list1.noError = true;
            list1.mensajeError = "Has creado una ruta, para añadir puntos por favor pincha en el mapa";
        list1.crear(1);
        list1.activarLista = false;
        list1.activarListaW = false;
        list1.activarListaR = true;
        list1.mensajeVerlista = "ver lista";
        list1.mensajeVerlistaR = "ocultar lista";
        list1.mensajeVerlistaW = "ver lista";
        EntidadesService.actualizarMarkers2();
        //Le metemos un tiempo de espera para que el input se cree antes d eque este metodo se ejecute
        setTimeout(function () {
            for(var i in list1.rutas){
                if(i!= list1.rutas.length-1){
                    $("#inr"+i).attr('checked', false);}
                else{
                    $("#inr"+i).prop("checked",true);
                    $("#inr"+i).click();
                }
            }
        },10);

    };
    //Mostrar la lista de waypoints
    list1.listaActivaW = function () {
        list1.activarListaR = false;
        list1.activarLista = false;
        list1.activarListaW = true;
        list1.mensajeVerlista = "ver lista";
        list1.mensajeVerlistaR = "ver lista";
        list1.mensajeVerlistaW = "ocultar lista";
        list1.crearWaypoint();


    };
    //Mostrar u ocultar la lista de rutas
    list1.listaR = function () {
        list1.activarListaW = false;
        list1.activarLista = false;
        if (EntidadesService.isWaypoint == true) {
            list1.mostrarMensaje = true;
        } else {
            list1.mostrarMensaje = false;
        }
        if (list1.activarListaR == true) {
            list1.activarListaR = false;
            list1.mensajeVerlistaR = "ver lista";
        } else {
            list1.activarListaR = true;
            list1.mensajeVerlistaR = "ocultar lista";
            list1.mensajeVerlistaW = "ver lista";
            list1.mensajeVerlista = "ver lista";
            EntidadesService.isTrack = false;
            EntidadesService.actualizarMarkers2();
            EntidadesService.actualizarMarkersR2();
            EntidadesService.puntoElegido = null;
            EntidadesService.isWaypoint = false;
            if (list1.mostrarTabla == true)
                list1.mostrarTabla = false;
            else {
                list1.mostrarTabla = true;
            }
            list1.verTablaR();
        }
          setTimeout(function(){
          for(var i in EntidadesService.rutas){
              $("#lir"+(i))[0].style.color = EntidadesService.polyLineasR[i].strokeColor;
          }
    },10);

    };
    //Mostar u ocultar la lista de waypoints
    list1.listaW = function () {
        list1.activarListaR = false;
        list1.activarLista = false;
        if (list1.activarListaW == true) {
            list1.activarListaW = false;
            list1.mensajeVerlistaW = "ver lista";
        } else {
            list1.activarListaW = true;
            list1.mensajeVerlistaW = "ocultar lista";
            list1.mensajeVerlistaR = "ver lista";
            list1.mensajeVerlista = "ver lista";
            EntidadesService.isWaypoint = false;
        }

    };
    //Mostrar u ocultar la lista de track
    list1.listaT = function () {
        list1.activarListaR = false;
        list1.activarListaW = false;
        if (EntidadesService.isWaypoint == true) {
            list1.mostrarMensaje = true;
        } else {
            list1.mostrarMensaje = false;
        }
        if (list1.activarLista == true) {
            list1.activarLista = false;
            list1.mensajeVerlista = "ver lista";
        } else {
            list1.activarLista = true;
            list1.mensajeVerlista = "ocultar lista";
            list1.mensajeVerlistaR = "ver lista";
            list1.mensajeVerlistaW = "ver lista";
            EntidadesService.isTrack = true;
            EntidadesService.actualizarMarkersR2();
            EntidadesService.actualizarMarkers2();
            EntidadesService.puntoElegido = null;
            EntidadesService.isWaypoint = false;
            list1.modoCreacion = false;
            EntidadesService.modoCreacion = false;
            if (list1.mostrarTabla == true)
                list1.mostrarTabla = false;
            else {
                list1.mostrarTabla = true;
            }
            list1.verTablaT();
           
        }
        setTimeout(function(){
          for(var i in EntidadesService.tracks){
              $("#li"+(i))[0].style.color = EntidadesService.polyLineas[i].strokeColor;
          }
    },10);

    };
    //Muestra u coulta la lista de botones relacionados con los track
    list1.listarFunciones = function () {
        list1.funcionesR = false;
        list1.funcionesW = false;
        list1.mostrarBotones = false;
        list1.mostrarBotonesR = false;
        list1.mostrarBotonesW = false;
        if (list1.funciones == true) {
            list1.funciones = false;
        } else {
            list1.funciones = true;
            EntidadesService.isTrackImport = true;
            EntidadesService.isRuteImport = false;
            EntidadesService.isWpImport = false;
        }

    };
    //Muestra u coulta la lista de botones relacionados con las rutas
    list1.listarFuncionesR = function () {
        list1.funciones = false;
        list1.funcionesW = false;
        list1.mostrarBotones = false;
        list1.mostrarBotonesR = false;
        list1.mostrarBotonesW = false;
        if (list1.funcionesR == true) {
            list1.funcionesR = false;
        } else {
            list1.funcionesR = true;
            EntidadesService.isTrackImport = false;
            EntidadesService.isRuteImport = true;
            EntidadesService.isWpImport = false;
        }

    };
    //Muestra u coulta la lista de botones relacionados con los waypoints
    list1.listarFuncionesW = function () {
        list1.funciones = false;
        list1.funcionesR = false;
        list1.mostrarBotones = false;
        list1.mostrarBotonesR = false;
        list1.mostrarBotonesW = false;
        if (list1.funcionesW == true) {
            list1.funcionesW = false;
        } else {
            list1.funcionesW = true;
            EntidadesService.isTrackImport = false;
            EntidadesService.isRuteImport = false;
            EntidadesService.isWpImport = true;
        }

    }
}




})();
