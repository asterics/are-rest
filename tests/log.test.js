const { setBaseURI, getRuntimeComponentPropertyDynamic } = require("../dist/index.node");

setBaseURI("http://localhost:8081/rest/");

getRuntimeComponentPropertyDynamic(
  function(data, status) {
    console.log(data, status);
  },
  function(status, error) {
    console.log(status, error);
  },
  "Knx.1",
  "DPTEvent1"
);
