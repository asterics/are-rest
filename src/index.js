import axios from "axios";
import EventSource from "eventsource";
import Map from "./JSmap";

let axiosInstance = axios.create({
  baseURL: "http://localhost:8081/rest/"
});

const axiosSuccessCallback = cb => {
  return response => {
    cb(response.data, response.statusText);
  };
};

const axiosErrorCallback = cb => {
  return error => {
    if (error.response !== undefined) {
      cb(error, error.response.statusText);
    } else {
      cb(error, error.message);
    }
  };
};
//A map holding the opened connection with ARE for SSE
let _eventSourceMap = new Map();

//delimiter used for encoding
const delimiter = "-";

//enumeration for server event types
export var ServerEventTypes = {
  MODEL_CHANGED: "model_changed",
  MODEL_STATE_CHANGED: "model_state_changed",
  EVENT_CHANNEL_TRANSMISSION: "event_channel_transmission",
  DATA_CHANNEL_TRANSMISSION: "data_channel_transmission",
  PROPERTY_CHANGED: "property_changed"
};

//Port datatypes
export var PortDatatype = {
  UNKNOWN: "unknown",
  BOOLEAN: "boolean",
  BYTE: "byte",
  CHAR: "char",
  INTEGER: "integer",
  DOUBLE: "double",
  STRING: "string"
};

//set the base uri (usually where ARE runs at)
export function setBaseURI(uri) {
  axiosInstance = axios.create({ baseURL: uri });
}

//encodes PathParametes
export function encodeParam(text) {
  let encoded = "";
  for (let i = 0; i < text.length; i++) {
    encoded += text.charCodeAt(i) + delimiter;
  }

  return encoded;
}

//replaces all occurrences of a 'oldString' with 'newString' in 'text'
export function replaceAll(text, oldString, newString) {
  return text.split(oldString).join(newString);
}

/**********************
 *	Runtime resources
 **********************/

export function downloadDeployedModel(successCallback, errorCallback) {
  axiosInstance
    .get("runtime/model")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function uploadModel(successCallback, errorCallback, modelInXML = "") {
  if (modelInXML == "") return;

  axiosInstance
    .put("runtime/model", modelInXML, {
      headers: { "Content-Type": "text/xml" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function autorun(successCallback, errorCallback, filepath = "") {
  if (filepath == "") return;

  axiosInstance
    .put("runtime/model/autorun/" + encodeParam(filepath))
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function pauseModel(successCallback, errorCallback) {
  axiosInstance
    .put("runtime/model/state/pause")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function startModel(successCallback, errorCallback) {
  axiosInstance
    .put("runtime/model/state/start")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function stopModel(successCallback, errorCallback) {
  axiosInstance
    .put("runtime/model/state/stop")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getModelState(successCallback, errorCallback) {
  axiosInstance
    .get("runtime/model/state")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function deployModelFromFile(successCallback, errorCallback, filepath = "") {
  if (filepath == "") return;

  axiosInstance
    .put("runtime/model/" + encodeParam(filepath))
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getRuntimeComponentIds(successCallback, errorCallback) {
  axiosInstance
    .get("runtime/model/components/ids")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getRuntimeComponentPropertyKeys(successCallback, errorCallback, componentId = "") {
  if (componentId == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId))
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getRuntimeComponentProperty(successCallback, errorCallback, componentId = "", componentKey = "") {
  if (componentId == "" || componentKey == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/" + encodeParam(componentKey))
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function setRuntimeComponentProperties(successCallback, errorCallback, propertyMap = "") {
  if (propertyMap == "") return;

  axiosInstance
    .put("runtime/model/components/properties", propertyMap, {
      headers: { "Content-Type": "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function setRuntimeComponentProperty(successCallback, errorCallback, componentId = "", componentKey = "", componentValue = "") {
  if (componentId == "" || componentKey == "" || componentValue == "") return;

  axiosInstance
    .put("runtime/model/components/" + encodeParam(componentId) + "/" + encodeParam(componentKey), componentValue, {
      headers: { "Content-Type": "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getEventChannelsIds(successCallback, errorCallback) {
  axiosInstance
    .get("runtime/model/channels/event/ids")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getEventChannelSource(successCallback, errorCallback, channelId = "") {
  if (channelId == "") return;

  axiosInstance
    .get("runtime/model/channels/event/" + encodeParam(channelId) + "/source")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getEventChannelTarget(successCallback, errorCallback, channelId = "") {
  if (channelId == "") return;

  axiosInstance
    .get("runtime/model/channels/event/" + encodeParam(channelId) + "/target")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getComponentEventChannelsIds(successCallback, errorCallback, componentId = "") {
  if (componentId == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/channels/event/ids")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getDataChannelsIds(successCallback, errorCallback) {
  axiosInstance
    .get("runtime/model/channels/data/ids")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getDataChannelSource(successCallback, errorCallback, channelId = "") {
  if (channelId == "") return;

  axiosInstance
    .get("runtime/model/channels/data/" + encodeParam(channelId) + "/source")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getDataChannelTarget(successCallback, errorCallback, channelId = "") {
  if (channelId == "") return;

  axiosInstance
    .get("runtime/model/channels/data/" + encodeParam(channelId) + "/source")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getComponentDataChannelsIds(successCallback, errorCallback, componentId = "") {
  if (componentId == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/channels/data/ids")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getComponentInputPortIds(successCallback, errorCallback, componentId = "") {
  if (componentId == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/ports/input/ids")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getComponentOutputPortIds(successCallback, errorCallback, componentId = "") {
  if (componentId == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/ports/output/ids")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getPortDatatype(successCallback, errorCallback, componentId = "", portId = "") {
  if (componentId == "" || portId == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/ports/" + encodeParam(portId) + "/datatype")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

/*************************************
 *	Storage/ARE-repository resources
 *************************************/

export function downloadModelFromFile(successCallback, errorCallback, filepath = "") {
  if (filepath == "") return;

  axiosInstance
    .get("storage/models/" + encodeParam(filepath))
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function storeModel(successCallback, errorCallback, filepath = "", modelInXML = "") {
  if (filepath == "" || modelInXML == "") return;

  axiosInstance
    .post("storage/models/" + encodeParam(filepath), modelInXML, {
      headers: { "Content-Type": "text/xml" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function storeData(successCallback, errorCallback, filepath = "", data = "") {
  if (filepath == "" || data == "") return;

  axiosInstance
    .post("storage/data/" + encodeParam(filepath), data, {
      headers: { "Content-Type": "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function storeWebappData(successCallback, errorCallback, webappId = "", filepath = "", data = "") {
  if (webappId == "" || filepath == "" || data == "") return;

  axiosInstance
    .post("storage/webapps/" + encodeParam(webappId) + "/" + encodeParam(filepath), data, {
      headers: { "Content-Type": "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getWebappData(successCallback, errorCallback, webappId = "", filepath = "") {
  if (webappId == "" || filepath == "") return;

  axiosInstance
    .get("storage/webapps/" + encodeParam(webappId) + "/" + encodeParam(filepath))
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function deleteModelFromFile(successCallback, errorCallback, filepath = "") {
  if (filepath == "") return;

  axiosInstance
    .delete("storage/models/" + encodeParam(filepath))
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function listStoredModels(successCallback, errorCallback) {
  axiosInstance
    .get("storage/models/names")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getComponentDescriptorsAsXml(successCallback, errorCallback) {
  axiosInstance
    .get("storage/components/descriptors/xml")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getComponentDescriptorsAsJSON(successCallback, errorCallback) {
  axiosInstance
    .get("storage/components/descriptors/json")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

/**********************
 *	Other Functions
 **********************/

export function getRestFunctions(successCallback, errorCallback) {
  axiosInstance
    .get("restfunctions")
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

/**********************************
 *	Subscription to SSE events
 **********************************/

export function subscribe(successCallback, errorCallback, eventType, channelId) {
  // Browser does not support SSE
  if (typeof EventSource === "undefined") {
    alert("SSE not supported by browser");
    return;
  }

  var eventSource = _eventSourceMap.get(eventType);
  if (eventSource != null) {
    eventSource.close();
  }

  let resource;

  switch (eventType) {
    case ServerEventTypes.MODEL_CHANGED:
      resource = "runtime/deployment/listener";
      break;
    case ServerEventTypes.MODEL_STATE_CHANGED:
      resource = "runtime/model/state/listener";
      break;
    case ServerEventTypes.EVENT_CHANNEL_TRANSMISSION:
      resource = "runtime/model/channels/event/listener";
      break;
    case ServerEventTypes.DATA_CHANNEL_TRANSMISSION:
      resource = "runtime/model/channels/data/" + encodeParam(channelId) + "/listener";
      break;
    case ServerEventTypes.PROPERTY_CHANGED:
      resource = "runtime/model/components/properties/listener";
      break;
    default:
      console.error("ERROR: Unknown event type given as a parameter '" + eventType + "'");
      return;
  }

  eventSource = new EventSource(_baseURI + resource); // Connecting to SSE service
  _eventSourceMap.add(eventType, eventSource);

  //adding listener for specific events
  eventSource.addEventListener(
    "event",
    function(e) {
      successCallback(e.data, 200);
    },
    false
  );

  // After SSE handshake constructed
  eventSource.onopen = function(e) {
    console.log("Waiting message...");
  };

  // Error handler
  eventSource.onerror = function(e) {
    switch (e.target.readyState) {
      case EventSource.CONNECTING:
        console.log(400, "reconnecting");
        errorCallback(400, "reconnecting");
        break;
      case EventSource.CLOSED:
        console.log(400, "connectionLost");
        errorCallback(400, "connectionLost");
        break;
      default:
        errorCallback(400, "someErrorOccurred");
        console.log("Error occured");
    }
  };
}

export function unsubscribe(eventType) {
  closeEventSource(eventType);
}

export function closeEventSource(eventType) {
  let eventSource = _eventSourceMap.remove(eventType);

  if (eventSource == null) {
    return false;
  } else {
    eventSource.close();
    return true;
  }
}
