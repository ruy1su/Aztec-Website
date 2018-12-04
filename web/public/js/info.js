/**
 * @class Info
 * @constructor
 * @classdesc populates the tool information page with the resource information passed in
 * @param {Resource} resource - resource to show
 */

function Info(resource) {
    var acc = "";

    if (resource.name) {
        var typeArr = [];
        var typeStr = "";

        if(resource.types){
            for(var i = 0; i < resource.types.length; i++){
                if (resource.types[i].match(/widget/i)) {
                    typeArr.push("W");
                }
                else if (resource.types[i].match(/database/i)) {
                    typeArr.push("D");
                }
                else if (resource.types[i].match(/tool/i)) {
                    typeArr.push("T");
                }
            }
        }

        if(typeArr.length === 0)
            typeArr.push("O");

        for(var i = 0; i < typeArr.length; i++){
            typeStr += '<span class="icon-stack" style="margin-bottom:5px;"><i class="icon-sign-blank icon-stack-base" style="color: ';

            if(typeArr[i]==="T"){
                typeStr += 'rgb(135, 172, 235)';
            } else if(typeArr[i]==="W"){
                typeStr += 'rgb(135, 206, 235)';
            } else if(typeArr[i]==="D"){
                typeStr += 'rgb(135, 139, 235)';
            } else {
                typeStr += 'rgb(164, 135, 235)';
            }
            typeStr += '"></i>';


            typeStr += '<span class="icon-fixed-width icon-light char-overlay" style="padding:0px;font-weight:600">' + typeArr[i] + '</span></span>';

        }

        var duplicateMsg = '';
        if(resource.mergedID){
            duplicateMsg+='<br/><span style="color:white; background-color:red; font-size:16px;">This entry is a duplicate of <a style="color:blue" href="/AZ'+resource.mergedID+'">Entry '+formatAZID(resource.mergedID)+'</a></span>'
        }

        $("#name").html(typeStr + '<span style="margin-left:15px; font-weight:600; font-weight:bold">' + resource.name + '</span>'+duplicateMsg);
        $("[data-icon]").html(typeStr + '<span style="margin-left:15px; font-weight:600; font-weight:bold">' + resource.name[0] + '</span>');

        if(resource.editable){
            $("#name").html($("#name").html() + '&nbsp; &nbsp; <a href="/tool/edit?id=' + resource.id + '" class="btn btn-info" role="button">Edit Resource</a>') //change: put in if block
        }
    }
    var tDescription = "NA";
    if (resource.description) {
        tDescription = autoLink(resource.description);
    }
    $("#tdescription").html(tDescription);

    var detail_count = 0;

    var linkArr = [];
    var tSourcecode_list = [];
    var tRelatedLinks_list = [];

    if (!resource.linkUrls) {
      resource.linkUrls = [];
    }
    if (resource.codeRepoURL && !resource.linkUrls.indexOf(resource.codeRepoURL)>0)
        resource.linkUrls.push(resource.codeRepoURL);

    if (resource.repoHomepage && !resource.linkUrls.indexOf(resource.repoHomepage)>0)
        resource.linkUrls.push(resource.repoHomepage);

    resource.linkUrls = Array.from(new Set(resource.linkUrls));

    for(var i=0;i<resource.linkUrls.length;i++){
        resource.linkUrls[i] = resource.linkUrls[i].replace(".Contact", "")
        if(resource.linkUrls.length==1 || (resource.linkUrls[i].trim()!="" && (resource.linkUrls[i].indexOf('github') >= 0 ||
            resource.linkUrls[i].indexOf('code')>=0 || resource.linkUrls[i].indexOf('bitbucket')>=0 ||
            resource.linkUrls[i].indexOf('bioconductor')>=0 ||
            resource.linkUrls[i].indexOf('sourceforge')>=0))){
            tSourcecode_list.push("<a href='" + resource.linkUrls[i].trim() + "' target='_blank'>" + resource.linkUrls[i].trim() + "</a>");
        }else{
            tRelatedLinks_list.push("<a href='" + resource.linkUrls[i].trim() + "'>" + resource.linkUrls[i].trim() + "</a>");
        }
    }
    // if(tSourcecode_list.length==0){
    //     for(var i=0;i<resource.linkUrls.length;i++){
    //         if(resource.linkUrls[i].indexOf('oxfordjournals') < 0){
    //             tSourcecode_list.push("<a href='" + resource.linkUrls[i].trim() + "'>" + resource.linkUrls[i].trim() + "</a>");
    //         }
    //     }
    // }
    if(tSourcecode_list.length>0){
        var tSourcecode = createList(tSourcecode_list);
        $("#h_detail_"+String(detail_count)).html('Source Code:');
        $("#detail_"+String(detail_count)).html(tSourcecode);
        detail_count++;
    }


    if (tRelatedLinks_list && tRelatedLinks_list.length>0) {
        var tRelated_links = createList(tRelatedLinks_list);
        $("#detail_"+String(detail_count)).html(tRelated_links);
        $("#h_detail_"+String(detail_count)).html('Related Links:');
        detail_count++;
    }

    if (resource.mergedFrom) {
        var mergedList = [];
        for(var i = 0; i<resource.mergedFrom.length; i++){
            mergedList.push('<a href="/AZ'+resource.mergedFrom[i]+'">Entry '+formatAZID(resource.mergedFrom[i])+'</a>')
        }
        var description = "This entry's metadata was combined from the following entries:";
        $("#detail_"+String(detail_count)).html(description+createList(mergedList));
        $("#h_detail_"+String(detail_count)).html('Combined From:');
        detail_count++;
    }

    if (resource.duplicateWith) {
        var duplicateList = [];
        for(var i = 0; i<resource.duplicateWith.length; i++){
            duplicateList.push('<a href="/AZ'+resource.duplicateWith[i]+'">Entry '+formatAZID(resource.duplicateWith[i])+'</a>');
        }
        var description = "This entry is a duplicate of the following entries:";
        $("#detail_"+String(detail_count)).html(description+createList(duplicateList));
        $("#h_detail_"+String(detail_count)).html('Other Duplicates:');
        detail_count++;
    }

    if (resource.domains && resource.domains.length>0) {
      var domain_list = createList(resource.domains);
      $("#detail_"+String(detail_count)).html(domain_list);
      $("#h_detail_"+String(detail_count)).html('Domains:');
      detail_count++;
    }


    // didn't show in this version
    if (resource.toolDOI) {
        acc += createAcc("Tool DOI", resource.toolDOI);
    }
    if (resource.versionNum) {
        acc += createAcc("Version Number", resource.versionNum);
    }
    if (resource.versionDate) {
        acc += createAcc("Version Date", resource.versionDate);
    }
    if(resource.dateCreated) {
        acc += createAcc("Date Created", resource.dateCreated);
    }
    //
    var tTypes_list = ['NA'];
    if (resource.types) {
        tTypes_list = resource.types;
    }
    var tTypes = createList(tTypes_list);
    $("#ttypes").html(tTypes);

    var regEx = /<|>/g;

    if (resource.licenses) {
        var licenseArr = [];
        for(var i = 0; i < resource.licenses.length; i++){
            if(resource.licenseUrls[i].length > 0){
                licenseArr.push(resource.licenses[i] + " &lt;" + resource.licenseUrls[i].replace(regEx,"") + "&gt;");
            }
            else
                licenseArr.push(resource.licenses[i]);
        }
        var tLicense= licenseArr.join('; ').trim();
    }
    else{
        var tLicense = "No License";
    }
    $("#tlicense").html(tLicense);
    //not use

    //
    var tDatatypes ="NA";
    if (resource.dataTypes) {
        acc += createAccList("Data Types", resource.dataTypes);
        tDatatypes = resource.dataTypes;
    }
    $("#tdatatypes").html(tDatatypes);



    if (resource.language && resource.language.length>0) {
        var tLanguage_list=resource.language;
        var tLanguage = createList(tLanguage_list);
        $("#detail_"+String(detail_count)).html(tLanguage);
        $("#h_detail_"+String(detail_count)).html('Tool Languages:');
        detail_count++;
    }

    if (resource.platforms && resource.platforms.length>0) {
        tPlatforms = createList(resource.platforms);
        $("#detail_"+String(detail_count)).html(tPlatforms);
        $("#h_detail_"+String(detail_count)).html('Supported Platforms:');
        detail_count++;
    }

    var tAuthor = "";
    if(resource.authors){
        var authorArr = [];
        for(var i = 0; i < resource.authors.length; i++){
            if(resource.authorEmails && resource.authorEmails[i] > 0){
                authorArr.push(resource.authors[i] + " &lt;" + resource.authorEmails[i].replace(regEx,"") + "&gt;");
            }
            else
                authorArr.push(resource.authors[i]);
        }
        tAuthor = authorArr.join('; ');
    }
    $("#tauthor").html(tAuthor);

    if(resource.maintainers){
        var maintainerArr = [];
        for(var i = 0; i < resource.maintainers.length; i++){
            if(resource.maintainerEmails && resource.maintainerEmails[i].length > 0){
                maintainerArr.push(resource.maintainers[i] + " &lt;" + resource.maintainerEmails[i].replace(regEx,"") + "&gt;");
            }
            else
                maintainerArr.push(resource.maintainers[i]);
        }
        var tMaintainers = createList(maintainerArr);
    }
    else{
        var maintainerArr = [];
        if(resource.emails){
            for(var i=0; i<resource.emails.length; i++){
              var email = resource.emails[i].split(' ')[0];
              maintainerArr.push("<a href='mailto:" + email + "'>" + email + "</a>");
            }
        }
        if(resource.repoOwner){
            maintainerArr.push("<span>" + resource.repo + ": " + resource.repoOwner + "</span>");
        }
        if(maintainerArr.length==0){
            maintainerArr.push('NA');
        }
        var tMaintainers = createList(maintainerArr);
    }
    $("#tmaintainers").html(tMaintainers);

    var tInstitutions = "";
    if(resource.institutions){
        acc += createAccList("Institutions", resource.institutions);
        tInstitutions = resource.institutions.join('; ');
        $("#detail_"+String(detail_count)).html(createList(resource.institutions));
        $("#h_detail_"+String(detail_count)).html('Institutions:');
        detail_count++;
    }



    var tFundings="";
    if(resource.funding){
        var funding_arr = [];
        var agency_set = new Set();
        for(var i=0; i<resource.funding.length; i++){
          var colon = resource.funding[i].indexOf(':');
          var agency = resource.funding[i].substring(0, colon);
          if(resource.funding[i].indexOf('not found')>0){
            if(!agency_set.has(agency)){
                funding_arr.push(resource.funding[i].substring(0, colon));
            }
          }else{
            funding_arr.push(resource.funding[i])
          }
          agency_set.add(agency);
        }
        tFundings = createList(funding_arr);
    }
    else{
        tFundings = createList(['NA'])
    }
    $("#tfundings").html(tFundings);


    var tSource ="";
    if (resource.source) {
        $("#detail_"+String(detail_count)).html(resource.source);
        $("#h_detail_"+String(detail_count)).html('Source:');
        detail_count++;
    }
    $("#tsource").html(tSource);

    var tTag = "";
    if(resource.tags){
        var tagsHtml = "";
        tagsHtml += '<div class="row" id="tagRemove" align="left"><div class="tag col-lg-12"  style="padding-bottom: 5px;padding-top: 5px">';
        for(var i = 0; i < resource.tags.length; i++){
            tagsHtml += '&nbsp;<button type="button" class="btn btn-info btn-xs" style="font-weight: bold;font-size:14px;border-radius:10px;margin-bottom:5px;padding-left:12px;padding-right: 12px">' + resource.tags[i] + '</button>';
        }
        tagsHtml += '</div></div>';
        //$("#tag").html('<b>Tags: </b><span>' + tagsHtml + '</span>');
        tTag = tagsHtml;
    }
    $("#ttagsHtml").html(tTag);

    var doiArr = ['NA'];
    var actdoi = "";
    //var outPublication = "Not Available";
    var outPublication = "";
    if (resource.publicationDOI) {
        var dois = resource.publicationDOI;
        if(resource.otherPublicationDOI)
            dois = dois.concat(resource.otherPublicationDOI);
        var doiArr = [];
        for(var i = 0; i < dois.length; i++){
            var doi = dois[i].replace(/ *\([^)]*\) */g, "");
            if(doi.substring(0,4).toLowerCase() == 'doi:'){
                actdoi = doi.substring(4);
            }
            else{
                actdoi = doi;
            }
            doiArr.push('DOI: <a href="http://dx.doi.org/' + actdoi.trim() + '">' + actdoi.trim() + '</a>');
        }
        var doi = dois[0].replace(/ *\([^)]*\) */g, "");
        if(doi.substring(0,4).toLowerCase() == 'doi:'){
            actdoi = doi.substring(4);
        }
        else{
            actdoi = doi;
        }
        var doiCrossref = actdoi.trim();
        if( !isNaN(doiCrossref[0])){ //still some invalid doi in our database
            //PublicationInfo = getPublication(doiCrossref);//string(JSON) from crossref
            getPublication(doiCrossref);
            //var outPublication = changeFormatPublication(PublicationInfo);
            //changeFormatCitationAPA(PublicationInfo);
            //changeFormatCitation(doiCrossref); //for Cite part
            /*if(PublicationInfo!=""){
                var outPublication = changeFormatPublication(PublicationInfo);
                changeFormatCitationAPA(PublicationInfo);
                changeFormatCitation(doiCrossref); //for Cite part
            } //for PUBLICATION part*/
            // else{
            //     $("#citationAPAinfo").html("Not Available")
            // }
        }
        else{
            $("#citationAPAinfo").html("Not Available");
            $("#citationBibinfo").html("Not Available");
        }
    }
    else {
        $("#citationAPAinfo").html("Not Available");
        $("#citationBibinfo").html("Not Available");
    }
    //$("#publicationinfo").html(outPublication);
    //tPublications = createList(doiArr);
    //$("#tpublications").html(tPublications);

    var svgElement = document.getElementsByTagName("svg");
    $("svg").css("width", "100%");
    //svgElement[0].setAttribute("width", "100%");
    //svgElement[0].removeAttribute("height");


    $("#accordion").html(acc);
    $('#submitTopForm').submit(function() {
        filteredBy = ["name", "description", "id", "authors"];
        filtersText = $("#topQuery").val();

        inputTypes = [];
        inputFilters = [];

        var filters = {};

        for (i = 0; i < filteredBy.length; i++) {
            filters[filteredBy[i]] = filtersText;
            inputTypes.push(filteredBy[i]);
            inputFilters.push(filtersText);
        }

        var parameters = {};
        parameters.searchFilters = filters;

        $("#sendTopJson").val(JSON.stringify(parameters));
        $("#submitTopForm").submit();
        return false; // return false to cancel form action
    });

//popup citation
    var modal = document.getElementById('citationAPA');
    var modal2 = document.getElementById('citationBibTex');
    var citation = document.getElementById('citation');
    var bib = document.getElementById('bibtex');
    var span1 = document.getElementsByClassName("close")[0];
    var span2 = document.getElementsByClassName("close")[1];

    citation.addEventListener('click', popupCitation1);
    function popupCitation1(){
        //alert("Publication Information");
        modal.style.display = "block";

    }
    bib.addEventListener('click', popupCitation2);
    span2.onclick = function() {
        modal2.style.display = "none";
    }

    function popupCitation2(){
        //alert("Publication Information");
        modal2.style.display = "block";
    }
    span1.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        if (event.target == modal2) {
            modal2.style.display = "none";
        }
    }
}
accCount = 0;
function createAcc(header, text){
    var ret = '<div class="panel panel-default" style="margin-bottom:15px"> <div class="panel-heading" style="background-image: linear-gradient(to bottom,#d6ebf2 0,#BBD2DB 100%); background-color: white; color:midnightblue"role="tab" id="heading'
    ret += accCount;
    ret += '"> <h4 class="panel-title"> <span role="button" data-toggle="collapse" href="#collapse';
    ret += accCount;
    ret += '" aria-expanded="true" aria-controls="collapse'
    ret += accCount + '">';
    ret += '<b>' + header + '</b>';
        ret += '&nbsp; &nbsp;<i class="fa fa-caret-down"></i></span></h4> </div> <div id="collapse';
    ret += accCount;
    ret += '" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading'
    ret += accCount;
    ret += '"><div class="panel-body" style="background-image: linear-gradient(to bottom,#eef7fa 0,#f6fbfc 100%); padding-left:25px">';
    ret += text;
    ret += '</div></div></div>';
    accCount++;
    return ret;
}

function formatAZID(id){
    var result = 'AZ'
    var id_length = 7;
    var id_str = String(id);
    var padding_length = id_length-id_str.length;

    for(var i = 0; i<padding_length; i++){
        result+='0';
    }
    result+=id_str;

    return result;
}

function createAccList(header, arr){
    var ret = '<div class="panel panel-default" style="margin-bottom:15px"> <div class="panel-heading" style="background-image: linear-gradient(to bottom,#d6ebf2 0,#BBD2DB 100%); background-color: white; color:midnightblue"role="tab" id="heading'
    ret += accCount;
    ret += '"> <h4 class="panel-title"> <span role="button" data-toggle="collapse" href="#collapse';
    ret += accCount;
    ret += '" aria-expanded="true" aria-controls="collapse'
    ret += accCount + '">';
    ret += '<b>' + header + '</b>';
    ret += '&nbsp; &nbsp;<i class="fa fa-caret-down"></i></span></h4> </div> <div id="collapse';
    ret += accCount;
    ret += '" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading'
    ret += accCount;
    ret += '"><ul class="list-group">';
    for(var i = 0; i < arr.length; i++)
        ret += '<li class="list-group-item" style="background-image: linear-gradient(to bottom,#eef7fa 0,#f6fbfc 100%); padding-left:25px">' + arr[i] + '</li>';
    ret += '</ul></div></div>';
    accCount++;
    return ret;
}

function createList(arr){
    var ret = "";
    ret += '<div class="list-group">';
    for(var i = 0; i < arr.length; i++)
        ret += '<li class="" style="padding-left:33px">' + arr[i] + '</li>';
    ret += '</div>';
    return ret;
}


// get publication information by DOI
function setXMLHttpRequest() {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhr;
}

var xmlhttp = setXMLHttpRequest();
var xmlhttp2 = setXMLHttpRequest();
function getPublication(DOI){
    var information = "";
    var url = 'https://api.crossref.org/works/'+DOI+'/transform/application/vnd.citationstyles.csl+json';//application/x-bibtex'
    xmlhttp.open("GET",url,true);//syn or asynronous????
    //alert(xmlhttp.status);
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //var outPublication='<div class="row" style="margin:20px"><div class="col-md-1"></div><div class="col-md-10" style="padding:20px"><div class="" style="overflow:hidden;margin-right:20px; margin-left:20px" align="left"><h3 class="text-center">PUBLICATIONS</h3></div></div></div>';
            var JSONinfo = JSON.parse(xmlhttp.responseText);
            var outPublication = '<div class="col-md-1"></div><div class="col-md-10" style="background-color:#FFFFFF;padding:20px"><div class="" style="overflow:hidden;margin-right:20px; margin-left:20px" align="left">';
            outPublication = outPublication+'<div class="row"><div class="col-md-6" style="padding-left:20px"><h4 class="text-left" style="font-weight:bold">Title:</h4><div style="padding-left:33px;margin-bottom: 10px">';
            outPublication = outPublication+JSONinfo.title+'</div></div>';
            outPublication = outPublication+'<div class="col-md-6" style="padding-left:20px"><h4 class="text-left" style="font-weight:bold">Author:</h4><div style="padding-left:33px;margin-bottom: 10px">';
            for(var i=0;i<JSONinfo.author.length;i++){
                outPublication=outPublication+JSONinfo.author[i].family+', '+JSONinfo.author[i].given+'; ';
            }
            outPublication = outPublication+'</div></div></div>';
            outPublication = outPublication+'<div class="row"><div class="col-md-6" style="padding-left:20px"><h4 class="text-left" style="font-weight:bold">Journal:</h4><div style="padding-left:33px;margin-bottom: 10px">'+JSONinfo['container-title']+'</div></div>';
            outPublication = outPublication+'<div class="col-md-6" style="padding-left:20px"><div class="" style="overflow:hidden;margin-right:20px; margin-left:20px" align="left"><h4 class="text-left" style="font-weight:bold">Date:</h4><div style="padding-left:33px;margin-bottom: 10px">'+mapDate(JSONinfo.deposited['date-parts'][0])+'</div></div></div>';
            outPublication = outPublication+'<div class="col-md-6"><h4 class="text-left" style="font-weight:bold">Publications:</h4><div style="padding-left:33px">'+'DOI: <a href="http://dx.doi.org/' + JSONinfo.DOI + '">' + JSONinfo.DOI + '</a>'+'</div></div></div>';
            outPublication=outPublication+'</div></div>';
            document.getElementById("pubtitle").innerHTML = "PUBLICATIONS";
            document.getElementById("publicationinfo").innerHTML = outPublication;
            var outAPA = "<h4>APA</h4><p>";
            //var JSONinfo = JSON.parse(information);
            for(var i=0;i<JSONinfo.author.length-1;i++){
                outAPA=outAPA+JSONinfo.author[i].family+", ";
                var givenname = JSONinfo.author[i].given.split(" ");
                for(var j = 0; j<givenname.length;j++){
                    outAPA=outAPA+givenname[j][0]+". ";
                }
                outAPA=outAPA+', ';
            }
            outAPA=outAPA+JSONinfo.author[JSONinfo.author.length-1].family+", ";
            var givenname = JSONinfo.author[i].given.split(" ");
            for(var j = 0; j<givenname.length;j++){
                outAPA=outAPA+givenname[j][0]+". ";
            }
            outAPA=outAPA+"("+JSONinfo.deposited['date-parts'][0][0]+"). ";
            outAPA=outAPA+JSONinfo.title+". ";
            outAPA=outAPA+ JSONinfo['container-title']+", ";
            outAPA=outAPA+JSONinfo['volume'] +"("+JSONinfo['issue']+"), ";
            outAPA=outAPA+JSONinfo['page']+".</p>";
            //outAPA=outAPA+"<a id = 'bibtex' href='#'>Bibtex</a>";
            document.getElementById("citationAPAinfo").innerHTML = outAPA;
            //document.getElementById("citationAPAinfo").innerHTML = outAPA;
        }
        else if(xmlhttp.status = 404){
            document.getElementById("citationAPAinfo").innerHTML = "Not Available";
        }
        //alert(xmlhttp.readyState);
    }
    xmlhttp.send();
    getCitation(DOI,"x-bibtex");
    //information=xmlhttp.responseText;
    //return information;
}

function getCitation(DOI,type) {
    var information = "";
    var url = 'https://api.crossref.org/works/' + DOI+ '/transform/application/'+type;//text/x-bibliography?style='+type;
    xmlhttp2.open("GET", url, true);//syn or asynronous????
    //xmlhttp.setRequestHeader("Accept","text/bibliography; style=bibtex");
    xmlhttp2.onreadystatechange = function () {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
            var formatstring='<h4>BibTeX</h4><pre style = "text-align:left">';
            formatstring=formatstring+xmlhttp2.responseText+'</pre>';
            document.getElementById("citationBibinfo").innerHTML = formatstring;
        }
        else if (xmlhttp2.status == 404){
            document.getElementById("citationBibinfo").innerHTML = "Not Available";
        }
    }
    xmlhttp2.send();
}
// function changeFormatCitationAPA(information){
//     var outAPA = "<h4>APA</h4><p>";
//     var JSONinfo = JSON.parse(information);
//     for(var i=0;i<JSONinfo.author.length-1;i++){
//         outAPA=outAPA+JSONinfo.author[i].family+", ";
//         var givenname = JSONinfo.author[i].given.split(" ");
//         for(var j = 0; j<givenname.length;j++){
//             outAPA=outAPA+givenname[j][0]+". ";
//         }
//         outAPA=outAPA+', ';
//     }
//     outAPA=outAPA+JSONinfo.author[JSONinfo.author.length-1].family+", ";
//     var givenname = JSONinfo.author[i].given.split(" ");
//     for(var j = 0; j<givenname.length;j++){
//         outAPA=outAPA+givenname[j][0]+". ";
//     }
//     outAPA=outAPA+"("+JSONinfo.deposited['date-parts'][0][0]+"). ";
//     outAPA=outAPA+JSONinfo.title+". ";
//     outAPA=outAPA+ JSONinfo['container-title']+", ";
//     outAPA=outAPA+JSONinfo['volume'] +"("+JSONinfo['issue']+"), ";
//     outAPA=outAPA+JSONinfo['page']+".</p><a id = 'bibtex' href = '#'>BibTex</a>";
//     document.getElementById("citationAPAinfo").innerHTML = outAPA;
// }
// function changeFormatPublication(information){
//     var outPublication="";
//     var JSONinfo = JSON.parse(information);
//     outPublication = '<div class="row" style="padding-left:20px"><h4 class="text-left" style="font-weight:bold">Title:</h4><div style="padding-left:33px;margin-bottom: 10px">'+JSONinfo.title+'</div></div>';
//     outPublication = outPublication+'<div class="row" style="padding-left:20px"><h4 class="text-left" style="font-weight:bold">Author:</h4><div style="padding-left:33px;margin-bottom: 10px">';
//     for(var i=0;i<JSONinfo.author.length;i++){
//         outPublication=outPublication+JSONinfo.author[i].family+', '+JSONinfo.author[i].given+'; ';
//     }
//     outPublication = outPublication+'</div></div>';
//     outPublication = outPublication+'<div class="row"><div class="col-md-6" style="padding-left:20px"><h4 class="text-left" style="font-weight:bold">Journal:</h4><div style="padding-left:33px;margin-bottom: 10px">'+JSONinfo['container-title']+'</div></div>';
//     outPublication = outPublication+'<div class="col-md-6" style="padding-left:20px"><div class="" style="overflow:hidden;margin-right:20px; margin-left:20px" align="left"><h4 class="text-left" style="font-weight:bold">Date:</h4><div style="padding-left:33px;margin-bottom: 10px">'+mapDate(JSONinfo.deposited['date-parts'][0])+'</div></div></div>';
//     //outPublication = outPublication+'<div class="col-md-4"><h4 class="text-left" style="font-weight:bold">Publications:</h4><div style="padding-left:33px">'+'DOI: <a href="http://dx.doi.org/' + JSONinfo.DOI + '">' + JSONinfo.DOI + '</a>'+'</div></div></div>';
//     $("#publicationinfo").html(outPublication);
//     //return outPublication;
// }

// function changeFormatCitation(DOI){
//     ///var formatstring='<div class ="row"><div class="col-md-2">BibTeX</div><div class="col-md-8" id = "x-bibtexinfo"></div></div>';
//     var formatstring='<h4>BibTeX</h4><p id = "x-bibtexinfo"></p>';
//     //console.log(Console);
//     ////formatstring = formatstring+'<div class ="row"><div class="col-md-2">APA</div><div class="col-md-8" id = "apainfo"></div></div>';
//     document.getElementById("citationBibinfo").innerHTML = formatstring;
//     //getCitation(DOI,'chicago-annotated-bibliography');
//     getCitation(DOI,"x-bibtex");
// }
//
function autoLink(text) {
    pattern = /(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
    return text.replace(pattern, "$1<a href='$2'>$2</a>");
}


function mapDate(Date){
    var monthList=['January','February','March','April','May','June','July','August','September','October','November','December'];
    var newDate=monthList[Date[1]-1]+' '+Date[2].toString()+', '+Date[0].toString();
    return newDate;
}
