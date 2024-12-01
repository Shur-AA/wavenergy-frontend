import { Fill, Stroke, Icon, Style, Text, Circle } from 'ol/style';
var fun = require('../components/functions')
var colorbrewer = require('colorbrewer');

var selectedStyle = new Style({
  stroke: new Stroke({
    color: 'red',
    width: 3
  })
})

function band_style(feature, resolution, palette,
  value, from, to, by, field = 'z_mean') {
  var z = feature.get(field);
  return new Style({
    fill: new Fill({
      color: get_color(palette, value, from, to, by)
    })
  })
}

function cont_style(feature, resolution) {
  var idx = feature.get('index');
  return new Style({
    stroke: new Stroke({
      color: '#000000',
      width: (idx == 1) ? 1 : 0.5
    })
  });
}


function cont_style_middle(feature, resolution) {
  var idx = feature.get('index1');
  var idz = feature.get('z1');

  return new Style({
    stroke: new Stroke({
      color: (idz == 1) ? '#000000' : '#00000000',
      width: (idx == 1) ? 1.2 : 0.5
    })
  });
}


function cont_style_small(feature, resolution) {
  var idx = feature.get('index2');
  var idz = feature.get('z2');

  return new Style({
    stroke: new Stroke({
      color: (idz == 1) ? '#000000' : '#00000000',
      width: (idx == 1) ? 1.1 : 0.5
    })
  });
}


function cont_label_style(feature, resolution) {
  var idx = feature.get('index');
  var z = fun.round(feature.get('z'), 1);
 
  var fontstyle = (idx == 1) ? 'bold 14px' : '13px'
    return new Style({
      text: new Text({
        text : z.toString(),
        font: `${fontstyle} "Open Sans", "Arial", "sans-serif"`,
        placement: 'line',
        fill: new Fill({
          color: 'black'
        }),
        stroke: new Stroke({
          color: 'white',
          width: 1
        })
      })
    });
 }

 function cont_label_style_middle(feature, resolution) {
  var idx = feature.get('index1');
  var z = fun.round(feature.get('z'), 1);
  var idz = feature.get('z1');
 
  var fontstyle = (idx == 1) ? 'bold 15px' : '13px';
  fontstyle = (idz == 1) ? fontstyle : '0px';

    return new Style({
      text: new Text({
        text : z.toString(),
        font: `${fontstyle} "Open Sans", "Arial", "sans-serif"`,
        placement: 'line',
        fill: new Fill({
          color: 'black'
        }),
        stroke: new Stroke({
          color: 'white',
          width: 1
        })
      })
    });
 }


 function cont_label_style_small(feature, resolution) {
  var idx = feature.get('index2');
  var z = fun.round(feature.get('z'), 1);
  var idz = feature.get('z2');
 
  var fontstyle = (idx == 1) ? 'bold 15px' : '13px';
  fontstyle = (idz == 1) ? fontstyle : '0px';

    return new Style({
      text: new Text({
        text : z.toString(),
        font: `${fontstyle} "Open Sans", "Arial", "sans-serif"`,
        placement: 'line',
        fill: new Fill({
          color: 'black'
        }),
        stroke: new Stroke({
          color: 'white',
          width: 1
        })
      })
    });
 }


function country_style() {
  return new Style({
    // stroke: new Stroke({
    //   color: '#A6ACAF',
    //   width: 0.5
    // }),
    fill: new Fill({
      color: 'white'
    })
  })
}


function russia_style() {
  return new Style({
    fill: new Fill({
      color: 'white'
    })
  })
}

function coastline_style() {
  return new Style({
    stroke: new Stroke({
      color: 'steelblue',
      width: 1.2
    })
  })
}

function river_style() {
  return new Style({
    stroke: new Stroke({
      color: '#B9DDE9',
      width: 0.6
    })
  })
}

function lake_style() {
  return new Style({
    stroke: new Stroke({
      color: 'steelblue',
      width: 0.5
    }),
    fill: new Fill({
      color: 'lightblue'
    })
  })
}

function city_style(label) {
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
      text: label,
      font: '10px Open Sans,sans-serif',
      fill: new Fill({
        color: '#34495E'
      }),
      offsetY: -8,
      offsetX: 10
    }),
  })
}

function port_style(label) {
  return new Style({
    image: new Icon({
      anchor: [0, 0],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: 'https://shur-aa.github.io/LazoZMU/img/anchor.png'
    }),
    text: new Text({
      text: label,
      font: 'italic 10px Open Sans,sans-serif',
      fill: new Fill({
        color: '#34495E'
      }),
      offsetY: -8,
      offsetX: 10
    }),
  })
}


module.exports = {
  selectedStyle,
  band_style,
  cont_style,
  cont_label_style,
  cont_style_middle,
  cont_label_style_middle,
  cont_style_small,
  cont_label_style_small,
  country_style,
  russia_style,
  coastline_style,
  river_style,
  lake_style,
  city_style,
  port_style
}
