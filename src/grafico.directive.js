(function () {
    'use strict';

    angular.module('GPS').config(function (ChartJsProvider) {
        // Configure all charts
        ChartJsProvider.setOptions({
            colors: ['#97BBCD', '#DCDCDC', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
        });

    });
    angular.module('GPS') .controller('LineCtrl',LineCtrl);

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
        $scope.colors =  [{
            backgroundColor : '#0062ff',
            pointBackgroundColor: '#3382FF',
            pointHoverBackgroundColor: '#3382FF',
            borderColor: '#3382FF',
            pointBorderColor: '#3382FF',
            pointHoverBorderColor: '#3382FF',
            fill: true /* this option hide background-color */
        }, '#00ADF9', '#FDB45C', '#46BFBD'];

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
