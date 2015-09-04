/**
 * Created by mothibeh on 2015/09/04.
 */
app.controller('appCtrl', ['$scope', 'Notification'
    ,function ($scope,Notification) {
        //alert("test");
        console.log("test");
        $scope.$watch(function () {
            // blah
        },
        function(newVal, oldVal) {
            $scope.notification = Notification.get();
        }, true);
}]);
