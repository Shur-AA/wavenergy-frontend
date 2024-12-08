import Map from 'ol/Map';
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Vector from 'ol/source/Vector.js';
import { Vector as VectorLayer, VectorTile as VectorTileLayer, Image, Group } from 'ol/layer.js';
import 'ol/style';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import { transform, Projection } from 'ol/proj.js';
import Overlay from 'ol/Overlay.js';
import Select from 'ol/interaction/Select.js'
import click from 'ol/events/condition.js'
import Graticule from 'ol/layer/Graticule';
import $ from 'jquery';
import { Fill, Stroke, Icon, Style, Text, Circle } from 'ol/style';
import { toStringHDMS } from 'ol/coordinate';
import { fromLonLat, toLonLat } from 'ol/proj';
import { get as getProjection, getTransform } from 'ol/proj';
import ZoomToExtent from 'ol/control/ZoomToExtent';


var fun = require('./components/functions');
var layers = require('./components/layers');
var styles = require('./appearence/styles');
import * as tools from './components/maps_legend_builder';
const colorbrewer = require('colorbrewer');
const convert = require('color-convert');
var render_rose = require('./components/roserender');
var render_hist = require('./components/gistrender');
var FooPicker = require('./appearence/foopicker.js');
var baseWFSWMS = require('./components/base_layers_wfs');


var epsg = 4326;

function insert_legend(palette, from, to, by, id = 'td00') {
  document.getElementById(id).innerHTML = "";
  tools.layeredColoring(0, 0,
    fun.get_colors(palette, from, to, by),
    false, [30, 15], false,
    fun.get_values(from, to, by), "8pt Arial", "black", 30, 20,
    false, "", "bold 10pt Arial");
}

// insert clicked point
var addMarker = function (coordinates) {

  map.getLayers().forEach(function (layer) {
    if (layer.get('name') == 'xaxa') {
      map.removeLayer(layer);
    }
  });
  var fill = new Fill({
    color: 'yellow'
  });
  var stroke = new Stroke({
    color: 'red',
    width: 1
  });
  var style = new Style({
    image: new Circle({
      fill: fill,
      stroke: stroke,
      radius: 4
    }),
    fill: fill,
    stroke: stroke
  });
  var point_feature = new Feature({});
  var point_geom = new Point(coordinates);
  point_feature.setGeometry(point_geom);
  var vector_layer = new VectorLayer({
    name: 'xaxa',
    source: new Vector({
      features: [point_feature],
    })
  })
  vector_layer.setStyle(style);

  map.addLayer(vector_layer);
}


// var center =  transform([100, 67], 'EPSG:4326', 'EPSG:3857');
var center = [115, 63];
// var prj = new Projection({
//   code: 'EPSG:4326',
//   units: 'degrees',
//   axisOrientation: 'neu'
// });


var cur_lyr = layers.hs_lyr_group2;



const map = new Map({
  target: 'map',
  layers: [
    // new TileLayer({
    //   source: new OSM()
    // }),
    // baseWFSWMS.gebco_lyr,
    layers.hs_lyr_group1,
    layers.hs_lyr_group2,
    layers.hs_lyr_group3,
    baseWFSWMS.base110_lyr_group_bottom,
    baseWFSWMS.base50_lyr_group_bottom,
    baseWFSWMS.base10_lyr_group_bottom,
    baseWFSWMS.base110_lyr_group_top,
    baseWFSWMS.base50_lyr_group_top,
    baseWFSWMS.base10_lyr_group_top,

  ],
  view: new View({
    projection: 'EPSG:4326',
    center: center,
    zoom: 3,
  })
});

let MapRequestId = 'hs'

map.on('moveend', function (e) {
  console.log(map.getView().getZoom())
  switch (MapRequestId) {
    case 'hs':
      if (map.getView().getZoom() <= 4) {
        insert_legend(colorbrewer.RdPu, 0, 20, 4);
        break;
      }
      if (map.getView().getZoom() > 7) {
        insert_legend(colorbrewer.RdPu, 0, 18, 1);
        break;
      }
      insert_legend(colorbrewer.RdPu, 0, 20, 2);
      break;
    case 'h3p':
      if (map.getView().getZoom() <= 4) {
        insert_legend(colorbrewer.PuRd, 0, 32, 8);
        break;
      }
      if (map.getView().getZoom() > 7) {
        insert_legend(colorbrewer.PuRd, 0, 26, 2);
        break;
      }
      insert_legend(colorbrewer.PuRd, 0, 28, 4);
      break;
    case 'hsr':
      if (map.getView().getZoom() <= 4) {
        insert_legend(colorbrewer.OrRd, 0, 3.2, 0.8);
        break;
      }
      if (map.getView().getZoom() > 7) {
        insert_legend(colorbrewer.OrRd, 0, 3.2, 0.2);
        break;
      }
      insert_legend(colorbrewer.OrRd, 0, 3.2, 0.4);
      break;
    case 'lsr':
      if (map.getView().getZoom() <= 4) {
        insert_legend(colorbrewer.Blues, 0, 160, 40);
        break;
      }
      if (map.getView().getZoom() > 7) {
        insert_legend(colorbrewer.Blues, 0, 140, 10);
        break;
      }
      insert_legend(colorbrewer.Blues, 0, 140, 20);
      break;
    case 'psr':
      if (map.getView().getZoom() <= 4) {
        insert_legend(colorbrewer.BuGn, z, 0, 8, 2);
        break;
      }
      if (map.getView().getZoom() > 7) {
        insert_legend(colorbrewer.BuGn, z, 0, 7, 0.5);
        break;
      }
      insert_legend(colorbrewer.BuGn, z, 0, 7, 1);
      break;
    case 'esr':
      if (map.getView().getZoom() <= 4) {
        insert_legend(colorbrewer.YlGnBu, 0, 80, 20);
        break;
      }
      if (map.getView().getZoom() > 7) {
        insert_legend(colorbrewer.YlGnBu, 0, 65, 5);
        break;
      }
      insert_legend(colorbrewer.YlGnBu, 0, 70, 10);
      break;
    case 'emax':
      if (map.getView().getZoom() <= 4) {
        insert_legend(colorbrewer.YlOrBr, 0, 4000, 1000);
        break;
      }
      if (map.getView().getZoom() > 7) {
        insert_legend(colorbrewer.YlOrBr, 0, 4000, 250);
        break;
      }
      insert_legend(colorbrewer.YlOrBr, 0, 4000, 500);
      break;
    case 'osr':
      if (map.getView().getZoom() <= 4) {
        insert_legend(colorbrewer.YlGn, 0, 120, 40);
        break;
      }
      if (map.getView().getZoom() > 7) {
        insert_legend(colorbrewer.YlGn, 0, 100, 10);
        break;
      }
      insert_legend(colorbrewer.YlGn, 0, 100, 20);
      break;
  }
})


var coordinate = 0;
map.on('click', function (evt) {
  coordinate = evt.coordinate;
  // console.log(coordinate);
  addMarker(coordinate);
  var htbox = document.getElementsByClassName("tb-checkbox");
  htbox[0].checked = false;
  render_rose.render_rose(coordinate[1], coordinate[0]);
  render_hist.render_hist(coordinate[1], coordinate[0], 50);
  htbox[0].addEventListener('change', function (event) {
    if (htbox[0].checked) {
      render_hist.render_hist(coordinate[1], coordinate[0], 100);
    } else {
      render_hist.render_hist(coordinate[1], coordinate[0], 50);
    }
  });
  let coors_var = document.getElementById("coords-display");
  coors_var.innerHTML = 'Latitude: ' + coordinate[1].toFixed(2) + '°<br>' + 'Longitude: ' + coordinate[0].toFixed(2) + '°';
});





var point_index = 0;
map.on('singleclick', function (evt) {
  var viewResolution = /** @type {number} */ (map.getView().getResolution());
  var url = layers.wmsSource.getFeatureInfoUrl(
    evt.coordinate, viewResolution, 'EPSG:4326',
    { 'INFO_FORMAT': 'application/json' });
  if (url) {
    let parser = new GeoJSON();
    $.ajax({
      url: url,
      type: "POST"
    }).then(function (response) {
      let result = parser.readFeatures(response);
      if (result.length) {
        var table = document.getElementsByClassName("ww-table");
        document.getElementById("sea_name").innerHTML =
          result[0].get('sea_en') + '<hr class="uk-divider-small">';
        document.getElementById("wave_height").innerHTML =
          result[0].get('hsr').toFixed(2);
        document.getElementById("wave_lenght").innerHTML =
          result[0].get('lsr').toFixed(2);
        document.getElementById("wave_period").innerHTML =
          result[0].get('psr').toFixed(2);
        document.getElementById("wave_energy").innerHTML =
          result[0].get('esr').toFixed(2);
        document.getElementById("wave_maxh").innerHTML =
          result[0].get('hs').toFixed(2);
        var h3p_result = result[0].get('h3p').toFixed(2);
        if (h3p_result == 0) {
          document.getElementById("wave_maxh3p").innerHTML = ''
        } else {
          document.getElementById("wave_maxh3p").innerHTML =
            h3p_result;
        };
        document.getElementById("wind_spd50").innerHTML =
          result[0].get('spd_50').toFixed(2);
        document.getElementById("wind_spd100").innerHTML =
          result[0].get('spd_100').toFixed(2);
        document.getElementById("wind_grp50").innerHTML =
          result[0].get('grp_50').toFixed(2);
        document.getElementById("wind_grp100").innerHTML =
          result[0].get('grp_100').toFixed(2);
        table[0].style.visibility = 'visible';
        point_index = result[0].get('index');
        // console.log(point_index);
      } else {
        document.getElementById("sea_name").innerHTML = '';
        document.getElementById("wave_height").innerHTML = '';
        document.getElementById("wave_lenght").innerHTML = '';
        document.getElementById("wave_period").innerHTML = '';
        document.getElementById("wave_energy").innerHTML = '';
        document.getElementById("wave_maxh").innerHTML = '';
        document.getElementById("wave_maxh3p").innerHTML = '';
      }
    })
  }
});


// var timedata = document.getElementById("timedatabut");
// timedata.addEventListener('click', function (event) {
//   var is_seen = document.querySelector('.table_place').style.visibility;
//   console.log(is_seen);
//   if (is_seen == 'visible'){
//     document.querySelector('.table_place').style.visibility = 'hidden';
//     document.querySelector('#timeshowbut').style.visibility = 'hidden';
//     document.querySelector('.responce_table').style.visibility = 'hidden';
//     document.querySelector('.supply_table').style.visibility = 'hidden';
//   } else {
//     document.querySelector('.table_place').style.visibility = 'visible';
//     if (document.getElementById("avg_hsig").innerHTML != ''){
//       console.log('table1 not empty');
//       document.querySelector('.responce_table').style.visibility = 'visible';
//       document.querySelector('#timeshowbut').style.visibility = 'visible';
//     };
//     if (document.getElementById("periodsup_value").innerHTML != ''){
//       console.log('table2 not empty');
//       document.querySelector('.supply_table').style.visibility = 'visible';
//     }
//   }

//   var foopicker_start = new FooPicker({
//     id: 'start',
//     dateFormat: 'dd.MM.yyyy'
//   });
//   var foopicker_end = new FooPicker({
//     id: 'finish',
//     dateFormat: 'dd.MM.yyyy'
//   });
//   const dataform = document.querySelector('#dataform');
//   const databut = document.querySelector('#calcbut');

//   databut.addEventListener('click', function (event) {
//     event.preventDefault();
//     var startdate = dataform.elements.startdate.value;
//     var enddate = dataform.elements.enddate.value;
//     var starthour = dataform.elements.startdate.value;
//     var starthour = dataform.elements.starttime.value;
//     var endhour = dataform.elements.endtime.value;
//     console.log(startdate, starthour, enddate, endhour);
//     var myjson = {"startdate": startdate,
//                   "starthour": starthour,
//                   "enddate": enddate,
//                   "endhour": endhour,
//                   "pindex": point_index,
//                   "type": "maintbl"};

//     let elem = $(event.currentTarget).parent().parent();
//     elem.slideUp(600, function(){
//       document.querySelector('#timeshowbut').style.height = 'auto';
//       document.querySelector('#timeshowbut').style.visibility = 'visible';
//       document.querySelector('#timeshowbut').innerText = startdate + ' ' + starthour + ':00 h  —  ' + enddate + ' ' + endhour + ':00 h';
//     });


//     var url = "https://autolab.geogr.msu.ru/wavedb"
//     if (url) {
//       $.ajax({
//         url: url,
//         type: "POST",
//         data : JSON.stringify(myjson),
//         success : function(data) {
//           console.log(data);
//           document.querySelector('.responce_table').style.height = 'auto';
//           document.querySelector('.responce_table').style.visibility = 'visible';
//           document.getElementById("avg_hsig").innerHTML = data[0].avg_hsig;
//           document.getElementById("avg_period").innerHTML = data[0].avg_period;
//           document.getElementById("avg_energy").innerHTML = data[0].avg_energy;
//           document.getElementById("avg_wlen").innerHTML = data[0].avg_wlen;
//           document.getElementById("min_hsig").innerHTML = data[0].min_hsig;
//           document.getElementById("min_period").innerHTML = data[0].min_period;
//           document.getElementById("min_energy").innerHTML = data[0].min_energy;
//           document.getElementById("min_wlen").innerHTML = data[0].min_wlen;
//           document.getElementById("max_hsig").innerHTML = data[0].max_hsig;
//           document.getElementById("max_period").innerHTML = data[0].max_period;
//           document.getElementById("max_energy").innerHTML = data[0].max_energy;
//           document.getElementById("max_wlen").innerHTML = data[0].max_wlen;
//           document.getElementById("med_hsig").innerHTML = data[0].med_hsig;
//           document.getElementById("med_period").innerHTML = data[0].med_period;
//           document.getElementById("med_energy").innerHTML = data[0].med_energy;
//           document.getElementById("med_wlen").innerHTML = data[0].med_wlen;
//           document.getElementById("std_hsig").innerHTML = data[0].std_hsig;
//           document.getElementById("std_period").innerHTML = data[0].std_period;
//           document.getElementById("std_energy").innerHTML = data[0].std_energy;
//           document.getElementById("std_wlen").innerHTML = data[0].std_wlen;
//           document.getElementById("period_input").value = data[0].med_period;
//           document.getElementById("energy_input").value = data[0].med_energy;
//           document.getElementById("len_input").value = data[0].med_wlen;
//           document.getElementById("hsig_input").value = data[0].med_hsig;

//           var myjson2 = {"period": data[0].med_period,
//                         "energy": data[0].med_energy,
//                         "wlen": data[0].med_wlen,
//                         "hsig": data[0].med_hsig,
//                         "pindex": point_index,
//                         "type": "supall"};
//           $.ajax({
//             url: url,
//             type: "POST",
//             data : JSON.stringify(myjson2),
//             success : function(data) {
//               console.log(data);
//               document.getElementById("periodsup_value").innerHTML = data[0].supper + ' %';
//               document.getElementById("energysup_value").innerHTML = data[0].supenerg + ' %';
//               document.getElementById("lensup_value").innerHTML = data[0].supwlen + ' %';
//               document.getElementById("hsigsup_value").innerHTML = data[0].suphsig + ' %';
//               document.querySelector('.supply_table').style.height = 'auto';
//               document.querySelector('.supply_table').style.visibility = 'visible';
//             }
//           })
//         }
//       })
//     }
//     $("#timeshowbut").on('click', e => {
//       let elem = $(".datetime_manager");
//       elem.slideDown(function () {
//         document.querySelector('#timeshowbut').style.height = '0';
//         document.querySelector('#timeshowbut').style.visibility = 'hidden';
//       });
//     })
//   })
// })

// ********************SUPPLY TABLE CHANGE******************

$("#period_input").on('change', e => {
  var changejson = {
    "period_in": $("#period_input")[0].value,
    "operator": $("#greater_less1")[0].value,
    "type": "supperiod"
  };
  var url = "http://93.180.9.222/wavedb";
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(changejson),
    success: function (data) {
      document.getElementById("periodsup_value").innerHTML = data[0].supply + ' %';
    }
  })
});


$("#greater_less1").on('change', e => {
  var v = document.getElementById("periodsup_value").innerHTML;
  v = Number((100 - parseFloat(v)).toFixed(1))
  document.getElementById("periodsup_value").innerHTML = v + ' %';
}
);


$("#energy_input").on('change', e => {
  var changejson = {
    "energy_in": $("#energy_input")[0].value,
    "operator": $("#greater_less2")[0].value,
    "type": "supenergy"
  };
  var url = "http://93.180.9.222/wavedb";
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(changejson),
    success: function (data) {
      document.getElementById("energysup_value").innerHTML = data[0].supply + ' %';
    }
  })
});

$("#greater_less2").on('change', e => {
  var v = document.getElementById("energysup_value").innerHTML;
  v = Number((100 - parseFloat(v)).toFixed(1))
  document.getElementById("energysup_value").innerHTML = v + ' %';
}
);

$("#len_input").on('change', e => {
  var changejson = {
    "wlen_in": $("#len_input")[0].value,
    "operator": $("#greater_less3")[0].value,
    "type": "suplen"
  };
  var url = "http://93.180.9.222/wavedb";
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(changejson),
    success: function (data) {
      document.getElementById("lensup_value").innerHTML = data[0].supply + ' %';
    }
  })
});

$("#greater_less3").on('change', e => {
  var v = document.getElementById("lensup_value").innerHTML;
  v = Number((100 - parseFloat(v)).toFixed(1))
  document.getElementById("lensup_value").innerHTML = v + ' %';
}
);

$("#hsig_input").on('change', e => {
  var changejson = {
    "hsig_in": $("#hsig_input")[0].value,
    "operator": $("#greater_less4")[0].value,
    "type": "supsig"
  };
  var url = "http://93.180.9.222/wavedb";
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(changejson),
    success: function (data) {
      document.getElementById("hsigsup_value").innerHTML = data[0].supply + ' %';
    }
  })
});

$("#greater_less4").on('change', e => {
  var v = document.getElementById("hsigsup_value").innerHTML;
  v = Number((100 - parseFloat(v)).toFixed(1));
  document.getElementById("hsigsup_value").innerHTML = v + ' %';
}
);



// ********************SUPPLY TABLE CHANGE END************************

function ready() {
  function drawMapName(intext) {
    const mapname = document.getElementsByClassName('curchoice');
    mapname[0].textContent = intext;
  };


  drawMapName('MAXIMUM SIGNIFICANT WAVE HEIGHT, M');

  let cur_var_zoom1 = layers.hs_lyr_group1;
  let cur_var_zoom2 = layers.hs_lyr_group2;
  let cur_var_zoom3 = layers.hs_lyr_group3;

  // const lili = document.getElementsByClassName('uk-dropdown-nav');
  const lili = document.getElementById('dropdown-nav');
  lili.addEventListener('click', function (event) {
    event.preventDefault();
    let selection = event.target.parentElement;
    MapRequestId = selection.id;
    drawMapName(selection.innerText);
    let lis = lili.childNodes;
    lis.forEach((item) => {
      if (item.classList) {
        if (item.classList.contains('uk-active')) {
          item.classList.remove('uk-active')
        }
      }
    });
    selection.classList.add('uk-active');

    // console.log(cur_var);
    map.removeLayer(cur_var_zoom1);
    map.removeLayer(cur_var_zoom2);
    map.removeLayer(cur_var_zoom3);

    var level = 1;

    switch (MapRequestId) {
      case 'hs':
        cur_var_zoom1 = layers.hs_lyr_group1;
        cur_var_zoom2 = layers.hs_lyr_group2;
        cur_var_zoom3 = layers.hs_lyr_group3;
        insert_legend(colorbrewer.RdPu, 0, 20, 4);
        break;
      case 'h3p':
        cur_var_zoom1 = layers.h3p_lyr_group1;
        cur_var_zoom2 = layers.h3p_lyr_group2;
        cur_var_zoom3 = layers.h3p_lyr_group3;
        insert_legend(colorbrewer.PuRd, 0, 32, 8);
        break;
      case 'hsr':
        cur_var_zoom1 = layers.hsr_lyr_group1;
        cur_var_zoom2 = layers.hsr_lyr_group2;
        cur_var_zoom3 = layers.hsr_lyr_group3;
        insert_legend(colorbrewer.OrRd, 0, 3.2, 0.8);
        break;
      case 'lsr':
        cur_var_zoom1 = layers.lsr_lyr_group1;
        cur_var_zoom2 = layers.lsr_lyr_group2;
        cur_var_zoom3 = layers.lsr_lyr_group3;
        insert_legend(colorbrewer.Blues, 0, 160, 40);
        break;
      case 'psr':
        cur_var_zoom1 = layers.psr_lyr_group1;
        cur_var_zoom2 = layers.psr_lyr_group2;
        cur_var_zoom3 = layers.psr_lyr_group3;
        insert_legend(colorbrewer.BuGn, z, 0, 8, 2);
        break;
      case 'esr':
        cur_var_zoom1 = layers.esr_lyr_group1;
        cur_var_zoom2 = layers.esr_lyr_group2;
        cur_var_zoom3 = layers.esr_lyr_group3;
        insert_legend(colorbrewer.YlGnBu, 0, 80, 20);
        break;
      case 'emax':
        cur_var_zoom1 = layers.emax_lyr_group1;
        cur_var_zoom2 = layers.emax_lyr_group2;
        cur_var_zoom3 = layers.emax_lyr_group3;
        insert_legend(colorbrewer.YlOrBr, 0, 4000, 1000);
        break;
      case 'osr':
        cur_var_zoom1 = layers.osr_lyr_group1;
        cur_var_zoom2 = layers.osr_lyr_group2;
        cur_var_zoom3 = layers.osr_lyr_group3;
        insert_legend(colorbrewer.YlGn, 0, 120, 40);
        break;
      case 'wind_grp_50':
        cur_var = layers.wind_grp_50_lyr_group;
        insert_legend(colorbrewer.PuBuGn, 0, 1200, 100);
        level = 4;
        break;
      case 'wind_grp_100':
        cur_var = layers.wind_grp_100_lyr_group;
        insert_legend(colorbrewer.PuBuGn, 0, 1200, 100);
        level = 4;
        break;
      case 'wind_grp_50c':
        cur_var = layers.wind_grp_50c_lyr_group;
        insert_legend(colorbrewer.PuBuGn, 0, 1800, 100);
        level = 4;
        break;
      case 'wind_grp_100c':
        cur_var = layers.wind_grp_100c_lyr_group;
        insert_legend(colorbrewer.PuBuGn, 0, 1800, 100);
        level = 4;
        break;
      case 'wind_spd_50c_year':
        cur_var = layers.wind_spd_50c_lyr_group;
        insert_legend(colorbrewer.PuBuGn, 0, 12, 1);
        level = 4;
        break;
      case 'wind_spd_100c_year':
        cur_var = layers.wind_spd_100c_lyr_group;
        insert_legend(colorbrewer.PuBuGn, 0, 12, 1);
        level = 4;
        break;
    }

    map.getLayers().insertAt(level, cur_var_zoom1);
    map.getLayers().insertAt(level, cur_var_zoom2);
    map.getLayers().insertAt(level, cur_var_zoom3);

    map.getView().setZoom(3)

  });

  tools.tablesInit(1, [1], "legendplace");
  insert_legend(colorbrewer.RdPu, 0, 20, 4);

  const closeBut = document.getElementsByClassName('fa-window-minimize');
  closeBut[0].addEventListener('click', function (event) {
    let rg = document.getElementsByClassName('rose-graphic');
    rg[0].style.visibility = 'hidden';
    let rtitle = document.getElementsByClassName('rose-title');
    rtitle[0].style.visibility = 'hidden';
    let prnt = document.getElementsByClassName('graphics');
    prnt[0].style.justifyContent = 'start';
    prnt[0].style.paddingLeft = '4px';
  })
  closeBut[1].addEventListener('click', function (event) {
    let fg = document.getElementsByClassName('freq-graphic');
    fg[0].style.visibility = 'hidden';
    let ftitle = document.getElementsByClassName('freq-title');
    ftitle[0].style.visibility = 'hidden';
    let prnt = document.getElementsByClassName('graphics');
    prnt[0].style.justifyContent = 'start';
    prnt[0].style.paddingLeft = '4px';
  })
  closeBut[0].addEventListener('click', function (event) {
    let tbl = document.getElementsByClassName('ww-table');
    tbl[0].style.visibility = 'hidden';
  })
};
document.addEventListener("DOMContentLoaded", ready);



const addsf = document.getElementById('freq-graphic');
addsf.addEventListener('mouseover', function (event) {
  let ftitle = document.getElementsByClassName('freq-title');
  ftitle[0].style.visibility = 'hidden';
});
addsf.addEventListener('mouseout', function (event) {
  let ftitle = document.getElementsByClassName('freq-title');
  let fg = document.getElementsByClassName('freq-graphic');
  if (fg[0].style.visibility == 'visible') {
    ftitle[0].style.visibility = 'visible';
  };
});

const addsr = document.getElementById('rose-graphic');
addsr.addEventListener('mouseover', function (event) {
  let rtitle = document.getElementsByClassName('rose-title');
  rtitle[0].style.visibility = 'hidden';
});
addsr.addEventListener('mouseout', function (event) {
  let rtitle = document.getElementsByClassName('rose-title');
  let rg = document.getElementsByClassName('rose-graphic');
  if (rg[0].style.visibility == 'visible') {
    rtitle[0].style.visibility = 'visible';
  };
});


//Zoom to the sea extent

const lisea = document.getElementById('dropdown-seas');
lisea.addEventListener('click', function (event) {
  event.preventDefault();
  let selection = event.target.parentElement;
  var SeaRequestId = selection.id;
  let lis = lisea.childNodes;
  lis.forEach((item) => {
    if (item.classList) {
      if (item.classList.contains('uk-active')) {
        item.classList.remove('uk-active')
      }
    }
  });
  selection.classList.add('uk-active');

  // console.log(cur_var);
  // map.getView().fit([35, 40, 60, 68]);
  var sea_extent = [];

  switch (SeaRequestId) {
    case 'ArcticO':
      sea_extent = [18, 63, 117, 82];
      break;
    case 'PaсificO':
      sea_extent = [125, 32, 207, 66];
      break;
    case 'BarentzS':
      sea_extent = [16, 63, 70, 82];
      break;
    case 'WhiteS':
      sea_extent = [31, 63, 45, 68];
      break;
    case 'KarskoeS':
      sea_extent = [54, 67, 117, 82];
      break;
    case 'LaptevS':
      sea_extent = [102, 70, 143, 82];
      break;
    case 'ChukchiS':
      sea_extent = [174, 66, 202, 78];
      break;
    case 'EastSibS':
      sea_extent = [140, 68, 177, 82];
      break;
    case 'BeringS':
      sea_extent = [160, 50, 207, 66];
      break;
    case 'OhotskS':
      sea_extent = [133, 43, 165, 63];
      break;
    case 'JapanS':
      sea_extent = [125, 32, 143, 53];
      break;
    case 'AtlanticO':
      sea_extent = [8, 40, 44, 67];
      break;
    case 'AzovS':
      sea_extent = [34, 45, 40, 48];
      break;
    case 'BalticS':
      sea_extent = [8, 53, 31, 67];
      break;
    case 'BlackS':
      sea_extent = [26, 40, 44, 48];
      break;
    case 'KaspyS':
      sea_extent = [46, 36, 56, 48];
      break;
    case 'AllSeas':
      sea_extent = [8, 32, 207, 82];
      break;
  }
  console.log(sea_extent);
  map.getView().fit(sea_extent);
});