(function () {
  $(function () {
    var quickData = {
      NH: { value: "0.30" },
      MT: { value: "0.14" },
      ND: { value: "0.39" },
      SD: { value: "0.27" },
      WI: { value: "0.06" },
      ME: { value: "0.35" },
      NE: { value: "0.31" },
      NV: { value: "0.16" },
      VT: { value: "0.27" },
      TX: { value: "0.20" },
      IA: { value: "0.19" },
      SC: { value: "0.77" },
      MS: { value: "0.43" },
      OR: { value: "0.08" },
      LA: { value: "0.40" },
      WY: { value: "0.02" },
      AL: { value: "1.05" },
      NM: { value: "0.41" },
      DE: { value: "0.26" },
      HI: { value: "0.93" },
      MN: { value: "0.49" },
      CO: { value: "0.08" },
      MO: { value: "0.06" },
      WV: { value: "0.18" },
      IL: { value: "0.23" },
      OH: { value: "0.18" },
      AZ: { value: "0.16" },
      PA: { value: "0.08" },
      FL: { value: "0.48" },
      AK: { value: "1.07" },
      ID: { value: "0.15" },
      KS: { value: "0.18" },
      MI: { value: "0.20" },
      OK: { value: "0.40" },
      CA: { value: "0.20" },
      NC: { value: "0.62" },
      WA: { value: "0.26" },
      VA: { value: "0.26" },
      TN: { value: "1.29" },
      GA: { value: "1.01" },
      AR: { value: "0.34" },
      MA: { value: "0.11" },
      KY: { value: "0.85" },
      IN: { value: "0.12" },
      RI: { value: "0.12" },
      NY: { value: "0.14" },
      NJ: { value: "0.12" },
      MD: { value: "0.53" },
      CT: { value: "0.23" },
      UT: { value: "0.41" },
    };
    var quickMap = new Squaire(quickData, {
      colors: d3.scale
        .quantize()
        .domain([0, 1.3])
        .range(["#c9e2f5", "#0098db"]),
    });

    /* CUSTOM TOOLTIP, UPDATE */

    var tooltipData = {},
      tooltipMap,
      tooltipIndex = "percapconsumption",
      tooltipColors,
      tooltipRepresentativesExtent;

    //get max/min of a column of numeric data
    function getExtent(index) {
      //console.log(`getExtent ${index}`)
      //console.log(tooltipData)
      var values = Object.keys(tooltipData).map(function (key) {
        return tooltipData[key][index];
      });
      console.log(values)
      return d3.extent(values, function (d) {
        return +d.replace(/[^\d-\.]/gi, "");
      });
    }
    //window.getExtent = getExtent;

    //get max/min of values in bar chart
    function getBarExtent() {
      var repExtent = getExtent("percapconsumption"),
        electoralExtent = getExtent("totalconsumption");
      return [
        d3.min([repExtent[0], electoralExtent[0]]),
        d3.max([repExtent[1], electoralExtent[1]]),
      ];
    }

    function updateLegend(extent, colors, index) {
      var commaFormat = d3.format(",f0"),
        unit =
          index === "percapconsumption"
            ? " gallons per year"
            : " gallons per year",
        html =
          '<span class="legend-value">' + commaFormat(extent[0]) + "</span>";
      html += colors
        .map(function (color, i) {
          return (
            '<span class="legend-box" style="background-color:' +
            color +
            ';"></span>'
          );
        })
        .join("");
      html +=
        '<span class="legend-value">' +
        commaFormat(extent[1]) +
        unit +
        "</span>";
      $(".legend-scale").html(html);
    }

    function getTooltipColorScale(index) {
      //console.log(`getTooltipColorScale ${index}`)
      var extent = getExtent(index),
        colors = ["#e6eff9", "#c9e2f5", "#95cbee", "#0098db", "#0079ae"],
        colorScale = d3.scale.quantize().domain(extent).range(colors);
        //console.log(`colorScale ${colorScale}`)
      console.log(`extent ${extent}`)
        updateLegend(extent, colors, index);

      return colorScale;
    }

    d3.csv(
      "data/custom-tooltip.csv",
      function (r) {
        // write values to object using id as proprety name
        // id is the column name in the spreadsheet that maps to the layout and labels -- U.S. state two-letter abbreviations in default squaire.js settings
        tooltipData[r.State] = r;
        //remove id from dictionary values
        delete tooltipData[r.State].State;
        return r;
      },
      function (csv) {
        //callback when file loaded and data formatted
        tooltipColors = getTooltipColorScale(tooltipIndex);
        tooltipRepresentativesExtent = getBarExtent();
        //init map
        tooltipMap = new Squaire(tooltipData, {
          el: "#custom-tooltip",
          index: tooltipIndex,
          labelStyle: "ap",
          colors: tooltipColors,
          classIndex: "landlocked",
          tooltip: {
            enabled: true,
            mode: "toggle",
            el: "#custom-tooltip-toolbox",
            layout: tooltipBarLayout,
            whitelist: ["percapconsumption", "totalconsumption"],
            column1: "Category",
            column2: "Value",
          },
        });
      }
    );

    // specialized tooltip layout with bar chart in table
    var bars = ["percapconsumption", "totalconsumption"];

    function tooltipBarLayout(d) {
      var html =
        "<h6>" +
        tooltipMap.options.labels[d.box].full +
        "</h6>" +
        '<table class="table">';
      if (
        tooltipMap.options.tooltip.column1 ||
        tooltipMap.options.tooltip.column2
      ) {
        html +=
          "<tr><th>" +
          tooltipMap.options.tooltip.column1 +
          "</th><th>" +
          tooltipMap.options.tooltip.column2 +
          "</th></tr>";
      }
      tooltipMap.options.tooltip.whitelist.forEach(function (column) {
        //check data is defined
        if (
          d.data !== undefined &&
          d.data.hasOwnProperty(column) &&
          d.data[column] !== false &&
          d.data[column] !== ""
        ) {
          var data = isNaN(d.data[column])
            ? d.data[column]
            : parseFloat(d.data[column]).toFixed(0);
          html += "<tr><td>" + column + "</td><td>" + data + "</td></tr>";
        }
      });
      html += "</table>";
      html += '<table class="table table-bar hang">';
      bars.forEach(function (item) {
        var value = d.data[item];
        html +=
          "<tr><td>" +
          item +
          "</td><td>" +
          value +
          '</td><td><div class="bar' +
          (item === d.index ? " active" : "") +
          '" style="width:' +
          ((value ? value : 0) / tooltipRepresentativesExtent[1]) * 100 +
          '%"></div></td></tr>';
      });
      html += "</table>";
      return html;
    }

    var $buttons = $(".toggle-data-buttons");
    //change map via buttons
    $buttons.on("click", "button", function () {
      $buttons.find(".btn-primary").removeClass("btn-primary");
      var index = $(this).addClass("btn-primary").data("index"),
        colorScale = getTooltipColorScale(index);

      tooltipMap.update(false, {
        index: index,
        colors: colorScale,
      });
    });
  });
})();
