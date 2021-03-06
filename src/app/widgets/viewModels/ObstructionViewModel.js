var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/widgets/support/widget", "esri/core/Accessor", "esri/core/watchUtils", "esri/Graphic", "esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters", "esri/geometry/SpatialReference", "esri/layers/support/LabelClass", "esri/layers/FeatureLayer", "esri/renderers/SimpleRenderer", "esri/symbols/PolygonSymbol3D", "esri/geometry/Point", "esri/geometry/geometryEngine", "esri/geometry/Polyline", "esri/tasks/support/Query", "dojo/_base/array", "dojo/dom-class", "dojo/promise/all", "dojo/Deferred", "esri/core/accessorSupport/decorators"], function (require, exports, __extends, __decorate, widget_1, Accessor, watchUtils_1, Graphic, IdentifyTask, IdentifyParameters, SpatialReference, LabelClass, FeatureLayer, SimpleRenderer, PolygonSymbol3D, Point, geometryEngine, Polyline, Query, Array, domClass, all, Deferred, decorators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CEPCT = "http://gis.aroraengineers.com/arcgis/rest/services/PHL/Surfaces/MapServer";
    var sr = new SpatialReference({
        wkid: 103142
    });
    var intersectionMarker = {
        type: "web-style",
        styleName: "EsriThematicShapesStyle",
        name: "Centered Sphere"
    };
    var intersectionGraphic = new Graphic({
        symbol: intersectionMarker
    });
    var intersectionLabelClass = new LabelClass({
        labelExpressionInfo: { expression: "$feature.surfaceName" },
        labelPlacement: "above-after",
        symbol: {
            type: "text",
            color: "black",
            haloSize: 1,
            haloColor: "white"
        }
    });
    var intersection_layer = new FeatureLayer({
        id: "surface_intersection",
        title: "Surface Intersection Point",
        visible: false,
        fields: [
            {
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid"
            },
            {
                name: "surfaceName",
                alias: "Surface Name",
                type: "text"
            }
        ],
        objectIdField: "ObjectID",
        geometryType: "point",
        spatialReference: sr,
        elevationInfo: {
            mode: "absolute-height"
        },
        source: [],
        legendEnabled: false,
        renderer: {
            type: "simple",
            symbol: intersectionMarker
        },
        labelingInfo: [intersectionLabelClass],
        labelsVisible: false,
        popupEnabled: true
    });
    var pointerTracker = new Graphic({
        symbol: {
            type: "point-3d",
            symbolLayers: [{
                    type: "object",
                    width: 5,
                    height: 100,
                    depth: 5,
                    resource: { primitive: "cylinder" },
                    material: { color: "blue" }
                }]
        }
    });
    var obstruction_base = new FeatureLayer({
        id: "obstruction_base",
        title: "Placed Obstruction",
        opacity: .50,
        fields: [
            {
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid"
            }, {
                name: "baseElevation",
                alias: "Base Elevation",
                type: "double"
            }, {
                name: "obstacleHeight",
                alias: "Obstacle Height",
                type: "double"
            }
        ],
        objectIdField: "ObjectID",
        geometryType: "polygon",
        spatialReference: sr,
        elevationInfo: {
            mode: "on-the-ground"
        },
        source: [],
        legendEnabled: false,
        renderer: new SimpleRenderer({
            symbol: new PolygonSymbol3D({
                symbolLayers: [{
                        type: "extrude",
                        width: 5,
                        depth: 5,
                        resource: { primitive: "cylinder" },
                        material: { color: "blue" }
                    }]
            }),
            visualVariables: [{
                    type: "size",
                    field: "obstacleHeight",
                    valueUnit: "feet"
                }]
        })
    });
    var ObstructionViewModel = (function (_super) {
        __extends(ObstructionViewModel, _super);
        function ObstructionViewModel(params) {
            var _this = _super.call(this, params) || this;
            watchUtils_1.whenOnce(_this, "view").then(_this.onload.bind(_this));
            return _this;
        }
        ObstructionViewModel.prototype.toggleActivation = function (event) {
            domClass.toggle(event.srcElement, "btn-clear");
            if (!this.activated) {
                this.activated = true;
            }
            else {
                this.activated = false;
            }
        };
        ObstructionViewModel.prototype.clearLayers = function () {
            var crit_3d = this.scene.findLayerById("critical_3d");
            var part77 = this.scene.findLayerById("part_77_group");
            var crit_2d = this.scene.findLayerById("critical_2d_surfaces");
            var intersect_points = this.scene.findLayerById("surface_intersection");
            if (crit_3d) {
                crit_3d.visible = false;
                crit_3d.layers.forEach(function (layer) {
                    layer.definitionExpression = "OBJECTID IS NULL";
                    layer.visible = false;
                });
            }
            if (part77) {
                part77.visible = false;
                part77.layers.forEach(function (layer) {
                    layer.definitionExpression = "OBJECTID IS NULL";
                    layer.visible = false;
                });
            }
            if (intersect_points) {
                intersect_points.source.removeAll();
                this.scene.remove(intersect_points);
            }
            if (crit_2d) {
                crit_2d.visible = false;
                crit_2d.definitionExpression = "OBJECTID IS NULL";
            }
            if (this.results.highlight2d) {
                this.results.highlight2d.remove();
            }
        };
        ObstructionViewModel.prototype.activate = function () {
            var _this = this;
            this.clearLayers();
            if (this.ccWidget) {
                this.ccWidget.mode = "live";
            }
            this.disableSubmitPanel();
            var ground_node = document.getElementById("groundLevel");
            var obsHeight_node = document.getElementById("obsHeight");
            var mouse_track = this.mouse_track = this.view.on("pointer-move", function (e) {
                var map_pnt = _this.view.toMap({
                    x: e.x,
                    y: e.y
                });
                if (map_pnt) {
                    _this.scene.ground.queryElevation(map_pnt).then(function (result) {
                        var _z = result.geometry.z;
                        ground_node.value = _z.toFixed(2);
                    });
                }
            });
            var view_click = this.view_click = this.view.on("click", function (e) {
                _this.activated = false;
                e.stopPropagation();
                if (e && e.mapPoint) {
                    _this.modifiedBase = false;
                    _this.scene.ground.queryElevation(e.mapPoint).then(function (result) {
                        var _x = result.geometry.x;
                        var _y = result.geometry.y;
                        var _z = result.geometry.z;
                        _this.demGroundElevation = _z;
                        _this.submit(new Point({
                            x: _x,
                            y: _y,
                            z: _z
                        })).then(function (arr) {
                            _this.enableSubmitPanel();
                        });
                    });
                }
            });
        };
        ObstructionViewModel.prototype.disableSubmitPanel = function () {
            var submit_btn = document.getElementById("obs_submit");
            domClass.add(submit_btn, "btn-disabled");
        };
        ObstructionViewModel.prototype.enableSubmitPanel = function () {
            var submit_btn = document.getElementById("obs_submit");
            domClass.remove(submit_btn, "btn-disabled");
        };
        ObstructionViewModel.prototype.deactivate = function () {
            if (this.mouse_track) {
                this.mouse_track.remove();
            }
            if (this.view_click) {
                this.view_click.remove();
            }
            if (this.ccWidget) {
                this.ccWidget.mode = "capture";
            }
        };
        ObstructionViewModel.prototype.submit = function (point) {
            var main_deferred = new Deferred();
            var obsHeight = document.getElementById("obsHeight");
            var y_fixed = point.y.toFixed(2);
            this.y_coordinate = parseFloat(y_fixed);
            var x_fixed = point.x.toFixed(2);
            this.x_coordinate = parseFloat(x_fixed);
            var height = parseFloat(obsHeight.value);
            if (!height) {
                if (this.modifiedBase) {
                    height = 200 - this.userGroundElevation;
                }
                else {
                    height = 200 - this.demGroundElevation;
                }
                obsHeight.value = height.toFixed(2);
            }
            this.obstructionHeight = parseFloat(parseFloat(obsHeight.value).toFixed(2));
            var graphic = this.addObstructionGraphic(point.x, point.y, point.z, this.obstructionHeight);
            this.performQuery(graphic).then(function (arr) {
                main_deferred.resolve(arr);
            });
            return main_deferred.promise;
        };
        ObstructionViewModel.prototype.addObstructionGraphic = function (_x, _y, _z, _height) {
            var pnt = new Point({
                x: _x,
                y: _y,
                z: _z,
                spatialReference: sr
            });
            var ptBuff = geometryEngine.buffer(pnt, 25, "feet");
            var obstHeight = _height;
            if (this.modifiedBase) {
                var diff = this.userGroundElevation - this.demGroundElevation;
                obstHeight = _height + diff;
            }
            var graphic = new Graphic();
            graphic.attributes = {
                "ObjectID": 0,
                "baseElevation": _z,
                "obstacleHeight": obstHeight
            };
            graphic.geometry = ptBuff;
            graphic.geometry.spatialReference = sr;
            obstruction_base.source.removeAll();
            obstruction_base.source.add(graphic);
            this.scene.add(obstruction_base);
            this.scene.add(intersection_layer);
            return graphic;
        };
        ObstructionViewModel.prototype.performQuery = function (_graphic) {
            var _this = this;
            var main_deferred = new Deferred();
            var first_deferred = new Deferred();
            var second_deferred = new Deferred();
            var _z = _graphic.attributes.baseElevation;
            var _agl = _graphic.attributes.obstacleHeight;
            var polygon = _graphic.geometry;
            var _x = polygon.centroid.x;
            var _y = polygon.centroid.y;
            var line = new Polyline({
                paths: [[
                        [_x, _y, _z],
                        [_x + 1, _y + 1, _agl]
                    ]],
                spatialReference: sr,
                hasZ: true
            });
            var promise = this.doIdentify(_x, _y);
            promise.then(function (response) {
                if (response) {
                    var obstructionSettings = _this.buildObstructionSettings(response);
                    var ground_elevation = void 0;
                    var elevation_change = void 0;
                    if (!_this.modifiedBase) {
                        var groundElevation = obstructionSettings.ground_elevation;
                        if (groundElevation !== _this.demGroundElevation) {
                            console.log("ground elevation in buildObstructionSettings not completed properly");
                        }
                        var input = document.getElementById("groundLevel");
                        input.value = groundElevation.toFixed(2);
                        ground_elevation = groundElevation;
                    }
                    else {
                        if (_this.userGroundElevation) {
                            ground_elevation = _this.userGroundElevation;
                            elevation_change = ground_elevation - _this.demGroundElevation;
                        }
                        else {
                            console.log("user ground elevation not set with a modified Base");
                        }
                    }
                    var _msl = Number((ground_elevation + _agl).toFixed(2));
                    _agl = Number(_agl.toFixed(2));
                    _x = Number(_x.toFixed(2));
                    _y = Number(_y.toFixed(2));
                    var params = {
                        x: _x,
                        y: _y,
                        msl: _msl,
                        agl: _agl,
                        modifiedBase: _this.modifiedBase,
                        layerResults3d: obstructionSettings.layerResults3d,
                        layerResults2d: obstructionSettings.layerResults2d,
                        ground_elevation: ground_elevation,
                        elevation_change: elevation_change,
                        dem_source: obstructionSettings.dem_source
                    };
                    second_deferred.resolve(params);
                }
                else {
                    console.log("No results from server :: " + response);
                    second_deferred.resolve(false);
                }
            });
            this.querySurfaces(line).then(function () {
                _this.view.whenLayerView(obstruction_base).then(function (lyrView) {
                    lyrView.highlight(_graphic);
                    _this.view.goTo(_graphic.geometry.extent.center);
                    var layerVisibilityModel = _this.createDefault3DLayerVisibility();
                    first_deferred.resolve(layerVisibilityModel);
                });
            });
            all([first_deferred, second_deferred]).then(function (arr) {
                var _layerVisibilityModel = arr[0];
                var _result_params = arr[1];
                var layerResults3d = _result_params.layerResults3d;
                var features = layerResults3d.features;
                var name;
                var count = 0;
                features.forEach(function (feat) {
                    var feat_name = feat.attributes.layerName.toLowerCase();
                    if (feat_name !== name) {
                        name = feat_name;
                        _layerVisibilityModel.some(function (obj) {
                            if (obj.id.toLowerCase() === name) {
                                obj.order = count;
                                count += 1;
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                    }
                });
                _layerVisibilityModel.sort(function (leftSide, rightSide) {
                    if (leftSide.order < rightSide.order) {
                        return -1;
                    }
                    if (leftSide.order > rightSide.order) {
                        return 1;
                    }
                    return 0;
                });
                _this.layerVisibility = _layerVisibilityModel;
                _this.results.defaultLayerVisibility = _layerVisibilityModel;
                ;
                _this.results.set(_result_params);
                _this.results.expand.expand();
                main_deferred.resolve(arr);
            });
            return main_deferred.promise;
        };
        ObstructionViewModel.prototype.submitPanel = function (event) {
            var obsHeight = document.getElementById("obsHeight");
            var groundLevel = document.getElementById("groundLevel");
            this.clearLayers();
            var base_level = parseFloat(parseFloat(groundLevel.value).toFixed(2));
            this.userGroundElevation = base_level;
            if (this.userGroundElevation !== this.demGroundElevation) {
                this.modifiedBase = true;
            }
            else {
                if (this.modifiedBase) {
                    console.log("the base has already been modified once");
                    this.modifiedBase = false;
                }
                else {
                    this.modifiedBase = false;
                }
            }
            var _x = this.x_coordinate;
            var _y = this.y_coordinate;
            var _z = this.userGroundElevation;
            var panelPoint = new Point({
                x: _x,
                y: _y,
                z: _z,
                spatialReference: sr
            });
            this.submit(panelPoint);
        };
        ObstructionViewModel.prototype.querySurfaces = function (vertical_line) {
            var _this = this;
            var map = this.scene;
            var main_deferred = new Deferred();
            var first = new Deferred();
            var second = new Deferred();
            var third = new Deferred();
            var crit_3d = map.findLayerById("critical_3d");
            var crit_3d_layers = crit_3d.layers;
            var part77 = map.findLayerById("part_77_group");
            var part77_layers = part77.layers;
            var crit_2d_layer = map.findLayerById("runwayhelipaddesignsurface");
            function isFalse(element, index, array) {
                if (!element) {
                    return true;
                }
                else {
                    return false;
                }
            }
            var query = new Query({
                geometry: vertical_line,
                units: "feet",
                spatialRelationship: "intersects",
                returnGeometry: true,
                outFields: ["*"],
                returnZ: true
            });
            var viz = Array.map(crit_3d_layers.items, function (lyr) {
                var deferred = new Deferred();
                lyr.queryFeatures(query).then(function (e) {
                    if (e.features.length) {
                        var oids = e.features.map(function (value) {
                            return value.attributes["OBJECTID"];
                        });
                        if (oids.length > 1) {
                            lyr.definitionExpression = "OBJECTID IN (" + oids.join() + ")";
                            lyr.visible = true;
                        }
                        else if (oids.length === 1 && oids[0] !== undefined) {
                            lyr.definitionExpression = "OBJECTID = " + oids[0];
                            lyr.visible = true;
                        }
                        else {
                            lyr.definitionExpression = "OBJECTID IS NULL";
                            lyr.visible = false;
                        }
                        deferred.resolve(oids);
                    }
                    else {
                        lyr.definitionExpression = "OBJECTID IS NULL";
                        lyr.visible = false;
                        deferred.resolve(false);
                    }
                    _this.results.viewModel.set3DSymbols(lyr, false);
                }, function (err) {
                    console.log(err);
                    crit_3d.visible = false;
                    deferred.resolve(false);
                });
                return deferred.promise;
            });
            all(viz).then(function (e) {
                if (e.every(isFalse)) {
                    crit_3d.visible = false;
                    first.resolve(false);
                }
                else {
                    crit_3d.visible = true;
                    first.resolve(true);
                }
            });
            var viz2 = Array.map(part77_layers.items, function (lyr) {
                var deferred = new Deferred();
                lyr.queryFeatures(query).then(function (e) {
                    if (e.features.length) {
                        var oids = e.features.map(function (value) {
                            return value.attributes["OBJECTID"];
                        });
                        if (oids) {
                            if (oids.length > 1) {
                                lyr.definitionExpression = "OBJECTID IN (" + oids.join() + ")";
                                lyr.visible = true;
                            }
                            else if (oids.length === 1 && oids[0] !== undefined) {
                                lyr.definitionExpression = "OBJECTID = " + oids[0];
                                lyr.visible = true;
                            }
                            else {
                                lyr.definitionExpression = "OBJECTID IS NULL";
                                lyr.visible = false;
                            }
                            deferred.resolve(oids);
                        }
                        else {
                            lyr.definitionExpression = "OBJECTID IS NULL";
                            lyr.visible = false;
                            deferred.resolve(false);
                        }
                    }
                    else {
                        lyr.definitionExpression = "OBJECTID IS NULL";
                        lyr.visible = false;
                        deferred.resolve(false);
                    }
                    _this.results.viewModel.set3DSymbols(lyr, false);
                }, function (err) {
                    console.log(err);
                    part77.visible = false;
                    deferred.resolve(false);
                });
                return deferred.promise;
            });
            all(viz2).then(function (e) {
                if (e.every(isFalse)) {
                    part77.visible = false;
                    second.resolve(false);
                }
                else {
                    part77.visible = true;
                    second.resolve(true);
                }
            });
            crit_2d_layer.queryFeatures(query).then(function (e) {
                if (e.features.length) {
                    var oids = e.features.map(function (obj) {
                        return obj.attributes["OBJECTID"];
                    });
                    crit_2d_layer.definitionExpression = "OBJECTID IN (" + oids.join() + ")";
                    crit_2d_layer.visible = true;
                    third.resolve(true);
                }
                else {
                    crit_2d_layer.definitionExpression = "OBJECTID IS NULL";
                    crit_2d_layer.visible = false;
                    third.resolve(false);
                }
            }, function (err) {
                console.log(err);
                crit_2d_layer.visible = false;
                third.resolve(false);
            });
            all([first, second, third]).then(function (e) {
                if (e[0] || e[1] || e[2]) {
                    main_deferred.resolve(true);
                }
                else {
                    main_deferred.resolve(false);
                }
            });
            return main_deferred.promise;
        };
        ObstructionViewModel.prototype.doIdentify = function (x, y) {
            var map = this.scene;
            var view = this.view;
            var deferred = new Deferred();
            var x_coord = x;
            var y_coord = y;
            var idTask = new IdentifyTask({
                url: CEPCT
            });
            var idParams = new IdentifyParameters();
            idParams.tolerance = 1;
            idParams.returnGeometry = true;
            idParams.layerOption = "all";
            idParams.mapExtent = view.extent;
            idParams.geometry = new Point({
                x: x_coord,
                y: y_coord,
                spatialReference: sr
            });
            idTask.execute(idParams).then(function (response) {
                var results = response.results;
                console.log(results);
                deferred.resolve(results);
            }, function (err) {
                console.log(err);
            });
            return deferred.promise;
        };
        ObstructionViewModel.prototype.createDefault3DLayerVisibility = function () {
            var _this = this;
            var i = 0;
            var layerViz = [];
            var group_layers = ["critical_3d", "part_77_group"];
            group_layers.forEach(function (layer_id) {
                var group_layer = _this.scene.findLayerById(layer_id);
                group_layer.layers.forEach(function (lyr) {
                    if (lyr.type === "feature") {
                        if (lyr.visible) {
                            var default_visibility = {
                                id: lyr.id,
                                def_visible: lyr.visible,
                                def_exp: lyr.definitionExpression,
                                order: 0
                            };
                            if (!i) {
                                layerViz = [default_visibility];
                                i += 1;
                            }
                            else {
                                if (layerViz.length) {
                                    layerViz.push(default_visibility);
                                }
                            }
                        }
                    }
                });
            });
            return layerViz;
        };
        ObstructionViewModel.prototype.buildObstructionSettings = function (idResults) {
            var features_3d = [];
            var features_2d = [];
            var server_dem_bool = false;
            for (var i = 0, il = idResults.length; i < il; i++) {
                var idResult = idResults[i];
                var whichRaster = void 0;
                var b = void 0;
                var bl = void 0;
                if ([1, 2, 3, 4, 6, 7, 8].indexOf(idResult.layerId) !== -1) {
                    var name_1 = idResult.feature.attributes.Name;
                    var rnwy_designator = idResult.feature.attributes["Runway Designator"].replace("/", "_");
                    var objectID = idResult.feature.attributes.OBJECTID;
                    var feat = idResult.feature.clone();
                    feat.attributes.layerName = idResult.layerName;
                    feat.attributes.Elev = undefined;
                    var runway = idResult.feature.attributes["Runway Designator"];
                    if (runway === "Null") {
                        feat.attributes["Runway Designator"] = "n/a";
                    }
                    whichRaster = name_1 + "_" + rnwy_designator + "_" + objectID;
                    for (b = 0, bl = idResults.length; b < bl; b++) {
                        if (idResults[b].layerName === whichRaster) {
                            var pixel_value = idResults[b].feature.attributes["Pixel Value"];
                            if (pixel_value === "NoData") {
                                console.log(whichRaster);
                            }
                            else {
                                var point_elev = parseFloat(pixel_value).toFixed(1);
                                feat.attributes.Elev = parseFloat(point_elev);
                                features_3d.push(feat);
                            }
                        }
                    }
                }
                if ([10, 11].indexOf(idResult.layerId) !== -1) {
                    var feat = idResult.feature.clone();
                    feat.attributes.layerName = idResult.layerName;
                    features_2d.push(feat);
                }
                if (idResult.layerId === 82) {
                    var raster_val = idResult.feature.attributes["Pixel Value"];
                    if (!this.modifiedBase) {
                        if (raster_val === "NoData") {
                            server_dem_bool = false;
                        }
                        else {
                            this.demGroundElevation = parseFloat(parseFloat(raster_val).toFixed(2));
                            server_dem_bool = true;
                        }
                    }
                    else {
                        server_dem_bool = false;
                    }
                }
            }
            var sorted_array = features_3d.splice(0);
            sorted_array.sort(function (leftSide, rightSide) {
                if (leftSide.attributes.Elev < rightSide.attributes.Elev) {
                    return -1;
                }
                if (leftSide.attributes.Elev > rightSide.attributes.Elev) {
                    return 1;
                }
                return 0;
            });
            var Results3d = {
                displayFieldName: "Name",
                features: sorted_array
            };
            var Results2d = {
                displayFieldName: "Name",
                features: features_2d
            };
            var dem_source;
            if (server_dem_bool) {
                dem_source = "PHL DEM";
            }
            else {
                if (this.modifiedBase) {
                    dem_source = "Manual Override";
                }
                else {
                    dem_source = "USGS DEM";
                }
            }
            var settings = {
                layerResults2d: Results2d,
                layerResults3d: Results3d,
                dem_source: dem_source,
                ground_elevation: this.demGroundElevation
            };
            return settings;
        };
        ObstructionViewModel.prototype.onload = function () {
        };
        __decorate([
            decorators_1.property()
        ], ObstructionViewModel.prototype, "scene", void 0);
        __decorate([
            decorators_1.property()
        ], ObstructionViewModel.prototype, "view", void 0);
        __decorate([
            widget_1.renderable(),
            decorators_1.property()
        ], ObstructionViewModel.prototype, "name", void 0);
        __decorate([
            widget_1.renderable(),
            decorators_1.property()
        ], ObstructionViewModel.prototype, "demGroundElevation", void 0);
        __decorate([
            widget_1.renderable(),
            decorators_1.property()
        ], ObstructionViewModel.prototype, "userGroundElevation", void 0);
        __decorate([
            decorators_1.property()
        ], ObstructionViewModel.prototype, "obstructionHeight", void 0);
        __decorate([
            decorators_1.property()
        ], ObstructionViewModel.prototype, "x_coordinate", void 0);
        __decorate([
            decorators_1.property()
        ], ObstructionViewModel.prototype, "y_coordinate", void 0);
        __decorate([
            decorators_1.property()
        ], ObstructionViewModel.prototype, "activated", void 0);
        __decorate([
            decorators_1.property()
        ], ObstructionViewModel.prototype, "layerVisibility", void 0);
        __decorate([
            decorators_1.property()
        ], ObstructionViewModel.prototype, "modifiedBase", void 0);
        __decorate([
            decorators_1.property()
        ], ObstructionViewModel.prototype, "ccWidget", void 0);
        __decorate([
            decorators_1.property()
        ], ObstructionViewModel.prototype, "results", void 0);
        __decorate([
            decorators_1.property()
        ], ObstructionViewModel.prototype, "mouse_track", void 0);
        __decorate([
            decorators_1.property()
        ], ObstructionViewModel.prototype, "view_click", void 0);
        ObstructionViewModel = __decorate([
            decorators_1.subclass("widgets.App.ObstructionViewModel")
        ], ObstructionViewModel);
        return ObstructionViewModel;
    }(decorators_1.declared(Accessor)));
    exports.default = ObstructionViewModel;
});
//# sourceMappingURL=ObstructionViewModel.js.map