/**
 * Created by mothibeh on 2015/09/04.
 */

// Showing a loading with the background
app.directive("loadingContent",function($http){
    return {
        restrict: "E",
        template:'<div class="layer_loading" ng-if="loadingContent"><div  class="loading_container" ><span class="loader">Loading</span><span class="_text"> Loading...</span></div></div>',
        replace: true,
        link: function(scope, element, attrs) {
            scope.isLoading = function () {

                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (value)
            {
                if(value){
                    scope.loadingContent = true;
                }else{
                    scope.loadingContent = false;
                }
            });
        }
    }
});


app.directive('notification', function(Notification) {
    return {
        restrict: 'E',
        replace: true,
        template: ' <div class="message_wrapper {{notification.status}}" ><div  class="status"><span    class="icon"></span></div><div   class="message">{{notification.message}}</div> </div>',
        link: function(scope, element, attrs) {
            setTimeout(function(){
                scope.showMessage = true;
                scope.$apply();
            }, 500);
            setTimeout(function(){
                scope.showMessage = false;
                scope.$apply();
                Notification.set("");
            }, 3000);
        }
    };
});


app.directive('categoriesMenu', function() {
    return {
        restrict: 'E',
        scope: {
            types: "=",
            home: "="
        },
        templateUrl: 'templates/categories-list-menu.html',
        link: function(scope, element, attrs , $scope) {
            scope.home_url = scope.home;
        }
    };
});

app.directive('AdminBanner', function(Screen) {
    return {
        restrict: 'E',
        replace: true,

        templateUrl: 'templates/shop-admin-banner.html',
        link: function(scope) {
            scope.isMobile =Screen.isMobile();
        }
    };
});

app.directive('deleteProduct', function($http, $location, Notification) {
    return {
        require: 'ngModel',
        link: function(scope) {
            scope.deleteProduct = function(id, name , hash, edit){

                var r = confirm("Are you sure you want to delete "+name+"?");
                if (r == true) {
                    var data =  angular.element("#"+hash).serialize();
                    var request = $http({
                        method: "post",
                        url: "/products/delete/"+id,
                        data: data,
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                    request.success( function( data ) {
                        if(data.status ==='success' ){
                            var notification = {
                                status: "successful",
                                message: "Product deleted"
                            };
                            Notification.set(notification);
                            $location.path(scope.loggedin.home_url);
                        }
                    });
                } else {
                    return false;
                }
            }
        }
    };
});


// Like button
app.directive('followLabel', function($window, $http) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/follow-label.html',
        scope: {
            user: '=',
            shop: '=',
            followers: '='
        },
        link: function(scope){
            scope.followers_count = (Object.keys(scope.followers).length > 0)? Object.keys(scope.followers).length: 0;
            if(checkExists(scope.followers, scope.user.customers_id)){
                scope.follow_label = "Unfollow";
            }else{
                scope.follow_label = "Follow";
            }

            function checkExists(values, value){
                if(typeof value !=="undefined"){
                    for(var i = 0; i < values.length; i++ ){
                        if(value.indexOf(values[i].customers_id) != -1){
                            scope.followers_id = values[i].id;
                            return values[i].id;
                        }
                    }
                }
                return false;
            }

            scope.followShop = function(shops_id, users_id){

                if(scope.user == false){
                    var r = confirm("You need to be logged in.");
                    if (r == true) {
                        $window.location.href = "/users/login";
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
                var data =  angular.element("#follow_"+shops_id).serialize();
                var request = $http({
                    method: "post",
                    url: "/shops/follow",
                    data: data,
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                request.success( function( data ) {
                    if(data.status ==='success' ){
                        if(data.message ==='Follow'){
                            scope.followers_count--;
                            scope.follow_label = data.message;
                            for(var i = 0; i < scope.followers .length; i++ ){
                                if( data['data']['Follower']['customers_id'].indexOf(scope.followers[i].customers_id) != -1){
                                    scope.followers.splice(scope.followers[i]);
                                    break;
                                }
//                                    else{
//                                        console.log('not deleted');
//                                    }
                            }
                        }else{
                            scope.followers_count++;
                            scope.follow_label = data.message;
                            scope.followers.push(data.data.Follower);
                            scope.followers_id = data.data.Follower.id;
                        }
                    }
                });
                event.stopPropagation();
                event.preventDefault();
                return false;
            };

        }
    }
});

// follow/unfollow link
app.directive('followersCard', function($window, $http) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/followers-card.html',
        scope: {
            user: '=',
            shop: '=',
            followers: '='
        },
        link: function(scope){
            scope.followers_count = (Object.keys(scope.followers).length > 0)? Object.keys(scope.followers).length: 0;
            if(checkExists(scope.followers, scope.user.customers_id)){
                scope.follow_label = "Unfollow";
                //scope.follow_label = "Following";
            }else{
                scope.follow_label = "Follow";
            }

            function checkExists(values, value){
                if(typeof value !=="undefined"){
                    for(var i = 0; i < values.length; i++ ){
                        if(value.indexOf(values[i].customers_id) != -1){
                            scope.followers_id = values[i].id;
                            return values[i].id;
                        }
                    }
                }
                return false;
            }

            scope.followShop = function(shops_id, users_id){

                if(scope.user == false){
                    var r = confirm("You need to be logged in.");
                    if (r == true) {
                        $window.location.href = "/users/login";
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
                var data =  angular.element("#follow_"+shops_id).serialize();
                var request = $http({
                    method: "post",
                    url: "/shops/follow",
                    data: data,
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                request.success( function( data ) {
                    if(data.status ==='success' ){
                        if(data.message ==='Follow'){
                            scope.followers_count--;
                            scope.follow_label = data.message;
                            for(var i = 0; i < scope.followers .length; i++ ){
                                if( data['data']['Follower']['customers_id'].indexOf(scope.followers[i].customers_id) != -1){
                                    scope.followers.splice(scope.followers[i]);
                                    break;
                                }
//                                    else{
//                                        console.log('not deleted');
//                                    }
                            }
                        }else{
                            scope.followers_count++;
                            scope.follow_label = data.message;
                            scope.followers.push(data.data.Follower);
                            scope.followers_id = data.data.Follower.id;
                        }
                    }
                });
                event.stopPropagation();
                event.preventDefault();
                return false;
            };
        }
    }
});

// Show or Hide Password
app.directive('toggleTypePassword', function () {
    return {
        restrict: 'A',
        replace: false,
        scope: {
            toggled: '=toggleTypePassword'
        },
        link: function (scope, element, attrs) {
            function changeType() {
                if (scope.toggled) {
                    element.attr('type', 'text');
                } else {
                    element.attr('type', 'password');
                }
            }
            scope.$watch('toggled', changeType);
            changeType();
        }
    };
});

app.directive('advert', function ($timeout, $http, Notification, $location) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/advert.html',
        link: function(scope, element, attrs) {
            console.log("test");
           /* $timeout(function() {  // set timeer
                scope.showPopup = true;
            }, 5000);*/

            scope.close = function(shops_id){
                scope.showPopup = false;
            }

            scope.showDemo = function(){
                scope.showPopup = true;
            };

            scope.SubmitEditEmailList = function(shops_id,  users_id) {
                scope.showPopup = false;
                var notification = {
                    status: "successful",
                    message: "You have been signed up for Shopfinda emails from ."+scope.infos.Shop.name
                };
                Notification.set(notification);
            }

        }
    };
});



app.directive('favouriteIcon', function ($http, $timeout) {
    return {
        restrict: 'E',
        scope: {
            product: '=',
            actions: '=',
            loggedin: '='
        },
        templateUrl: 'templates/favourite-icon.html',
        link: function (scope, element, attrs) {
            scope.favourite = function(products_id, cid, hasFavourite){
                event.preventDefault();
                if(typeof scope.loggedin === "undefined" || scope.loggedin === false){
                    var r = confirm("You need to be logged in.");
                    if (r == true) {
                        window.location.href = "/users/login";
                    } else {
                        event.stopPropagation();
                        return false;
                    }

                }
                if(hasFavourite){
                    var params = {
                        products_id: products_id,
                        customers_id: cid
                    };
                }else{
                    var params = {
                        products_id: products_id,
                        customers_id: cid,
                        hasViwerFavourited: true
                    };
                }
                var config = {
                    params: params
                };
                $http.put("/products/favourites", scope.putData, config)
                    .success(function (data, status, headers, config)
                    {
                        var temp = scope.product.actions.text.current;
                        scope.message = data.status;
                        $timeout(function() {
                            scope.message = false;
                            scope.product.actions.hasViewerFavourited = !scope.product.actions.hasViewerFavourited;
                            scope.product.actions.text.current = scope.product.actions.text.alternate;
                            scope.product.actions.text.alternate = temp;
                        }, 1000);
                    })
                    .error(function (data, status, headers, config)
                    {
                    });
                event.stopPropagation();
            }
        }
    };
});


