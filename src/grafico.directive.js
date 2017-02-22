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
        $scope.series = ['Elevacion'];
        $scope.data = [EntidadesService.getPuntosGrafico()];


        $scope.onClick = function (points, evt) {
            if(points.length>0){
                EntidadesService.puntoSelec(points[0]._index);
                EntidadesService.puntoBorrado = true;
            }
        };
        $scope.datasetOverride = [{ xAxisID: 'x-axis-1' }];
        $scope.options = {

            scales: {
                xAxes: [
                    {
                        id: 'x-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'bottom'
                    }
                ]
            }
        };
    }

})();
