(function () {
'use strict';

angular.module('GPS')
.controller('PruebaController',PruebaController);

function PruebaController($scope,EntidadesService,$document) {
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
    list1.coordV ="ocultar Coor";
    list1.tablaT = false;
    list1.escala = "5km";
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
    }

    list1.activarImportWp = function functionName() {
        list1.error = false;
        if (EntidadesService.xmlImportado == undefined) {
            list1.error = true;
            list1.mensajeError = "Antes de importar selecciona un archivo con el boton seleccione fichero ";

        } else {
            EntidadesService.importXMLWp();
        }
    }

    list1.activarImportRuta = function () {
        list1.error = false;
        if (EntidadesService.xmlImportado == undefined) {
            list1.error = true;
            list1.mensajeError = "Antes de importar selecciona un archivo con el boton seleccione fichero ";

        } else {
            list1.crear(1);
            EntidadesService.importXML();
        }
    }
    list1.activarImport = function () {
        list1.error = false;
        if (EntidadesService.xmlImportado == undefined) {
            list1.error = true;
            list1.mensajeError = "Antes de importar selecciona un archivo con el boton seleccione fichero ";

        } else {
            list1.crear(0);
            EntidadesService.importXML();
        }
    }

    //Metodo que llama al metodo unir del service
    list1.unirRutas = function () {
        //Desactivamos el boolean error
        list1.noError = false;
        list1.error = false;
        EntidadesService.modoInsertar = false;
        //Si ninguna ruta fuera seleccionada activamos el error y pasamos el mensaje
        if (EntidadesService.isTrack == true
            || EntidadesService.rutas[EntidadesService.rutaActiva] === undefined
            || EntidadesService.modoCreacion == true) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona una ruta para unir";
            //SI la ruta no tiene al menos dos puntos activamos el error
        } else if (EntidadesService.rutas.length < 2) {
            list1.error = true;
            list1.mensajeError = "Se necesitan al menos dos rutas para poder realizar la unión";
        }
        else {
            //Pedimos la ruta con la que se quiere unir
            var rutaElegida = prompt("Introduczca el nombre o el nº(la primera ruta seria el nº 0) de la ruta que quiere unir", "0");
            //Pasamos el index a int
            var elegido = parseInt(rutaElegida);
            //SI en lugar de posicion nos mete el nombre
            if (isNaN(elegido)) {
                //Entonces lo buscamos por el nombre
                elegido = EntidadesService.buscarRutaPorNombre(rutaElegida);
            }
            //Si la ruta no exitiera activamos el error
            if (elegido == null || EntidadesService.rutas[elegido] == undefined) {
                list1.error = true;
                list1.mensajeError = "La ruta elegido no existe";
                //Si alguna de las dos rutas no tiene al menos dos puntos creados activamos el error
            } else if (EntidadesService.rutas[EntidadesService.rutaActiva].puntos.length < 2 || EntidadesService.rutas[elegido].puntos.length < 2) {
                list1.error = true;
                list1.mensajeError = "Algunas de las dos rutas no dispone de al menos dos puntos creados";
                //Si el usuario intenta unir una rita con ella misma activamos el error
            } else if (elegido == EntidadesService.rutaActiva
                || elegido == EntidadesService.rutas[EntidadesService.rutaActiva].nombre) {
                list1.error = true;
                list1.mensajeError = "Elige otra ruta, no puede unir una ruta con ella misma";
            }
            else {
                //Creamos la ruta que almacenara los puntos de la union
                list1.crear(1);
                //Llamamos al metodo unir rutas del service
                EntidadesService.unirRuta(elegido);
            }
        }
    }
    //metodo que llama a la funcion unir tracks del service
    list1.unirTracks = function () {
        //Desactivamos el error
        list1.noError = false;
        list1.error = false;
        EntidadesService.modoInsertar = false;
        //Activamos el error si el usuario no ha seleccionado un track
        if (EntidadesService.isTrack == false
            || EntidadesService.tracks[EntidadesService.trackActivo] === undefined) {
            list1.error = true;
            list1.mensajeError = "Por favor selecciona un track para unir";
            //Activamos el error si el track no dispone de al menos dos puntos
        } else if (EntidadesService.tracks.length < 2) {
            list1.error = true;
            list1.mensajeError = "Se necesitan al menos dos tracks para poder realizar la unión";
        }
        else {
            //Pedimos el track al usuario
            var trackElegido = prompt("Introduczca el nombre o el nº(el primer track seria el nº 0) del track que quiere unir", "0");
            //Lo pasamos a entero
            var elegido = parseInt(trackElegido);
            //Si ha metido su nombre en lugar de su posicion
            if (isNaN(elegido)) {
                //Buscamos el track por el nombre
                elegido = EntidadesService.buscarTrackPorNombre(trackElegido);
            }
            //Activamos el error si el track no exitiera
            if (elegido == null || EntidadesService.tracks[elegido] == undefined) {
                list1.error = true;
                list1.mensajeError = "El track elegido no existe";
                //Activamos el error si el track no tiene al menos dos puntos
            } else if (EntidadesService.tracks[EntidadesService.trackActivo].puntos.length < 2 || EntidadesService.tracks[elegido].puntos.length < 2) {
                list1.error = true;
                list1.mensajeError = "Alguno de los dos tracks no dispone de al menos dos puntos creados";
                //Activamos el error si el usuario ha intentado unir el track con el mismo
            } else if (elegido == EntidadesService.trackActivo
                || elegido == EntidadesService.tracks[EntidadesService.trackActivo].nombre) {
                list1.error = true;
                list1.mensajeError = "Elige otro track, no puedes unir un track con el mismo";
            }
            else {
                //Creamos el track que almacenara los puntos de la union
                list1.crear(0);
                //llamamos al metodo unir del service
                EntidadesService.unirTrack(elegido);
            }
        }
    }

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
            EntidadesService.borrarRuta();
        }

    }
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

    }

    list1.verCoord= function () {


        if(EntidadesService.coords){
            EntidadesService.coords=false;
            list1.coordV="ocultar coord";
        }
        else{
            EntidadesService.coords=true;
            list1.coordV="ver coord";
        }
        var ps = $('P')

        for (var i = 0, len = ps.length; i < len; ++i)
        {
            if(EntidadesService.coords)
                ps[i].style.visibility= "hidden";
            else
                ps[i].style.visibility= "visible";
        }
    }

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
            EntidadesService.borrarTrack();
        }

    }

    //Metodo que recorta una ruta
    list1.recortarRuta = function () {
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
            list1.mensajeError = "Antes de cortar tienes que seleccionar en la tabla el punto a partir del cual quieres realizar el corte";
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
            //Guardamos el punto elegido
            EntidadesService.puntoElegido = punto;
            // Y llamamos al metodo del service
            EntidadesService.recortarRuta();
        }
    }

    //Metodo que recorta un track
    list1.recortarTrack = function () {
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
            list1.mensajeError = "Antes de cortar tienes que seleccionar en la tabla el punto a partir del cual quieres realizar el corte";
            //Se comprueba que el track tiene al menos dos puntos creados
        } else if (list1.tracks[list1.trackActivo].puntos.length < 2) {
            list1.error = true;
            list1.mensajeError = "El track necesita tener mas de un punto creado para poder ser cortado";
        }
        //Si todo esta bien...
        else {
            //Creamos dos tracks para almacenar los dos recortes
            list1.crear(0);
            list1.crear(0);
            //Guardamos el punto elegido
            EntidadesService.puntoElegido = punto;
            //Y llamaos al metodo del service
            EntidadesService.recortarTrack();
        }
    }

    //Funcion que obtiene de la tabla el punto seleccionado por el usuario
    list1.puntoSelec = function (index) {

        EntidadesService.puntoSelec(index);
        EntidadesService.puntoBorrado = true;
    }

    list1.descripcion = function () {
        list1.error = false;
        list1.noError = false;
        EntidadesService.modoInsertar = false;
        //Se comprueba que tenga algun waypoint creado
        if (EntidadesService.waypoints.length <= 0) {
            list1.error = true;
            list1.mensajeError = "No tienes ningun waypoint creado";
        }
        var nombre = prompt("Introduzca la nueva descripción", "Nueva descripción");
        if (nombre != null && EntidadesService.waypoints.length > 0) {
            //Se llama al metodo del service para cambiar la descripción
            EntidadesService.cambiarDescripcion(nombre);
        }
    }
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
        var nombre = prompt("Introduzca el nuevo nombre", "Nuevo nombre");
        if (nombre != null && EntidadesService.tracks.length > 0) {
            //Se llama al metodo del service para cambiar el nombre
            EntidadesService.renombrarT(nombre);
        }

    }
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
        var nombre = prompt("Introduzca el nuevo nombre", "Nuevo nombre");
        if (nombre != null && EntidadesService.rutas.length > 0) {
            //Se llama al metodo del service para cambiar el nombre
            EntidadesService.renombrarR(nombre);
        }

    }
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
            var nombre = prompt("Introduzca el nuevo nombre", "Nuevo nombre");
            if (nombre != null && EntidadesService.waypoints.length > 0) {
                //SE guarda el waypoint seleccionado
                EntidadesService.wpActivo = list1.wpActivo;
                //Se llama al metodo del service para cambiar el nombre
                EntidadesService.renombrarW(nombre);
            }
        }

    }

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
            list1.mensajeError = "Debes seleccionar un punto en la tabla de puntos  para poder borrarlo";
            //Se comprueba que la ruta tenga puntos creados
        } else if (EntidadesService.rutas[EntidadesService.rutaActiva].puntos.length < 1) {
            list1.error = true;
            list1.mensajeError = "La ruta no dispone de puntos que eliminar";
            //En caso de ir todo bien...
        } else {
            //se llama al metodo del service
            EntidadesService.eliminarPuntoRuta();
            //Se quita el modo borrar
            EntidadesService.puntoBorrado = false;
            //Se resetea el punto elegido
            EntidadesService.puntoElegido = null;
        }

    }

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
            list1.mensajeError = "Debes seleccionar un punto en la tabla de puntos para poder insertar a continuación";
            //Se comprueba que la ruta tenga puntos creados
        } else if (EntidadesService.rutas[EntidadesService.rutaActiva].puntos.length < 2) {
            list1.error = true;
            list1.mensajeError = "La ruta no dispone de puntos entre los que insertar";
        }
        //Si no hay errores activamos el modo inserccion y avisamos al usuario
        else {
            EntidadesService.modoInsertar = true;
            list1.noError = true;
            list1.mensajeError = "Has entrado en el modo insertar punto intermedio, " +
                "para salir pulse otra vez insertar punto. " +
                "Selecciona el punto de origen y después pincha donde " +
                "quieras añadir el nuevo punto";
        }

    }

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
            list1.mensajeError = "Debes seleccionar un punto en la tabla de puntos para poder insertar a continuación";
            //COmprobamos que el track tenga puntos creados
        } else if (EntidadesService.tracks[EntidadesService.trackActivo].puntos.length < 2) {
            list1.error = true;
            list1.mensajeError = "El track no dispone de puntos entre los que insertar";
        }
        //Si todo esta bien activamos el modo insertar y avisamos al usuario
        else {
            EntidadesService.modoInsertar = true;
            list1.noError = true;
            list1.mensajeError = "Has entrado en el modo insertar punto intermedio, " +
                "para salir pulse otra vez insertar punto. " +
                "Selecciona el punto de origen y después pincha donde " +
                "quieras añadir el nuevo punto";
        }
    }

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
            list1.mensajeError = "Debes seleccionar un punto en la tabla de puntos para poder borrarlo";
            //Comprobamos que el track tenga puntos creados
        } else if (EntidadesService.tracks[EntidadesService.trackActivo].puntos.length < 1) {
            list1.error = true;
            list1.mensajeError = "El track no dispone de puntos que eliminar";
            //SI todo esta bien llamamos al metodo del service
        } else {
            EntidadesService.eliminarPuntoTrack();
            EntidadesService.puntoBorrado = false;
            EntidadesService.puntoElegido = null;
        }

    }
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
            //Si todo es correcto llamamos al metodo del service
            EntidadesService.invertirTrack();
        }
    }
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
            //Si todo esta bien se llam al metodo dek service
            EntidadesService.invertirRuta();
        }
    }

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
    }

    //Detectamos si pulsa la tecla escape y si el modo creacion de waypoints esta actuivado pues lo desactivamos
    $document.bind("keydown", function (e) {

        var boton = $('#botonCrearW');

        if (EntidadesService.modoCreacion == true && e.key == "Escape") {
            boton.click();
        }

    });

    //FUncion que pide al usuario una fecha y una velocidad y calcula los tiempos del track a partir de esos datos
    list1.cambiarTiempos = function () {
        //Solo ejecutamos la funcion si hay algun tracl creado y si en el momento actual se esta modificando un track
        if (EntidadesService.tracks.length > 0 && EntidadesService.isTrack == true) {
            var velocidad = prompt("Velocidad del recorrido en km/h (no incluya la unidad, solo el numero)", "4");
            var velocidadInt = parseInt(velocidad);
            //Si la velocidad introducida no es correcta y la operacion no se ha cancelado se vuelve a pedir la velocidad
            while (isNaN(velocidadInt) == true && velocidad != null) {
                velocidad = prompt("Por favor introduzca una velocidad correcta en km/h (no incluya la unidad, solo el numero)", "4");
                velocidadInt = parseInt(velocidad);
                //Si la operacion es cancelada por el usuario se sale del while
                if (velocidad == null) {
                    break;
                }
            }
            //Si la operacion no ha sido cancelada se pide la fecha al ususario
            if (velocidad != null)
                var fechas = prompt("Introduca año,mes,dia,hora,minutos separados por comas", "2017,01,01,00,00");
            //Si la operacion ha sido cancelada no se ejecutara este if
            if (fechas != null && velocidad != null) {
                var cadena = fechas.split(",");
                var fecha = new Date(cadena[0], cadena[1], cadena[2], cadena[3], cadena[4], "00", "00");
                //Si la fecha es incorrecta  se vuelve a pedir
                while (fecha == "Invalid Date") {
                    fechas = prompt("La fecha no se ha introducido en el formato indicado por favor introduca año,mes,dia,hora,minutos separados por comas", "2017,01,01,00,00");
                    //Si se cancela la operacion se sale del while
                    if (fechas == null) {
                        break;
                    } else {
                        cadena = fechas.split(",");
                        fecha = new Date(cadena[0], cadena[1], cadena[2], cadena[3], cadena[4], "00", "00");
                    }
                }
                //Si la operacio ha sido cancelada no se ejecutara el metodo
                if (fechas != null) {
                    EntidadesService.cambiarTiempos(parseInt(velocidad), fecha,list1.trackActivo);
                    list1.actualizarPuntosT();
                }
            }
        }
    }
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
    }
    //Es llamado desde el evento click del mapa y añade un punto al track activo
    list1.anadirPuntoTForMapR = function (track, latitud, longitud) {
        //Actualizamos el track activo antes de realizar las operaciones
        list1.trackActivo = EntidadesService.trackActivo;
        //llamamos al metodo del servicio que se encarga de añadir los puntos
        EntidadesService.anadirPunto(list1.numTrack, track, latitud, longitud);
        //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
        list1.actualizarPuntosT();


    }

    //Es llamado desde el evento click del mapa y añade un punto al track activo
    list1.anadirPuntoTForMapI = function (latitud, longitud) {
        //Actualizamos el track activo antes de realizar las operaciones
        list1.trackActivo = EntidadesService.trackActivo;
        //llamamos al metodo del servicio que se encarga de añadir los puntos
        EntidadesService.anadirPunto(list1.numTrack, EntidadesService.trackActivo, latitud, longitud);
        //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
        list1.actualizarPuntosT();


    }

    //Es llamado desde el evento click del mapa y añade un punto al track activo
    list1.anadirPuntoTForMap = function (latitud, longitud) {
        //Actualizamos el track activo antes de realizar las operaciones
        list1.trackActivo = EntidadesService.trackActivo;
        //llamamos al metodo del servicio que se encarga de añadir los puntos
        EntidadesService.anadirPunto(list1.numTrack, EntidadesService.trackActivo, latitud, longitud);
        //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
        list1.actualizarPuntosT();
        $scope.$apply();


    }
    //Es llamado desde el evento click del mapa y añade un punto a la ruta activa
    list1.anadirPuntoRForMapR = function (ruta, latitud, longitud) {
        //Actualizamosla ruta activa antes de realizar las operaciones
        list1.rutaActiva = EntidadesService.rutaActiva;
        //llamamos al metodo del servicio que se encarga de añadir los puntos
        EntidadesService.anadirPunto(list1.numRuta, ruta, latitud, longitud);
        //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
        list1.actualizarPuntosR();


    }
    //Es llamado desde el evento click del mapa y añade un punto a la ruta activa
    list1.anadirPuntoRForMapI = function (latitud, longitud) {
        //Actualizamosla ruta activa antes de realizar las operaciones
        list1.rutaActiva = EntidadesService.rutaActiva;
        //llamamos al metodo del servicio que se encarga de añadir los puntos
        EntidadesService.anadirPunto(list1.numRuta, EntidadesService.rutaActiva, latitud, longitud);
        //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
        list1.actualizarPuntosR();


    }
    //Es llamado desde el evento click del mapa y añade un punto a la ruta activa
    list1.anadirPuntoRForMap = function (latitud, longitud) {
        //Actualizamosla ruta activa antes de realizar las operaciones
        list1.rutaActiva = EntidadesService.rutaActiva;
        //llamamos al metodo del servicio que se encarga de añadir los puntos
        EntidadesService.anadirPunto(list1.numRuta, EntidadesService.rutaActiva, latitud, longitud);
        //Actualizamos los puntos para que la tabla y la grafica puedan actualizarse al momento
        list1.actualizarPuntosR();
        $scope.$apply();


    }
    list1.changedT = function () {
        list1.actualizarPuntosT();
        EntidadesService.actualizarMarkers();
        EntidadesService.puntoElegido = null;
    }
    list1.changedR = function () {
        list1.actualizarPuntosR();
        EntidadesService.actualizarMarkersR();
        EntidadesService.puntoElegido = null;
    }
    list1.changedW = function () {
        EntidadesService.wpActivo = list1.wpActivo;
    }
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


    }
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
    }
    //Comprobamos desde que navegador accede el usuario a nuestra aplicación
    list1.esIE = /*@cc_on!@*/false || !!document.documentMode;
    list1.isEdge = /Edge\/\d./i.test(navigator.userAgent);
    list1.isChrome = !!window.chrome && !!window.chrome.webstore;
    list1.isFirefox = typeof InstallTrigger !== 'undefined';
    list1.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window['safari'] || safari.pushNotification);
    if (list1.isIE) {
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
    }
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

    }
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
    }

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
    }


    //Cabecera que tendrá la tabla en formato csv
    $scope.getHeader = function () {
        return ["Punto nº", "Latitud", "Longitud", "Elevación", "Fecha", "Hora", "Desnivel", "Distancia", "Velocidad"]
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
    }
    //oculta los botones que estan en archivo
    list1.noVerBotones = function () {
        list1.mostrarBotones = false;
        list1.mostrarBotonesR = false;
        list1.mostrarBotonesW = false;
        $("#funciones").css("width", "8.5%");
    }
    //Mostar botones de rutas
    list1.verBotonesR = function () {
        if (list1.mostrarBotonesR == true) {
            list1.mostrarBotonesR = false;
            $("#funciones").css("width", "8.5%");
        } else {
            list1.mostrarBotonesR = true;
            $("#funciones").css("width", "30%");
        }

    }
    //Mostar botones de waypoints
    list1.verBotonesW = function () {
        if (list1.mostrarBotonesW == true) {
            list1.mostrarBotonesW = false;
            $("#funciones").css("width", "8.5%");
        } else {
            list1.mostrarBotonesW = true;
            $("#funciones").css("width", "30%");
        }

    }
    //Mostrar botones de track
    list1.verBotones = function () {
        if (list1.mostrarBotones == true) {
            list1.mostrarBotones = false;
            $("#funciones").css("width", "8.5%");
        } else {
            list1.mostrarBotones = true;
            $("#funciones").css("width", "30%");
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
        list1.tablaT = true;
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

    }
    //Mostar u ocultar la tabla
    list1.verTablaR = function () {
        list1.tablaT=false;
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

    }
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

    }
    //Mostar la lista de track
    list1.listaActiva = function () {
        list1.crear(0);
        list1.activarListaR = false;
        list1.activarListaW = false;
        list1.activarLista = true;
        list1.mensajeVerlista = "ocultar lista";
        list1.mensajeVerlistaR = "ver lista";
        list1.mensajeVerlistaW = "ver lista";
        EntidadesService.actualizarMarkersR();
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


    }
    //Mostrar la lista de rutas
    list1.listaActivaR = function () {
        list1.crear(1);
        list1.activarLista = false;
        list1.activarListaW = false;
        list1.activarListaR = true;
        list1.mensajeVerlista = "ver lista";
        list1.mensajeVerlistaR = "ocultar lista";
        list1.mensajeVerlistaW = "ver lista";
        EntidadesService.actualizarMarkers();
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

    }
    //Mostrar la lista de waypoints
    list1.listaActivaW = function () {
        list1.activarListaR = false;
        list1.activarLista = false;
        list1.activarListaW = true;
        list1.mensajeVerlista = "ver lista";
        list1.mensajeVerlistaR = "ver lista";
        list1.mensajeVerlistaW = "ocultar lista";
        list1.crearWaypoint();


    }
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
            EntidadesService.actualizarMarkers();
            EntidadesService.actualizarMarkersR();
            EntidadesService.puntoElegido = null;
            EntidadesService.isWaypoint = false;
            if (list1.mostrarTabla == true)
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

    }
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
            EntidadesService.actualizarMarkersR();
            EntidadesService.actualizarMarkers();
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

    }
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

    }
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

    }
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
