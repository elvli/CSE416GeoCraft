import React, { useState, useContext } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import GlobalStoreContext from "../../store";
import EditRegionTransaction from "../../transactions/EditRegionTransaction";

export default function EditChoroRegionModal(props) {
  const { editRegionShow, handleEditRegionClose, mapId, region, tps, changeRegionNameinData } = props
  const { store } = useContext(GlobalStoreContext);
  // const [json, setJson] = useState({})
  const [validated, setValidated] = useState(false)

  function updateMapData(map, formData) {
    const initialRegion = region;
    const newRegion = formData.get("mapName");

    async function asyncUpdateMapData(mapId, newName, oldName) {
      changeRegionNameinData(oldName, newName);

      const mapData = await store.getMapDataById(mapId);
      const json = mapData.GeoJsonl;

      for (let i = 0; i < json["features"].length; i++) {
        if (json['features'][i].properties.hasOwnProperty('NAME_1') && json['features'][i].properties['NAME_1'] === oldName) {
          json['features'][i].properties['NAME_1'] = newName;
        }
        else if (json['features'][i].properties.hasOwnProperty('NAME') && json['features'][i].properties['NAME'] === oldName) {
          json['features'][i].properties['NAME'] = newName;
        }
      }
      await store.updateMapDataById(mapId, mapData);
      await store.setCurrentList(mapId, 0);
    }
    let transaction = new EditRegionTransaction(asyncUpdateMapData, map, newRegion, initialRegion)
    tps.addTransaction(transaction);
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else {
      event.preventDefault();
      event.stopPropagation();

      const formData = new FormData(event.currentTarget);
      updateMapData(mapId, formData);

      handleEditRegionClose(event);
    }
  };

  const handleClosing = (event) => {
    setValidated(false);
    handleEditRegionClose(event);
  }

  return (
    <div>
      <Modal centered show={editRegionShow} onHide={handleEditRegionClose}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Enter Region Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Change the name of the region</Form.Label>
              <Form.Control className="map-name" name="mapName" required type="text" placeholder={region} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosing}>
              Close
            </Button>
            <Form.Group>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form.Group>

          </Modal.Footer>
        </Form>

      </Modal>
    </div>
  )
}