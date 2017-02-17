(function () {
'use strict';

angular.module('GPS')
.controller('LineCtrl',LineCtrl);

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
