(function () {
    'use strict';

    angular.module('GPS')
        .service('MapasService',MapasService);

    function MapasService() {

        var mapaCtr = this;
        mapaCtr.mapas = [{nombre:"PNOA ES",versionWMS:"1.3.0",url:"http://www.ign.es/wms-inspire/pnoa-ma?request=GetMap&service=WMS&VERSION=1.3.0&LAYERS=OI.OrthoimageCoverage"},
            {nombre:"Raster ES",versionWMS:"1.3.0",url:"http://www.ign.es/wms-inspire/mapa-raster?request=GetMap&service=WMS&VERSION=1.3.0&LAYERS=mtn_rasterizado"},
            {nombre:"Raster FR",versionWMS:"1.1.1",url:"http://mapsref.brgm.fr/WMS-C-REF/?request=GetMap&service=WMS&VERSION=1.1.1&LAYERS=REF93"},
            {nombre:"RASTER PT",versionWMS:"1.3.0",url:"http://mapas.dgterritorio.pt/wms/sc500k?request=GetMap&service=WMS&VERSION=1.3.0&LAYERS=sc500k"},
            {nombre:"OCM",versionWMS:"no_version",url:"http://tile.opencyclemap.org/cycle/"},
            {nombre:"OSM",versionWMS:"no_version",url:"http://tile.openstreetmap.org/"},
            {nombre:"Landscape",versionWMS:"no_version",url:"http://tile.thunderforest.com/landscape/"},
            {nombre:"TopoMap",versionWMS:"topo",url:".tile.opentopomap.org/"}];

    }})();

   