// const $ = require("jquery");
// require("jquery");
const { JSDOM } = require("jsdom");
const dom = new JSDOM("");
const $ = require("jquery")(dom.window);

const { setBaseURI, downloadDeployedModel } = require("../dist");

setBaseURI("localhost:8081/rest");
downloadDeployedModel(
  function(data, status) {
    console.log(data);
    console.log(status);
  },
  function(e, r) {
    console.log(e);
    console.log(r);
  }
);
