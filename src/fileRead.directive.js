(function () {
'use strict';

angular.module('GPS')
.directive("fileread", ImportFunction)


//Funcion de la directiva de importacion
function ImportFunction(EntidadesService) {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            //Evento change del input de importacion
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    var reader = new FileReader();
                    console.log("XML");
                    console.log(changeEvent.target.files);

           reader.onload = (function(theFile) {
             return function(e) {



              var xml = $.parseXML( e.target.result);
              //Guardamos el contenido del xml en el service
             EntidadesService.xmlImportado = xml;
             console.log("Wpimport");
             console.log(EntidadesService.isWpImport);
             if (EntidadesService.isTrackImport) {
               EntidadesService.crear(0);
               EntidadesService.importXML();
             }else if (EntidadesService.isWpImport) {
               EntidadesService.importXMLWp();
             }
             else {
               EntidadesService.crear(1);
               EntidadesService.importXML();
             }

             };
           })(changeEvent.target.files[0]);

          //Leemos el contendo del fichero
          reader.readAsText(changeEvent.target.files[0],"UTF-8");
          //reader.readAsDataURL(changeEvent.target.files[0]);
                });
            });
        }
    }
}


})();
