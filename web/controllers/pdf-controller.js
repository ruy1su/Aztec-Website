var fs = require('fs');
var busboy = require('connect-busboy');
var jsonfile = require('jsonfile');
var util = require('../utility/toolUtils');
var BD2K = require('../utility/bd2k.js');
var solr = require('solr-client');
var http = require('http');
var request = require('request');


var waitTime = 5000;


function Uploader() {
    var self = this;

    self.upload = function(req, res) {
        self._upload(self, req, res);
    };
    self.push = function (req, res) {
        self._push(self, req, res);
    }
}


/**
 * Check if DOI is valid, stream pdf file to flask server and show the results
 * @param self
 * @param req
 * @param res
 * @private
 */
//TODO: Standardize flask server host and port
Uploader.prototype._upload = function(self, req, res) {
    var user = req.user.email;
    req.pipe(req.busboy);
    var data = [];
    req.busboy.on('file', function(fieldname, file, filename){
        console.log("Uploading: " + filename);
        file.on('data', function(chunk){
            console.log("Streaming data as chunks...");
            data.push(chunk)
        });
        file.on('end', function () {
           console.log("Finished with file");
        });
        var doi;
        req.busboy.on('field', function (fieldname, value, filename) {
            if(fieldname=='doi'){
                doi = value;
            }
        });
        req.busboy.on('finish', function(){
            data = Buffer.concat(data);
            // Now send to flask server
            var options = {
                host: 'localhost',
                port: '7777',
                url: 'http://localhost:7777/extraction',
                path: '/extraction',
                method: 'POST'
            };
            var post_req = request.post(options, function (err, resp, body) {
                if (err) {
		            console.log(err);
                    console.log('Error!');
                } else {
                    data = [];
                    if(resp.statusCode == 406){
                        //doi is invalid
                        return res.json({status: "error", message: body});
                    }
                    console.log("Data received is " + body);
                    var formObj = util.extract2form(JSON.parse(body));
                        console.log("Form object is " + JSON.stringify(formObj));
                        return res.render('tool/form.ejs', {title: "Edit",
                            heading: "Edit Resource #",
                            user: req.user,
                            loggedIn : req.isAuthenticated(),
                            editURL: "",
                            submitFunc: "onEditSubmit()",
                            init: "vm.initEdit2("+JSON.stringify(formObj)+")"
                        });
                }
            });
            var form = post_req.form();
            form.append('file', data.toString('base64'), {});
            form.append('doi', doi);
            form.append('user', user);
        });

    });

};

/**
 * This function updates the already existing Solr document
 * @param self
 * @param req
 * @param res
 * @private
 */
//TODO: Standardize flask server host and port
Uploader.prototype._push = function (self, req, res) {
    BD2K.solr.search({publicationDOI: req.body.data.publicationDOI}, function (r) {
        var result = r.response.docs[0];
        req.body.data['id'] = result['id'];
        var data = JSON.stringify(req.body.data);
        console.log("Data is " + data);
        var options = {
            host: 'localhost',
            port: '7777',
            url: 'http://localhost:7777/update',
            path: '/update',
            method: 'POST'
        };
        //Post user updated data to Solr
        var post_req = request.post(options, function (err, resp, body) {
            if(err){
                return res.json({status: "error", message: err});
            }
            return res.json({status: "success", message: "", id: result['id']});
        });
        var form = post_req.form();
        form.append('data', data);
    });
};

module.exports = new Uploader();
