(function() {
  var setSliderContent = (content, i) => {
    var root = 'channel_sliders';
    var sliders = document.getElementById(root).firstChild;
    var output = document.createElement("span");
    output.style.textOverflow = "ellipsis";
    output.style.verticalAlign = "middle";
    output.style.textAlign = "center";
    output.style.position = "absolute";
    output.style.lineHeight = "100%";
    output.style.height = "100%";
    output.style.width = "100%";
    output.innerText = content;
    try {
      var group = sliders.children[i].getElementsByClassName('ch_slider')[0];
      group.appendChild(output);
    }
    catch {
      console.error('No button ' + i + ' for ' + content);
    }
  }
  // Define Element Styles
  var readLine = (result, l, i) => {
    var [name, cycle] = l;
    var content = name
    if (result.count !== cycle) {
      result.count = cycle;
      content = "(" + cycle + "):" + name;
    }
    result.list.push(content);
    return result;
  }
  // Validate cycles
  var cleanLine = l => {
    var [name, cycle] = l.split(',');
    cycle = parseInt(cycle, 10);
    if (isNaN(cycle)) {
      return false;
    }
    return [name, cycle];
  }
  // Handle the csv file
  var readFile = f => {
    var reader = new FileReader();
    reader.onload = function(progressEvent){
      var lines = this.result.split('\n').map(cleanLine).filter(Boolean);
      var config = lines.reduce(readLine, {list: []});
      config.list.forEach(setSliderContent);
      document.body.addEventListener('mouseup', ()=>{
        window.setTimeout(() => {
          config.list.forEach(setSliderContent);
        }, 100);
      }, true); 
    };
    reader.readAsText(f);
  };
  // Present UI for uploading file
  var input = document.createElement("input");
  input.type = "file";
  input.style = "position:fixed; top:0; width:100%; height:100%; background:white; z-index: 999;";
  input.addEventListener('change', evt => {
    document.body.removeChild(input);
    var f = evt.target.files[0];
    if (f.type.match('.*csv') || f.name.match('.*csv')){
      readFile(f);
    }
  });
  document.body.appendChild(input);
})();

