import axios from "axios";
import EventSource from "eventsource";
import Map from "./JSmap";

const defaultBase = "http://localhost:8081/rest/";

let axiosInstance = axios.create({
  baseURL: defaultBase,
  headers: { "content-type": "text/plain" }
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
export let _baseURI = defaultBase;
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
  axiosInstance = axios.create({
    baseURL: uri,
    headers: { "content-type": "text/plain" }
  });
  _baseURI = uri;
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
    .get("runtime/model", {
      responseType: "document",
      headers: { Accept: "text/xml" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function uploadModel(successCallback, errorCallback, modelInXML = "", put = true) {
  if (modelInXML == "") return;

  axiosInstance
    .request({
      url: "runtime/model",
      method: put ? "put" : "post",
      data: modelInXML,
      headers: { "content-type": "text/xml" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function autorun(successCallback, errorCallback, filepath = "", put = true) {
  if (filepath == "") return;

  axiosInstance
    .request({ url: "runtime/model/autorun/" + encodeParam(filepath), method: put ? "put" : "post" })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function pauseModel(successCallback, errorCallback, put = true) {
  axiosInstance
    .request({ url: "runtime/model/state/pause", method: put ? "put" : "post" })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function startModel(successCallback, errorCallback, put = true) {
  axiosInstance
    .request({ url: "runtime/model/state/start", method: put ? "put" : "post" })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function stopModel(successCallback, errorCallback, put = true) {
  axiosInstance
    .request({ url: "runtime/model/state/stop", method: put ? "put" : "post" })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getModelState(successCallback, errorCallback) {
  axiosInstance
    .get("runtime/model/state", {
      responseType: "text",
      headers: { Accept: "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getModelName(successCallback, errorCallback) {
  axiosInstance
    .get("runtime/model/name", {
      responseType: "text",
      headers: { Accept: "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function deployModelFromFile(successCallback, errorCallback, filepath = "", put = true) {
  if (filepath == "") return;

  axiosInstance
    .request({ url: "runtime/model/" + encodeParam(filepath), method: put ? "put" : "post" })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getRuntimeComponentIds(successCallback, errorCallback) {
  axiosInstance
    .get("runtime/model/components/ids", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getRuntimeComponentPropertyKeys(successCallback, errorCallback, componentId = "") {
  if (componentId == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId), {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getRuntimeComponentProperty(successCallback, errorCallback, componentId = "", componentKey = "") {
  if (componentId == "" || componentKey == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/" + encodeParam(componentKey), {
      responseType: "text",
      headers: { Accept: "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getRuntimeComponentPropertyDynamic(successCallback, errorCallback, componentId = "", propertyKey = "") {
  if (componentId == "" || propertyKey == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/" + encodeParam(propertyKey) + "/dynamicproperty", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function setRuntimeComponentProperties(successCallback, errorCallback, propertyMap = "", put = true) {
  if (propertyMap == "") return;

  axiosInstance
    .request({
      url: "runtime/model/components/properties",
      method: put ? "put" : "post",
      data: propertyMap,
      headers: { "content-type": "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function setRuntimeComponentProperty(successCallback, errorCallback, componentId = "", componentKey = "", componentValue = "") {
  if (componentId == "" || componentKey == "" || componentValue == "") return;

  axiosInstance
    .put("runtime/model/components/" + encodeParam(componentId) + "/" + encodeParam(componentKey), componentValue, {
      headers: { "content-type": "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getEventChannelsIds(successCallback, errorCallback) {
  axiosInstance
    .get("runtime/model/channels/event/ids", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getEventChannelSource(successCallback, errorCallback, channelId = "") {
  if (channelId == "") return;

  axiosInstance
    .get("runtime/model/channels/event/" + encodeParam(channelId) + "/source", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getEventChannelTarget(successCallback, errorCallback, channelId = "") {
  if (channelId == "") return;

  axiosInstance
    .get("runtime/model/channels/event/" + encodeParam(channelId) + "/target", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getComponentEventChannelsIds(successCallback, errorCallback, componentId = "") {
  if (componentId == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/channels/event/ids", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getDataChannelsIds(successCallback, errorCallback) {
  axiosInstance
    .get("runtime/model/channels/data/ids", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getDataChannelSource(successCallback, errorCallback, channelId = "") {
  if (channelId == "") return;

  axiosInstance
    .get("runtime/model/channels/data/" + encodeParam(channelId) + "/source", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getDataChannelTarget(successCallback, errorCallback, channelId = "") {
  if (channelId == "") return;

  axiosInstance
    .get("runtime/model/channels/data/" + encodeParam(channelId) + "/source", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getComponentDataChannelsIds(successCallback, errorCallback, componentId = "") {
  if (componentId == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/channels/data/ids", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getComponentInputPortIds(successCallback, errorCallback, componentId = "") {
  if (componentId == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/ports/input/ids", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getComponentOutputPortIds(successCallback, errorCallback, componentId = "") {
  if (componentId == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/ports/output/ids", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getPortDatatype(successCallback, errorCallback, componentId = "", portId = "") {
  if (componentId == "" || portId == "") return;

  axiosInstance
    .get("runtime/model/components/" + encodeParam(componentId) + "/ports/" + encodeParam(portId) + "/datatype", {
      responseType: "text",
      headers: { Accept: "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function sendDataToInputPort(successCallback, errorCallback, componentId = "", portId = "", value = "", put = true) {
  if (componentId == "" || portId == "" || value == "") return;

  axiosInstance
    .request({
      url: "runtime/model/components/" + encodeParam(componentId) + "/ports/" + encodeParam(portId) + "/data",
      method: put ? "put" : "post",
      data: value,
      headers: { "content-type": "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function triggerEvent(successCallback, errorCallback, componentId = "", eventPortId = "", put = true) {
  if (componentId == "" || eventPortId == "") return;

  axiosInstance
    .request({
      url: "runtime/model/components/" + encodeParam(componentId) + "/events/" + encodeParam(eventPortId),
      method: put ? "put" : "post"
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

/*************************************
 *	Storage/ARE-repository resources
 *************************************/

export function downloadModelFromFile(successCallback, errorCallback, filepath = "") {
  if (filepath == "") return;

  axiosInstance
    .get("storage/models/" + encodeParam(filepath), {
      responseType: "document",
      headers: { Accept: "text/xml" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function storeModel(successCallback, errorCallback, filepath = "", modelInXML = "") {
  if (filepath == "" || modelInXML == "") return;

  axiosInstance
    .post("storage/models/" + encodeParam(filepath), modelInXML, {
      headers: { "content-type": "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function storeData(successCallback, errorCallback, filepath = "", data = "") {
  if (filepath == "" || data == "") return;

  axiosInstance
    .post("storage/data/" + encodeParam(filepath), data, {
      headers: { "content-type": "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function storeWebappData(successCallback, errorCallback, webappId = "", filepath = "", data = "") {
  if (webappId == "" || filepath == "" || data == "") return;

  axiosInstance
    .post("storage/webapps/" + encodeParam(webappId) + "/" + encodeParam(filepath), data, {
      headers: { "content-type": "text/xml" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getWebappData(successCallback, errorCallback, webappId = "", filepath = "") {
  if (webappId == "" || filepath == "") return;

  axiosInstance
    .get("storage/webapps/" + encodeParam(webappId) + "/" + encodeParam(filepath), {
      responseType: "text",
      headers: { Accept: "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function deleteModelFromFile(successCallback, errorCallback, filepath = "") {
  if (filepath == "") return;

  axiosInstance
    .delete("storage/models/" + encodeParam(filepath), {
      responseType: "text",
      headers: { Accept: "text/plain" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function listStoredModels(successCallback, errorCallback) {
  axiosInstance
    .get("storage/models/names", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getComponentDescriptorsAsXml(successCallback, errorCallback) {
  axiosInstance
    .get("storage/components/descriptors/xml", {
      responseType: "document",
      headers: { Accept: "text/xml" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

export function getComponentDescriptorsAsJSON(successCallback, errorCallback) {
  axiosInstance
    .get("storage/components/descriptors/json", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
    .then(axiosSuccessCallback(successCallback))
    .catch(axiosErrorCallback(errorCallback));
}

/**********************
 *	Other Functions
 **********************/

export function getRestFunctions(successCallback, errorCallback) {
  axiosInstance
    .get("restfunctions", {
      responseType: "json",
      headers: { Accept: "application/json" }
    })
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
    var state = e && e.target ? e.target.readyState : null;
    switch (state) {
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
