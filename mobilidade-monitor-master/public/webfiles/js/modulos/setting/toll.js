document.addEventListener('DOMContentLoaded', () => {
   preload(true);

   const elementProperty = new ElementProperty();
   const mapService = new MapService();
   const mapServiceView = new MapService();

   let timeout = null;
   let timeoutBlur = null;

   let circleMap = null;

   let choiceRequest = 1;
   let request;

   function isMobile() {
      let check = false;
      (function (a) {
         if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
               a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
               a.substr(0, 4)
            )
         )
            check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
   }

   if (isMobile()) {
      elementProperty.addClass('.table', 'table-responsive');
   }

   if (Session.get('user').roleId > 2  && Session.get('user').support != 1) {
      document.querySelector('.btn-list-toll').style.display = 'none';
   }

   elementProperty.addEventInElement('.btn-list-toll', 'onclick', function () {
      if (choiceRequest === 1) {
         choiceRequest = 2;
         return toolRequest();
      } else {
         choiceRequest = 1;
         return toolRequest();
      }
   });

   function toolRequest() {
      if (choiceRequest === 1) {
         document.querySelector('.btn-list-toll').innerHTML = 'Listar todos';
         request = TollController.listByCity(Session.getLocal('citySelected').cityId);
      } else {
         document.querySelector('.btn-list-toll').innerHTML = 'Por cidade';
         request = TollController.list();
      }
      preload(true);
      request.then(({ response }) => {
         if (response.length === 0) {
            document.querySelector('.table').style.display = 'none';
            document.querySelector('.dont-prepaid-yet').innerHTML =
               'Ainda não há pedágio cadastrado';
         } else {
            document.querySelector('.table').style.display = '';
            document.querySelector('.dont-prepaid-yet').innerHTML = '';
         }
         document.querySelector('#listToll').innerHTML = response
            .map((toll) => {
               return `<tr>
                        <td>${toll.name}</td>
                        <td>${toll.address}</td>
                        <td>${Mask.maskMoney(toll.value)}</td>
                        <td>${toll.active == true ? 'Ativo' : 'Desativado'}</td>
                        <td><a href="#" class="delete-toll" value="${toll.id}">Excluir</a></td>
                        <td><a href="#" class="view-toll" value="${btoa(JSON.stringify(toll))}">Ver</a></td>
                    </tr>`
        }).join("");
        preload(false);
        elementProperty.addEventInElement(".view-toll", "onclick", function () {
            const toll = JSON.parse(atob(this.getAttribute("value")));
            elementProperty.getElement(".container-map-toll-view", element => {
                mapServiceView.initMap({lat: 0, lng: 0}, 10, element,true);
                setTimeout(() => {
                    mapServiceView.setBounds(...toll.polygon);

                    const circleMap = new google.maps.Polyline({
                        path: toll.polygon,
                        strokeColor: "#FF0000",
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                    });

                    circleMap.setMap(mapServiceView.map);

                   // mapServiceView.map.setZoom(18);
                }, 500);
            });

            $('#viewTollModal').modal('show');
         });
         elementProperty.addEventInElement('.delete-toll', 'onclick', (e) => {
            e.preventDefault();
            const value = e.target.getAttribute('value');
            SwalCustom.dialogConfirm('Deseja excluir esse pedágio ?', '', (status) => {
               if (status) {
                  preload(true);
                  TollController.delete(value).then(({ message, status }) => {
                     preload(false);
                     SwalCustom.messageDialog('', message, status ? 'success' : 'info').then(() => {
                        if (status) location.reload();
                     });
                  });
               }
            });
         });
         preload(false);
      });
   }
   toolRequest();

   elementProperty.addEventInElement('#addressToll', 'oninput', function () {
      clearTimeout(timeout);
      if (this.value.trim().length > 2) {
         timeout = setTimeout(() => {
            SettingsController.getPlaces(
               this.value,
               getCenterPolygon(Session.getLocal('pointsCity'))
            ).then(({ data }) => {
               document.querySelector('.autocomplete-address').innerHTML = data
                  .map((place) => {
                     return `<li class="place-address" value="${btoa(JSON.stringify(place))}">${
                        place.address
                     }</li>`;
                  })
                  .join('');
               initEventPlace();
            });
         }, 500);
      }
   });

   function initEventPlace() {
      elementProperty.addEventInElement('.place-address', 'onclick', function () {
         const place = JSON.parse(atob(this.getAttribute('value')));

         if (place.latitude == null && place.longitude == null) {
            preload(true);
            SettingsController.getLocationByAddress(place.address)
               .then(({ data }) => {
                  place.latitude = data.latitude;
                  place.longitude = data.longitude;
                  showInMap(place);
               })
               .finally(() => preload(false));
         } else {
            place.latitude = parseFloat(place.latitude);
            place.longitude = parseFloat(place.longitude);
            showInMap(place);
         }
      });
   }

   function showInMap(place) {
      document.querySelector('#addressToll').value = place.address;
      document.querySelector('.autocomplete-address').innerHTML = '';
      const position = { lat: place.latitude, lng: place.longitude };
      if (circleMap == null) {
         circleMap = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: mapService.map,
            center: position,
            radius: parseInt(document.querySelector('#meterRange').value),
         });
      } else {
         circleMap.setCenter(position);
      }

      mapService.map.setCenter(position);
      mapService.map.setZoom(18);

      let currMarker = new google.maps.Marker({
         position: mapService.map.getCenter(),
         draggable: true,
         icon: {
            url: '/webfiles/img/icon/measle_blue.png',
            size: new google.maps.Size(7, 7),
            anchor: new google.maps.Point(4, 4),
         },
         map: mapService.map,
      });

      circleMap.bindTo('center', currMarker, 'position');
   }

   function circlePath(circle) {
      let numPts = 512;
      const path = [];
      for (let i = 0; i < numPts; i++) {
         const { lat, lng } = google.maps.geometry.spherical.computeOffset(
            circle.getCenter(),
            circle.getRadius(),
            (i * 360) / numPts
         );
         path.push({ lat: lat(), lng: lng() });
      }

      path.push(path[0]);

      return path;
   }

   elementProperty.addEventInElement('#meterRange', 'oninput', function () {
      if (circleMap) {
         circleMap.setRadius(parseInt(document.querySelector('#meterRange').value));
      }
   });

   elementProperty.addEventInElement('#addressToll', 'onblur', function () {
      clearTimeout(timeoutBlur);
      timeoutBlur = setTimeout(() => {
         document.querySelector('.autocomplete-address').innerHTML = '';
      }, 500);
   });

   elementProperty.addEventInElement('#addressToll', 'onfocus', function () {
      clearTimeout(timeoutBlur);
   });

   Mask.setMoneyField('#valueToll');

   const manager = {
      estate: null,
      city: null,
      mapPolygon: null,
      drawingManager: null,
   };

   mapService.setLibraries('geometry');

   mapService.importScriptWithPlaces().then(() => {
      /*manager.mapPolygon = new google.maps.Polygon({
            paths: [],
            draggable: false, // turn off if it gets annoying
            editable: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });

        let polyOptions = {
            strokeWeight: 0,
            fillOpacity: 0.45,
            editable: true
        };
        //
        manager.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                drawingModes: [
                    google.maps.drawing.OverlayType.POLYGON,
                ]
            },
            markerOptions: {
                draggable: true
            },
            polylineOptions: {
                editable: true
            },
            polygonOptions: polyOptions,
        });

        google.maps.event.addListener(manager.drawingManager, 'polygoncomplete', function (polygon) {
            manager.drawingManager.setDrawingMode(null);

            manager.drawingManager.setOptions({
                drawingControl: false
            });

            let path = polygon.getPath();
            let coordinates = [];

            for (let i = 0; i < path.length; i++) {
                coordinates.push({
                    lat: path.getAt(i).lat(),
                    lng: path.getAt(i).lng()
                });
            }

            manager.mapPolygon.setPath(coordinates);

            polygon.setMap(null);

        });*/

      preload(false);
   });

   elementProperty.addEventInElement('#btnOpenModal', 'onclick', () => {
      $('#addTollModal').modal('show');
      const citySelected = Session.getLocal('citySelected');

      initMap({ lat: 0, lng: 0 }, getPathByPolygon(citySelected.polygon));
   });

   function initMap(location, bounds = []) {
      elementProperty.getElement('.container-map-toll', (element) => {
         mapService.initMap(location, 10, element);

         setTimeout(() => {
            mapService.setBounds(...bounds);
            // manager.drawingManager.setMap(mapService.map);
            //manager.mapPolygon.setMap(mapService.map);
         }, 500);
      });
   }

   function getPathByPolygon(stringPolygon) {
      stringPolygon = stringPolygon.replace('POLYGON((', '').replace('))', '');

      return stringPolygon.split(',').map((locationString) => {
         const location = locationString.split(' ');

         return { lat: parseFloat(location[0]), lng: parseFloat(location[1]) };
      });
   }

   elementProperty.addEventInElement('#btnAddToll', 'onclick', () => {
      const data = {
         name: document.querySelector('#nameToll').value,
         address: document.querySelector('#addressToll').value,
         value: Mask.removeMaskMoney(document.querySelector('#valueToll').value),
      };

      if (data.name.trim().length === 0) return alert('Informe o nome');

      if (data.address.trim().length === 0) return alert('Informe o endereço');

      if (data.value === 0) return alert('Informe o valor do pedágio');
      if (circleMap == null) return alert('Informe a area do pedágio');

      data.polygon = circlePath(circleMap);

      preload(true);
      TollController.insert({ ...data })
         .then(({ message, status }) => {
            SwalCustom.messageDialog('', message, status ? 'success' : 'info').then(() => {
               if (status) location.reload();
            });
         })
         .finally(() => {
            preload(false);
         });
   });

   function getPolygonCoords() {
      let len = manager.mapPolygon.getPath().getLength();

      let polygon = [];

      for (let i = 0; i < len; i++) {
         polygon.push(manager.mapPolygon.getPath().getAt(i));
      }

      if (polygon.length === 0) {
         SwalCustom.messageDialog('', 'Nenhuma aréa selecionanda', 'info');
         return;
      }

      polygon.push(polygon[0]);

      return polygon;
   }

   function getCenterPolygon(arr) {
      var minX, maxX, minY, maxY;
      for (var i = 0; i < arr.length; i++) {
         var x = arr[i].lat,
            y = arr[i].lng;
         minX = x < minX || minX == null ? x : minX;
         maxX = x > maxX || maxX == null ? x : maxX;
         minY = y < minY || minY == null ? y : minY;
         maxY = y > maxY || maxY == null ? y : maxY;
      }
      return { lat: (minX + maxX) / 2, lng: (minY + maxY) / 2 };
   }
});
