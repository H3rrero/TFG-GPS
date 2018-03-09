webpackJsonp(["main"],{

/***/ "../../../../../src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "app-select {\r\n  color: #A2A1A1;\r\n  cursor: pointer;\r\n}\r\n\r\n.editor {\r\n  margin-left: 200px;\r\n  width: calc(100vw - 200px);\r\n}\r\n\r\n.sidenav {\r\n  background-color: rgb(255, 255, 255);\r\n  box-shadow: 3px 0 5px rgba(30, 30, 30, 0.35);\r\n  height: 100%;\r\n  overflow-x: hidden;\r\n  padding-top: 20px;\r\n  position: fixed;\r\n  top: 0;\r\n  width: 200px;\r\n  z-index: 9999999999;\r\n}\r\n\r\n.sidenav a:hover {\r\n  color: #f1f1f1;\r\n}\r\n\r\n.traductor {\r\n  float: left;\r\n  height: 100vh;\r\n  width: 87vw ;\r\n}\r\n.desk{\r\n  left:0px;\r\n}\r\n.oculta{\r\n  left:-210px !important;\r\n  transition: all 0.5s linear;\r\n}\r\n.visible{\r\n  left:0 !important;\r\n  transition: all 0.5s linear;\r\n}\r\n@media only screen and (max-width: 500px){\r\n  .sidenav{\r\n    left: -200px;\r\n  }\r\n  .editor{\r\n    margin-left: 0px;\r\n    width: 100%;\r\n  }\r\n  .traductor{\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n  }\r\n}\r\n@media screen and (max-height: 450px) {\r\n  .sidenav{\r\n    left: -200px;\r\n    padding-top: 15px;\r\n  }\r\n  .editor{\r\n    margin-left: 0px;\r\n    width: 100%;\r\n  }\r\n  .traductor{\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n  }\r\n  .sidenav a {\r\n    font-size: 18px;\r\n  }\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"sidenav desk\" >\n    <app-select title=\"Lenguaje de entrada\" [leng]=\"['GPX','KML']\"  [selectedValue]=\"'From'\" (onSelect)=\"onSelectFrom($event)\"></app-select>\n    <app-select title=\"Lenguaje de salida\" [leng]=\"['GPX','KML']\" [selectedValue]=\"'To'\" (onSelect)=\"onSelectTo($event)\"></app-select>\n</div>\n<main class=\"editor\">\n    <app-traductor class=\"traductor\" [from]=\"from\" [to]=\"to\"></app-traductor>\n</main>"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__traductor_traductor_component__ = __webpack_require__("../../../../../src/app/traductor/traductor.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    function AppComponent() {
        this.title = 'app';
    }
    AppComponent.prototype.onSelectFrom = function (from) {
        this.from = from;
    };
    AppComponent.prototype.onSelectTo = function (to) {
        this.to = to;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1__traductor_traductor_component__["a" /* TraductorComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__traductor_traductor_component__["a" /* TraductorComponent */])
    ], AppComponent.prototype, "traductor", void 0);
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-root',
            template: __webpack_require__("../../../../../src/app/app.component.html"),
            styles: [__webpack_require__("../../../../../src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__select_select_component__ = __webpack_require__("../../../../../src/app/select/select.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__traductor_traductor_component__ = __webpack_require__("../../../../../src/app/traductor/traductor.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__notificacion_notificacion_component__ = __webpack_require__("../../../../../src/app/notificacion/notificacion.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__responsiveMenu_openmenu_component__ = __webpack_require__("../../../../../src/app/responsiveMenu/openmenu.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ng2_codemirror__ = __webpack_require__("../../../../ng2-codemirror/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ng2_codemirror___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_ng2_codemirror__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_4__select_select_component__["a" /* SelectComponent */],
                __WEBPACK_IMPORTED_MODULE_5__traductor_traductor_component__["a" /* TraductorComponent */],
                __WEBPACK_IMPORTED_MODULE_6__notificacion_notificacion_component__["a" /* NotificacionComponent */],
                __WEBPACK_IMPORTED_MODULE_7__responsiveMenu_openmenu_component__["a" /* OpenMenuComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_8_ng2_codemirror__["CodemirrorModule"],
            ],
            providers: [],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "../../../../../src/app/model/impl/Punto.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Punto; });
var Punto = (function () {
    function Punto(elevacion, latitud, longitud, time) {
        this.elevacion = elevacion;
        this.latitud = latitud;
        this.longitud = longitud;
        this.time = time;
    }
    return Punto;
}());



/***/ }),

/***/ "../../../../../src/app/model/impl/Track.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Track; });
var Track = (function () {
    function Track(puntos, autor, nombre, waypoints) {
        this.autor = autor;
        this.nombre = nombre;
        this.puntos = puntos;
        this.waypoints = waypoints;
    }
    return Track;
}());



/***/ }),

/***/ "../../../../../src/app/model/impl/WayPoint.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WayPoint; });
var WayPoint = (function () {
    function WayPoint(nombre, latitud, longitud, elevacion, descripcion, time, cmt) {
        this.cmt = cmt;
        this.descripcion = descripcion;
        this.elevacion = elevacion;
        this.latitud = latitud;
        this.longitud = longitud;
        this.nombre = nombre;
        this.time = time;
    }
    return WayPoint;
}());



/***/ }),

/***/ "../../../../../src/app/model/impl/processing/GPXprocessing.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GPXprocessing; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Track_model__ = __webpack_require__("../../../../../src/app/model/impl/Track.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Punto_model__ = __webpack_require__("../../../../../src/app/model/impl/Punto.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__WayPoint_model__ = __webpack_require__("../../../../../src/app/model/impl/WayPoint.model.ts");



var GPXprocessing = (function () {
    function GPXprocessing() {
    }
    GPXprocessing.prototype.from = function (text) {
        var autor = "Anonimo";
        var puntos = [];
        var xml = (new DOMParser()).parseFromString(text, 'application/xml');
        var wayPoints = [];
        if (this.checkErrors(xml)["respuesta"]) {
            var name_1 = xml.getElementsByTagName("trk")[0].getElementsByTagName("name")[0];
            var puntosXMl = xml.getElementsByTagName("trkpt");
            var wpt = xml.getElementsByTagName("wpt");
            if (xml.getElementsByTagName("author")[0] != undefined)
                autor = xml.getElementsByTagName("author")[0].getElementsByTagName("name")[0].textContent;
            for (var i = 0; i < puntosXMl.length; i++) {
                var lat = puntosXMl[i].attributes["lat"].nodeValue;
                var lon = puntosXMl[i].attributes["lon"].nodeValue;
                var ele = "0";
                var time = "noTime";
                if (puntosXMl[i].getElementsByTagName("ele")[0] != undefined)
                    ele = puntosXMl[i].getElementsByTagName("ele")[0].textContent;
                if (puntosXMl[i].getElementsByTagName("time")[0] != undefined)
                    time = puntosXMl[i].getElementsByTagName("time")[0].textContent;
                puntos.push(new __WEBPACK_IMPORTED_MODULE_1__Punto_model__["a" /* Punto */](ele, lat, lon, time));
            }
            for (var i = 0; i < wpt.length; i++) {
                var cmt = "Waypoint coment";
                var desc = "Waypoint description";
                var ele = "0";
                var lat = wpt[i].attributes["lat"].nodeValue;
                var lon = wpt[i].attributes["lon"].nodeValue;
                var nombre = "Waypoint";
                var time = "noTime";
                if (wpt[i].getElementsByTagName("ele")[0] != undefined)
                    ele = wpt[i].getElementsByTagName("ele")[0].textContent;
                if (wpt[i].getElementsByTagName("name")[0] != undefined)
                    nombre = wpt[i].getElementsByTagName("name")[0].textContent;
                if (wpt[i].getElementsByTagName("desc")[0] != undefined)
                    desc = wpt[i].getElementsByTagName("desc")[0].textContent;
                if (wpt[i].getElementsByTagName("time")[0] != undefined)
                    time = wpt[i].getElementsByTagName("time")[0].textContent;
                if (wpt[i].getElementsByTagName("cmt")[0] != undefined)
                    cmt = wpt[i].getElementsByTagName("cmt")[0].textContent;
                wayPoints.push(new __WEBPACK_IMPORTED_MODULE_2__WayPoint_model__["a" /* WayPoint */](nombre, lat, lon, ele, desc, time, cmt));
            }
            return new __WEBPACK_IMPORTED_MODULE_0__Track_model__["a" /* Track */](puntos, autor, name_1.textContent, wayPoints);
        }
        else {
            return new __WEBPACK_IMPORTED_MODULE_0__Track_model__["a" /* Track */](puntos, this.checkErrors(xml)["error"], "-1", wayPoints);
        }
    };
    GPXprocessing.prototype.to = function (track) {
        if (track.nombre != "-1") {
            //Cabecera del gpx
            var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n            <gpx creator=\"Anonimo\" version=\"1.1\" xmlns=\"http://www.topografix.com/GPX/1/1\" \n            xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"\n            http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd\">\n            <metadata>\n                <name>" + track.nombre + "</name>\n                <author>\n                    <name>" + track.autor + "</name>\n                    <link href=\"http://herrero.ninja/TFG/index.html\">\n                        <text>" + track.nombre + "</text>\n                    </link>\n                </author>\n                <link href=\"https://h3rrero.github.io/TFG-GPS/\">\n                    <text>" + track.nombre + "</text>\n                </link>\n            </metadata>\n" + this.generateWayPointsXml(track.waypoints) + "\n            <trk>\n                <name> " + track.nombre + " </name>\n                <trkseg>\n" + this.generatePointsXml(track.puntos) + "\n                </trkseg>\n            </trk>\n        </gpx>";
            return xml;
        }
        else {
            return track.autor;
        }
    };
    GPXprocessing.prototype.generatePointsXml = function (points) {
        var _this = this;
        console.log("Puntos gpx");
        console.log(points);
        return points.map(function (p) {
            if (p.latitud != undefined)
                return "                   <trkpt lat=\"" + p.latitud + "\" lon=\"" + p.longitud + "\">\n            <ele>" + p.elevacion + "</ele>\n            " + _this.generateTime(p.time) + "\n       </trkpt>\n";
        }).join('');
    };
    GPXprocessing.prototype.generateWayPointsXml = function (points) {
        var _this = this;
        return points.map(function (p) {
            return "                   <wpt lat=\"" + p.latitud + "\" lon=\"" + p.longitud + "\">\n                        <ele>" + p.elevacion + "</ele>\n                        " + _this.generateTime(p.time) + "\n                        <name>" + p.nombre + "</name>\n                        <cmt>" + p.cmt + "</cmt>\n                        <desc>" + p.descripcion + "</desc>\n                   </wpt>\n";
        }).join('');
    };
    GPXprocessing.prototype.generateTime = function (time) {
        return time !== 'noTime' ? "<time>" + time + "</time>" : '';
    };
    GPXprocessing.prototype.checkErrors = function (xml) {
        if (xml.childNodes[0].textContent != null) {
            if (xml.childNodes[0].textContent.indexOf("error") == -1) {
                if (xml.childNodes[0]["tagName"] == "gpx") {
                    return { respuesta: true, mensaje: "GPX bien formado", error: "ninguno" };
                }
                else {
                    return { respuesta: false, mensaje: "La entrada tiene que estar en formato GPX", error: "La entrada tiene que estar en formato GPX" };
                }
            }
            else {
                return { respuesta: false, mensaje: "Documento no válido", error: xml.childNodes[0].textContent };
            }
        }
        else {
            return { respuesta: false, mensaje: "Documento no válido", error: xml.childNodes[0].textContent };
        }
    };
    return GPXprocessing;
}());



/***/ }),

/***/ "../../../../../src/app/model/impl/processing/KMLprocessing.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KMLprocessing; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Track_model__ = __webpack_require__("../../../../../src/app/model/impl/Track.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Punto_model__ = __webpack_require__("../../../../../src/app/model/impl/Punto.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__WayPoint_model__ = __webpack_require__("../../../../../src/app/model/impl/WayPoint.model.ts");



var KMLprocessing = (function () {
    function KMLprocessing() {
    }
    KMLprocessing.prototype.from = function (text) {
        var xml = (new DOMParser()).parseFromString(text, 'application/xml');
        if (xml.getElementsByTagName("gx:coord")[0] != undefined) {
            return this.fromFormatNew(text);
        }
        else {
            return this.fromFormatOld(text);
        }
    };
    KMLprocessing.prototype.to = function (track) {
        if (track.nombre != "-1") {
            var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n        <kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n        <Folder>\n            <name>Lugares temporales</name>\n            <open>1</open>\n            <Folder>\n                <name>Lugares temporales</name>\n                <open>1</open>\n            </Folder>\n            <Document>\n                <name>GPS device</name>\n                <snippet>Created " + Date() + "</snippet>\n                <LookAt>\n                    <gx:TimeSpan>\n                        <begin>" + track.puntos[0].time + "</begin>\n                        <end>" + track.puntos[track.puntos.length - 1].time + "</end>\n                    </gx:TimeSpan>\n                    <longitude>" + track.puntos[0].longitud + "</longitude>\n                    <latitude>" + track.puntos[0].latitud + "</latitude>\n                    <altitude>0</altitude>\n                    <heading>0</heading>\n                    <tilt>0</tilt>\n                    <range>4372.51637</range>\n                </LookAt>\n                <StyleMap id=\"multiTrack\">\n                    <Pair>\n                        <key>normal</key>\n                        <styleUrl>#multiTrack_n</styleUrl>\n                    </Pair>\n                    <Pair>\n                        <key>highlight</key>\n                        <styleUrl>#multiTrack_h</styleUrl>\n                    </Pair>\n                </StyleMap>\n                <StyleMap id=\"waypoint\">\n                    <Pair>\n                        <key>normal</key>\n                        <styleUrl>#waypoint_n</styleUrl>\n                    </Pair>\n                    <Pair>\n                        <key>highlight</key>\n                        <styleUrl>#waypoint_h</styleUrl>\n                    </Pair>\n                </StyleMap>\n                <Style id=\"multiTrack_n\">\n                    <IconStyle>\n                        <Icon>\n                            <href>http://earth.google.com/images/kml-icons/track-directional/track-0.png</href>\n                        </Icon>\n                    </IconStyle>\n                    <LineStyle>\n                        <color>99ffac59</color>\n                        <width>6</width>\n                    </LineStyle>\n                </Style>\n                <Style id=\"multiTrack_h\">\n                    <IconStyle>\n                        <scale>1.2</scale>\n                        <Icon>\n                            <href>http://earth.google.com/images/kml-icons/track-directional/track-0.png</href>\n                        </Icon>\n                    </IconStyle>\n                    <LineStyle>\n                        <color>99ffac59</color>\n                        <width>8</width>\n                    </LineStyle>\n                </Style>\n                <Style id=\"waypoint_h\">\n                    <IconStyle>\n                        <scale>1.2</scale>\n                        <Icon>\n                            <href>http://maps.google.com/mapfiles/kml/pal4/icon61.png</href>\n                        </Icon>\n                    </IconStyle>\n                </Style>\n                <Style id=\"waypoint_n\">\n                    <IconStyle>\n                        <Icon>\n                            <href>http://maps.google.com/mapfiles/kml/pal4/icon61.png</href>\n                        </Icon>\n                    </IconStyle>\n                </Style>\n                <Folder>\n                    <name>Waypoints</name>\n                    " + this.generateWaypoints(track.waypoints) + "\n                </Folder>\n                <Folder>\n                    <name>Tracks</name>\n                    <Placemark>\n                        <name>" + track.nombre + "</name>\n                        <styleUrl>#multiTrack</styleUrl>\n                        <gx:Track>\n                            " + this.generateTimes(track.puntos) + "\n                            " + this.generateCoordinates(track.puntos) + "\n                        </gx:Track>\n                    </Placemark>\n                </Folder>\n            </Document>\n        </Folder>\n        </kml>";
            return xml;
        }
        else {
            return track.autor;
        }
    };
    KMLprocessing.prototype.generateCoordinates = function (pts) {
        return pts.map(function (p) {
            return "<gx:coord>" + p.longitud + "," + p.latitud + "," + p.elevacion + "</gx:coord>\n            ";
        }).join('');
    };
    KMLprocessing.prototype.generateTimes = function (pts) {
        return pts.map(function (p) {
            return "<when>" + p.time + "</when>\n            ";
        }).join('');
    };
    KMLprocessing.prototype.generateWaypoints = function (pts) {
        return pts.map(function (p) {
            return "<Placemark>\n                <TimeStamp><when>" + p.time + "</when>\n                </TimeStamp>\n                <name>" + p.nombre + "</name>\n                <description>" + p.descripcion + "</description>\n                <styleUrl>#waypointStyle</styleUrl>\n                <Point>\n                    <coordinates>" + p.longitud + "," + p.latitud + "," + p.elevacion + "</coordinates>\n                </Point>\n            </Placemark>";
        }).join('');
    };
    KMLprocessing.prototype.checkErrors = function (xml) {
        if (xml.childNodes[0].textContent != null) {
            if (xml.childNodes[0].textContent.indexOf("error") == -1) {
                if (xml.childNodes[0]["tagName"] == "kml") {
                    return { respuesta: true, mensaje: "KML bien formado", error: "ninguno" };
                }
                else {
                    return { respuesta: false, mensaje: "La entrada tiene que estar en formato KML", error: "La entrada tiene que estar en formato KML" };
                }
            }
            else {
                return { respuesta: false, mensaje: "Documento no válido", error: xml.childNodes[0].textContent };
            }
        }
        else {
            return { respuesta: false, mensaje: "Documento no válido", error: xml.childNodes[0].textContent };
        }
    };
    KMLprocessing.prototype.fromFormatNew = function (text) {
        var autor = "anonimo";
        var name = "track";
        var descripcion = "description";
        var puntos = [];
        var xml = (new DOMParser()).parseFromString(text, 'application/xml');
        var wayPoints = [];
        if (this.checkErrors(xml)["respuesta"]) {
            if (xml.getElementsByTagName("description")[0] != undefined)
                descripcion = xml.getElementsByTagName("description")[0].textContent;
            if (xml.getElementsByTagName("name")[0] != undefined)
                name = xml.getElementsByTagName("name")[0].textContent;
            var whenPoint = xml.getElementsByTagName("when");
            var coordPoint = xml.getElementsByTagName("gx:Track")[0].getElementsByTagName("gx:coord");
            var wpt = xml.getElementsByTagName("Point");
            for (var i = 0; i < wpt.length; i++) {
                var cmt = "Waypoint coment";
                var datos = wpt[i].getElementsByTagName("coordinates")[0].textContent.split(",");
                var desc = "Waypoint description";
                var ele = "0";
                var lat = datos[1];
                var lon = datos[0];
                var nombre = "Waypoint";
                var time = "2017-11-02T12:40:35Z";
                if (datos[2] != undefined)
                    ele = datos[2];
                wayPoints.push(new __WEBPACK_IMPORTED_MODULE_2__WayPoint_model__["a" /* WayPoint */](nombre, lat, lon, ele, desc, time, cmt));
            }
            for (var i = 0; i < coordPoint.length; i++) {
                var puntoXML = coordPoint[i].textContent.split(",");
                var lat = puntoXML[1];
                var lon = puntoXML[0];
                var ele = "0";
                var time = "2017-11-02T12:40:35Z";
                if (whenPoint[i] != undefined)
                    time = whenPoint[i].textContent;
                if (puntoXML[2] != undefined)
                    ele = puntoXML[2];
                puntos.push(new __WEBPACK_IMPORTED_MODULE_1__Punto_model__["a" /* Punto */](ele, lat, lon, time));
            }
            return new __WEBPACK_IMPORTED_MODULE_0__Track_model__["a" /* Track */](puntos, autor, name, wayPoints);
        }
        else {
            return new __WEBPACK_IMPORTED_MODULE_0__Track_model__["a" /* Track */](puntos, this.checkErrors(xml)["error"], "-1", wayPoints);
        }
    };
    KMLprocessing.prototype.fromFormatOld = function (text) {
        var autor = "anonimo";
        var puntos = [];
        var name = "track";
        var descripcion = "description";
        var xml = (new DOMParser()).parseFromString(text, 'application/xml');
        var wayPoints = [];
        if (this.checkErrors(xml)["respuesta"]) {
            descripcion = xml.getElementsByTagName("description")[0].textContent;
            name = xml.getElementsByTagName("name")[0].textContent;
            var puntosXMl = xml.getElementsByTagName("MultiGeometry")[0].getElementsByTagName("LineString")[0].getElementsByTagName("coordinates")[0].textContent;
            var tuplas = puntosXMl.split(" ");
            var wpt = xml.getElementsByTagName("Point");
            for (var i = 0; i < wpt.length; i++) {
                var cmt = "Waypoint coment";
                var datos = wpt[i].getElementsByTagName("coordinates")[0].textContent.split(",");
                var desc = "Waypoint description";
                var ele = "0";
                var lat = datos[1];
                var lon = datos[0];
                var nombre = "Waypoint";
                var time = "noTime";
                if (datos[2] != undefined)
                    ele = datos[2];
                wayPoints.push(new __WEBPACK_IMPORTED_MODULE_2__WayPoint_model__["a" /* WayPoint */](nombre, lat, lon, ele, desc, time, cmt));
            }
            for (var i = 0; i < tuplas.length; i++) {
                var puntoXML = tuplas[i].split(",");
                var lat = puntoXML[1];
                var lon = puntoXML[0];
                var ele = "0";
                if (puntoXML[2] != undefined)
                    ele = puntoXML[2];
                var time = "noTime";
                puntos.push(new __WEBPACK_IMPORTED_MODULE_1__Punto_model__["a" /* Punto */](ele, lat, lon, time));
            }
            return new __WEBPACK_IMPORTED_MODULE_0__Track_model__["a" /* Track */](puntos, autor, name, wayPoints);
        }
        else {
            return new __WEBPACK_IMPORTED_MODULE_0__Track_model__["a" /* Track */](puntos, this.checkErrors(xml)["error"], "-1", wayPoints);
        }
    };
    return KMLprocessing;
}());



/***/ }),

/***/ "../../../../../src/app/notificacion/notificacion.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".notifica{\r\n    background-color: #FF0000;\r\n    border: 1px solid #AA3939;\r\n    border-radius: 50%;\r\n    box-shadow: 0 3px 5px rgba(50, 50, 50, 0.35);\r\n    box-sizing: border-box;\r\n    color: #ffffff;\r\n    font-size: 20px;\r\n    height: 60px;\r\n    margin: auto;\r\n    position: fixed;\r\n    right: 25px;\r\n    text-align: center;\r\n    top: 15px;\r\n    width: 60px;\r\n    z-index: 9;\r\n}\r\n\r\n.notifica.show {\r\n    background-color: #16d145;\r\n    border: 1px solid #2D882D;\r\n}\r\n\r\n.icon{\r\n    line-height: 60px;\r\n    font-size: 30px;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/notificacion/notificacion.component.html":
/***/ (function(module, exports) {

module.exports = "<div title=\"Resultado de la traducción\" class=\"notifica\" [class.show]=\"isShown\">\r\n        <span class=\"fa {{iconClass}} icon\" aria-hidden=\"true\"></span>\r\n</div>\r\n"

/***/ }),

/***/ "../../../../../src/app/notificacion/notificacion.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificacionComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NotificacionComponent = (function () {
    function NotificacionComponent() {
        this.iconClass = "fa-exclamation";
        this.isShown = true;
    }
    NotificacionComponent.prototype.ngOnInit = function () {
    };
    NotificacionComponent.prototype.closeModal = function () {
        this.isShown = false;
        this.iconClass = "fa-exclamation";
    };
    NotificacionComponent.prototype.openModal = function () {
        this.isShown = true;
        this.iconClass = "fa-check";
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], NotificacionComponent.prototype, "isShown", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], NotificacionComponent.prototype, "mensaje", void 0);
    NotificacionComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-notificacion',
            template: __webpack_require__("../../../../../src/app/notificacion/notificacion.component.html"),
            styles: [__webpack_require__("../../../../../src/app/notificacion/notificacion.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], NotificacionComponent);
    return NotificacionComponent;
}());



/***/ }),

/***/ "../../../../../src/app/responsiveMenu/openmenu.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".notifica{\r\n\r\n    background: rgb(75, 78, 79);\r\n\tcontent:'\\F0A9';\r\n\tborder-bottom-right-radius: 40px;\r\n    border-top-right-radius: 40px;\r\n\tbox-shadow: rgba(0, 0, 0, 0.5) -1px 0px 2px 0px;\r\n\tcolor: white;\r\n\tfont: normal normal normal 25px/1 FontAwesome;\r\n\theight:80px;\r\n\tline-height:80px;\r\n\topacity:0.9;\r\n\tpadding-left:40px;\r\n    position: fixed;\r\n\ttext-align:left;\r\n\ttext-rendering: auto;\r\n    top: 45%;\r\n    width:80px;\r\n    -webkit-font-smoothing: antialiased;\r\n    z-index: 9;\r\n}\r\n.leftDesk{\r\n    left: -200px;\r\n}\r\n.leftOut{\r\n    left:-30px !important;\r\n    transition: all 0.5s linear;\r\n}\r\n.leftIn{\r\n    left: 170px !important;\r\n    transition: all 0.5s linear;\r\n}\r\n.icon{\r\n    line-height: 60px;\r\n    font-size: 30px;\r\n}\r\n@media only screen and (max-width: 500px){\r\n   .notifica{\r\n       left: -30px;\r\n   }\r\n    }", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/responsiveMenu/openmenu.component.html":
/***/ (function(module, exports) {

module.exports = "<div title=\"Resultado de la traducción\" class=\"notifica {{leftClass}}\" [class.show]=\"isShown\" (click)=\"showMenu()\" >\r\n        <span class=\"fas {{arrowclass}}\" aria-hidden=\"true\"></span>\r\n</div>\r\n"

/***/ }),

/***/ "../../../../../src/app/responsiveMenu/openmenu.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpenMenuComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var OpenMenuComponent = (function () {
    function OpenMenuComponent() {
        this.iconClass = "fa-exclamation";
        this.leftClass = "leftDesk";
        this.arrowclass = "fa-arrow-circle-right";
        this.isShown = true;
    }
    OpenMenuComponent.prototype.ngOnInit = function () {
    };
    OpenMenuComponent.prototype.closeModal = function () {
        this.isShown = false;
        this.leftClass = "leftOut";
        this.arrowclass = "fa-arrow-circle-right";
        document.getElementsByClassName("sidenav")[0].classList.remove("visible");
        document.getElementsByClassName("sidenav")[0].classList.add("oculta");
    };
    OpenMenuComponent.prototype.openModal = function () {
        this.isShown = true;
        this.leftClass = "leftIn";
        this.arrowclass = "fa-arrow-circle-left";
        if (document.getElementsByClassName("sidenav")[0].classList[1] == "desk")
            document.getElementsByClassName("sidenav")[0].classList.remove("desk");
        document.getElementsByClassName("sidenav")[0].classList.remove("oculta");
        document.getElementsByClassName("sidenav")[0].classList.add("visible");
    };
    OpenMenuComponent.prototype.showMenu = function () {
        if (this.isShown)
            this.closeModal();
        else
            this.openModal();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], OpenMenuComponent.prototype, "isShown", void 0);
    OpenMenuComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-openmenu',
            template: __webpack_require__("../../../../../src/app/responsiveMenu/openmenu.component.html"),
            styles: [__webpack_require__("../../../../../src/app/responsiveMenu/openmenu.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], OpenMenuComponent);
    return OpenMenuComponent;
}());



/***/ }),

/***/ "../../../../../src/app/select/select.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".lista {\r\n  font-size: 0.9rem;\r\n  font-weight: normal;\r\n  line-height: 2rem;\r\n  list-style: none;\r\n}\r\n\r\n.lista>span {\r\n  margin-left: 2rem;\r\n}\r\n\r\n.lista:hover {\r\n  background-color: #A2A1A1;\r\n  color: rgb(255, 255, 255);\r\n}\r\n\r\n.separator {\r\n  border-bottom: 1px solid #CFCECE;\r\n}\r\n\r\n.separator>div {\r\n  padding: 0.6rem 1.2rem;\r\n}\r\n\r\n.separator>div:hover {\r\n  background-color: #A2A1A1;\r\n  color: rgb(255, 255, 255);\r\n}\r\n\r\n.separator>div:after {\r\n  clear: both;\r\n  content: '';\r\n  display: block;\r\n}\r\n\r\n.separator>div>.titlesection {\r\n  float: left;\r\n}\r\n\r\n.separator>div>i {\r\n  float: right;\r\n  transition: all 0.25s linear;\r\n}\r\n\r\n.separator>div.open>i {\r\n  -webkit-transform: rotate(-90deg);\r\n          transform: rotate(-90deg);\r\n}\r\n\r\n.separator>ul {\r\n  background-color: rgb(255, 255, 255);\r\n  margin-top: 0;\r\n  padding-left: 0;\r\n}\r\n\r\n.titlesection {\r\n  font-size: 1.2rem;\r\n  font-weight: bold;\r\n  -webkit-box-flex: 1;\r\n      -ms-flex: 1 1 0%;\r\n          flex: 1 1 0%;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/select/select.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"separator\">\n    <div (click)=\"toggleSelect()\" [class.open]=\"opened\">\n        <span class=\"titlesection\">{{selectedValue}}</span>\n        <i class=\"fa fa-chevron-left\" aria-hidden=\"true\"></i>\n    </div>\n    <ul *ngIf=\"opened\">\n        <li class=\"lista\" *ngFor=\"let l of leng\" (click)=\"selectValue(l)\"><span>{{l}}</span></li>\n    </ul>\n</div>"

/***/ }),

/***/ "../../../../../src/app/select/select.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SelectComponent = (function () {
    function SelectComponent() {
        this.title = "select";
        this.opened = false;
        this.onSelect = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    SelectComponent.prototype.ngOnInit = function () {
    };
    SelectComponent.prototype.selectValue = function (l) {
        this.selectedValue = l;
        this.onSelect.emit(this.selectedValue);
    };
    SelectComponent.prototype.toggleSelect = function () {
        this.opened = !this.opened;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
    ], SelectComponent.prototype, "onSelect", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], SelectComponent.prototype, "selectedValue", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], SelectComponent.prototype, "leng", void 0);
    SelectComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-select',
            template: __webpack_require__("../../../../../src/app/select/select.component.html"),
            styles: [__webpack_require__("../../../../../src/app/select/select.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], SelectComponent);
    return SelectComponent;
}());



/***/ }),

/***/ "../../../../../src/app/traductor/traductor.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ":host ::ng-deep .CodeMirror {\r\n    float: left;\r\n    width: 50%;\r\n    height: 100vh;\r\n}\r\n\r\n@media only screen and (max-width: 500px){\r\n    :host ::ng-deep .CodeMirror{\r\n        float: inherit;\r\n        width: 100vw;\r\n        height: 50vh;\r\n    }\r\n    \r\n}\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/traductor/traductor.component.html":
/***/ (function(module, exports) {

module.exports = "<app-openmenu [isShown]=\"show\" ></app-openmenu>\n<app-notificacion [isShown]=\"show\" [mensaje]=\"mensaje\"></app-notificacion>\n<div (drop)=\"onDrop($event)\" (dragover)=\"onDragOver($event)\">\n<codemirror [(ngModel)]=\"content\" [config]=\"config\" (ngModelChange)=\"importCode()\" ></codemirror>\n</div>\n<codemirror [(ngModel)]=\"salida\" [config]=\"configSalida\" ></codemirror>\n"

/***/ }),

/***/ "../../../../../src/app/traductor/traductor.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TraductorComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_codemirror_mode_xml_xml__ = __webpack_require__("../../../../codemirror/mode/xml/xml.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_codemirror_mode_xml_xml___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_codemirror_mode_xml_xml__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_impl_processing_GPXprocessing_model__ = __webpack_require__("../../../../../src/app/model/impl/processing/GPXprocessing.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_impl_processing_KMLprocessing_model__ = __webpack_require__("../../../../../src/app/model/impl/processing/KMLprocessing.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__notificacion_notificacion_component__ = __webpack_require__("../../../../../src/app/notificacion/notificacion.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var processors = {
    "GPX": new __WEBPACK_IMPORTED_MODULE_2__model_impl_processing_GPXprocessing_model__["a" /* GPXprocessing */](),
    "KML": new __WEBPACK_IMPORTED_MODULE_3__model_impl_processing_KMLprocessing_model__["a" /* KMLprocessing */]()
};
var TraductorComponent = (function () {
    function TraductorComponent() {
        this.successMessage = false;
        this.title = "traductor";
        this.config = { lineNumbers: true, mode: 'text/xml', theme: "base16-light" };
        this.configSalida = { lineNumbers: true, mode: 'text/xml', theme: "base16-light", readOnly: true };
        this.content =
            "    Selecciona un formato de entrada, uno de salida y luego pega aqu\u00ED la entrada \n      o arrastra y suelta el fichero.\n      \n    Select an input format, an output format,and then paste the entry here\n     or drag and drop the file.";
        this.salida =
            "    Aqu\u00ED veras la salida.\n    Here you will see the result.";
    }
    Object.defineProperty(TraductorComponent.prototype, "from", {
        get: function () {
            return this._from;
        },
        set: function (from) {
            this._from = from;
            this.importCode();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TraductorComponent.prototype, "to", {
        get: function () {
            return this._to;
        },
        set: function (to) {
            this._to = to;
            this.importCode();
        },
        enumerable: true,
        configurable: true
    });
    TraductorComponent.prototype.ngOnInit = function () {
    };
    TraductorComponent.prototype.importCode = function () {
        if (this.to == undefined || this.from == undefined)
            this.successMessage = true;
        else {
            this.successMessage = false;
            var toProcessor = processors[this.to];
            var fromProcessor = processors[this.from];
            var track = fromProcessor.from(this.content);
            if (track.nombre != "-1") {
                this.salida = toProcessor.to(track);
                this.notificacion.openModal();
            }
            else {
                this.salida = toProcessor.to(track);
                this.notificacion.closeModal();
            }
        }
    };
    TraductorComponent.prototype.onDrop = function (event) {
        var _this = this;
        event.preventDefault();
        event.stopPropagation();
        console.log("onDrop", event.dataTransfer.files[0]);
        var myReader = new FileReader();
        myReader.readAsText(event.dataTransfer.files[0]);
        myReader.onloadend = function (e) {
            _this.content = myReader.result;
            _this.importCode();
        };
    };
    TraductorComponent.prototype.onDragOver = function (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log("onDragOver", event);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_4__notificacion_notificacion_component__["a" /* NotificacionComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__notificacion_notificacion_component__["a" /* NotificacionComponent */])
    ], TraductorComponent.prototype, "notificacion", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], TraductorComponent.prototype, "from", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], TraductorComponent.prototype, "to", null);
    TraductorComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-traductor',
            template: __webpack_require__("../../../../../src/app/traductor/traductor.component.html"),
            styles: [__webpack_require__("../../../../../src/app/traductor/traductor.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], TraductorComponent);
    return TraductorComponent;
}());



/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map