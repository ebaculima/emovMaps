
emovControllers.controller('searchText', ['$routeParams', '$scope', '$window', 'globalData', 'sparqlQuery', 'searchData',
    function ($routeParams, $scope, $window, globalData, sparqlQuery, searchData) {
        String.format = function () {
            // The string containing the format items (e.g. "{0}")
            // will and always has to be the first argument.
            var theString = arguments[0];
            // start with the second argument (i = 1)
            for (var i = 1; i < arguments.length; i++) {
                // "gm" = RegEx options for Global search (more than one instance)
                // and for Multiline search
                var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
                theString = theString.replace(regEx, arguments[i]);
            }
            return theString;
        };

        var queryAuthors = globalData.PREFIX
                + " CONSTRUCT { "
                + " ?subject a foaf:Person. "
                + " ?subject foaf:name ?name } "
                + " WHERE { "
                + " { "
                + "     SELECT DISTINCT (sample(?s) AS ?subject) ?name "
                + "     WHERE { "
                + '         GRAPH <' + globalData.centralGraph + '> {'
                + "             ?s a foaf:Person. "
                + "             ?s foaf:name ?name."
                + "             ?s foaf:publications ?pub. "
                + "             ?pub dct:title ?title. "
                + "             {0} "
                + "     } } "
                + "     GROUP BY ?name "
                + "  } "
                + " }";

        $scope.submit = function () {
            if ($scope.searchText) {
                console.log("Searching: " + $scope.searchText);
                waitingDialog.show("Buscando Autores o Keywords");
                /**
                 * The first attempt to search the full-text function (of Marmotta) is used, 
                 * this function is the fastest but only accurate text searches
                 */
                var fulltextFilter = 'FILTER(mm:fulltext-search(str(?name), "' + $scope.searchText + '")).';
                var queryAuthorsFullText = String.format(queryAuthors, fulltextFilter)
                sparqlQuery.querySrv({query: queryAuthorsFullText},
                function (rdf) {
                    jsonld.compact(rdf, globalData.CONTEXT, function (err, compacted) {
                        if (compacted["@graph"])
                        {
                            waitingDialog.hide();
                            searchData.authorSearch = compacted;
                            $window.location.hash = "/" + $routeParams.lang + "/w/search?" + $scope.searchText;
                        }
                        else
                        {
                            /**
                             * If the first attempt does not work, on the second attempt regex function (of SPARQL) is used. 
                             * This function allows you to search parts of text in a text string
                             */
                            console.log($scope.searchText + " has not been found by direct search ");
                            var filterPath = 'FILTER(CONTAINS(UCASE(?name), "{0}" )) . ';
                            var searchTextt = $scope.searchText.trim();
                            var keywords = searchTextt.split(" ");
                            var filterContainer = "";
                            keywords.forEach(function (val) {
                                if (val.length > 0) {
                                    filterContainer += String.format(filterPath, val.toUpperCase());
                                }
                            });
                            queryAuthors = String.format(queryAuthors, filterContainer);

                            sparqlQuery.querySrv({query: queryAuthors},
                            function (rdf) {
                                jsonld.compact(rdf, globalData.CONTEXT, function (err, compacted) {
                                    if (compacted["@graph"])
                                    {
                                        waitingDialog.hide();
                                        searchData.authorSearch = compacted;
                                        $window.location.hash = "/" + $routeParams.lang + "/w/search?" + $scope.searchText;
                                    }
                                    else
                                    {
                                        /**
                                         *  If the second attempt author search returns no results. 
                                         *  Then, a third attempt to search runs on keywords
                                         */
                                        var querySearchKeyword = globalData.PREFIX
                                                + " CONSTRUCT { ?keywordduri rdfs:label ?k } "
                                                + " WHERE { "
                                                + " { "
                                                + "     SELECT DISTINCT (sample(?keyword) AS ?keywordduri) ?k "
                                                + "     WHERE { "
                                                + '         GRAPH <' + globalData.centralGraph + '> {'
                                                + "         ?s foaf:publications ?pub. "
                                                + "         ?s dct:subject ?k. "
                                                //+ "         ?pub bibo:Quote ?k."
                                                + "         BIND(IRI(?k) AS ?keyword) . "
                                                + '         FILTER(mm:fulltext-search(str(?k), "' + $scope.searchText + '")).'
                                                + "     } } "
                                                + "     GROUP BY ?k "
                                                + "  } "
                                                + " }";

                                        sparqlQuery.querySrv({query: querySearchKeyword},
                                        function (rdf) {
                                            jsonld.compact(rdf, globalData.CONTEXT, function (err, compacted) {
                                                if (compacted["@graph"])
                                                {
                                                    waitingDialog.hide();
                                                    searchData.areaSearch = compacted;
                                                    $window.location.hash = "/" + $routeParams.lang + "/cloud/group-by";
                                                }
                                                else
                                                {
                                                    alert("Information not found");
                                                    waitingDialog.hide();
                                                }
                                            });
                                        }); // end of  sparqlQuery.querySrv({...)}  of Third attempt
                                    }
                                });
                            }); // end of  sparqlQuery.querySrv({...)} of Second attempt
                        }
                    });
                }); // end  sparqlQuery.querySrv({...)}  of First attempt
            }
        };//end $scope.submit
    }]);