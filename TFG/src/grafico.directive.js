(function () {
    'use strict';

    angular.module('GPS').config(function (ChartJsProvider) {
        // Configure all charts
        ChartJsProvider.setOptions({
            colors: ['#97BBCD', '#DCDCDC', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
        });

    });
    angular.module('GPS') .controller('LineCtrl',LineCtrl);

    LineCtrl.$inject = ['$scope','EntidadesService'];
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
            backgroundColor : '#3382FF',
            pointBackgroundColor: '#0062ff',
            pointHoverBackgroundColor: '#699eee',
            borderColor: '#0062ff',
            pointBorderColor: '#0062ff',
            pointHoverBorderColor: '#022558',
            pointHoverRadius: 10,
            
            fill: true /* this option hide background-color */
        }, '#00ADF9', '#FDB45C', '#46BFBD'];

        $scope.onClick = function (points, evt) {
            if(points.length>0 && EntidadesService.isTrack){
                EntidadesService.clicTabGraf = true;
                EntidadesService.puntoSelec(points[0]._index);
                EntidadesService.puntoBorrado = true;
            } else if(points.length>0 && !EntidadesService.isTrack){
                EntidadesService.clicTabGraf = true;
                EntidadesService.puntoSelecR(points[0]._index);
                EntidadesService.puntoBorrado = true;
            }
        };

        $scope.onMouseOver = function (points, evt) {
            if(points.length>0 && EntidadesService.isTrack){
               EntidadesService.hoverGraf(points[0]._index);
            }else if (points.length>0 && !EntidadesService.isTrack){
                EntidadesService.hoverGrafR(points[0]._index);
            }

        }

        $scope.datasetOverride = [{ xAxisID: 'x-axis-1' }];
        $scope.options = {
            responsive:true,
            tooltips:{
                 callbacks: {
                    title: function(tooltipItem, data) {
                      return 'Distancia: '+tooltipItem[0].xLabel + ' km'
                    },
                    label: function(tooltipItem, data) {
                        return 'Elevación: '+tooltipItem.yLabel + ' m'
                      }
                    }
            },
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
