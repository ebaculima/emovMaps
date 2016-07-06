app.controller("OpenMapJsController", ["$scope", "$document", "$http", "$resource", "$rootScope", "Map", "SparqlEndpoint",
    function (e, t, n, o, i, r, a) {
        e.Version = "1.0 Beta",
                e.idMapControl = "map",
                e.map = null,
                e.endpoint = null,
                e.selected = [],
                e.entities = [],
                e.classUris = [],
                e.selectedFilter = [],
                t.ready(function () {
                    var t = ' - © <a href="https://github.com/marcelocaj/openmapjs" target="_blank">OpenMapJS ' + e.Version + "</a>";
                    setTimeout(function () {
                        $(".ol-attribution").find("ul").append(t)
                    }, 1500)
                });

        var listZonas = function (tipo) {
            var zonasQuery = 'PREFIX emov: <http://emov.gob.ec/ontology#> '
                    + '  SELECT DISTINCT ?zonas '
                    + ' WHERE { '
                    + ' ?a a <' + tipo + '> . '
                    + ' ?a emov:zona ?zonas. '
                    + ' } ';

            var t = e.endpoint.sendRequest(zonasQuery);
            t.then(function (t) {
                var n = e.endpoint.getResultList(t);
                e.zonas = [];
                var o = 0;
                angular.forEach(n, function (t, n) {
                    var label = t["zonas"].value;
                    e.zonas.push({id: o, label: label}), o++;
                })
            }, function (t) {
                var n = $("#warning-alert");
                $("#containerZonas");
                null != n && (n.find(".alert-text").html("<strong>Warning!</strong> Could not connect to the endpoint."), n.show(), e.resizeLayout());
            })
        };

        var buildQueryFilter = function (t, n, filter) {
            if (e.map.removeInfoPopup(), "add" === t && -1 === e.selected.indexOf(n)) {
                $(".overlay").show(), e.selected.push(n);
                /**
                 * Consulta para obtener todos los puntos relacionados con todas las incidencias
                 * 
                 */
                var sparql_query = 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '
                        + ' PREFIX geo: <http://www.opengis.net/ont/geosparql#> '
                        + ' PREFIX owl: <http://www.w3.org/2002/07/owl#> '
                        + ' PREFIX geof: <http://www.opengis.net/def/function/geosparql/> '
                        + ' SELECT DISTINCT ?label ?wkt ?anio '
                        + ' WHERE { '
                        + ' ?a ?p ?zonas. '
                        + ' FILTER (CONTAINS(?zonas,"' + filter + '")) . '
                        + '         ?a rdfs:label ?label . '
                        + '         ?a geo:hasGeometry ?b . '
                        + '         ?a <http://emov.gob.ec/ontology#año> ?anio. '
                        + '         ?b geo:asWKT ?wkt .'
                        + '         ?subject2 a <http://geo.linkeddata.ec/ontology/provincias_promsa> . '
                        + '         ?subject2 rdfs:label  "AZUAY"@es. '
                        + '         ?subject2 geo:hasGeometry ?geo2 .  '
                        + '         ?geo2 geo:asWKT ?wkt2. '
                        + '         FILTER (geof:sfWithin(?wkt, ?wkt2)) '
                        + '    } LIMIT ' + e.config.endpoint.maxResults;


                var i = e.endpoint.sendRequest(sparql_query);
                i.then(function (t) {
                    $(".overlay").hide(), e.map.graphicQueryResponse(t, n)
                }, function (e) {
                    $(".overlay").hide()
                })
            }
            "remove" === t && -1 !== e.selected.indexOf(n) && ($(".overlay").show(), e.selected.splice(e.selected.indexOf(n), 1), e.map.removeFeatures(n), $(".overlay").hide())
        };

        var buildQuery = function (t, n, o) {
            if (e.map.removeInfoPopup(), "add" === t && -1 === e.selected.indexOf(n)) {
                $(".overlay").show(), e.selected.push(n), console.log("uriClass:" + o);
                /**
                 * Consulta para obtener todos los puntos relacionados con todas las incidencias
                 * 
                 */
                var sparql_query = 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '
                        + ' PREFIX geo: <http://www.opengis.net/ont/geosparql#> '
                        + ' PREFIX owl: <http://www.w3.org/2002/07/owl#> '
                        + ' PREFIX geof: <http://www.opengis.net/def/function/geosparql/> '
                        + ' PREFIX emov: <http://emov.gob.ec/ontology#>'
                        + ' SELECT DISTINCT ?label ?wkt ?anio ?mes ?dia ?consecuencia ?hora ?parroquia ?tipologia ?direccion'
                        + ' WHERE { ?a a <' + o + '> . '
                        + '         ?a rdfs:label ?label . '
                        + '         ?a geo:hasGeometry ?b . '
                        + '         OPTIONAL { ?a emov:año ?anio. } '
                        + '         OPTIONAL { ?a emov:mes ?mes. } '
                        + '         OPTIONAL { ?a emov:dia ?dia. } '
                        + '         OPTIONAL { ?a emov:consecuencia ?consecuencia. } '
                        + '         OPTIONAL { ?a emov:direccion ?direccion. } '
                        + '         OPTIONAL { ?a emov:hora ?hora. } '
                        + '         OPTIONAL { ?a emov:parroquia ?parroquia. } '
                        + '         OPTIONAL { ?a emov:tipologia ?tipologia. } '
                        + '         ?b geo:asWKT ?wkt .'
                        + '         ?subject2 a <http://geo.linkeddata.ec/ontology/provincias_promsa> . '
                        + '         ?subject2 rdfs:label  "AZUAY"@es. '
                        + '         ?subject2 geo:hasGeometry ?geo2 .  '
                        + '         ?geo2 geo:asWKT ?wkt2. '
                        + '         FILTER (geof:sfWithin(?wkt, ?wkt2)) '
                        + '    } LIMIT ' + e.config.endpoint.maxResults;


                var i = e.endpoint.sendRequest(sparql_query);
                i.then(function (t) {
                    $(".overlay").hide(), e.map.graphicQueryResponse(t, n)
                }, function (e) {
                    $(".overlay").hide()
                })
            }
            "remove" === t && -1 !== e.selected.indexOf(n) && ($(".overlay").show(), e.selected.splice(e.selected.indexOf(n), 1), e.map.removeFeatures(n), $(".overlay").hide())
        };
        e.updateSelection = function (e, t, tipo) {
            var o = e.target, i = o.checked ? "add" : "remove";
            buildQuery(i, t, tipo);
            listZonas(tipo);
        }, e.selectAll = function (t) {
            for (var n = t.target, o = n.checked ? "add" : "remove", i = 0; i < e.entities.length; i++) {
                var r = e.entities[i];
                s(o, r.id)
            }
        }, e.getSelectedClass = function (t) {
            return e.isSelected(t.id) ? "selected" : ""
        }, e.isSelected = function (t) {
            return e.selected.indexOf(t) >= 0
        }, e.isSelectedAll = function () {
            return e.selected.length === e.entities.length
        }, e.loadJSON = function (e) {
            $.ajaxSetup({async: !1});
            var t = $.getJSON(e);
            return $.ajaxSetup({async: !0}), t.responseJSON
        }, e.init = function () {
            i.config = e.loadJSON("config.json"), e.endpoint = new a(i.config.endpoint.url), e.map = new r("map"), e.listAllClasses(), e.map.createMap()
        }, e.listAllClasses = function () {
            var t = e.endpoint.requestAllClasses();
            t.then(function (t) {
                var n = e.endpoint.getResultList(t);
                e.entities = [];
                var o = 0;
                angular.forEach(n, function (t, n) {
                    var i = t["class"].value;
                    var label = t["label"] ? t["label"].value : t["class"].value;
                    e.entities.push({id: o, uriClass: i, labelClass: label}), o++
                })
            }, function (t) {
                var n = $("#warning-alert");
                $("#container");
                null != n && (n.find(".alert-text").html("<strong>Warning!</strong> Could not connect to the endpoint."), n.show(), e.resizeLayout())
            });
        }, e.updateSelectionZona = function (e, t, label) {
            var o = e.target, i = o.checked ? "add" : "remove";
            buildQueryFilter(i, t, label);
        }, e.isSelectedZona = function (t) {
            
            return e.selected.indexOf(t) >= 0;
        }, e.resizeLayout = function () {
            null != myLayout && myLayout.resizeAll()
        }, e.updateMapSize = function () {
            e.map.updateMapSize()
        }, e.clearMap = function () {
            e.map.clearMap(), e.selected = []
        }, e.sendQuery = function () {

            var t = e.endpoint.sendRequest();
            t.then(function (t) {
                e.map.graphicQueryResponse(t)
            })
        }, e.init()


    }]);