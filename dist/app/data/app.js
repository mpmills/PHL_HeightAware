//>>built
define("require exports esri/Basemap esri/geometry/Extent esri/PopupTemplate esri/geometry/SpatialReference esri/layers/ElevationLayer esri/layers/FeatureLayer esri/layers/GroupLayer esri/layers/TileLayer esri/renderers/SimpleRenderer esri/WebScene".split(" "),function(a,n,p,q,c,d,h,b,e,k,g,r){Object.defineProperty(n,"__esModule",{value:!0});a=new d({wkid:103142});k=new k({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/PHL_Imagery_1ft/MapServer",opacity:.95});h=new h({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/DEM_Merged_2011/ImageServer"});
c=new c({title:"Building  {Name}",content:[{type:"fields",fieldInfos:[{fieldName:"BUILDINGNO",visible:!0,lable:"Building Number"},{fieldName:"STRUCTHGHT",visible:!0,label:"Structure Height"}]}]});c=new b({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/ContextFeatures/FeatureServer/2",title:"Building",spatialReference:a,popupEnabled:!1,popupTemplate:c});c.renderer={type:"unique-value",defaultSymbol:{type:"polygon-3d",symbolLayers:[{type:"extrude",material:{color:"#D3D3D3"},edges:{type:"solid",
color:"#43464b"}}]},defaultLabel:"Building",field:"NAME",uniqueValueInfos:[{value:"Terminal F",symbol:{type:"polygon-3d",symbolLayers:[{type:"extrude",material:{color:"#66c2a5"},edges:{type:"solid",color:"#43464b"}}]},label:"Terminal F"},{value:"Terminal D-E",symbol:{type:"polygon-3d",symbolLayers:[{type:"extrude",material:{color:"#fc8d62"},edges:{type:"solid",color:"#43464b"}}]},label:"Terminal D-E"},{value:"Terminal B-C",symbol:{type:"polygon-3d",symbolLayers:[{type:"extrude",material:{color:"#8da0cb"},
edges:{type:"solid",color:"#43464b"}}]},label:"Terminal B-C"},{value:"Terminal A West",symbol:{type:"polygon-3d",symbolLayers:[{type:"extrude",material:{color:"#e78ac3"},edges:{type:"solid",color:"#43464b"}}]},label:"Terminal A West"},{value:"Terminal A East",symbol:{type:"polygon-3d",symbolLayers:[{type:"extrude",material:{color:"#a6d854"},edges:{type:"solid",color:"#43464b"}}]},label:"Terminal A East"}],visualVariables:[{type:"size",field:"STRUCTHGHT",valueUnit:"feet"}]};d=new b({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/ContextFeatures/FeatureServer/1",
title:"TankSite",spatialReference:a,elevationInfo:{mode:"on-the-ground"},renderer:new g({symbol:{type:"polygon-3d",symbolLayers:[{type:"extrude",material:{color:"#D3D3D3"},edges:{type:"solid",color:"#D3D3D3"}}]},visualVariables:[{type:"size",field:"TOPELEV",valueUnit:"feet"}]})});var f=new b({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/ContextFeatures/FeatureServer/0",title:"Tree",spatialReference:a,legendEnabled:!1,popupEnabled:!1,elevationInfo:{mode:"on-the-ground"},renderer:new g({symbol:{type:"web-style",
name:"Ficus",portal:{url:"https://www.arcgis.com"},styleName:"EsriRealisticTreesStyle"},visualVariables:[{type:"size",field:"ABOVEGROUN",valueUnit:"feet"},{type:"rotation",valueExpression:"random() * 360"}]})});g=new e({id:"ContextGroup",title:"Context Features",visible:!0});g.addMany([d,c,f]);d=new b({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/Surfaces/FeatureServer/11",opacity:.25,title:"Air Operations Area",id:"airoperationsarea",spatialReference:a,renderer:{type:"simple",symbol:{type:"polygon-3d",
symbolLayers:[{type:"fill",material:{color:"#89e9f0"}}]}},elevationInfo:{mode:"on-the-ground"},popupEnabled:!1});f=new b({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/Surfaces/FeatureServer/10",id:"runwayhelipaddesignsurface",title:"Critical 2D Surfaces",opacity:.15,elevationInfo:{mode:"on-the-ground"},spatialReference:a,popupEnabled:!1,visible:!0,definitionExpression:"OBJECTID IS NULL"});c=new e({id:"critical_2d",title:"2D Critical Surfaces",visible:!0});c.addMany([d,f]);var f=new b({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/Surfaces/FeatureServer/6",
title:"TERPS",id:"terps",opacity:1,visible:!0,spatialReference:a,elevationInfo:{mode:"absolute-height"},returnZ:!0,popupEnabled:!1,definitionExpression:"OBJECTID IS NULL"}),l=new b({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/Surfaces/FeatureServer/7",title:"Departure",id:"departure",opacity:1,visible:!0,spatialReference:a,elevationInfo:{mode:"absolute-height"},returnZ:!0,popupEnabled:!1,definitionExpression:"OBJECTID IS NULL"}),m=new b({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/Surfaces/FeatureServer/8",
title:"OEI",id:"oei",opacity:1,visible:!0,spatialReference:a,elevationInfo:{mode:"absolute-height"},returnZ:!0,popupEnabled:!1,definitionExpression:"OBJECTID IS NULL"});d=new e({id:"critical_3d",title:"3D Critical Surfaces",visible:!1});d.addMany([m,l,f]);f=new b({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/Surfaces/FeatureServer/1",title:"Transitional",id:"transitional",opacity:1,visible:!0,spatialReference:a,elevationInfo:{mode:"absolute-height"},returnZ:!0,popupEnabled:!1,definitionExpression:"OBJECTID IS NULL"});
l=new b({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/Surfaces/FeatureServer/2",title:"Approach",id:"approach",opacity:1,visible:!1,spatialReference:a,elevationInfo:{mode:"absolute-height"},returnZ:!0,popupEnabled:!1,definitionExpression:"OBJECTID IS NULL"});m=new b({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/Surfaces/FeatureServer/3",title:"Horizontal",id:"horizontal",opacity:1,visible:!1,spatialReference:a,elevationInfo:{mode:"absolute-height"},returnZ:!0,popupEnabled:!1,
definitionExpression:"OBJECTID IS NULL"});b=new b({url:"http://gis.aroraengineers.com/arcgis/rest/services/PHL/Surfaces/FeatureServer/4",title:"Conical",id:"conical",opacity:1,visible:!0,spatialReference:a,elevationInfo:{mode:"absolute-height"},returnZ:!0,popupEnabled:!1,definitionExpression:"OBJECTID IS NULL"});e=new e({id:"part_77_group",title:"Part 77 3D Surfaces",visible:!1});e.addMany([l,f,m,b]);n.scene=new r({basemap:new p({baseLayers:[k]}),ground:{layers:[h]},clippingEnabled:!0,clippingArea:new q({xmax:2739534.7447781414,
ymax:268804.0899403095,xmin:2606408.7447781414,ymin:156304.08994030952,spatialReference:a}),layers:[c,d,e,g]})});