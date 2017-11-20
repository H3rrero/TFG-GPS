(function () {
'use strict';

angular.module('GPS')
.directive("fileread", ImportFunction)

ImportFunction.$inject = ['EntidadesService', 'usSpinnerService'];
//Funcion de la directiva de importacion
function ImportFunction(EntidadesService,usSpinnerService) {
    
 
    var link= function (scope, element,attributes, controller) {
    
        //Evento change del input de importacion
        element.bind("change", function (changeEvent) {
  if(!!window.chrome && !!window.chrome.webstore) {        
 usSpinnerService.spin('spinner-2');
  }else if(typeof InstallTrigger !== 'undefined'){
     usSpinnerService.spin('spinner-2');  
  }else{usSpinnerService.spin('spinner-2');  }
            scope.$apply(function () {
            
                

                scope.fileread = changeEvent.target.files[0];
                var reader = new FileReader();
                reader.onload = (function(theFile) {
     
                    return function(e) {

                        
                       
                        var xml = $.parseXML( e.target.result);
                        console.log(EntidadesService.isTrackImport);
                        //Guardamos el contenido del xml en el service
                        EntidadesService.xmlImportado = xml;
                        if (EntidadesService.isTrackImport && EntidadesService.xmlImportado.getElementsByTagName("trkpt").length>0) {
                           
                            controller.listaActiva();
                            EntidadesService.importXML();
                            EntidadesService.centrarMapa();
                             scope.$apply();
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
            if(!!window.chrome && !!window.chrome.webstore){
               setTimeout(function() {
 usSpinnerService.stop('spinner-2');
}, 11);
        }else if(typeof InstallTrigger !== 'undefined'){
              setTimeout(function() {
 
            usSpinnerService.stop('spinner-2');
}, 1001);
            
        }else{    setTimeout(function() {

            usSpinnerService.stop('spinner-2');
}, 3001);}
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
