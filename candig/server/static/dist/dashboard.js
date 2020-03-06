"use strict";$(window).on("load",function(){changeClass("nav_1"),makeRequest("/datasets/search",{}).then(function(a){const b=JSON.parse(a),c=b.results.datasets;let d=document.getElementById("dropdown-menu");for(let b=0;b<c.length;b++)finalDatasetId.includes(c[b].id)||(finalDatasetId.push(c[b].id),finalDatasetName.push(c[b].name));for(let b=0;b<finalDatasetId.length;b++)d.innerHTML+="<a class=\"dropdown-item\" id=\"refresh\" href=\"javascript:void(0)\" onclick=\"refreshDataset("+b+")\">"+finalDatasetName[b]+"</a>";null==getCookie("datasetId")||-1==finalDatasetId.indexOf(getCookie("datasetId"))?(datasetId=finalDatasetId[0],setCookie("datasetId",datasetId),$("#dropdownMenuLink").html("<i class=\"fas fa-database\"></i> "+finalDatasetName[0])):(datasetId=getCookie("datasetId"),$("#dropdownMenuLink").html("<i class=\"fas fa-database\"></i> "+finalDatasetName[finalDatasetId.indexOf(datasetId)]));let e=new dashboard;e.initialize()},function(){alertBuilder("No datasets currently available. Please contact a system administrator for assistance."),noPermissionMessageMultiple(["queryStatus","responseToTreatment","therapeuticToResponses","cancerTypes","drugScatter","hospitals","timelineSamples"])})});function refreshDataset(a){datasetId=finalDatasetId[a],document.getElementById("warningMsg").style.display="none",setCookie("datasetId",datasetId),$("#dropdownMenuLink").html("<i class=\"fas fa-database\"></i> "+finalDatasetName[finalDatasetId.indexOf(getCookie("datasetId"))]);let b=new dashboard;b.initialize()}function dashboard(){function a(){document.getElementById("responseToTreatment").innerHTML="<div class=\"loader_bar\"></div>",document.getElementById("therapeuticToResponses").innerHTML="<div class=\"loader_bar\"></div>",document.getElementById("cancerTypes").innerHTML="<div class=\"loader_bar\"></div>",document.getElementById("drugScatter").innerHTML="<div class=\"loader_bar\"></div>",document.getElementById("hospitals").innerHTML="<div class=\"loader_bar\"></div>",document.getElementById("queryStatus").innerHTML="<div class=\"loader_bar\"></div>",document.getElementById("timelineSamples").innerHTML="<div class=\"loader_bar\"></div>"}function b(){makeRequest("/enrollments/search",{datasetId:datasetId}).then(function(a){var b,d=JSON.parse(a),e=d.results.enrollments,f=[];if(b=groupBy(e,"treatingCentreName"),0==Object.keys(b).length?noPermissionMessage("hospitals"):singleLayerDrawer("hospitals","bar","Hospital distribution",b),null==e[0].enrollmentApprovalDate)noPermissionMessage("timelineSamples");else{for(var g=0;g<e.length;g++)if(e[g].enrollmentApprovalDate){let a=new Date(e[g].enrollmentApprovalDate);e[g].enrollmentApprovalDate=a.getFullYear()}f=groupBy(e,"enrollmentApprovalDate");var h=Object.keys(f),j=Object.values(f),k=[0];j.forEach(function(a,b){var c=k[b]+a;k.push(c)}),k.shift(),c(j,h,k)}},function(){noPermissionMessageMultiple(["hospitals","timelineSamples"])})}function c(a,b,c){Highcharts.chart("timelineSamples",{chart:{type:"area",zoomType:"xy",style:{fontFamily:"Roboto"}},title:{text:"Samples received by years"},credits:{enabled:!1},exporting:{enabled:!1},xAxis:{categories:b,tickmarkPlacement:"on",title:{enabled:!1}},yAxis:{title:{text:""},labels:{formatter:function(){return this.value}}},tooltip:{split:!0,valueSuffix:""},plotOptions:{area:{stacking:"normal",lineColor:"#666666",lineWidth:1,marker:{lineWidth:1,lineColor:"#666666"}}},series:[{type:"column",name:"new sample",data:a},{type:"line",name:"Cumulative samples",data:c}]})}function d(a){var b={"Known Peers":a.status["Known peers"],"Queried Peers":a.status["Queried peers"],"Successful Communications":a.status["Successful communications"]};singleLayerDrawer("queryStatus","bar","Server status",b)}function e(a){let b={},c=[];searchRequest("diagnoses",["systematicTherapyAgentName","startDate","stopDate"],datasetId,{field:"cancerType",operator:"==",value:a},"chemotherapies").then(function(d){if(0==d.length)noPermissionMessage("drugScatter");else{for(let a=0;a<d.length;a++){let c,e=d[a],f=/\d{1,4}[/-]\d{1,2}[/-]\d{1,2}/;if(null==e.startDate.match(f)&&null==e.stopDate.match(f))try{c=parseInt(e.stopDate)-parseInt(e.startDate)}catch(a){continue}else{let a=new Date(e.startDate),b=new Date(e.stopDate);c=Math.floor((b-a)/86400000)}let g=e.systematicTherapyAgentName;b[g]?b[g].push(c):(b[g]=[],b[g].push(c))}let e=Object.keys(b);for(let a=0;a<e.length;a++)for(let d,f=0;f<b[e[a]].length;f++)d=[],d.push(a),d.push(b[e[a]][f]),c.push(d);Highcharts.chart("drugScatter",{chart:{renderTo:"drugScatter",type:"scatter",zoomType:"xy",style:{fontFamily:"Roboto"}},title:{text:"Time of drug treatment for "+a},credits:{enabled:!1},exporting:{enabled:!1},xAxis:{categories:e},yAxis:{title:{text:"days"}},tooltip:{formatter:function(){return""+this.x+", "+this.y+" days"}},plotOptions:{scatter:{marker:{symbol:"circle",radius:5,states:{hover:{enabled:!0,lineColor:"rgb(100,100,100)"}}},states:{hover:{marker:{enabled:!1}}}}},series:[{name:"Drugs",color:"rgba(223, 83, 83, .75)",data:c}]})}})}function f(a,b,c,d){if(d==null)noPermissionMessage(a);else{var f=Object.keys(d),g=Object.values(d),h=highChartSeriesObjectMaker(f,g);Highcharts.chart(a,{chart:{type:b,style:{fontFamily:"Roboto"}},credits:{enabled:!1},exporting:{enabled:!1},title:{text:c},xAxis:{type:"category"},legend:{enabled:!1},plotOptions:{series:{borderWidth:0,dataLabels:{enabled:!0}}},series:[{name:"count",colorByPoint:!0,data:h,cursor:"pointer",point:{events:{click:function(){e(this.name)}}}}]})}}this.initialize=function(){alertCloser(),a(),b(),countRequest("treatments",["responseToTreatment","therapeuticModality"],datasetId).then(function(a){d(JSON.parse(a));let b=JSON.parse(a).results.treatments[0];singleLayerDrawer("responseToTreatment","bar","Response to treatments",b.responseToTreatment),singleLayerDrawer("therapeuticToResponses","bar","Therapeutic Types",b.therapeuticModality)}),countRequest("diagnoses",["cancerType"],datasetId).then(function(a){let b=JSON.parse(a).results.diagnoses[0];if(f("cancerTypes","pie","Cancer types and corresponding treatment drugs",b.cancerType),b.cancerType){let a=Object.keys(b.cancerType);var c=a[Math.floor(Math.random()*a.length)];e(c)}else noPermissionMessage("drugScatter")})}}