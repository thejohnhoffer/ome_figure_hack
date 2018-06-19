(function() {
  // Backbone functions
  var getModel = key => {
    if (figureModel) {
      var model = figureModel.panels.getSelected().at(0);
      return model? model.get(key, undefined): undefined;
    }
  }
  var getLabels = () => {
    return getModel('channels').map(c => { return c.label });
  }
  var getUrl = () => {
    var rootUrl = "https://omero.hms.harvard.edu/pathviewer/viewer/";
    var id = getModel('imageId');
    if (id !== undefined) {
      return rootUrl + id + "/channelgroups";
    }
  }

  // DOM functions
  var makeSpan = content => {
    var output = document.createElement("span");
    output.style.textOverflow = "ellipsis";
    output.style.marginTop = "-15px";
    output.style.textAlign = "center";
    output.style.position = "absolute";
    output.style.lineHeight = "100%";
    output.style.height = "100%";
    output.style.width = "100%";
    output.innerText = content;
    return output; 
  }
  var setSliderContent = (content, i) => {
    var root = 'channel_sliders';
    var sliders = document.getElementById(root).firstChild;
    try {
      var group = sliders.children[i].getElementsByClassName('ch_slider')[0];
    }
    catch (e) {
      //console.error('No ' + content);
      return;
    }
    if (group.children.length === 3) {
      group.appendChild(makeSpan(content));
    }
  }

  // Core logic
  var runLoop = config => {
    var url = getUrl();
    if (url && config.url !== url) {
      loadJSON(url).then(runLoop);
      return;
    }
    if (url) {
      config.list.forEach(setSliderContent);
    }
    window.setTimeout(() => runLoop(config), 100);
  }
  var readGroup = (list, group) => {
    var labels = getLabels();
    return list.concat(group.channels.map((cid, i) => {
      var label = labels[cid];
      if (i == 0) {
        return group.name + ": " + label;
      }
      return "" + label;
    }));
  }
  var loadJSON = url => {
    return new Promise(function(resolve, reject) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var result = JSON.parse(this.responseText);
          var list = result.groups.reduce(readGroup, []);
          // runLoop
          resolve({
            "list": list,
            "url": url
          });
        }
      }
      xhttp.open("GET", url, true);
      xhttp.send();
    })
  }
  runLoop({});
})();
