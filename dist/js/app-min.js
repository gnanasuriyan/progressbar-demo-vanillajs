var app;!function(){var t,e=window.app={};t=function(){var t=document.getElementById("container");new e.ProgressBarController(new e.ProgressBarView(t),new e.ProgressBarModel).init()},"loading"!==document.readyState?t():document.addEventListener?document.addEventListener("DOMContentLoaded",t):document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&t()})}(),(app=window.app||{}).ProgressBarController=function(){function t(t,e){if(arguments.length<2)throw new Error("Minimum two arguments required");this.progressBarView=t,this.progressBarModel=e}return t.prototype.init=function(){this.progressBarModel.on("loaded",this.updateView.bind(this)),this.progressBarModel.load()},t.prototype.updateView=function(t){this.progressBarView.render(t)},t}(),(app=window.app||{}).ProgressBarModel=function(){var t="http://pb-api.herokuapp.com/bars",e=function(){this.data=null,this.registers={}};return e.prototype.load=function(){var e,r,n;(e=t,r="GET",n=!0,new Promise(function(t,a){var o=new XMLHttpRequest;o.onreadystatechange=function(){4==this.readyState&&200==this.status&&t(this.responseText)},o.open(r.toUpperCase(),e,n),o.send()})).then(function(t){this.data=JSON.parse(t),this.fireEvent("loaded")}.bind(this))},e.prototype.on=function(t,e,r){if(arguments.length<2)throw new Error("Minimum two arguments required");if(this.registers.hasOwnProperty(t)||(this.registers[t]=[]),"[object Function]"!==toString.call(e))throw new Error("The callback should be a function");this.registers[t].push({method:e,scope:r})},e.prototype.fireEvent=function(t){if(this.registers.hasOwnProperty(t)){var e=this.registers[t];for(var r in e){var n=e[r];n.scope?n.method.call(n.scope,this.data):n.method(this.data)}}},e.prototype.setApiUrl=function(e){t=e},e.prototype.getData=function(){return this.data},e}(),(app=window.app||{}).ProgressBarView=function(){var t=null,e={},r=function(t){return 100===t?"width:100%;background-color:#ff0000;":"width:"+t+"%;background-color:#007bff;"},n=function(){for(var e=t.bars,n="",o='<select id="selected-bar">',s=0,i=e.length;s<i;s++){var d=Math.ceil(e[s]/t.limit*100);d<0&&(d=0),n+='<div class="progress mar-top-10"><div class="progress-bar" style="'+r(d)+'">'+d+"%</div></div>",o+='<option value="'+s+'">#progress '+(s+1)+"</option>"}return n+'<div class="mar-top-10 ">'+(o+="</select>")+a()+"</div>"},a=function(){var e=t.buttons,r="";for(var n in e)r+='<button class="btn btn-primary bar-button" data-index='+n+">"+e[n]+"</button>";return r+="<h5>Limit: "+t.limit+"</h5>"},o=function(n,a){var o=parseInt(n.getAttribute("data-index"));e.selectedBar||(e.selectedBar=a.getElementsByTagName("select")[0]);parseInt(e.selectedBar.value);e.bars||(e.bars=a.getElementsByClassName("progress-bar"));var s=parseInt(e.selectedBar.value);t.bars[s]=t.bars[s]+t.buttons[o],t.bars[s]>t.limit?t.bars[s]=t.limit:t.bars[s]<0&&(t.bars[s]=0);var i=Math.ceil(t.bars[s]/t.limit*100);e.bars[s].style=r(i),e.bars[s].innerHTML=i+"%"},s=function(t){for(var e=t.getElementsByClassName("bar-button"),r=0,n=e.length;r<n;r++)i(e[r],"click",function(){o(this,t)})},i=function(t,e,r){t.addEventListener?t.addEventListener(e,r):t.attachEvent&&t.attachEvent(e,r)},d=function(t){this.parentEl=t};return d.prototype.render=function(e){var r;t=e,(r=this.parentEl).innerHTML=n(),s(r)},d}();