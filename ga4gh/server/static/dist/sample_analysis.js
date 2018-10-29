"use strict";let sample_analysis_instance;$(window).on("load",function(){makeRequest("datasets/search",{}).then(function(a){const b=JSON.parse(a),c=b.results.datasets;let d=document.getElementById("dropdown-menu");for(let b=0;b<c.length;b++)finalDatasetId.includes(c[b].id)||(finalDatasetId.push(c[b].id),finalDatasetName.push(c[b].name));for(let b=0;b<finalDatasetId.length;b++)d.innerHTML+=`<a class="dropdown-item" id="refresh" href="javascript:void(0)" onclick="refreshDataset(' + j + ')">`+finalDatasetName[b]+"</a>";null==getCookie("datasetId")?(datasetId=finalDatasetId[0],$("#dropdownMenuLink").html("<i class=\"fas fa-database\"></i> "+finalDatasetName[0])):(datasetId=getCookie("datasetId"),$("#dropdownMenuLink").html("<i class=\"fas fa-database\"></i> "+finalDatasetName[finalDatasetId.indexOf(getCookie("datasetId"))])),"/sample_analysis"==location.pathname&&(sample_analysis_instance=new sample_analysis,sample_analysis_instance.initialize())},function(){document.getElementById("tab-content").style.display="none",alertBuilder("No data currently available. Please contact a system administrator for assistance.")})});function refreshDataset(a){datasetId=finalDatasetId[a],document.getElementById("warningMsg").style.display="none",setCookie("datasetId",datasetId),$("#dropdownMenuLink").html("<i class=\"fas fa-database\"></i> "+finalDatasetName[finalDatasetId.indexOf(getCookie("datasetId"))]),sample_analysis_instance.initialize()}var tableIds=["extractions","alignments","sequencing","variantcalling","fusiondetection","expressionanalysis"];function sample_analysis(){function a(a,b,c){let e={datasetId:datasetId,filters:[{field:"sampleId",operator:"==",value:c}]};makeRequest(a+"/search",e).then(function(c){d(JSON.parse(c),a,b)})}function b(){makeRequest("samples/search",{datasetId:datasetId}).then(function(a){var b=JSON.parse(a).results.samples;let d=document.getElementById("sampleSelect"),e=[];for(let c=0;c<b.length;c++)null!=b[c].sampleId&&e.push(b[c].sampleId);c("sampleSelect",e.sort())},function(){alertBuilder("No data currently available, either the server does not have it, or you do not have access to them.")})}function c(a,b){let c=document.getElementById(a);for(let d=0;d<b.length;d++)c.options[c.options.length]=new Option(b[d],b[d])}function d(a,b,c){document.getElementById(c).innerHTML="";for(var d,f=a.results[b],g=Object.keys(f[0]),h=[],l=["id","datasetId","name"],m=0;m<g.length;m++)d={},l.includes(g[m])||h.push(g[m]);for(var n,o=[{headerName:b,field:"field"},{headerName:"",field:"value"}],p=0;p<f.length;p++){n=[];for(var q,r=0;r<h.length;r++)q={},q.field=h[r].replace(/([a-z])([A-Z])/g,"$1 $2"),q.value=f[p][h[r]],n.push(q);e(o,n,c)}}function e(a,b,c){var d=document.querySelector("#"+c);new agGrid.Grid(d,{domLayout:"autoHeight",columnDefs:a,rowData:b,enableSorting:!0,enableFilter:!0,rowSelection:"multiple",defaultColDef:{width:120,editable:!0,filter:"agTextColumnFilter"},enableColResize:!0})}document.getElementById("sampleSearch").addEventListener("click",function(){document.getElementById("sample_analysis_title").style.marginTop="50px",document.getElementById("sample_analysis_title").style.marginBottom="50px";var b=document.getElementById("sampleSelect").value;for(let c=0;c<tableIds.length;c++)a(tableIds[c],tableIds[c],b)}),this.initialize=function(){document.getElementById("sample_analysis_title").style.marginTop="10%",document.getElementById("sample_analysis_title").style.marginBottom="100px",document.getElementById("extractions").innerHTML="",document.getElementById("alignments").innerHTML="",document.getElementById("sequencing").innerHTML="",document.getElementById("variantcalling").innerHTML="",document.getElementById("fusiondetection").innerHTML="",document.getElementById("expressionanalysis").innerHTML="",document.getElementById("sampleSelect").innerHTML="",b()}}