angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Search, $ionicLoading) {

    $scope.form = {
        location: ''
    };

    $scope.search = function() {
        console.log($scope);

        $scope.searching = true;
        $ionicLoading.show({
            template: '<i class="icon ion-load-a"></i> Loading...'
        });

        Search.search($scope.form.location).then(function (data) {
            $scope.items = data;
            $scope.searching = false;
            $ionicLoading.hide();
        }).catch(function (e) {
            $ionicLoading.hide();
            alert(e);
        });
    };

    $scope.$on('remove', function (e, data) {
      console.log(remove(data));
      console.log($scope.items);
    });

    $scope.undo = function () {
      var item = $scope.deleted.pop()[0];
      delete item['$$hashkey'];
      $scope.items.unshift(item);
    };

    $scope.deleted = [];
    function remove(id) {
      for (var i = 0; i < $scope.items.length; i++) {
        if ($scope.items[i].id == id) {
          $scope.deleted.push($scope.items.splice(i, 1));
        }
      }
    }

  });
