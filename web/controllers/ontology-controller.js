var fs = require('fs');

var input_file = 'final.json';

var ontology_map = (function() {
    var contents = fs.readFileSync(input_file);
    var mapping = JSON.parse(contents);

    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    
    this.get_description = function (original_description) {
        var description = original_description.toLowerCase();
        var replaced = description.replace(/[.\/#!{}`()]/g,""); //strip punctuation
        var array = replaced.split(' ');
        var to_iterate = 23; //hardcoded based on longest name in json data
        var matches = {};
        var end_indices = {};
        var covered_indices = {};
        var best_matches = {};
        for(var i = 0; i < array.length;){
            // console.log("Outer loop is at " + i);
            var best_match_length = -1;
            var best_match = "";
            var cur_string = array[i];
            var cur_match_length;
            if(mapping.hasOwnProperty(cur_string)){
                cur_match_length = 1;
                if (cur_match_length > best_match_length){
                    best_match_length = cur_match_length;
                    best_match = cur_string;
                }
            }
            for(var j = i+1; j < i + to_iterate; j++){
                if(j >= array.length)
                    break;
                // console.log(cur_string);
                cur_string += ' ' + array[j];
                if(mapping.hasOwnProperty(cur_string)){
                    cur_match_length = j-i+1;
                    if (cur_match_length > best_match_length){
                        best_match_length = cur_match_length;
                        best_match = cur_string;
                    }
                }
            }
            if(best_match != ""){
                if (best_matches.hasOwnProperty(best_match)){
                    i++;
                    continue;
                }
                var correct = false;
                var to_check = 0;
                var start_index = -1;
                while(!correct){
                    correct = true;
                    start_index = description.indexOf(best_match, to_check);
                    if(start_index === -1)
                        break;
                    for(var l = start_index; l < start_index + best_match.length; l++){
                        if(covered_indices.hasOwnProperty(l.toString())){
                            correct = false;
                            to_check = start_index + best_match.length;
                            break;
                        }
                    }
                }
                if(start_index !== -1){
                    for(var m = start_index; m < start_index + best_match.length; m++){
                        covered_indices[m] = true;
                    }
                    best_matches[best_match] = true;
                    // console.log("Best match is " + best_match);
                    // console.log("Jumping ahead by " + best_match_length);
                    matches[start_index] = mapping[best_match];
                    end_indices[start_index+best_match.length] = true;
                    i += best_match_length;
                }
                else
                    i++;
            }
            else
                i++;
        }
        // console.log("Matches are " + JSON.stringify(matches));
        // console.log("End indices are " + JSON.stringify(end_indices));
        if(!isEmpty(matches)){
            var new_description = "";
            for(var k = 0; k < original_description.length; k++){
                if(matches.hasOwnProperty(k.toString())){
                    new_description += "<b><a href=" + matches[k.toString()] + ">";
                }
                if(end_indices.hasOwnProperty(k.toString())){
                    new_description += "</a></b>";
                }
                new_description += original_description[k];

            }
            //console.log("New description is " + new_description);
            return new_description;
        }
        return original_description;
    };
    
    return this;
})();

module.exports = ontology_map;

