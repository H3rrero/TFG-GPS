(function () {
'use strict';

angular.module('GPS')
.directive("fileread", ImportFunction)


//Funcion de la directiva de importacion
function ImportFunction(EntidadesService,usSpinnerService) {
    
 
    var link= function (scope, element,attributes, controller) {
    
        //Evento change del input de importacion
        element.bind("change", function (changeEvent) {
             
 usSpinnerService.spin('spinner-2');

            scope.$apply(function () {
            
                scope.fileread = changeEvent.target.files[0];
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    if(theFile.name.includes(".gpx"))
                    return function(e) {

                        
                       
                        var xml = $.parseXML( e.target.result);
                        
                        //Guardamos el contenido del xml en el service
                        EntidadesService.xmlImportado = xml;
                        if (EntidadesService.isTrackImport && EntidadesService.xmlImportado.getElementsByTagName("trkpt").length>0) {
                            controller.listaActiva();
                            EntidadesService.importXML();
                            EntidadesService.centrarMapa();
                        }else if (EntidadesService.isWpImport &&  EntidadesService.xmlImportado.getElementsByTagName("wpt").length>0) {
                            EntidadesService.importXMLWp();
                            EntidadesService.centrarWP();
                        }
                        else {
                            if(EntidadesService.xmlImportado.getElementsByTagName("rtept").length>0){
                                controller.listaActivaR();
                                EntidadesService.importXMLRuta();
                                EntidadesService.centrarRuta();
                            }else{
                                
                            }
                        }
                    };
                })(changeEvent.target.files[0]);

                //Leemos el contendo del fichero
                reader.readAsText(changeEvent.target.files[0],"UTF-8");
            });
               setTimeout(function() {
 usSpinnerService.stop('spinner-2');
}, 11);
        });
       
    }
    
    return {
        scope: {
            fileread: "="
        },
        controller: 'GPSController',
        link: link

    }
}


})();
