"use strict";$(window).on("load",function(){makeRequest("datasets/search",{}).then(function(a){const b=JSON.parse(a),c=b.results.datasets;let d=document.getElementById("dropdown-menu");for(let b=0;b<c.length;b++)finalDatasetId.includes(c[b].id)||(finalDatasetId.push(c[b].id),finalDatasetName.push(c[b].name));for(let b=0;b<finalDatasetId.length;b++)d.innerHTML+="<a class=\"dropdown-item\" id=\"refresh\" href=\"javascript:void(0)\" onclick=\"refreshDataset("+b+")\">"+finalDatasetName[b]+"</a>";null==getCookie("datasetId")||-1==finalDatasetId.indexOf(getCookie("datasetId"))?(datasetId=finalDatasetId[0],setCookie("datasetId",datasetId),$("#dropdownMenuLink").html("<i class=\"fas fa-database\"></i> "+finalDatasetName[0])):(datasetId=getCookie("datasetId"),$("#dropdownMenuLink").html("<i class=\"fas fa-database\"></i> "+finalDatasetName[finalDatasetId.indexOf(datasetId)]))},function(){alertBuilder("No data currently available. Please contact a system administrator for assistance.")})});function refreshDataset(a){datasetId=finalDatasetId[a],document.getElementById("warningMsg").style.display="none",setCookie("datasetId",datasetId),$("#dropdownMenuLink").html("<i class=\"fas fa-database\"></i> "+finalDatasetName[finalDatasetId.indexOf(getCookie("datasetId"))])}var statusCode=0;if($("#firstRG").empty(),$("#secondRG").empty(),$("#igvSample").empty(),document.getElementById("request").value="",document.getElementById("readGroupSelector").style.display="none",document.getElementById("geneTable_wrap").style.display="none",document.getElementById("title").style.marginTop="10%",""!=document.getElementById("geneTable").innerHTML&&-1!=statusCode){var table=$("#geneTable").DataTable();table.destroy(),document.getElementById("geneTable").innerHTML="",statusCode=0}document.getElementById("searchBtn").addEventListener("click",submit),document.getElementById("confirmRG").addEventListener("click",rg_submit);function submit(){if($("#firstRG").empty(),$("#secondRG").empty(),$("#igvSample").empty(),1==statusCode&&""!=document.getElementById("geneTable").innerHTML){var a=$("#geneTable").DataTable();a.destroy(),document.getElementById("geneTable").innerHTML=""}document.getElementById("loader").style.display="block",document.getElementById("geneTable").innerHTML="",document.getElementById("readGroupSelector").style.display="none";var b=document.getElementById("request").value,c={datasetId:datasetId,gene:b,pageSize:"10000"};makeRequest("/variantsbygenesearch",c).then(function(a){var c=JSON.parse(a),d=c.results.variants;tableMaker(d),readGroupFetcher(b,d),document.getElementById("igvSample").style.display="block",statusCode=1},function(){document.getElementById("loader").style.display="none",document.getElementById("igvSample").style.display="none",document.getElementById("geneTable").innerHTML="Sorry, but we are not able to locate the gene.",statusCode=-1})}function freqCounter(a){result={};for(var b=0;b<a.length;b++)result[a[b]]||(result[a[b]]=0),++result[a[b]];return result}let readGroupsetsDict={};function readGroupFetcher(a,b){makeRequest("readgroupsets/search",{datasetId:datasetId}).then(function(c){var d=JSON.parse(c).results.readGroupSets;let e=[];readGroupsetsDict={};try{let c=b[0].referenceName.replace("chr","");for(let a=0;a<d.length;a++){let b=[],c={referenceId:"",referenceSetId:d[a].readGroups[0].referenceSetId,readGroupSetIds:d[a].id,name:d[a].name};for(let c=0;c<d[a].readGroups.length;c++)b.push(d[a].readGroups[c].id);c.readGroupIds=b,readGroupsetsDict[d[a].name]=c}readGroupsetsDict.chromesomeId=c,readGroupsetsDict.geneRequest=a;let f=document.getElementById("rgSelect");f.innerHTML="";for(let a=0;a<d.length;a++)e.push(d[a].name);e.sort();for(let a=0;a<e.length;a++)f.options[f.options.length]=new Option(e[a],e[a]);$(".selectpicker").selectpicker("refresh"),document.getElementById("readGroupSelector").style.display="block"}catch(a){alertBuilder("We are sorry, but the IGV browser cannot be rendered.")}},function(){alertBuilder("We are sorry, but the IGV browser cannot be rendered.")})}function rg_submit(){let a=$(".selectpicker").val();if(alertCloser(),null==a||3<a.length)alertBuilder("Please specify at least one, but no more than three read group sets.");else try{let b=[];for(let c,d=0;d<a.length;d++)c=referenceIdFetcher(readGroupsetsDict[a[d]].referenceSetId,a[d],readGroupsetsDict.chromesomeId),b.push(c);b.push(variantSetIdFetcher(a)),Promise.all(b).then(function(b){igvCaller(b,readGroupsetsDict.chromesomeId,a,readGroupsetsDict.geneRequest)})}catch(a){alertBuilder("The IGV Browser cannot be rendered for the selected read group sets.")}}function igvCaller(a,b,c,d){let e,f;for(let f=0;f<a.length;f++)a[f].referenceId?readGroupsetsDict[a[f].name].referenceId=a[f].referenceId:e=variantsTrackGenerator(a[f],b);f=alignmentTrackGenerator(c);let g=[].concat(e,f);g.push({name:"Genes",type:"annotation",format:"bed",sourceType:"file",url:"https://s3.amazonaws.com/igv.broadinstitute.org/annotations/hg19/genes/refGene.hg19.bed.gz",indexURL:"https://s3.amazonaws.com/igv.broadinstitute.org/annotations/hg19/genes/refGene.hg19.bed.gz.tbi",order:Number.MAX_VALUE,visibilityWindow:3e8,displayMode:"EXPANDED",height:300}),igvSearch(d,g)}function alignmentTrackGenerator(a){let b=[];for(let c,d=0;d<a.length;d++)c={sourceType:"ga4gh",type:"alignment",url:prepend_path+"",referenceId:readGroupsetsDict[a[d]].referenceId,readGroupIds:readGroupsetsDict[a[d]].readGroupIds,readGroupSetIds:readGroupsetsDict[a[d]].readGroupSetIds,name:a[d]},0==b.length?b.push(c):b[0].name!=c.name&&b.push(c);return b}function variantsTrackGenerator(a,b){let c=[];for(let d,e=0;e<a.length;e++)d={sourceType:"ga4gh",type:"variant",url:prepend_path+"",referenceName:b,variantSetIds:"",name:"",pageSize:1e4,visibilityWindow:1e5},d.name=a[e].name,d.variantSetId=a[e].variantSetId,c.push(d);return c}function referenceIdFetcher(a,b,c){return new Promise(function(d,e){makeRequest("references/search",{referenceSetId:a}).then(function(a){let f="";try{let e=JSON.parse(a).results.references;for(let a,b=0;b<e.length;b++)a=e[b].name.replace("chr",""),a==c&&(f=e[b].id);d({name:b,referenceId:f})}catch(a){e({name:b,referenceId:""}),alertBuilder("We are sorry, but some parts of IGV may not work correctly.")}},function(){e({name:b,referenceId:""}),alertBuilder("We are sorry, but some parts of IGV may not work correctly.")})})}function variantSetIdFetcher(a){return new Promise(function(b){makeRequest("variantsets/search",{datasetId:datasetId}).then(function(c){let d=JSON.parse(c).results.variantSets,e=[];for(let b=0;b<d.length;b++)if(a.includes(d[b].name)){let a={};a.name=d[b].name,a.variantSetId=d[b].id,e.push(a)}b(e)})})}function igvSearch(a,b){var c=document.getElementById("igvSample"),d={locus:a,genome:"hg19",reference:{id:"hg19",fastaURL:"https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/1kg_v37/human_g1k_v37_decoy.fasta",cytobandURL:"https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/b37/b37_cytoband.txt"},oauthToken:session_id,showRuler:!0,tracks:b};igv.createBrowser(c,d)}function tableMaker(a){var b,c,d,e=$("<table/>").attr("id","geneTable"),f={};$("#geneTable").append("<thead><tr><th scope=\"col\" >Reference Name</th><th scope=\"col\">Start</th><th scope=\"col\">End</th> <th scope=\"col\">Length</th><th scope=\"col\">Reference Bases</th><th scope=\"col\">Alternate Bases</th><th scope=\"col\">Frequency</th><th scope=\"col\">Names</th></tr></thead><tbody>");for(var g=[],h=0;h<a.length;h++){var k=a[h],l={referenceName:k.referenceName,start:k.start,end:k.end,referenceBases:k.referenceBases,alternateBases:k.alternateBases,names:k.names};g.push(JSON.stringify(l))}for(var h=0;h<g.length;h++)f[g[h]]||(f[g[h]]=0),++f[g[h]];for(var m=Object.keys(f),n=Object.values(f),o=0;o<m.length;o++){var p=JSON.parse(m[o]),c=p.referenceName;d=c.includes("chr")?c.replace("chr","Chromosome "):"Chromosome "+c;var q="<td scope=\"col\">"+d+"</td>",r="<td scope=\"col\">"+p.start+"</td>",s=p.end-p.start,t="<td scope=\"col\">"+p.end+"</td>",u="<td scope=\"col\">"+p.referenceBases+"</td>",v="<td scope=\"col\">"+p.alternateBases+"</td>",w="<td scope=\"col\">"+n[o].toString()+"</td>";if(p.names!=null){b="";for(var h=0;h<p.names.length;h++)p.names[h].includes("rs")?(0<h&&(b+=", "),b+="<a href=\"https://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs="+p.names[h]+"\">"+p.names[h]+"</a>"):p.names[h].includes("COSM")?(0<h&&(b+=", "),b+="<a href=\"https://cancer.sanger.ac.uk/cosmic/mutation/overview?id="+p.names[h].split("COSM")[1]+"\">"+p.names[h]+"</a>"):(0<h&&(b+=", "),b+=", "+p.names[h])}else b="Not Found";var x="<td scope=\"col\">"+b+"</td>";$("#geneTable").append("<tr>"+q+r+t+("<td scope=\"col\">"+s+"</td>")+u+v+w+x+"</tr>")}$("#geneTable").append("</tbody>"),$(document).ready(function(){$("#geneTable").DataTable(),document.getElementById("geneTable_info").innerHTML+=", aggregated from "+a.length+" records."}),document.getElementById("geneTable_wrap").style.display="block",document.getElementById("title").style.marginTop="50px",document.getElementById("loader").style.display="none"}