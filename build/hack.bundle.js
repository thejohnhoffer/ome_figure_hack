"use strict";

(function () {
  var MODELS = window.figureModel.panels.models;
  var MODEL = MODELS.filter(function (m) {
    return m.attributes.selected;
  })[0];
  var LABELS = MODEL.attributes.channels.map(function (c) {
    return c.label;
  });
  var ID = MODEL.attributes.imageId;
  var URL = "https://omero.hms.harvard.edu/pathviewer/viewer/" + ID + "/channelgroups";

  var setSliderContent = function setSliderContent(content, i) {
    var root = 'channel_sliders';
    var sliders = document.getElementById(root).firstChild;
    var output = document.createElement("span");
    output.style.textOverflow = "ellipsis";
    output.style.marginTop = "-15px";
    output.style.textAlign = "center";
    output.style.position = "absolute";
    output.style.lineHeight = "100%";
    output.style.height = "100%";
    output.style.width = "100%";
    output.innerText = content;
    try {
      var group = sliders.children[i].getElementsByClassName('ch_slider')[0];
      group.appendChild(output);
    } catch (e) {
      console.error('No button ' + i + ' for ' + content);
    }
  };
  var readGroup = function readGroup(list, group) {
    return list.concat(group.channels.map(function (channel, i) {
      var label = LABELS[channel];
      if (i == 0) {
        return group.name + ": " + label;
      }
      return "" + label;
    }));
  };

  var readJSON = function readJSON(response) {
    var groups = JSON.parse(response).groups;
    var config_list = groups.reduce(readGroup, []);
    config_list.forEach(setSliderContent);
    document.body.addEventListener('mouseup', function () {
      window.setTimeout(function () {
        config_list.forEach(setSliderContent);
      }, 100);
    }, true);
  };
  var loadJSON = function loadJSON(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        readJSON(this.responseText);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  };
  loadJSON(URL);
})();
