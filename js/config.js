/**
 * Created by mothibeh on 2015/09/04.
 */
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


 //var app = angular.module('shopFindaApp', ['ngRoute','ngTouch', 'ngResource','ui.bootstrap']);
 var app = angular.module('app', ['ngRoute']);


app.config(function($routeProvider, $locationProvider) {
    $routeProvider

        /*.when('/favourites', {
            templateUrl : '/js/pages/favourites.html',
            controller: 'FavouritesCtrl',
            params : {
                section : 'favourites'
            }
        })
        .when('/following', {
            templateUrl : '/js/pages/following.html',
            controller: 'FollowingCtrl',
            params : {
                section : 'following'
            }
        })*/
    $locationProvider.html5Mode({enabled: true,requireBase: false}).hashPrefix('!');


});
