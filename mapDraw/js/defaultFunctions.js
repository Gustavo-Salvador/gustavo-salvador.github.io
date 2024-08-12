//script para habilitar o mapa
function loadMapApi() {
  (g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })({
    key: "AIzaSyBxVdSp3cK80KG-w2Tg1zApo4CVOQtO1Qc",
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
  });
}

// TODO: adicionar mesagesns auxiliares
// TODO: adicionar um menu de ajuda
// TODO: adicionar mudança de opções possíveis para cada forma
// TODO: adicionar opção de editar formas na criação
// TODO: adicionar opção de editar marcadores na criação
// TODO: corrigir delay em criação de póligono/polyline
// TODO: adicionar opção de zindex
// TODO: adicionar logo
// TODO: adicionar opção de adicionar texto ao marcador
// TODO: adicionar função de copiar e colar formas
// TODO: adicionar função de desfazer e refazer
// TODO: adicionar ferramenta de imagem
// TODO: adicionar linha "imantada"
// TODO: melhorar a responsividade

const shapeVariables = {
  exists: false,
};
var shapes = [];
var shapesSave = {};
var index = 0;
var shapeId = 0;
var actualPath;
var clicks = 0;
var pointIndex = 0;
var originalBounds = {
  northEast: { lat: 0, lng: 0 }
}
var bounds = {
  northEast: { lat: 0, lng: 0 },
  southWest: { lat: 0, lng: 0 }
}
var callingFromShape = false;
var deleteMenu;

var isBodyLoaded = false;
var IntervalId;

var selectedTool = "pan";

var map;
var shouldCallFromMap = true;

var callingShape;
var lastCallingShape;

var geometryLibrary;
var advancedMarkerElement;
var pinElement;

var strokeColorValue;
var strokeWeightValue;
var strokeOpacityValue;
var fillColorValue;
var fillOpacityValue;
var geodesicValue;
//elementos
var strokeColorElement;
var strokeWeightElement;
var strokeOpacityRangeElement;
var strokeOpacityNumberElement;
var fillColorElement;
var fillOpacityRangeElement;
var fillOpacityNumberElement;
var geodesicElement;

var markerStrokeColorValue;
var markerBackgroundColorValue;
var markerGlyphColorValue;
var markerScaleValue;
var markerShowGlyphValue;
//elementos do marcador
var markerStrokeColorElement;
var markerBackgroundColorElement;
var markerGlyphColorElement;
var markerScaleElement;
var markerShowGlyphElement;

var centerControlsDiv;
var buttonSave;
var buttonLoad;
var buttonClear;

var topCenterControlsDiv;
var topCenterText;

function watchVariable(obj, propName, callback) {
  let value = obj[propName];

  Object.defineProperty(obj, propName, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue !== value) {
        const oldValue = value;
        value = newValue;
        callback(newValue, oldValue);
      }
    },
  });
}

watchVariable(shapeVariables, 'exists', (newValue, oldValue) => {
  if (oldValue && !newValue) {

    shapes[index - 1].id = shapeId;
    shapeId += 1;

    if (typeof window[selectedTool + "ShapeCreated"] !== "undefined") {
      callingFromShape = true;
      let shape = shapes[index - 1];
      lastCallingShape = callingShape;
      callingShape = shape;

      window[selectedTool + "ShapeCreated"](callingShape.id, callingShape);
    }

    showSaveClearButtons(true);
  }
});

function bodyLoaded() {
  loadMapApi();
  initMapScript("map");

  strokeColorElement = document.getElementById("strokeColor");
  strokeWeightElement = document.getElementById("strokeWeight");
  strokeOpacityRangeElement = document.getElementById("strokeOpacityRange");
  strokeOpacityNumberElement = document.getElementById("strokeOpacityNumber");
  fillColorElement = document.getElementById("fillColor");
  fillOpacityRangeElement = document.getElementById("fillOpacityRange");
  fillOpacityNumberElement = document.getElementById("fillOpacityNumber");
  geodesicElement = document.getElementById("geodesic");

  fillOpacityRangeElement.addEventListener("input", (event) => {
    fillOpacityNumberElement.value = Math.round(event.target.value * 100);
  });
  fillOpacityNumberElement.addEventListener("input", (event) => {
    if (event.target.value % 1 != 0) {
      event.target.value = Math.round(event.target.value);
    }

    fillOpacityRangeElement.value = event.target.value / 100;
  });

  strokeOpacityRangeElement.addEventListener("input", (event) => {
    strokeOpacityNumberElement.value = Math.round(event.target.value * 100);
  });
  strokeOpacityNumberElement.addEventListener("input", (event) => {
    if (event.target.value % 1 != 0) {
      event.target.value = Math.round(event.target.value);
    }

    strokeOpacityRangeElement.value = event.target.value / 100;
  });

  markerStrokeColorElement = document.getElementById("markerStrokeColor");
  markerBackgroundColorElement = document.getElementById("markerBackgroundColor");
  markerGlyphColorElement = document.getElementById("markerGlyphColor");
  markerScaleRangeElement = document.getElementById("markerScaleRange");
  markerScaleNumberElement = document.getElementById("markerScaleNumber");
  markerShowGlyphElement = document.getElementById("markerShowGlyph");

  markerScaleRangeElement.addEventListener("input", (event) => {
    markerScaleNumberElement.value = event.target.value;
  });
  markerScaleNumberElement.addEventListener("input", (event) => {
    if (event.target.value % 1 != 0) {
      event.target.value = Math.round(event.target.value);
    }

    markerScaleRangeElement.value = event.target.value;
  });

  let editInputElements = document.getElementsByClassName("editInputs");
  for (let i = 0; i < editInputElements.length; i++) {
    editInputElements[i].addEventListener("input", (event) => {
      defaultChangeEditInputFunction(event);
      if (typeof window[selectedTool + "EditInput"] !== "undefined") {
        window[selectedTool + "EditInput"](event);
      }
    });
  }

  buttonSave = document.createElement("button");
  buttonSave.id = "buttonSave";
  buttonSave.classList.add("button");
  buttonSave.classList.add("buttonBlue");
  buttonSave.classList.add("hidden");
  buttonSave.innerHTML = "Salvar";

  buttonLoad = document.createElement("button");
  buttonLoad.id = "buttonLoad";
  buttonLoad.classList.add("button");
  buttonLoad.classList.add("buttonGreen");
  buttonLoad.innerHTML = "Carregar";

  buttonClear = document.createElement("button");
  buttonClear.id = "buttonClear";
  buttonClear.classList.add("button");
  buttonClear.classList.add("buttonRed");
  buttonClear.classList.add("hidden");
  buttonClear.innerHTML = "Limpar";
  
  let saveDialog = document.getElementById("saveDialog");
  let saveDowloadButton = document.getElementById("saveDowloadButton");
  let saveLocalStorageButton = document.getElementById("saveLocalStorageButton");
  let saveCancel = document.getElementById("saveCancel");

  buttonSave.addEventListener("click", () => {
    saveDialog.showModal();
  });
  saveDowloadButton.addEventListener("click", () => {
    saveMapToFile();
    saveDialog.close();
  });
  saveLocalStorageButton.addEventListener("click", () => {
    if (localStorage.getItem("drawMapFile") !== null) {
      if (window.confirm("já existe um arquivo salvo, deseja sobrescrever?")) {
        saveMapToLocalStorage();
      }
    } else {
      saveMapToLocalStorage();
    }
    saveDialog.close();
  });
  saveCancel.addEventListener("click", () => {
    saveDialog.close();
  });

  let loadDialog = document.getElementById("loadDialog");
  let loadFromFileButton = document.getElementById("loadFromFileButton");
  let loadFromLocalStorageButton = document.getElementById("loadFromLocalStorageButton");
  let loadCancel = document.getElementById("loadCancel");
  let loadMapFromFileDialog = document.getElementById("fileLoadDialog");
  let loadFileButton = document.getElementById("fileLoadButton");
  let fileLoadCancel = document.getElementById("fileLoadCancel");
  let fileLoadInput = document.getElementById("fileLoadInput");

  buttonLoad.addEventListener("click", () => {
    if (localStorage.getItem("drawMapFile") !== null) {
      loadDialog.showModal();
    } else {
      loadMapFromFileDialog.showModal();
    }
  });
  loadFromFileButton.addEventListener("click", () => {
    loadDialog.close();
    loadMapFromFileDialog.showModal();
  });
  loadFromLocalStorageButton.addEventListener("click", () => {
    loadMap(true);
    loadDialog.close();
  });
  loadCancel.addEventListener("click", () => {
    loadDialog.close();
  });
  loadFileButton.addEventListener("click", () => {
    let filePickerLabel = document.querySelector(".fileUpload");

    if (fileLoadInput.files[0] == undefined) {
      showMensage("Atenção!!! Nenhum arquivo selecionado", "rgb(255, 255, 255)", "rgb(204, 0, 0)");
      filePickerLabel.style.borderColor = "rgb(204, 0, 0)";
    } else if (fileLoadInput.files[0].name.match(/(?<=\.).*/)[0] !== "mapDraw") {
      showMensage("Atenção!!! Arquivo inválido", "rgb(255, 255, 255)", "rgb(204, 0, 0)");
    } else {
      loadMap();
    }
  });
  fileLoadCancel.addEventListener("click", () => {
    document.querySelector(".fileUpload").style.borderColor = "var(--fileUploadBorderColor)";
    document.getElementById("fileLoadInput").value = "";
    document.getElementById("fileLoadText").innerHTML = "Selecionar arquivo";

    loadMapFromFileDialog.close();
  });
  fileLoadInput.addEventListener("change", () => {
    document.getElementById("fileLoadText").innerHTML = fileLoadInput.files[0].name;
  });

  let clearDialog = document.getElementById("clearDialog");
  let confirmClearButton = document.getElementById("clearConfirmButton");
  let cancelClearButton = document.getElementById("clearCancel");
  
  buttonClear.addEventListener("click", (event) => {
    clearDialog.showModal();
  });
  confirmClearButton.addEventListener("click", () => {
    clearMap();
    clearDialog.close();
  });
  cancelClearButton.addEventListener("click", () => {
    clearDialog.close();
  });

  defaultChangeEditInputFunction();

  topCenterText = document.createElement("span");
  topCenterText.id = "helpText";
  topCenterText.innerHTML = "Clique e arraste para mover o mapa";

  isBodyLoaded = true;
}

function initMapScript(id) {
  async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const { spherical } = await google.maps.importLibrary("geometry")

    map = new Map(document.getElementById(id), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
      mapId: "4504f8b37365c3d0",
    });

    advancedMarkerElement = AdvancedMarkerElement;
    pinElement = PinElement;

    geometryLibrary = spherical;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map.setCenter(pos);
        },
      );
    }

    map.addListener("dblclick", (event) => {
      dblClickEvent(event);
    });
    map.addListener("click", (event) => {
      if (shouldCallFromMap) {
        callingFromShape = false;
        lastCallingShape = callingShape;
        callingShape = null;
  
        window[selectedTool](event);
      }
    });
    map.addListener("mousemove", (event) => {
      if (typeof window[selectedTool + "MouseMove"] != "undefined") {
        window[selectedTool + "MouseMove"](event);
      }
    })
  }

  initMap();

  IntervalId = setInterval(()=>{
    if (isBodyLoaded) {
      centerControlsDiv = document.createElement("div");
      centerControlsDiv.id = "mapButtonsConteiner";

      centerControlsDiv.appendChild(buttonSave);
      centerControlsDiv.appendChild(buttonLoad);
      centerControlsDiv.appendChild(buttonClear);

      map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlsDiv);

      topCenterControlsDiv = document.createElement("div");
      topCenterControlsDiv.id = "helpTextConteiner";
      topCenterControlsDiv.appendChild(topCenterText);

      map.controls[google.maps.ControlPosition.TOP_CENTER].push(topCenterControlsDiv);

      class DeleteMenu extends google.maps.OverlayView {
        div_;
        buttonDelete_;
        divListener_;
        constructor() {
          super();
          this.div_ = document.createElement("div");
          this.div_.className = "delete-menu";
          this.buttonDelete_ = document.createElement("button");
          this.buttonDelete_.classList.add("button");
          this.buttonDelete_.classList.add("buttonRed");
          this.buttonDelete_.innerHTML = "Delete";
    
          const menu = this;
    
          google.maps.event.addDomListener(this.div_, "click", () => {
            menu.removeVertex();
          });
        }
        onAdd() {
          const deleteMenu = this;
          const map = this.getMap();
    
          this.getPanes().floatPane.appendChild(this.div_);
          this.div_.appendChild(this.buttonDelete_);

          shouldCallFromMap = false;
    
          this.divListener_ = google.maps.event.addDomListener(
            map.getDiv(),
            "mousedown",
            (e) => {
              if (e.target != deleteMenu.buttonDelete_) {
                deleteMenu.close();
              }
            },
            true,
          );
        }
        onRemove() {
          if (this.divListener_) {
            google.maps.event.removeListener(this.divListener_);
          }
    
          this.buttonDelete_.parentNode.removeChild(this.buttonDelete_);
          this.div_.parentNode.removeChild(this.div_);
    
          this.set("position", null);
          this.set("path", null);
          this.set("vertex", null);

          setTimeout(() => {
            shouldCallFromMap = true;
          }, 100);
        }
        close() {
          this.setMap(null);
        }
        draw() {
          const position = this.get("position");
          const projection = this.getProjection();
    
          if (!position || !projection) {
            return;
          }
    
          const point = projection.fromLatLngToDivPixel(position);
    
          this.div_.style.top = point.y + "px";
          this.div_.style.left = point.x + "px";
        }
    
        open(map, path, vertex, id) {
          this.set("position", path.getAt(vertex));
          this.set("path", path);
          this.set("vertex", vertex);
          this.set("id", id);
          this.setMap(map);
          this.draw();
        }
    
        removeVertex() {
          const path = this.get("path");
          const vertex = this.get("vertex");
    
          if (!path || vertex == undefined) {
            this.close();
            return;
          }
    
          path.removeAt(vertex);
    
          window[shapesSave[callingShape.id][0] + "ShapeCreated"](callingShape.id, callingShape, false);
    
          this.close();
        }
      }

      deleteMenu = new DeleteMenu();

      clearInterval(IntervalId);
    }
  }, 100);
}

function dblClickEvent(event) {
  if (["drawPolygon", "drawPolyLine"].includes(selectedTool)) {
    event.cancelBubble = true;
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.preventDefault) {
      event.preventDefault();
    }

    if (shapeVariables.exists) {
      shapeVariables.exists = false;
    }
  }

  clicks = 0;
}

function changeTool(tool) {
  if (shapeVariables.exists) {
    shapeVariables.exists = false;
  }

  if (typeof window[selectedTool + "Deselect"] !== "undefined") {
    window[selectedTool + "Deselect"]();
  }
  if (typeof window[tool + "Select"] !== "undefined") {
    window[tool + "Select"]();
  }

  document.getElementById(selectedTool).classList.remove("selected");
  document.getElementById(tool).classList.add("selected");

  clicks = 0;
  selectedTool = tool;

  for (let i = 0; i < shapes.length; i++) {
    google.maps.event.clearListeners(shapes[i], "click");
    google.maps.event.addListener(shapes[i], "click", (event) => {
      callingFromShape = true;
      let shape = shapes[i];
      lastCallingShape = callingShape;
      callingShape = shape;

      window[selectedTool](event);
    });
  }

  if (["drawPolygon", "drawPolyLine"].includes(selectedTool)) {
    map.setOptions({ disableDoubleClickZoom: true });
  } else {
    map.setOptions({ disableDoubleClickZoom: false });
  }
}

function addEventToNewShape(isFromDataLayer = false) {
  google.maps.event.addListener(shapes[index - 1], "click", (eventNewShape) => {
    callingFromShape = true;
    let shape = shapes[index - 1];
    lastCallingShape = callingShape;
    callingShape = shape;

    window[selectedTool](eventNewShape);
  });
  google.maps.event.addListener(shapes[index - 1], "dblclick", (eventNewShape) => {
    dblClickEvent(eventNewShape);
  });
  google.maps.event.addListener(shapes[index - 1], "mousemove", (eventNewShape) => {
    if (typeof window[selectedTool + "MouseMove"] != "undefined") {
      window[selectedTool + "MouseMove"](eventNewShape);
    }
  });
}

function defaultChangeEditInputFunction(event) {
  if (event != undefined) {
    if (event.target.type == "number") {
      if (parseInt(event.target.value) > parseInt(event.target.max)) {
        event.target.value = event.target.max;
      }
      if (parseInt(event.target.value) < parseInt(event.target.min)) {
        event.target.value = event.target.min;
      }
    }
  }

  strokeColorValue = strokeColorElement.value;
  strokeWeightValue = strokeWeightElement.value;
  strokeOpacityValue = strokeOpacityRangeElement.value;
  fillColorValue = fillColorElement.value;
  fillOpacityValue = fillOpacityRangeElement.value;
  geodesicValue = geodesicElement.checked;

  markerStrokeColorValue = markerStrokeColorElement.value;
  markerBackgroundColorValue = markerBackgroundColorElement.value;
  markerGlyphColorValue = markerGlyphColorElement.value;
  markerScaleValue = markerScaleRangeElement.value;
  markerShowGlyphValue = markerShowGlyphElement.checked;
}

function drawPolyLine(event) {
  clicks += 1;

  if (clicks == 1) {
    setTimeout((localEvent) => {
      if (clicks == 1) {
        if (!shapeVariables.exists) {
          index = shapes.push(new google.maps.Polyline({
            geodesic: geodesicValue,
            strokeColor: strokeColorValue,
            strokeOpacity: strokeOpacityValue,
            strokeWeight: strokeWeightValue,
          }));
          
          changeMapHintText("Clique para adicionar um vértice");

          shapeVariables.exists = true;

          shapes[index - 1].setMap(map);

          actualPath = shapes[index - 1].getPath();

          actualPath.push(localEvent.latLng);

          addEventToNewShape();

          pointIndex = shapes[index - 1].getPath().getLength();

        } else {
          //actualPath.push(localEventTimeout.latLng);
          pointIndex = shapes[index - 1].getPath().getLength();
        }
      }

      clicks = 0;
    }, 50, event);
  }
}
function drawPolyLineMouseMove(event) {
  if (shapeVariables.exists) {
    actualPath.setAt(pointIndex, event.latLng);
  }
}
function drawPolyLineShapeCreated(id, shapeToSave, shouldChangeMapHintText) {
  shapesSave[id] = [
    "drawPolyLine",
    shapeToSave.getPath().getArray(),
    {
      geodesic: shapeToSave.geodesic,
      strokeColor: shapeToSave.strokeColor,
      strokeOpacity: shapeToSave.strokeOpacity,
      strokeWeight: shapeToSave.strokeWeight,
    }
  ];

  if (shouldChangeMapHintText) {
    changeMapHintText("Clique para iniciar a linha");
  }
}
function drawPolyLineLoadShape(positions) {
  index = shapes.push(new google.maps.Polyline({
    path: positions,
    geodesic: geodesicValue,
    strokeColor: strokeColorValue,
    strokeOpacity: strokeOpacityValue,
    strokeWeight: strokeWeightValue,
  }));

  shapes[index - 1].setMap(map);

  addEventToNewShape();
}
function drawPolyLineSelect () {
  changeMapHintText("Clique para iniciar a linha");
} 

function drawPolygon(event) {
  clicks += 1;

  if (clicks == 1) {
    setTimeout((localEvent) => {
      if (clicks == 1) {
        if (!shapeVariables.exists) {
          index = shapes.push(new google.maps.Polygon({
            geodesic: geodesicValue,
            strokeColor: strokeColorValue,
            strokeOpacity: strokeOpacityValue,
            strokeWeight: strokeWeightValue,
            fillColor: fillColorValue,
            fillOpacity: fillOpacityValue,
          }));

          changeMapHintText("Clique para adicionar um vértice");

          shapeVariables.exists = true;

          shapes[index - 1].setMap(map);

          actualPath = shapes[index - 1].getPath();

          actualPath.push(localEvent.latLng);

          addEventToNewShape();

          pointIndex = shapes[index - 1].getPath().getLength();

        } else {
          //actualPath.push(localEventTimeout.latLng);
          pointIndex = shapes[index - 1].getPath().getLength();
        }
      }

      clicks = 0;
    }, 50, event);
  }
}
function drawPolygonMouseMove(event) {
  if (shapeVariables.exists) {
    actualPath.setAt(pointIndex, event.latLng);
  }
}
function drawPolygonShapeCreated(id, shapeToSave, shouldChangeMapHintText) {
  shapesSave[id] = [
    "drawPolygon",
    shapeToSave.getPath().getArray(),
    {
      geodesic: shapeToSave.geodesic,
      strokeColor: shapeToSave.strokeColor,
      strokeOpacity: shapeToSave.strokeOpacity,
      strokeWeight: shapeToSave.strokeWeight,
      fillColor: shapeToSave.fillColor,
      fillOpacity: shapeToSave.fillOpacity,
    }
  ];

  if (shouldChangeMapHintText) {
    changeMapHintText("Clique para iniciar o polígono");
  }
}
function drawPolygonLoadShape(positions) {
  index = shapes.push(new google.maps.Polygon({
    path: positions,
    geodesic: geodesicValue,
    strokeColor: strokeColorValue,
    strokeOpacity: strokeOpacityValue,
    strokeWeight: strokeWeightValue,
    fillColor: fillColorValue,
    fillOpacity: fillOpacityValue,
  }));

  shapes[index - 1].setMap(map);

  addEventToNewShape();
}
function drawPolygonSelect () {
  changeMapHintText("Clique para iniciar o polígono");
}

function drawRectangle(event) {
  clicks += 1;

  if (clicks == 1) {
    if (!shapeVariables.exists) {
      index = shapes.push(new google.maps.Rectangle({
        geodesic: geodesicValue,
        strokeColor: strokeColorValue,
        strokeOpacity: strokeOpacityValue,
        strokeWeight: strokeWeightValue,
        fillColor: fillColorValue,
        fillOpacity: fillOpacityValue,
      }));

      shapeVariables.exists = true;

      changeMapHintText("Clique para definir o outro canto do retangulo");

      shapes[index - 1].setMap(map);

      shapes[index - 1].setBounds(new google.maps.LatLngBounds(event.latLng, event.latLng));

      originalBounds.northEast.lat = event.latLng.lat();
      originalBounds.northEast.lng = event.latLng.lng();

      addEventToNewShape();
    }
  } else {
    clicks = 0;

    shapeVariables.exists = false;
  }
}
function drawRectangleMouseMove(event) {
  if (shapeVariables.exists) {
    if (event.latLng.lng() < originalBounds.northEast.lng) {
      bounds.southWest.lng = originalBounds.northEast.lng;

      bounds.northEast.lng = event.latLng.lng();
    } else {
      bounds.northEast.lng = originalBounds.northEast.lng;

      bounds.southWest.lng = event.latLng.lng();
    }

    if (event.latLng.lat() > originalBounds.northEast.lat) {
      bounds.southWest.lat = originalBounds.northEast.lat;

      bounds.northEast.lat = event.latLng.lat();
    } else {
      bounds.northEast.lat = originalBounds.northEast.lat;

      bounds.southWest.lat = event.latLng.lat();
    }

    shapes[index - 1].setBounds(new google.maps.LatLngBounds(bounds.northEast, bounds.southWest));
  }
}
function drawRectangleShapeCreated(id, shapeToSave, shouldChangeMapHintText) {
  shapesSave[id] = [
    "drawRectangle",
    shapeToSave.getBounds().toJSON(),
    {
      strokeColor: shapeToSave.strokeColor,
      strokeOpacity: shapeToSave.strokeOpacity,
      strokeWeight: shapeToSave.strokeWeight,
      fillColor: shapeToSave.fillColor,
      fillOpacity: shapeToSave.fillOpacity,
    }
  ];

  if (shouldChangeMapHintText) {
    changeMapHintText("Clique para definir um dos cantos do retangulo");
  }
}
function drawRectangleLoadShape(bounds) {
  index = shapes.push(new google.maps.Rectangle({
    bounds: bounds,
    geodesic: geodesicValue,
    strokeColor: strokeColorValue,
    strokeOpacity: strokeOpacityValue,
    strokeWeight: strokeWeightValue,
    fillColor: fillColorValue,
    fillOpacity: fillOpacityValue,
  }));

  shapes[index - 1].setMap(map);

  addEventToNewShape();
}
function drawRectangleSelect () {
  changeMapHintText("Clique para definir um dos cantos do retangulo");
}

function drawLine(event) {
  clicks += 1;

  if (clicks == 1) {
    if (!shapeVariables.exists) {
      index = shapes.push(new google.maps.Polyline({
        geodesic: geodesicValue,
        strokeColor: strokeColorValue,
        strokeOpacity: strokeOpacityValue,
        strokeWeight: strokeWeightValue,
      }));

      changeMapHintText("Clique para finalizar a linha");

      shapeVariables.exists = true;

      shapes[index - 1].setMap(map);

      actualPath = shapes[index - 1].getPath();

      actualPath.push(event.latLng);

      addEventToNewShape();

      pointIndex = shapes[index - 1].getPath().getLength();
    }
  } else {
    clicks = 0;

    shapeVariables.exists = false;
  }
}
function drawLineMouseMove(event) {
  if (shapeVariables.exists) {
    actualPath.setAt(pointIndex, event.latLng);
  }
}
function drawLineShapeCreated(id, shapeToSave, shouldChangeMapHintText) {
  shapesSave[id] = [
    "drawLine",
    shapeToSave.getPath().getArray(),
    {
      geodesic: shapeToSave.geodesic,
      strokeColor: shapeToSave.strokeColor,
      strokeOpacity: shapeToSave.strokeOpacity,
      strokeWeight: shapeToSave.strokeWeight,
    }
  ];

  if (shouldChangeMapHintText) {
    changeMapHintText("Clique para iniciar a linha");
  }
}
function drawLineLoadShape(positions) {
  index = shapes.push(new google.maps.Polyline({
    path: positions,
    geodesic: geodesicValue,
    strokeColor: strokeColorValue,
    strokeOpacity: strokeOpacityValue,
    strokeWeight: strokeWeightValue,
  }));

  shapes[index - 1].setMap(map);

  addEventToNewShape();
}
function drawLineSelect () {
  changeMapHintText("Clique para iniciar a linha");
}

function putMarker(event) {
  index = shapes.push(new advancedMarkerElement({
    map,
    position: event.latLng,
  }));

  shapes[index - 1].scale = markerScaleValue;
  shapes[index - 1].strokeColor = markerStrokeColorValue;
  shapes[index - 1].backgroundColor = markerBackgroundColorValue;
  shapes[index - 1].glyphColor = markerGlyphColorValue;
  shapes[index - 1].showGlyph = markerShowGlyphValue;

  let pin = createPin(shapes[index - 1].scale, shapes[index - 1].strokeColor, shapes[index - 1].backgroundColor, shapes[index - 1].glyphColor, shapes[index - 1].showGlyph);

  shapes[index - 1].content = pin.element;

  addEventToNewShape();

  shapes[index - 1].id = shapeId;
  shapeId += 1;

  callingFromShape = true;
  let shape = shapes[index - 1];
  lastCallingShape = callingShape;
  callingShape = shape;

  putMarkerShapeCreated(shape.id, shape);
}
function createPin(scale, strokeColor, backgroundColor, glyphColor, showGlyph) {
  let glyph;

  if (!showGlyph) {
    glyph = "";
  }

  return new pinElement({
    scale: parseFloat(scale),
    borderColor: strokeColor,
    background: backgroundColor,
    glyphColor: glyphColor,
    glyph: glyph,
  });
}
function putMarkerSelect() {
  changeMarkerOptionsVisibility(true);
  changeMapHintText("Clique para adicionar um marcador");
}
function putMarkerDeselect() {
  changeMarkerOptionsVisibility(false);
}
function putMarkerShapeCreated(id, shapeToSave) {
  shapesSave[id] = [
    "putMarker",
    shapeToSave.position.toJSON(),
    {
      scale: shapeToSave.scale,
      strokeColor: shapeToSave.strokeColor,
      backgroundColor: shapeToSave.backgroundColor,
      glyphColor: shapeToSave.glyphColor,
      showGlyph: shapeToSave.showGlyph,
    }
  ];
}
function putMarkerLoadShape(position) {
  index = shapes.push(new advancedMarkerElement({
    map,
    position: position,
  }));

  shapes[index - 1].scale = markerScaleValue;
  shapes[index - 1].strokeColor = markerStrokeColorValue;
  shapes[index - 1].backgroundColor = markerBackgroundColorValue;
  shapes[index - 1].glyphColor = markerGlyphColorValue;
  shapes[index - 1].showGlyph = markerShowGlyphValue;

  let pin = createPin(shapes[index - 1].scale, shapes[index - 1].strokeColor, shapes[index - 1].backgroundColor, shapes[index - 1].glyphColor, shapes[index - 1].showGlyph);

  shapes[index - 1].content = pin.element;

  addEventToNewShape();
}

function drawCircle(event) {
  clicks += 1;

  if (clicks == 1) {
    if (!shapeVariables.exists) {
      index = shapes.push(new google.maps.Circle({
        strokeColor: strokeColorValue,
        strokeOpacity: strokeOpacityValue,
        strokeWeight: strokeWeightValue,
        fillColor: fillColorValue,
        fillOpacity: fillOpacityValue,
        map: map,
        center: event.latLng,
        radius: 0.1,
      }));

      shapeVariables.exists = true;

      changeMapHintText("Clique para definir o raio do circulo");

      addEventToNewShape();
    }
  } else if (clicks == 2) {
    clicks = 0;

    shapeVariables.exists = false;

  }
}
function drawCircleMouseMove(event) {
  if (shapeVariables.exists) {
    const radius = geometryLibrary.computeDistanceBetween(event.latLng, shapes[index - 1].getCenter());
    shapes[index - 1].setRadius(radius);
  }
}
function drawCircleShapeCreated(id, shapeToSave, shouldChangeMapHintText = true) {
  let center = shapeToSave.getCenter();
  let radius = shapeToSave.getRadius();

  shapesSave[id] = [
    "drawCircle",
    [center.toJSON(), radius],
    {
      strokeColor: strokeColorValue,
      strokeOpacity: strokeOpacityValue,
      strokeWeight: strokeWeightValue,
      fillColor: fillColorValue,
      fillOpacity: fillOpacityValue,
    }
  ];

  if (shouldChangeMapHintText) {
    changeMapHintText("Clique para definir o centro do circulo");
  }
}
function drawCircleLoadShape(properties) {
  index = shapes.push(new google.maps.Circle({
    strokeColor: strokeColorValue,
    strokeOpacity: strokeOpacityValue,
    strokeWeight: strokeWeightValue,
    fillColor: fillColorValue,
    fillOpacity: fillOpacityValue,
    map: map,
    center: properties[0],
    radius: properties[1], // initial radius
  }));
}
function drawCircleSelect() {
  changeMapHintText("Clique para definir o centro do circulo");
}

function clear() {
  if (callingShape != null) {
    callingShape.setMap(null);
    delete shapesSave[callingShape.id];

    if (Object.keys(shapesSave).length == 0) {
      showSaveClearButtons(false);
    }
  }
}
function clearSelect() {
  changeMapHintText("Clique para apagar uma forma");
}

function editShape(event) {
  if (callingShape != lastCallingShape) {
    if (lastCallingShape != null) {
      if (isMarker(lastCallingShape)) {
        lastCallingShape.gmpDraggable = false;
        changeMarkerOptionsVisibility(false);
      } else {
        lastCallingShape.setOptions({ editable: false });
        if (['drawPolyLine', 'drawPolygon'].includes(shapesSave[lastCallingShape.id][0])) {
          google.maps.event.clearListeners(lastCallingShape, "contextmenu");
        }
      }
      window[shapesSave[lastCallingShape.id][0] + "ShapeCreated"](lastCallingShape.id, lastCallingShape, false);
    }
  }

  if (callingShape != null) {
    setOptionsToShape(callingShape);

    changeMapHintText("mude as opções para editar a forma selecionada");

    if (isMarker(callingShape)) {
      dragShape(event);
      changeMarkerOptionsVisibility(true);
    } else {
      if (['drawPolyLine', 'drawPolygon'].includes(shapesSave[callingShape.id][0])) {
        changeMapHintText("mude as opções ou modifique os pontos para editar a forma selecionada");
        google.maps.event.addListener(callingShape, "contextmenu", (e) => {
          if (e.vertex == undefined) {
            return;
          }
      
          deleteMenu.open(map, callingShape.getPath(), e.vertex);
        });
      }

      callingShape.setOptions({ editable: true });
    }
  } else {
    changeMapHintText("Clique para habiltar a edição de uma forma");
  }
}
function editShapeSelect() {
  changeMapHintText("Clique para habiltar a edição de uma forma");
}
function editShapeDeselect() {
  if (callingShape != null) {
    if (isMarker(callingShape)) {
      callingShape.gmpDraggable = false;
    } else {
      callingShape.setOptions({ editable: false });
    }

    window[shapesSave[callingShape.id][0] + "ShapeCreated"](callingShape.id, callingShape, false);
  }
}
function editShapeEditInput(event) {
  let callerIsMarker = isMarker(callingShape);

  if (callingShape != null) {
    if (callerIsMarker) {
      editShapeEditInputMarker(event);
    } else {
      editShapeEditInputShape(event);
    }

    window[shapesSave[callingShape.id][0] + "ShapeCreated"](callingShape.id, callingShape, false);
  }
}
function editShapeEditInputShape() {
  callingShape.setOptions({ strokeColor: strokeColorValue });
  callingShape.setOptions({ strokeOpacity: strokeOpacityValue });
  callingShape.setOptions({ strokeWeight: strokeWeightValue });

  if (callingShape.fillColor != null) {
    callingShape.setOptions({ fillColor: fillColorValue });
    callingShape.setOptions({ fillOpacity: fillOpacityValue });
  }

  if (hasAtribute(callingShape, "geodesic", false)) {
    callingShape.setOptions({ geodesic: geodesicValue });
  }
}
function editShapeEditInputMarker() {
  let newPin = createPin(markerScaleValue, markerStrokeColorValue, markerBackgroundColorValue, markerGlyphColorValue, markerShowGlyphValue);

  callingShape.scale = markerScaleValue;
  callingShape.strokeColor = markerStrokeColorValue;
  callingShape.backgroundColor = markerBackgroundColorValue;
  callingShape.glyphColor = markerGlyphColorValue;
  callingShape.showGlyph = markerShowGlyphValue;
  
  callingShape.content = newPin.element;
}


function dragShape(event) {

  clicks += 1;

  if (callingShape != lastCallingShape) {
    clicks = 1;
    if (lastCallingShape != null) {
      if (lastCallingShape.localName != null) {
        lastCallingShape.gmpDraggable = false;
      } else {
        lastCallingShape.setOptions({ draggable: false });
        lastCallingShape.setOptions({ strokeWeight: parseInt(lastCallingShape.strokeWeight) - 2 });
      }
      window[shapesSave[lastCallingShape.id][0] + "ShapeCreated"](lastCallingShape.id, lastCallingShape, false);
    }
  }
  if (clicks == 1 && callingShape != null) {
    if (callingShape.localName != null) {
      callingShape.gmpDraggable = true;
    } else {
      callingShape.setOptions({ draggable: true });
      callingShape.setOptions({ strokeWeight: parseInt(callingShape.strokeWeight) + 2 });
    }
    changeMapHintText("Clique e arrate a forma selecionada para mudar sua posição");
  } else if (callingShape == null) {
    changeMapHintText("Clique para permitir arrastar uma forma");
  }
}

function dragShapeSelect() {
  changeMapHintText("Clique para permitir arrastar uma forma");
}
function dragShapeDeselect() {
  if (callingShape != null && clicks == 1) {
    if (callingShape.localName != null) {
      callingShape.gmpDraggable = false;
    } else {
      callingShape.setOptions({ draggable: false });
      callingShape.setOptions({ strokeWeight: parseInt(callingShape.strokeWeight) - 2 });
    }
    window[shapesSave[callingShape.id][0] + "ShapeCreated"](callingShape.id, callingShape, false);
  }
}

function isMarker(object) {
  if (object != null) {
    if (object.localName) {
      return true;
    }
  }
  return false;
}

function changeMarkerOptionsVisibility(show = true) {
  if (show) {
    let markerOptionsTable = document.getElementById("drawMarkerOptionsTable");
    markerOptionsTable.classList.remove("hidden");

    let optionsTable = document.getElementById("drawOptionsTable");
    optionsTable.classList.add("hidden");
  } else {
    let markerOptionsTable = document.getElementById("drawMarkerOptionsTable");
    markerOptionsTable.classList.add("hidden");

    let optionsTable = document.getElementById("drawOptionsTable");
    optionsTable.classList.remove("hidden");
  }
}

function hasAtribute(object, attribute, defaultValue) {
  if (object != null) {
    if (object[attribute] != null) {
      return object[attribute];
    }
  }
  return defaultValue;
}

function setOptionsToShape(shapeToGetOptions) {
  if (isMarker(shapeToGetOptions)) {
    markerScaleValue = shapeToGetOptions.scale;
    markerStrokeColorValue = shapeToGetOptions.strokeColor;
    markerBackgroundColorValue = shapeToGetOptions.backgroundColor;
    markerGlyphColorValue = shapeToGetOptions.glyphColor;
    markerShowGlyphValue = shapeToGetOptions.showGlyph;

    markerStrokeColorElement.value = markerStrokeColorValue;
    markerBackgroundColorElement.value = markerBackgroundColorValue;
    markerGlyphColorElement.value = markerGlyphColorValue;
    markerScaleRangeElement.value = markerScaleValue;
    markerScaleNumberElement.value = markerScaleValue;
    markerShowGlyphElement.checked = markerShowGlyphValue;
  } else {
    strokeColorValue = hasAtribute(shapeToGetOptions, "strokeColor", "#000000");
    strokeWeightValue = hasAtribute(shapeToGetOptions, "strokeWeight", 2);
    strokeOpacityValue = hasAtribute(shapeToGetOptions, "strokeOpacity", 0.5);
    fillColorValue = hasAtribute(shapeToGetOptions, "fillColor", "#000000");
    fillOpacityValue = hasAtribute(shapeToGetOptions, "fillOpacity", 0.5);
    geodesicValue = hasAtribute(shapeToGetOptions, "geodesic", false);

    strokeColorElement.value = strokeColorValue;
    strokeWeightElement.value = strokeWeightValue;
    strokeOpacityRangeElement.value = strokeOpacityValue;
    strokeOpacityNumberElement.value = Math.round(strokeOpacityValue * 100);
    fillColorElement.value = fillColorValue;
    fillOpacityRangeElement.value = fillOpacityValue;
    fillOpacityNumberElement.value = Math.round(fillOpacityValue * 100);
    geodesicElement.value = geodesicValue;
  }
}

function resetOptions() {
  strokeColorValue = "#000000";
  strokeWeightValue = 2;
  strokeOpacityValue = 0.5;
  fillColorValue = "#000000";
  fillOpacityValue = 0.5;
  geodesicValue = false;

  markerStrokeColorValue = "#C5221F";
  markerBackgroundColorValue = "#EA4335";
  markerGlyphColorValue = "#B31412";
  markerScaleValue = 1;
  markerShowGlyphValue = true;

  strokeColorElement.value = strokeColorValue;
  strokeWeightElement.value = strokeWeightValue;
  strokeOpacityRangeElement.value = strokeOpacityValue;
  strokeOpacityNumberElement.value = Math.round(strokeOpacityValue * 100);
  fillColorElement.value = fillColorValue;
  fillOpacityRangeElement.value = fillOpacityValue;
  fillOpacityNumberElement.value = Math.round(fillOpacityValue * 100);
  geodesicElement.value = geodesicValue;

  markerStrokeColorElement.value = markerStrokeColorValue;
  markerBackgroundColorElement.value = markerBackgroundColorValue;
  markerGlyphColorElement.value = markerGlyphColorValue;
  markerScaleRangeElement.value = markerScaleValue;
  markerScaleNumberElement.value = markerScaleValue;
  markerShowGlyphElement.checked = markerShowGlyphValue;
}

function saveMapToFile() {
  let data = JSON.stringify(shapesSave);
  let file = new Blob([data], { type: "text/plain;charset=utf-8" });

  if (window.navigator.msSaveOrOpenBlob)
    window.navigator.msSaveOrOpenBlob(file, 'DrawMapFile.mapDraw');
  else { 
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = 'DrawMapFile.mapDraw';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
function saveMapToLocalStorage() {
  let data = JSON.stringify(shapesSave);

  localStorage.setItem("drawMapFile", data);
}

function clearMap() {
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].setMap(null);
  }
  shapes = [];
  shapesSave = {};
  shapeId = 0;

  showSaveClearButtons(false);
}

function loadMap(fromLocalFile = false) {
  clearMap();

  if (fromLocalFile) {
    loadMapFunction(localStorage.getItem("drawMapFile"));
  } else {
    let file = document.getElementById("fileLoadInput").files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
      loadMapFunction(e.target.result);
    };
    reader.readAsText(file);
  }
}
function loadMapFunction(data) {
  let shapesToLoad = JSON.parse(data);
  shapeId = 0;

  try {
    for (const key of Object.keys(shapesToLoad)) {
      if(shapesToLoad[key][0] == "putMarker") {
        markerStrokeColorValue = shapesToLoad[key][2]["strokeColor"];
        markerBackgroundColorValue = shapesToLoad[key][2]["backgroundColor"];
        markerGlyphColorValue = shapesToLoad[key][2]["glyphColor"];
        markerScaleValue = shapesToLoad[key][2]["scale"];
        markerShowGlyphValue = shapesToLoad[key][2]["showGlyph"];
  
        putMarkerLoadShape(shapesToLoad[key][1]);
      } else {
        
        strokeColorValue = shapesToLoad[key][2]["strokeColor"];
        strokeWeightValue = shapesToLoad[key][2]["strokeWeight"];
        strokeOpacityValue = shapesToLoad[key][2]["strokeOpacity"];
        fillColorValue = shapesToLoad[key][2]["fillColor"];
        fillOpacityValue = shapesToLoad[key][2]["fillOpacity"];
        geodesicValue = shapesToLoad[key][2]["geodesic"];
  
        window[shapesToLoad[key][0] + "LoadShape"](shapesToLoad[key][1]);
      }
  
      shapes[index - 1].id = shapeId;
      shapesSave[shapeId] = shapesToLoad[key];
      shapeId += 1;
    }
  
    resetOptions();

    document.querySelector(".fileUpload").style.borderColor = "var(--fileUploadBorderColor)";
    document.getElementById("fileLoadInput").value = "";
    document.getElementById("fileLoadText").innerHTML = "Selecione o arquivo";

    document.getElementById("fileLoadDialog").close();

    showSaveClearButtons(true);

    showMensage("Mapa carregado com sucesso", "rgb(255, 255, 255)", "rgb(0, 160, 0)");
  }
  catch (error) {
    showMensage("Atenção!!! dado inválido, ele pode estar corrompido ou ter sido modificado", "rgb(255, 255, 255)", "rgb(204, 0, 0)");
  
    shapes = [];
    shapesSave = {};
    shapeId = 0;
  }
}

function showMensage(message, textBorderColor, textBackgroundColor, time = 5000) {
  let mensageConteiner = document.getElementById("mensageConteiner");
  let mensage = document.getElementById("mensage");

  mensageConteiner.style.borderColor = textBorderColor;
  mensageConteiner.style.backgroundColor = textBackgroundColor;

  mensage.style.color = textBorderColor;
  mensage.innerHTML = message;

  mensageConteiner.classList.add("showMensage");
  setTimeout(() => {
    mensageConteiner.classList.remove("showMensage");

    setTimeout(() => {
      mensageConteiner.style.borderColor = "var(--defaultMansageColor)";
      mensageConteiner.style.backgroundColor = "1px solid var(--textColor)";
      mensage.style.color = "var(--textColor)";
    }, 300);
  }, time);
}

function showSaveClearButtons(showButtons) {
  if (showButtons) {
    buttonSave.classList.remove("hidden");
    buttonClear.classList.remove("hidden");
  } else {
    buttonSave.classList.add("hidden");
    buttonClear.classList.add("hidden");
  }
  map.setZoom(map.getZoom());
}

function changeMapHintText(text) {
  topCenterText.innerHTML = text;
  map.setZoom(map.getZoom());
}

function pan() {
  // é isso então ¯\_(ツ)_/¯
  // é sério, é só isso
}
function panSelect() {
  changeMapHintText("Clique para mover o mapa");
}