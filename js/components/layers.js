import {Tile as TileLayer, Vector as VectorLayer, VectorTile as VectorTileLayer, Image, Group } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import GeoJSON from 'ol/format/GeoJSON';
import TileJSON from 'ol/source/TileJSON.js';
import OSM from 'ol/source/OSM';
import MVT from 'ol/format/MVT.js';
import {Fill, Stroke, Icon, Style, Text, Circle} from 'ol/style';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileWMS from 'ol/source/TileWMS.js';
import ImageWMS from 'ol/source/ImageWMS.js';


var styles  = require('../appearence/styles');
var fun = require('./functions');
var colorbrewer = require('colorbrewer');

// var styles = require('./styles.js');

var epsg = 4326;

// var host = "localhost:8080/geoserver";
// var host = "autolab.geogr.msu.ru/public/geoserver";
var host = "http://93.180.9.222/geoserver";


var gridNames = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];

var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];

function vt_source(host, name, epsg = 4326){
  return new VectorTileSource({
    format: new MVT(),
    url: `${host}/gwc/service/tms/1.0.0/${name}@EPSG%3A${epsg}@pbf/{z}/{x}/{-y}.pbf`
  })
}

function vector_source(host, name, epsg = 4326){
  return new VectorSource({
    format: new GeoJSON(),
    url: `${host}/wavenergy/ows?service=wfs&version=1.1.0&request=GetFeature&typename=${name}&outputFormat=application/json&srsname=EPSG:${epsg}`
  });
}

var bnd_lyr = new VectorLayer({
   style: new Style({
     stroke: new Stroke({
       color: '#888888',
       width: 0.5
     })
   }),
   source: vector_source(host, 'wavenergy:ne_10m_admin_0_countries')
})

var geo_lines = new VectorLayer({
    style: new Style({
      stroke: new Stroke({
        color: '#888888',
        width: 0.5,
        lineDash: [1, 5]
      })
    }),
    source: vector_source(host, 'wavenergy:ne_10m_geographic_lines')
 })


var world_lyr = new VectorLayer({
   style: new Style({
      fill: new Fill({
        color: '#AAAAAA'
      })
    }),
   source: vector_source(host, 'general:world')
})

var land_lyr = new VectorLayer({
  style: new Style({
    fill: new Fill({
      color: '#FFFFFF'
    }),
    stroke: new Stroke({
      color: '#e6e6e6',
      width: 0.5
    })
  }),
  source: vector_source(host, 'wavenergy:admin0', epsg)
})

var coast_lyr = new VectorLayer({
 style: new Style({
   stroke: new Stroke({
     color: '#000000',
     width: 0.5
   })
 }),
 source: vector_source(host, 'wavenergy:ne_10m_coastline', epsg),
})


/*Значительная высота волны
        Large scale*/

var hs_lyr_group1 = new Group({
  combine: true,
  visible: true,
  minZoom: 7,
  title: 'Значительная высота волны',
  name: 'hs',
  layers: [
    new VectorLayer({
     style: function(feature, resolution) {
      var z = feature.get('z_mean');
      return new Style({
         fill: new Fill({
           color: fun.get_color(colorbrewer.RdPu, z, 0, 18, 1)
         })
       })
     },
     source: vector_source(host, 'wavenergy:hs_band_big', epsg)
    }),
    new VectorLayer({
     style: styles.cont_style,
     source: vector_source(host, 'wavenergy:hs_iso_big', epsg)
    }),
    new VectorLayer({
     declutter: true,
     style: styles.cont_label_style,
     source: vector_source(host, 'wavenergy:hs_iso_big', epsg)
    }),
    new VectorLayer({
     style: function(feature, resolution) {
      var z = feature.get('z_mean');
      return new Style({
         fill: new Fill({
           color: fun.get_color(colorbrewer.RdPu, z, 0, 18, 1)
         })
       })
     },
     source: vector_source(host, 'wavenergy:azov_10_hsig_plg', epsg)
    }),
    new VectorLayer({
     style: styles.cont_style,
     source: vector_source(host, 'wavenergy:azov_10_hsig_iso', epsg)
    }),
    new VectorLayer({
     declutter: true,
     style: styles.cont_label_style,
     source: vector_source(host, 'wavenergy:azov_10_hsig_iso', epsg)
    }),
      new VectorLayer({
     style: function(feature, resolution) {
      var z = feature.get('z_mean');
      return new Style({
         fill: new Fill({
           color: fun.get_color(colorbrewer.RdPu, z, 0, 18, 1)
         })
       })
     },
     source: vector_source(host, 'wavenergy:maxs_02_50_plg_ws', epsg)
    }),
    new VectorLayer({
     style: styles.cont_style,
     source: vector_source(host, 'wavenergy:maxs_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
     declutter: true,
     style: styles.cont_label_style,
     source: vector_source(host, 'wavenergy:maxs_02_50_iso_ws', epsg)
    })
  ]
})



/*Значительная высота волны
        Middle scale*/

var hs_lyr_group2 = new Group({
  combine: true,
  visible: true,
  maxZoom: 7,
  minZoom: 4,
  title: 'Значительная высота волны',
  name: 'hs',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
      var z = feature.get('z_mean');
      return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.RdPu, z, 0, 20, 2)
          })
        })
      },
      source: vector_source(host, 'wavenergy:hs_band_big', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_middle,
      source: vector_source(host, 'wavenergy:hs_iso_big', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_middle,
      source: vector_source(host, 'wavenergy:hs_iso_big', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
      var z = feature.get('z_mean');
      return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.RdPu, z, 0, 20, 2)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_hsig_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_middle,
      source: vector_source(host, 'wavenergy:azov_10_hsig_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_middle,
      source: vector_source(host, 'wavenergy:azov_10_hsig_iso', epsg)
    }),
      new VectorLayer({
      style: function(feature, resolution) {
      var z = feature.get('z_mean');
      return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.RdPu, z, 0, 20, 2)
          })
        })
      },
      source: vector_source(host, 'wavenergy:maxs_02_50_plg_ws', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_middle,
      source: vector_source(host, 'wavenergy:maxs_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_middle,
      source: vector_source(host, 'wavenergy:maxs_02_50_iso_ws', epsg)
    })
  ]
})


/*Значительная высота волны
        Small scale*/

var hs_lyr_group3 = new Group({
  combine: true,
  visible: true,
  maxZoom: 4,
  title: 'Значительная высота волны',
  name: 'hs',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
      var z = feature.get('z_mean');
      return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.RdPu, z, 0, 20, 4)
          })
        })
      },
      source: vector_source(host, 'wavenergy:hs_band_big', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_small,
      source: vector_source(host, 'wavenergy:hs_iso_big', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_small,
      source: vector_source(host, 'wavenergy:hs_iso_big', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
      var z = feature.get('z_mean');
      return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.RdPu, z, 0, 20, 4)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_hsig_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_small,
      source: vector_source(host, 'wavenergy:azov_10_hsig_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_small,
      source: vector_source(host, 'wavenergy:azov_10_hsig_iso', epsg)
    }),
      new VectorLayer({
      style: function(feature, resolution) {
      var z = feature.get('z_mean');
      return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.RdPu, z, 0, 20, 4)
          })
        })
      },
      source: vector_source(host, 'wavenergy:maxs_02_50_plg_ws', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_small,
      source: vector_source(host, 'wavenergy:maxs_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_small,
      source: vector_source(host, 'wavenergy:maxs_02_50_iso_ws', epsg)
    })
  ]
})

/*Максимальная высота волны
        Large scale*/

var h3p_lyr_group1 = new Group({
  combine: true,
  visible: true,
  title: 'Значительная высота волны',
  name: 'h3p',
  minZoom: 7,
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuRd, z, 0, 26, 2)
          })
        })
      },
      source: vector_source(host, 'wavenergy:h3p_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:h3p_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:h3p_cont', epsg)
    }),
     new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuRd, z, 0, 26, 2)
          })
        })
      },
      source: vector_source(host, 'wavenergy:dv_h1p_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:dv_h1p_ln', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:dv_h1p_ln', epsg)
    })
  ]
});


/*Максимальная высота волны
        Middle scale*/

var h3p_lyr_group2 = new Group({
  combine: true,
  visible: true,
  title: 'Значительная высота волны',
  name: 'h3p',
  maxZoom: 7,
  minZoom: 4,
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuRd, z, 0, 28, 4)
          })
        })
      },
      source: vector_source(host, 'wavenergy:h3p_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_middle,
      source: vector_source(host, 'wavenergy:h3p_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_middle,
      source: vector_source(host, 'wavenergy:h3p_cont', epsg)
    }),
      new VectorLayer({
      style: function(feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuRd, z, 0, 28, 4)
          })
        })
      },
      source: vector_source(host, 'wavenergy:dv_h1p_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_middle,
      source: vector_source(host, 'wavenergy:dv_h1p_ln', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_middle,
      source: vector_source(host, 'wavenergy:dv_h1p_ln', epsg)
    })
  ]
});



/*Максимальная высота волны
        Small scale*/

var h3p_lyr_group3 = new Group({
  combine: true,
  visible: true,
  title: 'Значительная высота волны',
  name: 'h3p',
  maxZoom: 4,
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuRd, z, 0, 32, 8)
          })
        })
      },
      source: vector_source(host, 'wavenergy:h3p_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_small,
      source: vector_source(host, 'wavenergy:h3p_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_small,
      source: vector_source(host, 'wavenergy:h3p_cont', epsg)
    }),
      new VectorLayer({
      style: function(feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuRd, z, 0, 32, 8)
          })
        })
      },
      source: vector_source(host, 'wavenergy:dv_h1p_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_small,
      source: vector_source(host, 'wavenergy:dv_h1p_ln', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_small,
      source: vector_source(host, 'wavenergy:dv_h1p_ln', epsg)
    })
  ]
});


/*Средняя высота значительных волн
        Large scale*/

var hsr_lyr_group1 = new Group({
  combine: true,
  visible: true,
  name: 'hsr',
  minZoom: 7,
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.OrRd, z, 0, 3.2, 0.2)
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:hsr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:hsr_cont', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.OrRd, z, 0, 3.2, 0.2)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_hsr_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:azov_10_hsr_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:azov_10_hsr_iso', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.OrRd, z, 0, 3.2, 0.2)
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_plg_dv', epsg)
    })
    ,
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:hsr_iso_dv', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:hsr_iso_dv', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.OrRd, z, 0, 3.2, 0.2)
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_02_50_plg_ws', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:hsr_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:hsr_02_50_iso_ws', epsg)
    }),
  ]
});


/*Средняя высота значительных волн
        Middle scale*/

var hsr_lyr_group2 = new Group({
  combine: true,
  visible: true,
  name: 'hsr',
  maxZoom: 7,
  minZoom: 4,
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.OrRd, z, 0, 3.2, 0.4)
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_middle,
      source: vector_source(host, 'wavenergy:hsr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_middle,
      source: vector_source(host, 'wavenergy:hsr_cont', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.OrRd, z, 0, 3.2, 0.4)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_hsr_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_middle,
      source: vector_source(host, 'wavenergy:azov_10_hsr_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_middle,
      source: vector_source(host, 'wavenergy:azov_10_hsr_iso', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.OrRd, z, 0, 3.2, 0.4)
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_plg_dv', epsg)
    })
    ,
    new VectorLayer({
      style: styles.cont_style_middle,
      source: vector_source(host, 'wavenergy:hsr_iso_dv', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_middle,
      source: vector_source(host, 'wavenergy:hsr_iso_dv', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.OrRd, z, 0, 3.2, 0.4)
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_02_50_plg_ws', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_middle,
      source: vector_source(host, 'wavenergy:hsr_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_middle,
      source: vector_source(host, 'wavenergy:hsr_02_50_iso_ws', epsg)
    }),
  ]
});



/*Средняя высота значительных волн
        Small scale*/


var hsr_lyr_group3 = new Group({
  combine: true,
  visible: true,
  maxZoom: 4,
  name: 'hsr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.OrRd, z, 0, 2.6, 0.8)
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_small,
      source: vector_source(host, 'wavenergy:hsr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_small,
      source: vector_source(host, 'wavenergy:hsr_cont', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.OrRd, z, 0, 2.6, 0.8)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_hsr_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_small,
      source: vector_source(host, 'wavenergy:azov_10_hsr_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_small,
      source: vector_source(host, 'wavenergy:azov_10_hsr_iso', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.OrRd, z, 0, 2.6, 0.8)
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_plg_dv', epsg)
    })
    ,
    new VectorLayer({
      style: styles.cont_style_small,
      source: vector_source(host, 'wavenergy:hsr_iso_dv', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_small,
      source: vector_source(host, 'wavenergy:hsr_iso_dv', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.OrRd, z, 0, 2.6, 0.8)
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_02_50_plg_ws', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_small,
      source: vector_source(host, 'wavenergy:hsr_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_small,
      source: vector_source(host, 'wavenergy:hsr_02_50_iso_ws', epsg)
    }),
  ]
});



/*Максимальный поток энергии волны
        Large scale*/

var emax_lyr_group1 = new Group({
  combine: true,
  visible: true,
  minZoom: 7,
  name: 'emax',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlOrBr, z, 0, 4000, 250)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_emax_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:azov_10_emax_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:azov_10_emax_iso', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlOrBr, z, 0, 4000, 250)
          })
        })
      },
      source: vector_source(host, 'wavenergy:emax_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:emax_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:emax_iso', epsg)
    })
  ]
});



/*Максимальный поток энергии волны
        Middle scale*/

var emax_lyr_group2 = new Group({
  combine: true,
  visible: true,
  maxZoom: 7,
  minZoom: 4,
  name: 'emax',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlOrBr, z, 0, 4000, 500)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_emax_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_middle,
      source: vector_source(host, 'wavenergy:azov_10_emax_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_middle,
      source: vector_source(host, 'wavenergy:azov_10_emax_iso', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlOrBr, z, 0, 4000, 500)
          })
        })
      },
      source: vector_source(host, 'wavenergy:emax_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_middle,
      source: vector_source(host, 'wavenergy:emax_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_middle,
      source: vector_source(host, 'wavenergy:emax_iso', epsg)
    })
  ]
});



/*Максимальный поток энергии волны
        Small scale*/

var emax_lyr_group3 = new Group({
  combine: true,
  visible: true,
  maxZoom: 4,
  name: 'emax',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlOrBr, z, 0, 4000, 1000)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_emax_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_small,
      source: vector_source(host, 'wavenergy:azov_10_emax_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_small,
      source: vector_source(host, 'wavenergy:azov_10_emax_iso', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlOrBr, z, 0, 4000, 1000)
          })
        })
      },
      source: vector_source(host, 'wavenergy:emax_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style_small,
      source: vector_source(host, 'wavenergy:emax_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style_small,
      source: vector_source(host, 'wavenergy:emax_iso', epsg)
    })
  ]
});


var lsr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'lsr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Blues, z, 0, 140, 10)
          })
        })
      },
      source: vector_source(host, 'wavenergy:lsr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:lsr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:lsr_cont', epsg)
    }),
     new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Blues, z, 0, 140, 10)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_lsr_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:azov_10_lsr_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:azov_10_lsr_iso', epsg)
    })
  ]
});




var psr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'psr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Greens, z, 0, 7, 0.5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:psr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:psr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:psr_cont', epsg)
    }),
     new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Greens, z, 0, 7, 0.5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_psr_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:azov_10_psr_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:azov_10_psr_iso', epsg)
    })
  ]
});

var esr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'esr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 65, 5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:esr_02_50_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:esr_02_50_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:esr_02_50_iso', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 65, 5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_esr_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:azov_10_esr_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:azov_10_esr_iso', epsg)
    }),
        new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 65, 5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:esr_02_50_plg_ws', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:esr_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:esr_02_50_iso_ws', epsg)
    }),
     new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 65, 5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:esr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:esr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:esr_cont', epsg)
    })
  ]
});





var osr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'osr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('Z_MEAN');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGn, z, 0, 100, 10)
          })
        })
      },
      source: vector_source(host, 'wavenergy:osr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:osr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:osr_cont', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGn, z, 0, 100, 10)
          })
        })
      },
      source: vector_source(host, 'wavenergy:osr_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:osr_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:osr_iso', epsg)
    }),
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGn, z, 0, 100, 10)
          })
        })
      },
      source: vector_source(host, 'wavenergy:obesp_02_50_plg_ws', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:obesp_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:obesp_02_50_iso_ws', epsg)
    })
  ]
});

var wind_grp_50_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'psr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 900, 100)
          })
        })
      },
      source: vector_source(host, 'wavenergy:wind_grp50_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:wind_grp50_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:wind_grp50_cont', epsg)
    })
  ]
});

var wind_grp_100_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'psr',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('z_mean');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1100, 100)
          })
        })
      },
      source: vector_source(host, 'wavenergy:wind_grp100_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:wind_grp100_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:wind_grp100_cont', epsg)
    })
  ]
});

var wind_grp_50c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'grp_50',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
        var sea = feature.get('layer');
        var conflict = feature.get('overlap');
        if (!(conflict == 1 && sea == 'barentsz_wind')) {
       var z = feature.get('grp_50');
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1800, 100)
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 0.1
          })
        })
      }
      },
      source: vector_source(host, 'wavenergy:grpandblackwind', epsg)
    })
  ]
});

var wind_grp_100c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'grp_100',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
        var sea = feature.get('layer');
        var conflict = feature.get('overlap');
        if (!(conflict == 1 && sea == 'barentsz_wind')) {
          var z = feature.get('grp_100');
          return new Style({
             fill: new Fill({
               color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1800, 100)
             }),
             stroke: new Stroke({
               color: '#000000',
               width: 0.1
             })
           })
        }
      },
      source: vector_source(host, 'wavenergy:grpandblackwind', epsg)
    })
  ]
});

var wind_spd_50c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'wind_spd_50c_lyr_group',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('spd_50');
       if (z != null) {
       return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 12, 1)
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 0.1
          })
        })
      }
      },
      source: vector_source(host, 'wavenergy:grpandblackwind', epsg)
    })
  ]
});

// NOT ("layer" = 'barentsz_wind' AND "overlap" = 1)
// var wind_spd_50c_lyr_group = new VectorLayer({
//   style: function(feature, resolution) {
//    var z = feature.get('spd_50_year');
//    return new Style({
//       fill: new Fill({
//         color: fun.get_color(colorbrewer.PuBuGn, z, 0, 9, 1)
//       }),
//       stroke: new Stroke({
//         color: '#000000',
//         width: 0.1
//       })
//     })
//   },
//   source: vector_source(host, 'wavenergy:wind', epsg)
// });

var wind_spd_100c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'wind_spd_100c_lyr_group',
  layers: [
    new VectorLayer({
      style: function(feature, resolution) {
       var z = feature.get('spd_100');
if (z != null) {
  return new Style({
     fill: new Fill({
       color: fun.get_color(colorbrewer.PuBuGn, z, 0, 12, 1)
     }),
     stroke: new Stroke({
       color: '#000000',
       width: 0.1
     })
   })
}
},
      source: vector_source(host, 'wavenergy:grpandblackwind', epsg)
    })
  ]
});

var city_lyr = new VectorLayer({
  source: vector_source(host, 'wavenergy:ne_10m_populated_places'),
  style: function(feature, resolution) {
    if (feature.get('FEATURECLA') =='Admin-0 capital')
      return new Style({
        image: new Circle({
          radius: 2,
          fill: new Fill({
            color: 'rgba(255,255,255,0.5)',
          }),
          stroke: new Stroke({
            color: 'rgba(0,0,0,1)',
            width: 0.5
          })
        }),
        text: new Text({
          text: feature.get('name_ru'),
          font: '10px Open Sans,sans-serif',
          fill: new Fill({
            color: '#231a24'
          }),
          offsetY: -10
        })
      })
    else return new Style({})
  },
  declutter: true
});

// var voronoy_src = new ImageWMS({
//   url: 'http://localhost:8080/geoserver/wavenergy/wms?service=WMS',
//autolab.geogr.msu.ru/public/geoserver
//   params: {'LAYERS': 'wavenergy:all_voronoy', 'TILED': true},
//   serverType: 'geoserver',
//   crossOrigin: 'anonymous'
// });
// var voronoy_lyr = new Image({
//   source: voronoy_src
// });

var wmsSource = new TileWMS({
  url: 'http://93.180.9.222/geoserver/wavenergy/wms?service=WMS',
  params: {'LAYERS': 'wavenergy:myvoronoy', 'TILED': true},
  serverType: 'geoserver',
  crossOrigin: 'anonymous'
});
var wmsLayer = new TileLayer({
  source: wmsSource
});


module.exports = {
  world_lyr,
  land_lyr,
  bnd_lyr,
  coast_lyr,
  city_lyr,
  geo_lines,
  hs_lyr_group3,
  hs_lyr_group2,
  hs_lyr_group1,
  h3p_lyr_group1,
  h3p_lyr_group2,
  h3p_lyr_group3,
  hsr_lyr_group1,
  hsr_lyr_group2,
  hsr_lyr_group3,
  lsr_lyr_group,
  psr_lyr_group,
  esr_lyr_group,
  emax_lyr_group1,
  emax_lyr_group2,
  emax_lyr_group3,
  osr_lyr_group,
  wind_grp_50_lyr_group,
  wind_grp_100_lyr_group,
  wind_grp_50c_lyr_group,
  wind_grp_100c_lyr_group,
  wind_spd_50c_lyr_group,
  wind_spd_100c_lyr_group,
  wmsSource,
  // wmsLayer
}
