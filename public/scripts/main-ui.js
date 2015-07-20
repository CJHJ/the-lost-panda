var controllerProvider = null;

angular.module('tlp-web', ['ui.bootstrap'], function($controllerProvider){
    controllerProvider = $controllerProvider;
});
var mainMod = angular.module('tlp-web');

(function(){
    mainMod.controller('ModalMenuCtrl', function($scope, $modal, $http, $log){
        $scope.animationsEnabled = true;
        $scope.url = "http://localhost:8080/ranking";

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
                    loadingtext: function() {
                        return "Loading...";
                    },
                    contentType: function(){
                        return type;
                    }
                }
            });

            modalInstance.opened.then(function() {
                //load ranking if type is ranking
                if($scope.type === "Ranking"){
                    $scope.loadRanking(modalInstance);
                }
            }, function(){
                $log.info('Modal dismissed at: '+new Date());
            });
        };

        $scope.loadRanking = function(aModalInstance) {
            $scope.aModalInstance = aModalInstance;
            $log.info("starts loading");
            $http.get($scope.url).then(function(response){
                $log.info("data loaded");
                $scope.aModalInstance.getRanking(response.data);
            });
        };
    });

    mainMod.controller('ModalInstanceCtrl', function($scope, $modalInstance, loadingtext, contentType){
        $scope.loadingtext = loadingtext;
        $scope.contentType = contentType;
        $scope.rankingTable = [];
        $scope.isLoaded = false;

        //get ranking when loaded
        $modalInstance.getRanking = function(ranking) {
            //show tables
            $scope.isLoaded = true;
            //transfer tables
            for(var i=0; i<ranking.length; i++){
                $scope.rankingTable.push(ranking[i]);
            }
        };

        $scope.ok = function() {
            $modalInstance.close('close');
        };
    });

    
})();

// angular modal for high score registration
mainMod.controller('ModalHighScore', function ($scope, $modal, $log){
    $scope.highScore = 0;
    
    $scope.openModal = function(highScore){
        $scope.highScore = highScore;

        console.log($scope.highScore);
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'newscore.html',
            controller: 'ModalHSCtrl',
            resolve: {
                playerName: function(){
                    return $scope.playername;
                },
                highScore: function(){
                    return $scope.highScore;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

//modal instance - highscore
mainMod.controller('ModalHSCtrl', function ($scope, $modalInstance, $http, playerName, highScore) {
    $scope.highScore = highScore;
    $scope.playerName = playerName;

    $scope.ok = function () {
        $scope.postData = {name: $scope.playerName, score: $scope.highScore};
        console.log($scope.postData);
        $http.post('http://localhost:8080/post', $scope.postData).
            success(function(data, status, headers, config) {
                console.log("POST succeded!")
            }).
            error(function(data, status, headers, config) {
                console.log("error "+status);
            });
        $modalInstance.close($scope.playerName);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

document.addEventListener('DOMContentLoaded', function () {
    console.log(angular.element(document.querySelector('#canvas-cont')).scope());
});