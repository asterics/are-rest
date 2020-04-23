const path = require("path");
const fs = require("fs");
const {
  ServerEventTypes,
  setBaseURI,
  downloadDeployedModel,
  uploadModel,
  getModelState,
  getRuntimeComponentIds,
  getRuntimeComponentPropertyKeys,
  subscribe
} = require("../dist");

setBaseURI("http://localhost:8081/rest/");

downloadDeployedModel(
  function(data, status) {
    console.log(data, status);
  },
  function(status, error) {
    console.log(status, error);
  }
);

let model = fs.readFileSync(path.join(__dirname, "model.xml"), "utf-8");
let modelImageBox = fs.readFileSync(path.join(__dirname, "modelImageBox.xml"), "utf-8");

if (false) {
  uploadModel(
    function(data, status) {
      console.log(data, status);
    },
    function(status, error) {
      console.log(status, error);
    },
    model
  );
} else if (false) {
  uploadModel(
    function(data, status) {
      console.log(data, status);
    },
    function(status, error) {
      console.log(status, error);
    },
    modelImageBox
  );
}

// setBaseURI("http://localhost:8081/");

// downloadDeployedModel(
//   function(data, status) {
//     console.log(data, status);
//   },
//   function(status, error) {
//     console.log(status, error.message);
//   }
// );

getModelState(
  function(data, status) {
    console.log(data, status);
  },
  function(status, error) {
    console.log(status, error);
  }
);

getRuntimeComponentIds(
  function(data, status) {
    console.log(data, status);
  },
  function(status, error) {
    console.log(status, error);
  }
);

getRuntimeComponentPropertyKeys(
  function(data, status) {
    console.log(data, status);
  },
  function(status, error) {
    console.log(status, error);
  },
  "CellBoard.1"
);

subscribe(
  function(data, status) {
    console.log(data, status);
  },
  function(status, error) {
    console.log(status, error);
  },
  ServerEventTypes.MODEL_CHANGED
);
