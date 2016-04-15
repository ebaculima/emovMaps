'use strict';

/* App Module */
var emovApp = angular.module('emovApp', [
    'pascalprecht.translate',
    'ngSanitize',
    'ngRoute',
    'ui.router',
    'swipe',
    'snapscroll',
    'emovControllers',
    'emovServices',
]);



emovApp.service('searchData', function () {
    this.authorSearch = null;
    this.areaSearch = null;
    this.genericData = null;
    this.researchArea = "SEMANTICWEB";
    this.globalauthor = null;
    
});

emovApp.service('globalData', function () {
    this.language = "es";
    this.centralGraph = "http://emov.gob.ec";
    this.clustersGraph = "http://ucuenca.edu.ec/wkhuska/clusters";
    this.authorsGraph = "http://ucuenca.edu.ec/wkhuska/authors";
    this.endpointsGraph = "http://ucuenca.edu.ec/wkhuska/endpoints";
    this.externalAuthorsGraph = "http://ucuenca.edu.ec/wkhuska/externalauthors";
    this.translateData = null;
    this.PREFIX = ' PREFIX bibo: <http://purl.org/ontology/bibo/>'
            + ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>  '
            + ' PREFIX dct: <http://purl.org/dc/terms/> '
            + ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '
            + ' PREFIX emov: <http://emov.gob.ec/ontology#>  '
            + ' PREFIX mm: <http://marmotta.apache.org/vocabulary/sparql-functions#> '
            ;
    this.CONTEXT = {
        "emov": "http://emov.gob.ec/ontology#",
        "foaf": "http://xmlns.com/foaf/0.1/",
        "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        "bibo": "http://purl.org/ontology/bibo/",
        "dc": "http://purl.org/dc/elements/1.1/",
        "dct": "http://purl.org/dc/terms/",
    };
    
    this.urltofindinGOOGLE = 'https://scholar.google.com/scholar?q={0}';
    this.urltofindinDBLP = 'http://dblp.uni-trier.de/search?q={0}';
    this.urltofindinSCOPUS = 'http://www.scopus.com/results/results.uri?numberOfFields=0&src=s&clickedLink=&edit=&editSaveSearch=&origin=searchbasic&authorTab=&affiliationTab=&advancedTab=&scint=1&menu=search&tablin=&searchterm1={0}&field1=TITLE&dateType=Publication_Date_Type&yearFrom=Before+1960&yearTo=Present&loadDate=7&documenttype=All&subjects=LFSC&_subjects=on&subjects=HLSC&_subjects=on&subjects=PHSC&_subjects=on&subjects=SOSC&_subjects=on&st1={1}&st2=&sot=b&sdt=b&sl=91&s=TITLE%28{2}%29'
});

emovApp.config(['$routeProvider',
    function ($routeProvider) {

        $routeProvider.
                when('/', {
                    templateUrl:  'pantallas/home.html',
                }).
                when('/mapa', {
                    templateUrl: 'pantallas/mapaPrincipal.html',
                    //      controller: 'ExploreController'
                }).
                when('/w/author/:text', {//when user search an author in textbox
                    templateUrl: '/wkhome/partials/search.html',
                }).
                when('/w/cloud?:text', {
                    templateUrl: '/wkhome/partials/genericCloud.html',
                }).
                when('/w/clusters?:text', {
                    templateUrl: '/wkhome/partials/clustersCloud.html',
                }).
                when('/a/a', {
                    templateUrl: '/wkhome/partials/d3.html',
                }).
                when('/b/', {
                    templateUrl: '/wkhome/partials/geoplain.html',
                    controller: 'worldPath'
                }).
                when('/:lang/info/about', {
                    templateUrl: '/wkhome/partials/about.html'
                }).
                when('/:lang/info/help', {
                    templateUrl: '/wkhome/partials/help.html'
                }).
                when('/:lang/info/contact', {
                    templateUrl: '/wkhome/partials/contact.html'
                }).
//                .
                /*when('/phones/:phoneId', {
                 templateUrl: 'partials/phone-detail.html',
                 controller: 'PhoneDetailCtrl'
                 }).*/
                otherwise({
                    redirectTo: '/'
                })
                ;
    }]);

    emovApp.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }]);
