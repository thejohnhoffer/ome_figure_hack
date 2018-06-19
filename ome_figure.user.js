// ==UserScript==
// @name        Omero Figure Channel Names
// @match       https://omero.hms.harvard.edu/figure/*
// @description Adds to Omero Figure: labels by group and channel.
// @author      John Hoffer and Jeremy Muhlich
// @namespace   http://hoff.in
// @version     1.2.2
// ==/UserScript==

"use strict";(function(){var getModel=function getModel(key){if(figureModel){var model=figureModel.panels.getSelected().at(0);return model?model.get(key,undefined):undefined}};var getLabels=function getLabels(){return getModel("channels").map(function(c){return c.label})};var getUrl=function getUrl(){var rootUrl="https://omero.hms.harvard.edu/pathviewer/viewer/";var id=getModel("imageId");if(id!==undefined){return rootUrl+id+"/channelgroups"}};var makeSpan=function makeSpan(content){var output=document.createElement("span");output.style.textOverflow="ellipsis";output.style.marginTop="-15px";output.style.textAlign="center";output.style.position="absolute";output.style.lineHeight="100%";output.style.height="100%";output.style.width="100%";output.innerText=content;return output};var setSliderContent=function setSliderContent(content,i){var root="channel_sliders";var sliders=document.getElementById(root).firstChild;try{var group=sliders.children[i].getElementsByClassName("ch_slider")[0]}catch(e){return}if(group.children.length===3){group.appendChild(makeSpan(content))}};var runLoop=function runLoop(config){var url=getUrl();if(url&&config.url!==url){loadJSON(url).then(runLoop);return}if(url){config.list.forEach(setSliderContent)}window.setTimeout(function(){return runLoop(config)},100)};var readGroup=function readGroup(list,group){var labels=getLabels();return list.concat(group.channels.map(function(cid,i){var label=labels[cid];if(i==0){return group.name+": "+label}return""+label}))};var loadJSON=function loadJSON(url){return new Promise(function(resolve,reject){var xhttp=new XMLHttpRequest;xhttp.onreadystatechange=function(){if(this.readyState==4&&this.status==200){var result=JSON.parse(this.responseText);var list=result.groups.reduce(readGroup,[]);resolve({list:list,url:url})}};xhttp.open("GET",url,true);xhttp.send()})};runLoop({})})();