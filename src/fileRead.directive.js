(function () {
'use strict';

angular.module('GPS')
.directive("fileread", ImportFunction)


//Funcion de la directiva de importacion
function ImportFunction(EntidadesService) {

    var link= function (scope, element,attributes, controller) {
        //Evento change del input de importacion
        element.bind("change", function (changeEvent) {
            scope.$apply(function () {
                scope.fileread = changeEvent.target.files[0];
                var reader = new FileReader();

                reader.onload = (function(theFile) {
                    return function(e) {



                        var xml = $.parseXML( e.target.result);
                        //Guardamos el contenido del xml en el service
                        EntidadesService.xmlImportado = xml;
                        if (EntidadesService.isTrackImport) {
                            EntidadesService.crear(0);
                            EntidadesService.importXML();
                            EntidadesService.centrarMapa();
                        }else if (EntidadesService.isWpImport) {
                            EntidadesService.importXMLWp();
                            EntidadesService.centrarWP();
                        }
                        else {
                            if(EntidadesService.xmlImportado.getElementsByTagName("rtept").length>0){
                                EntidadesService.crear(1);
                                EntidadesService.importXMLRuta();
                                EntidadesService.centrarRuta();
                            }else{
                                controller.actualizarError();
                            }
                        }
                    };
                })(changeEvent.target.files[0]);

                //Leemos el contendo del fichero
                reader.readAsText(changeEvent.target.files[0],"UTF-8");
            });
        });
    }
    return {
        scope: {
            fileread: "="
        },
        controller: 'PruebaController',
        link: link

    }
}


})();
