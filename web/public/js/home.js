/**
 * @class Home
 * @constructor
 * @classdesc sets up malarkey and search box for the home page
 */
$(function() {
    var elem = document.querySelector('#aztec-malarkey');
    var opts = {
        typeSpeed: 100,
        deleteSpeed: 50,
        pauseDelay: 1500,
        loop: true,
        //postfix: ' BD2K'
    };
    malarkey(elem, opts).type('Genomics')   .pause().delete()
        .call(function(elem){
          elem.style.color = 'red';
          this();
        })
        .type('Proteomics').pause().delete()
        .call(function(elem){
          elem.style.color = 'green';
          this();
        })
        .type('Metabolomics').pause().delete()
        .call(function(elem){
          elem.style.color = 'blue';
          this();
        })
        .type('Metagenomics').pause().delete()
        .call(function(elem){
          elem.style.color = 'yellow';
          this();
        })
        .type('Epigenomics').pause().delete()
        .call(function(elem){
          elem.style.color = 'brown';
          this();
        })
        .type('Precision Med').pause().delete()
        .call(function(elem){
          elem.style.color = 'orange';
          this();
        })
        .type('Innovation').pause().delete()
        .call(function(elem){
          elem.style.color = 'purple';
          this();
        })
        .type('Technology').pause().delete()
        .call(function(elem){
          elem.style.color = 'black';
          this();
        })
        .type('Biology').pause().delete()
        .call(function(elem){
          elem.style.color = 'pink';
          this();
        })
        .type('Imaging').pause().delete()
        .call(function(elem){
          elem.style.color = 'gold';
          this();
        })
        .type('Bioinformatics').pause().delete()
        .call(function(elem){
          elem.style.color = 'teal';
          this();
        });

    $('#submitForm').submit(function() { //sends search request
        var service_search_url = "https://dev.aztec.io/resource/ir";

        var query = $("#query").val();
        console.log(query);
        if (!query) {
            return false;
        }
        query = query.trim();
        if (!query) {
            return false;
        }
        var offset = 0
        var limit = 1000000;
        var id = Math.random().toString();
        var request = {"jsonrpc": "2.0", "id": id, "method": "getEntriesByQuery", "params": [query, offset, limit]};
        $.ajax({
            type: "GET",
            url: service_search_url,
            data: JSON.stringify(request),
	    contentType: "application/json",
	    success: function (data) {
                console.log("success");
                var id_list = data;
                /**for (var i=0; i<data.result.entries.length; i++) {
                    var e=data.result.entries[i];
                    id_list.push(parseInt(e.id));
                }**/
                var filters = {};
                filters["resource"] = id_list;
                filters["resource_search"] = query;
		var parameters = {};
                parameters.searchFilters = filters;
                parameters.type = "ir";
                $("#sendJson").val(JSON.stringify(parameters));
                $('#submitFormTrue').submit();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                return false; // return false to cancel form action
            }
        });

        return false; // return false to cancel form action
    });
});
