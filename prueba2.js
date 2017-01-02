angular.module("app", ["chart.js"]).controller("LineCtrl", function ($scope) {

  $scope.labels = ["1000", "2000", "3000", "5000", "7000", "9000", "10000"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [100, 250, 310, 600, 745, 864, 943]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
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
});
