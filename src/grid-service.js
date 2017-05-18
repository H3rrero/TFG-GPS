var dL = {};
(function () {
    'use strict';

    angular.module('GPS')
        .service('GridService',GridService);

/*
Esta cuadricula a sido implanta basandome en el codigo de un ejemplo de
la pagina de gmap4, el ejemplo es el siguiente-->
https://mappingsupport.com/p/gmap4.php?utm=14N,460555,4257618&tilt=off&z=5&t=t1
 */

    function GridService() {
        var grid = this;
        grid.mapa;
        
        dL.jo = false;
        dL.dF = "";
        dL.tk = 0;
         var Q = [];
        var aD = [];
        var iB = [];
        var iG = [];
        var jn = true;
        var dq;
       
       
        dL.P = "utm";
        dL.ok = false;
       
       //Funcion que controla la vida de la cuadricula
        grid.draw= function cd(K, action) {
             dL.map = grid.mapa;
            dL.R = dL.map.getZoom();
            if (dL.jo === false) {
                dL.jo = true;
                if (false) {} else {
                    dL.tk = dL.map.getBounds();
                    dL.R = dL.map.getZoom();
                    if (dL.dF == "utm" || dL.dF == "usng" || dL.dF == "mgrs") {
                        dL.dF = "";
                        //Limpia la cuadricula y sus valores para que se peda volver a pintar cuando se produce un evento en el mapa
                        tM();
						
                    }
                    if (action == 1) {
                        //Hace los calculos necesarios para la cuadricula
                        ue();
                        if (dL.P == "utm") {
                            dL.dF = "utm";
                            if (dL.R >= 6) {
                                //Pinta la cuadricula
                                qx("utm");
								
                            }
                            
							
                        }
                    
                    }
                }
            } 
            dL.jo = false;
           
        };
		
 function ue() {
            if (dL.ok === false) {
                dL.ok = true;
                dL.zP = "off";
                dL.cC = dL.map.getProjection();
                dL.ba = [];
                dL.eB = [];
                dL.en = [];
                dL.iZ = [];
                dL.he = [];
                dL.fu = [];
                dL.lZ = [];
                dL.ld = [];
                dL.dv = [];
                dL.dv[6] = 100000;
                dL.dv[7] = 100000;
                dL.dv[8] = 100000;
                dL.dv[9] = 100000;
                dL.dv[10] = 10000;
                dL.dv[11] = 10000;
                dL.dv[12] = 10000;
                dL.dv[13] = 1000;
                dL.dv[14] = 1000;
                dL.dv[15] = 1000;
                dL.dv[16] = 1000;
                dL.dv[17] = 100;
                dL.dv[18] = 100;
                dL.dv[19] = 100;
                dL.dv[20] = 10;
                dL.dv[21] = 10;
                dL.di = [];
                dL.di[4] = "GDZ Grid";
                dL.di[5] = "GDZ Grid";
                dL.di[6] = "100km Grid";
                dL.di[7] = "100km Grid";
                dL.di[8] = "100km Grid";
                dL.di[9] = "100km Grid";
                dL.di[10] = "10km Grid";
                dL.di[11] = "10km Grid";
                dL.di[12] = "10km Grid";
                dL.di[13] = "1km Grid";
                dL.di[14] = "1km Grid";
                dL.di[15] = "1km Grid";
                dL.di[16] = "1km Grid";
                dL.di[17] = "100m Grid";
                dL.di[18] = "100m Grid";
                dL.di[19] = "100m Grid";
                dL.di[20] = "10m Grid";
                dL.di[21] = "10m Grid";
                dL.lX = false;
                dL.yc = false;
                dL.hq = [];
                dL.pS = [];
                dL.mK = [];
                dL.eU = [];
                dL.gx = [];
                dL.ke = [];
                dL.kW = [];
                dL.to = 75;
                dL.tx = 25;
                if (dL.o == "desktop") {
                    dL.oK = 85;
                } else {
                    dL.oK = 125;
                }
                dL.tv = 25;
                dL.rT = 10;
                dL.rS = 35;
                dL.sd = 15;
                dL.sF = 30;
                var aq = "CDEFGHJKLMNPQRSTUVWX";
                dL.sz = [];
                dL.sz = aq.split("");
                for ( var i = 0; i < 60; i++) {
                    dL.mK[i] = [];
                    dL.pS[i] = [];
                    dL.ke[i] = -180 + (6 * i);
                    dL.dN = dL.ke[i] + 3;
                    aq = i + 1;
                    for (var j = 0; j < 20; j++) {
                        dL.pS[i][j] = "" + aq + dL.sz[j];
                        dL.cZ = -80 + (8 * j) + 4;
                      //  if (dL.gb == 72) {
                        //    dL.cZ = 78;
                        //}
                        dL.mK[i][j] = new google.maps.LatLng(dL.cZ, dL.dN);
                    }
                    dL.ke[60] = 180;
                }
                for (var j = 0; j < 20; j++) {
                    dL.kW[j] = -80 + (8 * j);
                }
                dL.kW[20] = 84;
				////////////////BARRAS ROJAS VERTICALES///////////////////////
                dL.rV = {
                    strokeWeight: 5,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.5,
                    zIndex: 99
                };
				//////////////////////////////////////////////////////////////
                dL.iY = "FFCCCC";
                dL.vJ = 'position: relative; left:-22px; top:-10px; ' + 'white-space: nowrap; border: 1px solid black; padding: 0px; margin: 0px;' + 'background-color: #' + dL.iY + '; font-size: 24px; font-weight:bold;';
                dL.vC = "FFCCCC";
                dL.nJ = false;
                dL.ia = [];
                dL.vT = [];
                dL.lo = [];
                aq = "ABCDEFGHJKLMNPQRSTUVWXYZ";
                dL.wz = [];
                dL.wz = aq.split("");
                aq = "ABCDEFGHJKLMNPQRSTUV";
                dL.vU = [];
                dL.vU = aq.split("");
                dL.cT = [];
                dL.dm = [];
                dL.wr = 30;
                dL.lW = {
                    strokeWeight: 5,
                    strokeColor: "#00FF00",
                    strokeOpacity: 0.6,
                    zIndex: 99
                };
                dL.wA = "CCFFCC";
                dL.wK = 'position: relative; left:-20px; top:-10px; ' + 'white-space: nowrap; border: 1px solid black; padding: 1px; margin: 0px;' + 'background-color: #' + dL.wA + '; font-size: 22px; font-weight:bold;';
                dL.js = "AAFFAA";
				/////////////////////LINEAS DE LA CUADRICULA////////////////////////
                dL.rC = {
                    strokeWeight: 4,
                    strokeColor: "#FFFFFF",
                    strokeOpacity: 0.7,
                    zIndex: 99
                };
                dL.sB = {
                    strokeWeight: 2,
                    strokeColor: "#572364",
                    strokeOpacity: 0.7,
                    zIndex: 99
                };
				///////////////////////////////////////////////////////////////////////////
                dL.eL = [];
                dL.es = -1;
                dL.wy = 50;
                if (dL.o == "desktop") {
                    dL.rZ = 122;
                } else {
                    dL.rZ = 71;
                }
                dL.yJ = false;
                dL.rx = "000000";
                dL.la = "00FFFF";
                dL.jP = "FFCC00";
                dL.cI = [];
                dL.cI[6] = 0;
                dL.cI[7] = 100000;
                dL.cI[8] = 50000;
                dL.cI[9] = 50000;
                dL.cI[10] = 25000;
                dL.cI[11] = 10000;
                dL.cI[12] = 5000;
                dL.cI[13] = 2000;
                dL.cI[14] = 1000;
                dL.cI[15] = 1000;
                dL.cI[16] = 500;
                dL.cI[17] = 250;
                dL.cI[18] = 100;
                dL.cI[19] = 50;
                dL.hC = 'position: relative; ' + 'left:-30px; top:25px;' + 'white-space: nowrap; border: 1px solid black;  padding: 1px; background-color: #FFFFFF; font-size: 14px;';
                dL.gX = 'position: relative; ' + 'left:5px; top:-10px;' + 'white-space: nowrap; border: 1px solid black; padding: 1px; background-color: #FFFFFF; font-size: 14px;';
            }
            var pd = -1;
            grid.vQ = 60;
            var Ac = 20;
            grid.cy = -1;
            grid.cH = -1;
            grid.ii = -1;
            grid.iv = -1;
            var fD = -1;
            Q.length = 0;
            aD.length = 0;
            iB.length = 0;
            iG.length = 0;
            dL.eB.length = 0;
            dL.en.length = 0;
            dL.iZ.length = 0;
            dL.he.length = 0;
            dL.hq.length = 0;
            dL.eU.length = 0;
            dL.gx.length = 0;
            dL.cT.length = 0;
            dL.ia.length = 0;
            dL.vT.length = 0;
            dL.lo.length = 0;
            dL.ni = -1;
            dL.R = dL.map.getZoom();
           // dL.v = dL.ar.lat().toFixed(6);
            dL.mZ = false;
            //if (dL.v < 0) {
             //   dL.mZ = true;
            //}
            
            if (dL.R > 5) {
                if (dL.R < 19) {
                    if (dL.P == "utm") {
                        dL.dD = dL.cI[dL.R];
                    } else {
                        dL.dD = dL.dv[dL.R];
                    }
                } else {
                    if (dL.P == "utm") {
                        dL.dD = dL.cI[19];
                    } else {
                        if (dL.R < 22) {
                            dL.dD = dL.dv[dL.R];
                        } else {
                            dL.dD = dL.dv[21];
                        }
                    }
                }
                dL.bb = dL.dD * 2;
            }
            dL.hL = dL.map.getBounds();
            dL.oI = dL.hL.getNorthEast();
            dL.oX = dL.hL.getSouthWest();
            dL.ef = dL.oI.lat();
            dL.eC = dL.oI.lng();
            dL.dV = dL.oX.lat();
            dL.fd = dL.oX.lng();
            if (dL.ef > 84) {
                dL.ef = 84;
            }
            if (dL.dV < -80) {
                dL.dV = -80;
            }
            dL.xq = true;
            dL.mi = dL.cC.fromLatLngToPoint(dL.oI);
            dL.iH = dL.cC.fromLatLngToPoint(dL.oX);
            dL.bh = Math.pow(2, dL.R);
            var J = ((dL.mi.x * dL.bh) - dL.tx) / dL.bh;
            var F = ((dL.mi.y * dL.bh) + dL.to) / dL.bh;
            dL.ot = dL.cC.fromPointToLatLng(new google.maps.Point(J, F));
            var J = (J * dL.bh - dL.rS) / dL.bh;
            var F = (F * dL.bh + dL.rT) / dL.bh;
            dL.rW = dL.cC.fromPointToLatLng(new google.maps.Point(J, F));
            var J = ((dL.mi.x * dL.bh) - dL.tx) / dL.bh;
            var F = ((dL.iH.y * dL.bh) - dL.oK) / dL.bh;
            dL.zU = dL.cC.fromPointToLatLng(new google.maps.Point(J, F));
            var J = (J * dL.bh - dL.rS) / dL.bh;
            var F = (F * dL.bh - dL.sd) / dL.bh;
            dL.yI = dL.cC.fromPointToLatLng(new google.maps.Point(J, F));
            var J = ((dL.iH.x * dL.bh) + dL.tv) / dL.bh;
            var F = ((dL.iH.y * dL.bh) - dL.oK) / dL.bh;
            dL.oc = dL.cC.fromPointToLatLng(new google.maps.Point(J, F));
            var J = (J * dL.bh + dL.sF) / dL.bh;
            var F = (F * dL.bh - dL.sd) / dL.bh;
            dL.sG = dL.cC.fromPointToLatLng(new google.maps.Point(J, F));
            var J = ((dL.iH.x * dL.bh) + dL.tv) / dL.bh;
            var F = ((dL.mi.y * dL.bh) + dL.to) / dL.bh;
            dL.zD = dL.cC.fromPointToLatLng(new google.maps.Point(J, F));
            var J = (J * dL.bh + dL.sF) / dL.bh;
            var F = (F * dL.bh + dL.rT) / dL.bh;
            dL.yE = dL.cC.fromPointToLatLng(new google.maps.Point(J, F));
            dL.mf = dL.ot.lat();
            dL.nm = dL.oc.lat();
            dL.mh = dL.ot.lng();
            dL.lD = dL.oc.lng();
            dL.sS = dL.rW.lat();
            dL.rB = dL.sG.lat();
            dL.sm = dL.rW.lng();
            dL.rF = dL.sG.lng();
            dL.oh = (dL.iH.y * dL.bh) - dL.rZ;
            dL.jR = (dL.iH.x * dL.bh) + dL.wy;
            dL.sM = dL.cC.fromPointToLatLng(new google.maps.Point(dL.jR / dL.bh, dL.oh / dL.bh));
            dL.yD = dL.sM.lat();
            dL.yz = dL.sM.lng();
          
          };


        function qx(action) {
        
            dL.sQ = Math.floor((dL.fd + 180.0) / 6) + 1;
            dL.ep = -180 + (dL.sQ * 6) - 12;
            var aB = 0;
            for (var i = 0; i < grid.vQ; i++) {
                dL.cL = -180 + (6 * i);
                if (dL.fd >= 0 && dL.eC < 0) {
                    if ((dL.cL > dL.fd && dL.cL < 180) || (dL.cL >= -180 && dL.cL < dL.eC)) {
                        aB++;
                    }
                } else if (dL.cL >= dL.fd && dL.cL <= dL.eC) {
                    aB++;
                }
            }
            dL.gE = aB + 1;
            LLtoUTM(dL.ef, dL.eC, dL.lZ);
            if (dL.v < 0) {
                dL.lZ[1] = 10000000 + dL.lZ[1];
            }
            dL.yU = dL.lZ[1];
            dL.bj = Math.floor(dL.yU / dL.dD) * dL.dD + dL.bb;
            LLtoUTM(dL.dV, dL.fd, dL.ld);
            if (dL.v < 0) {
                dL.ld[1] = 10000000 + dL.ld[1];
            }
            dL.xH = dL.ld[1];
            dL.bf = Math.floor(dL.xH / dL.dD) * dL.dD - dL.bb;
            if (dL.bf >= dL.bj) {
                if (dL.v < 0) {
                    dL.bj = dL.bj + 10000000;
                } else {
                    dL.bf = dL.bf + dL.bb - 10000000;
                }
            }
            if (dL.ef > 0 && dL.dV >= 0) {
                dL.cZ = dL.dV;
                dL.dN = dL.fd;
                dL.jV = dL.dV;
                dL.nG = dL.eC;
                dL.ig = dL.dV;
            } else if (dL.ef > 0 && dL.dV < 0) {
                dL.cZ = 0;
                dL.dN = dL.fd;
                dL.jV = 0;
                dL.nG = dL.eC;
                dL.ig = 0;
            } else {
                dL.cZ = dL.ef;
                dL.dN = dL.fd;
                dL.jV = dL.ef;
                dL.nG = dL.eC;
                dL.ig = dL.ef;
            }
            LLtoUTM(dL.cZ, dL.dN, dL.fu);
            if (dL.cZ < 0) {
                dL.fu[1] = 10000000 + dL.fu[1];
            }
            var aq = dL.fu[0];
            dL.vk = Math.floor(aq / dL.dD) * dL.dD;
            LLtoUTM(dL.jV, dL.nG, dL.fu);
            if (dL.jV < 0) {
                dL.fu[1] = 10000000 + dL.fu[1];
            }
            aq = dL.fu[0];
            dL.vp = Math.floor(aq / dL.dD) * dL.dD + dL.dD;
            if (dL.gE > 1) {
                LLtoUTM(dL.ig, -90, dL.fu);
                if (dL.ig < 0) {
                    dL.fu[1] = 10000000 + dL.fu[1];
                }
                aq = dL.fu[0];
                dL.wb = Math.floor(aq / dL.dD) * dL.dD + dL.dD;
                LLtoUTM(dL.ig, -84.00001, dL.fu);
                if (dL.ig < 0) {
                    dL.fu[1] = 10000000 + dL.fu[1];
                }
                aq = dL.fu[0];
                dL.wN = Math.floor(aq / dL.dD) * dL.dD;
            }
            dL.jh = dL.sQ;
            var max = dL.gE;
            for (var i = 1; i <= max; i++) {
                if (i == 1) {
                    dL.oD = dL.vk;
                } else {
                    dL.oD = dL.wb;
                }
                if (i == dL.gE) {
                    dL.qC = dL.vp;
                } else {
                    dL.qC = dL.wN;
                }
                if (dL.gE > 1) {
                    dL.ep = dL.ep + 6;
                    if (dL.ep == 180) {
                        dL.ep = -180;
                    }
                    dL.fj = dL.ep + 6;
                } else {
                    dL.ep = 0;
                    dL.fj = 0;
                }
                dL.qq = "ns";
                for (var j = dL.oD; j <= dL.qC; j = j + dL.dD) {
                    dL.kR = dL.rC;
                    if (action == "100km") {
                        dL.kR = dL.lW;
                    }
                    dL.ba.length = 0;
                    var x = j;
                    dL.ae = gA(x, dL.bj, dL.jh, dL.mZ);
                    dL.ac = new google.maps.LatLng(dL.ae[0], dL.ae[1]);
                    aq = dL.ac;
                    dL.ba.push(dL.ac);
                    dL.ae = gA(x, dL.bf, dL.jh, dL.mZ);
                    dL.ac = new google.maps.LatLng(dL.ae[0], dL.ae[1]);
                    dL.ba.push(dL.ac);
                    if (dL.gE > 1) {
                        sC("doing NS lines", -111, -111);
                    }
                    if (aq != dL.ba[0]) {
                        dL.yO = dL.ba[0].lat();
                    }
                    if (action == "100km" && dL.R > 9) {} else {
                        if (dL.ba[0].show == "yes" || dL.gE == 1) {
                             grid.cH++;
                            aD[ grid.cH] = new google.maps.Polyline(dL.kR);
                            aD[ grid.cH].setMap(dL.map);
                            dL.en[ grid.cH] = aD[ grid.cH].getPath();
                            if (action == "utm" || action == "grid") {
                                grid.iv++;
                                iG[grid.iv] = new google.maps.Polyline(dL.sB);
                                iG[grid.iv].setMap(dL.map);
                                dL.he[grid.iv] = iG[grid.iv].getPath();
                            }
                            dL.en[ grid.cH].push(dL.ba[0]);
                            dL.en[ grid.cH].push(dL.ba[1]);
                            if (action == "utm" || action == "grid") {
                                dL.he[grid.iv].push(dL.ba[0]);
                                dL.he[grid.iv].push(dL.ba[1]);
                                dL.fx = dL.cC.fromLatLngToPoint(dL.ba[0]);
                                dL.im = dL.fx.x * dL.bh;
                                dL.kv = dL.fx.y * dL.bh;
                                dL.fx = dL.cC.fromLatLngToPoint(dL.ba[1]);
                                dL.lc = dL.fx.x * dL.bh;
                                dL.mN = dL.fx.y * dL.bh;
                                if (dL.im == dL.lc) {
                                    dL.aN = dL.im;
                                } else {
                                    dL.jJ = (dL.kv - dL.mN) / (dL.im - dL.lc);
                                    dL.nS = dL.kv - (dL.jJ * dL.im);
                                    dL.aN = (dL.oh - dL.nS) / dL.jJ;
                                }
                                var F = dL.oh / dL.bh;
                                var J = dL.aN / dL.bh;
                                dL.ac = dL.cC.fromPointToLatLng(new google.maps.Point(J, F));
                                if (action == "grid") {
                                   
                                } else {
                                    var dK = "" + j;
                                    var aq = dK.length - 5;
                                    var bK = dK.substr(0, aq);
                                    var aq = dK.slice(-5);
                                    var bJ = aq.slice(0, 2);
                                    var bN = aq.slice(-3);
                                    dL.aS = "" + bK + "<span style='font-weight:bold; font-size: 15px;'>" + bJ + "</span>" + bN;
                                    dL.fo = dL.hC;
                                    dL.es++;
                                 
                                    dL.eL[dL.es] = new cR({
                                        map: dL.map
                                    });
                                }
                                dL.eL[dL.es].set('text', dL.aS);
                                dL.eL[dL.es].set('position', dL.ac);
                            }
                        
                        }
                    }
                }
                dL.qq = "ew";
                dL.cT.length = 0;
                var qA = 0;
                for (var j = dL.bf; j <= dL.bj; j = j + dL.dD) {
                    qA++;
                    dL.kR = dL.rC;
                    if (action == "100km") {
                        dL.kR = dL.lW;
                    }
                    J = dL.oD - dL.dD;
                    F = dL.qC + dL.dD;
                    dL.ba.length = 0;
                    for (var k = J; k <= F; k = k + dL.dD) {
                        dL.xc = k;
                        dL.wS = j;
                        dL.ae = gA(dL.xc, dL.wS, dL.jh, dL.mZ);
                        dL.ac = new google.maps.LatLng(dL.ae[0], dL.ae[1]);
                        dL.ba.push(dL.ac);
                    }
                    if (dL.gE > 1) {
                        sC("doing EW lines", i, qA);
                    } else {
                        for (var z = 0; z < dL.ba.length; z++) {
                            dL.ba[z].show = "yes";
                        }
                    }
                    if (action == "100km" && dL.R > 9) {
                        dL.dm.length = 0;
                        dL.lv = 0;
                        for (var k = 0; k < dL.ba.length; k++) {
                            dL.lv++;
                        }
                        if (dL.lv > 1) {
                            for (var k = 0; k < dL.ba.length; k++) {
                                if (dL.ba[k].show == "yes" || dL.gE == 1) {
                                    dL.dm.push(dL.ba[k]);
                                }
                            }
                        }
                    } else {
                        dL.lv = 0;
                        for (var k = 0; k < dL.ba.length; k++) {
                            if (dL.ba[k].show == "yes") {
                                dL.lv++;
                            }
                        }
                        if (dL.lv > 1) {
                            grid.cy++;
                            Q[grid.cy] = new google.maps.Polyline(dL.kR);
                            Q[grid.cy].setMap(dL.map);
                            dL.eB[grid.cy] = Q[grid.cy].getPath();
                            if (action == "utm" || action == "grid") {
                                grid.ii++;
                                iB[grid.ii] = new google.maps.Polyline(dL.sB);
                                iB[grid.ii].setMap(dL.map);
                                dL.iZ[grid.ii] = iB[grid.ii].getPath();
                            }
                            for (var k = 0; k < dL.ba.length; k++) {
                                if (dL.ba[k].show == "yes" || dL.gE == 1) {
                                    dL.eB[grid.cy].push(dL.ba[k]);
                                    if (action == "utm" || action == "grid") {
                                        dL.iZ[grid.ii].push(dL.ba[k]);
                                    }
                                }
                            }
                            if (i == 1) {
                                if (action == "grid" || action == "utm") {
                                    var ctr = 0;
                                    aq = false;
                                    while (ctr < dL.ba.length && aq === false) {
                                        ctr++;
                                        dL.fx = dL.cC.fromLatLngToPoint(dL.ba[ctr]);
                                        dL.lc = dL.fx.x * dL.bh;
                                        if (dL.lc >= dL.jR) {
                                            aq = true;
                                        }
                                    }
                                    if (aq === false) {} else {
                                        dL.mN = dL.fx.y * dL.bh;
                                        dL.fx = dL.cC.fromLatLngToPoint(dL.ba[ctr - 1]);
                                        dL.im = dL.fx.x * dL.bh;
                                        dL.kv = dL.fx.y * dL.bh;
                                        dL.jJ = (dL.kv - dL.mN) / (dL.im - dL.lc);
                                        dL.nS = dL.kv - (dL.jJ * dL.im);
                                        dL.uo = (dL.jJ * dL.jR) + dL.nS;
                                        J = dL.jR / dL.bh;
                                        F = dL.uo / dL.bh;
                                        dL.ac = dL.cC.fromPointToLatLng(new google.maps.Point(J, F));
                                        if (action == "grid") {
                                            
                                        } else {
                                            dK = "" + j;
                                            aq = dK.length - 5;
                                            bK = dK.substr(0, aq);
                                            aq = dK.slice(-5);
                                            bJ = aq.slice(0, 2);
                                            bN = aq.slice(-3);
                                            dL.aS = "" + bK + "<span style='font-weight:bold; font-size: 15px;'>" + bJ + "</span>" + bN;
                                            dL.fo = dL.gX;
                                            dL.es++;
                                            dL.eL[dL.es] = new cR({
                                                map: dL.map
                                            });
                                        }
                                        dL.eL[dL.es].set('text', dL.aS);
                                        dL.eL[dL.es].set('position', dL.ac);
                                    }
                                }
                            }
                          
                            if (action == "100km") {
                                dL.dm.length = 0;
                                pY = "";
                                for (var k = 0; k < dL.ba.length; k++) {
                                    if (dL.ba[k].show == "yes") {
                                        dL.dm.push(dL.ba[k]);
                                    }
                                    pY += dL.ba[k].show + "_";
                                }
                            }
                        }
                    }
                    if (dL.R > 6 && action == "100km") {
                        if (dL.cT.length != 0) {
                            if (i == 1) {
                                if (dL.cT.length == dL.dm.length) {
                                    gd = 0;
                                    ha = dL.cT.length - 1;
                                    cG = 1;
                                } else if (dL.cT.length - 1 == dL.dm.length) {
                                    gd = 0;
                                    ha = dL.cT.length - 2;
                                    cG = 1;
                                } else {
                                    gd = 1;
                                    ha = dL.cT.length - 2;
                                    cG = 0;
                                }
                            } else if (i == max) {
                                J = Math.abs(dL.cT[0].lng() - dL.cT[1].lng());
                                F = Math.abs(dL.dm[0].lng() - dL.dm[1].lng());
                                if (J < F) {
                                    gd = 1;
                                    ha = dL.cT.length - 1;
                                    cG = 0;
                                } else if (dL.cT.length == dL.dm.length) {
                                    gd = 0;
                                    ha = dL.cT.length - 1;
                                    cG = 1;
                                } else {
                                    gd = 1;
                                    ha = dL.cT.length - 2;
                                    cG = 0;
                                }
                            } else {
                                if (dL.cT.length == dL.dm.length) {
                                    gd = 0;
                                    ha = dL.cT.length - 1;
                                    cG = 1;
                                } else {
                                    gd = 1;
                                    ha = dL.cT.length - 2;
                                    cG = 0;
                                }
                            }
                            for (var m = gd; m < ha; m++) {
                                dL.cC = dL.map.getProjection();
                                dL.bh = Math.pow(2, dL.R);
                                if (dL.cT[m].lat() >= 0) {
                                    aq = dL.tR = dL.cC.fromLatLngToPoint(dL.cT[m]).x * dL.bh;
                                    dL.tC = dL.cC.fromLatLngToPoint(dL.cT[m + 1]).x * dL.bh;
                                } else {
                                    dL.tR = dL.cC.fromLatLngToPoint(dL.dm[m + cG - 1]).x * dL.bh;
                                    dL.tC = dL.cC.fromLatLngToPoint(dL.dm[m + cG]).x * dL.bh;
                                }
                                if (Math.abs(dL.tC - dL.tR) > dL.wr) {
                                    dL.gL = 0;
                                    dL.ci = false;
                                    if (dL.hL.contains(dL.cT[m]) === true) {
                                        dL.gL++;
                                    }
                                    if (dL.hL.contains(dL.cT[m + 1]) === true) {
                                        dL.gL++;
                                    }
                                    if (dL.hL.contains(dL.dm[m + cG - 1]) === true) {
                                        dL.gL++;
                                    }
                                    if (dL.hL.contains(dL.dm[m + cG]) === true) {
                                        dL.gL++;
                                    }
                                    if (dL.gL == 0) {
                                        dL.nF = false;
                                        dL.wd = new google.maps.LatLngBounds(dL.cT[m], dL.dm[m + cG]);
                                        if (dL.hL.intersects(dL.wd) === true) {
                                            dL.nF = true;
                                        }
                                    }
                                    if (dL.gL > 0 || dL.nF === true) {
                                        dL.ac = google.maps.geometry.spherical.interpolate(dL.cT[m], dL.dm[m + cG], 0.5);
                                        if (dL.uV.contains(dL.ac) === false) {
                                            if (dL.gL == 1 || dL.gL == 2 || dL.nF === true) {
                                                dL.cZ = dL.ac.lat();
                                                dL.dN = dL.ac.lng();
                                                dL.ci = false;
                                                if (dL.cZ > dL.mf) {
                                                    aq = dL.cT[m].lat();
                                                    if (dL.cT[m + 1].lat() > dL.cT[m].lat()) {
                                                        aq = dL.cT[m + 1].lat();
                                                    }
                                                    if (aq <= dL.sS) {
                                                        dL.ci = true;
                                                        dL.cZ = dL.mf;
                                                    }
                                                } else if (dL.cZ < dL.nm) {
                                                    aq = dL.dm[m + cG].lat();
                                                    if (dL.dm[m + cG - 1].lat() < dL.dm[m + cG].lat()) {
                                                        aq = dL.dm[m + cG - 1].lat();
                                                    }
                                                    if (aq >= dL.rB) {
                                                        dL.ci = true;
                                                        dL.cZ = dL.nm;
                                                    }
                                                }
                                                if (dL.dN > dL.mh) {
                                                    aq = dL.cT[m].lng();
                                                    if (dL.dm[m + cG - 1].lng() > dL.cT[m].lng()) {
                                                        aq = dL.dm[m + cG - 1].lng();
                                                    }
                                                    if (aq <= dL.sm) {
                                                        dL.ci = true;
                                                        dL.dN = dL.mh;
                                                    }
                                                } else if (dL.dN < dL.lD) {
                                                    aq = dL.cT[m + 1].lng();
                                                    if (dL.dm[m + cG].lng() < dL.cT[m + 1].lng()) {
                                                        aq = dL.dm[m + cG].lng();
                                                    }
                                                    if (aq >= dL.rF) {
                                                        dL.ci = true;
                                                        dL.dN = dL.lD;
                                                    }
                                                }
                                                if (dL.ci === true) {
                                                    dL.te = new google.maps.LatLng(dL.cZ, dL.dN);
                                                }
                                            }
                                        }
                                        aq = dL.uV.contains(dL.ac);
                                        if (dL.gL > 2 || aq === true || dL.ci === true) {
                                            if (dL.ci === true) {
                                                dL.ci = false;
                                                dL.ac = new google.maps.LatLng(dL.cZ, dL.dN);
                                            }
                                            dL.ni++;
                                            dL.lo[dL.ni] = dL.ac;
                                        }
                                    }
                                }
                            }
                        }
                        dK = dL.dm.length;
                        if (dK > 1) {
                            dL.cT.length = 0;
                            for (var m = 0; m < dK; m++) {
                                dL.cT[m] = dL.dm[m];
                            }
                        }
                    }
                }
                dL.jh++;
                if (dL.jh == 61) {
                    dL.jh = 1;
                }
            }
            if (dL.ni > 0) {
                dL.nJ = true;
                dL.fo = dL.wK;
                for (var i = 0; i <= dL.ni; i++) {
                    dL.ia[i] = new cR({
                        map: dL.map
                    });
                    dL.lat = dL.lo[i].lat();
                    dL.lng = dL.lo[i].lng();
                    gD(1);
                    if (isNaN(parseInt(dL.dA.substr(1, 1)))) {
                        aq = dL.dA.substr(2, 2);
                    } else {
                        aq = dL.dA.substr(3, 2);
                    }
                    dL.ia[i].set('text', aq);
                    dL.ia[i].set('position', dL.lo[i]);
                }
            }
            dL.ff = "12466 in grid_4";
          
            if (dL.o != "desktop" && (dL.P == "utm" || dL.P == "usng" || dL.P == "mgrs")) {
               
            }
            dL.ff = "12472 END grid_4";
        };
		
function tM() {
         
            var max = dL.eB.length;
            for (var i = 0; i < max; i++) {
                dL.eB[i].clear();
                google.maps.event.clearListeners(Q[i], 'click');
            }
            if (dL.iZ != undefined) {
                max = dL.iZ.length;
                for (var i = 0; i < max; i++) {
                    dL.iZ[i].clear();
                    google.maps.event.clearListeners(iB[i], 'click');
                }
            }
            dL.eB.length = 0;
            dL.iZ.length = 0;
            var max = dL.en.length;
            for (var i = 0; i < max; i++) {
                dL.en[i].clear();
                google.maps.event.clearListeners(aD[i], 'click');
            }
            if (dL.he != undefined) {
                max = dL.he.length;
                for (var i = 0; i < max; i++) {
                    dL.he[i].clear();
                    google.maps.event.clearListeners(iG[i], 'click');
                }
            }
            dL.en.length = 0;
            dL.he.length = 0;
            dL.ek = "";
         
           
            if (dL.eL != undefined) {
                dL.xG = false;
                var max = dL.eL.length;
                for (var i = 0; i < max; i++) {
                    dL.eL[i].setMap(null);
                }
                dL.eL.length = 0;
                dL.es = -1;
            }
            if (dL.pK != undefined) {
                dL.pK.clear();
            }
            if (dL.qM != undefined) {
                dL.qM.clear();
            }
            dL.ff = "11668 END grid erase";
        };

 function rw(lat, lng) {
            dL.ip = 0;
            if (dL.ep == -180 && lng > 0) {
                dL.ip |= 1;
            } else if (dL.fj == 180 && lng < 0) {
                dL.ip |= 2;
            } else {
                if (lng < dL.ep) {
                    dL.ip |= 1;
                }
                if (lng > dL.fj) {
                    dL.ip |= 2;
                }
            }
        };
          function tp(lat, lng) {
            if (lng < dL.ep || lng > dL.fj) {
                return 0;
            }
            return 1;
        };
           function sC(K, yG, qA) {
            dL.sH = dL.ba.length - 1;
            dL.ba[dL.sH].show = "no";
            for (var aB = 0; aB < dL.sH; aB++) {
                dL.ba[aB].show = "yes";
               var ct = dL.ba[aB].lng();
               var  fO = dL.ba[aB].lat();
               var  eg = dL.ba[aB + 1].lng();
               var kY = dL.ba[aB + 1].lat();
                rw(fO, ct);
                dL.je = dL.ip;
                rw(kY, eg);
                dL.nx = dL.ip;
                if (dL.qq == "ew" && ct >= dL.fj) {
                    if (dL.fj == -174 && ct > 0) {} else if (ct > dL.fj) {
                        dL.ba[aB].show = "no";
                    }
                } else if ((dL.je & dL.nx) != 0) {
                    dL.ba[aB].show = "no";
                } else if ((ct <= dL.ep && eg <= dL.ep) || (ct >= dL.fj && eg >= dL.fj)) {
                    dL.ba[aB].show = "no";
                }
                if ((dL.je | dL.nx) == 0) {} else if (dL.ba[aB].show == "yes") {
                    dL.wq = false;
                    if (tp(fO, ct)) {
                        dL.wq = true;
                       var aq = ct;
                       var ct = eg;
                       var eg = aq;
                        var aq = fO;
                       var  fO = kY;
                       var  kY = aq;
                        var aq = dL.je;
                        dL.je = dL.nx;
                        dL.nx = aq;
                    }
                    dL.cG = 0;
                    if (dL.je & 1) {
                        if (ct > 0 && eg < 0) {
                            aq = ct + (180 - ct) + (180 + eg);
                            dL.kw = ((dL.ep * -1) - ct) / (aq - ct);
                        } else {
                            dL.kw = (dL.ep - ct) / (eg - ct);
                        }
                        fO += dL.kw * (kY - fO);
                        if (dL.ep == -180) {
                            ct = 180;
                        } else {
                            ct = dL.ep;
                        }
                        dL.ba[aB] = new google.maps.LatLng(fO, ct);
                        dL.ba[aB].show = "yes";
                    } else if (dL.je & 2) {
                        if (dL.qq == "ew") {
                            dL.cG = 1;
                            dL.ba[aB].show = "yes";
                        }
                        if (ct < 0 && eg > 0) {
                            aq = ct - (180 + ct) - (180 - eg);
                            dL.kw = ((dL.fj * -1) - ct) / (aq - ct);
                        } else {
                            dL.kw = (dL.fj - ct) / (eg - ct);
                        }
                        fO += dL.kw * (kY - fO);
                        ct = dL.fj;
                        dL.ba[aB + dL.cG] = new google.maps.LatLng(fO, ct);
                        dL.ba[aB + dL.cG].show = "yes";
                    }
                }
            }
            if (dL.ba[aB - 1].show == "no") {
                dL.ba[aB].show = "no";
            }
            if (dL.ba[aB].toUrlValue(6) == dL.ba[aB - 1].toUrlValue(6)) {
                dL.ba[aB].show = "no";
            }
        };

    }})();

