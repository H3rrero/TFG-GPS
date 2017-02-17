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


           reader.onload = (function(theFile) {
             return function(e) {


              console.log("XML");
              var xml = $.parseXML( e.target.result);
              //Guardamos el contenido del xml en el service
             EntidadesService.xmlImportado = xml;
             console.log(EntidadesService.xmlImportado);
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
