java = require("java")
// java.classpath.push("./TextSimilarity");
//
// var searcher = java.newInstanceSync("edu.ucla.cs.scai.aztec.similarity.Search")
//
// var result = searcher.SearchFunctionSync("protein");
// console.log("done")
// console.log(result)

java.classpath.push("TextSimilarity.jar");
var searcher = java.newInstanceSync("edu.ucla.cs.scai.aztec.similarity.Search");
var result = searcher.SearchFunctionSync("protein");
console.log("done")
res = result.toStringSync()
var array = JSON.parse(res);
console.log(array)