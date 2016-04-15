
emovControllers.controller('contarAccidentes', ['$routeParams', '$scope', '$window', 'globalData', 'sparqlQuery', 'searchData',
    function ($routeParams, $scope, $window, globalData, sparqlQuery, searchData) {

   

        //if click in pie-chart (Authors)
        $scope.ifClick = function (value)
        {
            searchData.genericData = value;
            $window.location.hash = "/w/cloud?" + "datacloud";
        };
        //sparql construct to get total authors of publications
        var queryTotalAuthors = globalData.PREFIX
                + 'CONSTRUCT { '
                + '         <http://emov.gob.ec/resource/valores> a emov:Endpoint . '
                + '         <http://emov.gob.ec/resource/valores> emov:name "ACCIDENTES" . '
                + '         <http://emov.gob.ec/resource/valores> emov:total ?total  } '
                + 'WHERE { '
                + '         SELECT DISTINCT (count(DISTINCT ?s) as ?total)'
                +  ' WHERE { ' 
                +  '        ?s a <http://emov.gob.ec/accidentes_de_Transito>.'
                +  '        ?s ?p ?o'
                +  ' } '
                + ' } ';

        //for parliament triplestore test
//        var queryTotalAuthors = 'PREFIX dct: <http://purl.org/dc/terms/> PREFIX foaf: <http://xmlns.com/foaf/0.1/> '
//                + 'PREFIX uc: <http://ucuenca.edu.ec/wkhuska/resource/> '
//                + 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '
//                +       " construct { ?s ?p ?o } "  
//                +    "  WHERE {  ?s ?p ?o } limit 10 " ;

        sparqlQuery.querySrv({query: queryTotalAuthors}, function (rdf) {
            jsonld.compact(rdf, globalData.CONTEXT, function (err, compacted) {
                //$scope.data = compacted;
                var endpoints = compacted['@graph'];
                var data = []
                if (endpoints) {
                    endpoints.forEach(function (endpoint) {
                        data.push({label: endpoint['emov:name'], value: endpoint['emov:total']['@value']});
                    });
                    $scope.$apply(function () {
                        $scope.data = {'entityName': 'Accidents', 'data': data};
                    });
                }
            });
        });// End sparqlQuery.querySrv ...
      
        
        /*************************************************************/
        /*************************************************************/
      


    }]);
