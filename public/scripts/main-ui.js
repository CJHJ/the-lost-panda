(function(){
    angular.module('tlp-web', ['ui.bootstrap']);
    var mainMod = angular.module('tlp-web');

    mainMod.controller('ModalMenuCtrl', function($scope, $modal, $timeout, $log){
        $scope.animationsEnabled = true;

        $scope.open = function(type) {
            $scope.type = type;
            $scope.tempURL = './contents/modalContent.html';
            if($scope.type === "About Us")
                $scope.tempURL = './contents/about-content.html';
            else if($scope.type === "Ranking")
                $scope.tempURL = './contents/ranking-content.html';
            else if($scope.type === "Help")
                $scope.tempURL = './contents/help-content.html';

            var modalInstance = $modal.open({
                templateUrl: $scope.tempURL,
                controller: 'ModalInstanceCtrl',
                resolve: {
                    mydata: function() {
                        if("")
                        return "Loading...";
                    },
                    contentType: function(){
                        return type;
                    }
                }
            });

            modalInstance.opened.then(function() {
                //$scope.loadData(modalInstance);
            }, function(){
                $log.info('Modal dismissed at: '+new Date());
            });
        };

        $scope.loadData = function(aModalInstance) {
            $log.info("starts loading");
            $timeout(function() {
                $log.info("data loaded");
                aModalInstance.setMyData("data loaded...");
            }, 3000);
            
        };
    });

    mainMod.controller('ModalInstanceCtrl', function($scope, $modalInstance, mydata, contentType){
        $scope.mydata = mydata;
        $scope.contentType = contentType;

        $modalInstance.setMyData = function(theData) {
            $scope.mydata = theData;
        };

        $scope.ok = function() {
            $modalInstance.close('close');
        };
    });

    
})();

