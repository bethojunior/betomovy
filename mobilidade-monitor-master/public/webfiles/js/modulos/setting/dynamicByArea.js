document.addEventListener('DOMContentLoaded', function () {
   const city = Session.getLocal('citySelected');
   let circleMap = null;
   let drawingManager = null;
   Mask.setMoneyField('.input-mask-money');
   updateListZone();
   const mapService = new MapService();
   mapService.setLibraries('drawing');
   mapService.importScriptWithPlaces().then(() => {
      mapService.initMap({ lat: 0, lng: 0 }, 15, document.getElementById('map'));

      let polyOptions = {
         strokeWeight: 0,
         fillOpacity: 0.45,
         editable: true,
      };

      drawingManager = new google.maps.drawing.DrawingManager({
         drawingMode: google.maps.drawing.OverlayType.POLYGON,
         drawingControl: true,
         drawingControlOptions: {
            drawingModes: [google.maps.drawing.OverlayType.POLYGON],
         },
         markerOptions: {
            draggable: true,
         },
         polylineOptions: {
            editable: true,
         },
         polygonOptions: polyOptions,
      });
      drawingManager.setMap(mapService.map);
      google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
         drawingManager.setDrawingMode(null);

         drawingManager.setOptions({
            drawingControl: false,
         });

         let path = polygon.getPath();
         let coordinates = [];

         for (let i = 0; i < path.length; i++) {
            coordinates.push({
               lat: path.getAt(i).lat(),
               lng: path.getAt(i).lng(),
            });
         }
         circleMap.setPath(coordinates);

         polygon.setMap(null);
      });
   });

   elementProperty.addEventInElement('#btnSearchLocal', 'onclick', function () {
      const host = `https://nominatim.openstreetmap.org/search.php?q=${
         document.querySelector('#nameZone').value
      } ${Session.getLocal('citySelected').nome}&polygon_geojson=1&format=jsonv2`;

      const stringPolygon = Session.getLocal("citySelected").polygon;
      const arrayPolygon = stringPolygon.split(',');
      const firstPosition = arrayPolygon[1].split(' ');
      const secondPosition = arrayPolygon[2].split(' ');
      const finalPosition = [{lat: parseFloat(firstPosition[0]), lng: parseFloat(firstPosition[1])}, {lat: parseFloat(secondPosition[0]), lng: parseFloat(secondPosition[1])}];

      preload(true);
      fetch(host).then(result => result.json()).then((result) => {
         const polygons = result.filter(item => {
            return item.geojson.type === "Polygon";
         });

         preload(false);

         document.querySelector("#contentMap").hidden = false;

         document.querySelector("#listGroupAddress").innerHTML = polygons.map(item => {
            return `<li class="list-group-item item-address" style="cursor: pointer" value='${btoa(JSON.stringify(item))}'><small>${item.display_name.substring(0, 50)}</small></li>`
         }).join("");

         if(polygons.length === 0 || polygons[0].geojson.type != 'Polygon'){
            if (circleMap == null) {
               circleMap = new google.maps.Polygon({
                  paths: finalPosition,
                  draggable: false, // turn off if it gets annoying
                  editable: true,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#FF0000',
                  fillOpacity: 0.35
               });

            } else {
               circleMap.setPath(finalPosition);
            }
            circleMap.setMap(mapService.map);

            mapService.setBoundsArray(finalPosition)
         } else {
            elementProperty.addEventInElement(".item-address", "onclick", function () {
               elementProperty.removeClass(".item-address", "active");
               this.classList.add("active");
               const item = JSON.parse(atob(this.getAttribute("value")));

               const bounds = item.geojson.coordinates[0].map(position => {
                  return {lat: position[1], lng: position[0]}
               });

               if (circleMap == null) {
                  circleMap = new google.maps.Polygon({
                     paths: bounds,
                     draggable: false, // turn off if it gets annoying
                     editable: true,
                     strokeColor: '#FF0000',
                     strokeOpacity: 0.8,
                     strokeWeight: 2,
                     fillColor: '#FF0000',
                     fillOpacity: 0.35
                  });

               } else {
                  circleMap.setPath(bounds);
               }
               circleMap.setMap(mapService.map);

               mapService.setBoundsArray(bounds)
            });
         }
      })
   });

   function updateListZone() {
      document.querySelector('#listGroupAddress').innerHTML = '';
      preload(true);
      DynamicByAreaController.list()
         .then(({ response }) => {
            document.querySelector('#listArea').innerHTML = response
               .filter((item) => item.startTime != null)
               .map((item) => {
                  return `<tr>
                        <td>${item.name}</td>
                        <td>${item.multiplierValue}</td>                   
                        <td>${item.startTime} até ${item.endTime}</td>
                        <td>
                        <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input change-status-setting change-status-dynamic-by-area" id="${
                               item.id
                            }" value="${item.id}" ${item.active == 1 ? 'checked' : ''}>
                            <label class="custom-control-label" for="${item.id}">${
                     item.active == 1 ? 'Ativado' : 'Desativado'
                  }</label>
                        </div>
                        </td>
                        <td><a href="#" value="${item.id}" class="remove-area">Excluir</a></td>
                    </tr>`;
               })
               .join('');

            elementProperty.addEventInElement('.remove-area', 'onclick', function () {
               SwalCustom.dialogConfirm('Deseja remover esse valor?', '', (status) => {
                  if (!status) return;

                  preload(true);
                  DynamicByAreaController.delete(this.getAttribute('value'))
                     .then(({ status, message }) => {
                        SwalCustom.messageDialog('', message, status ? 'success' : 'info');
                        if (status) {
                           $('#addNeighborhoodArea').modal('hide');
                           updateListZone();
                        }
                     })
                     .finally(() => {
                        preload(false);
                     });
               });
            });

            elementProperty.addEventInElement(
               '.change-status-dynamic-by-area',
               'onchange',
               function () {
                  const id = this.getAttribute('value');
                  preload(true);
                  DynamicByAreaController.changeStatus(
                     id,
                     this.checked ? 'enable' : 'disable'
                  ).then(() => {
                     preload(false);
                     updateListZone();
                  });
               }
            );
         })
         .finally(() => {
            preload(false);
         });
   }

   function getAreaPolygon() {
      if (!circleMap) return [];

      let len = circleMap.getPath().getLength();
      let polygon = [];
      for (let i = 0; i < len; i++) {
         const position = circleMap.getPath().getAt(i);
         polygon.push({ lat: position.lat(), lng: position.lng() });
      }
      if (polygon[0]) polygon.push(polygon[0]);

      return polygon;
   }

   elementProperty.addEventInElement('#btnAddZone', 'onclick', function () {
      const valurMultiplier = Mask.removeMaskMoney(
         document.querySelector('#valueInDynamicByArea').value
      );
      const area = getAreaPolygon();
      if (area.length === 0) {
         SwalCustom.messageDialog('', 'Nenhuma aréa selecionanda', 'info');
         return;
      }
      if (valurMultiplier == 0) {
         SwalCustom.messageDialog('', 'Digite um valor para esta área', 'info');
         return;
      }

      const startTime = document.querySelector('#startTime').value;
      const endTime = document.querySelector('#endTime').value;

      if (startTime === '' || endTime === '') {
         SwalCustom.messageDialog('', 'Informe os horários', 'info');
         return;
      }

      const data = {
         name: document.querySelector('#nameZone').value,
         cityId: city.cityId,
         area,
         multiplierValue: valurMultiplier,
         startTime,
         endTime,
      };

      if (data.name.length <= 0) return alert('Informe o nome da área');

      preload(true);
      DynamicByAreaController.insert(data)
         .then(({ status, message }) => {
            SwalCustom.messageDialog('', message, status ? 'success' : 'info');
            if (status) {
               document.location.reload(true);
            }
         })
         .finally(() => {
            preload(false);
         });
   });
});
