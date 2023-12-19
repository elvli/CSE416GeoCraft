import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useContext } from "react";
import GlobalStoreContext from "../../store";

export default function EditRegionModal(props) {
  const { editRegionShow, handleEditRegionClose, mapId, region } = props
  const { store } = useContext(GlobalStoreContext);
  const [validated, setValidated] = useState(false)
  function updateMapData(mapId, formData) {
    async function asyncUpdateMapData() {
        
        const mapData = await store.getMapDataById(mapId)

        const json = mapData.GeoJson
        let j = 0
        for(let i = 0; i < json["features"].length; i++) {
          if(json['features'][i].properties['NAME_1']&&json['features'][i].properties['NAME_1'] === region) {
            json['features'][i].properties['NAME_1'] = formData.get("mapName");
            j = i
          }
        }
      //console.log(json['features'][j].properties['NAME_1'])
      await store.updateMapDataById(mapId, mapData);
      await store.setCurrentList(mapId, 0)
    }
    asyncUpdateMapData()
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
        updateMapData(mapId, formData)
        // map.name = formData.get("mapName");
        // console.log(map)
        // store.updateLikeDislike(map._id, map);
        
        handleEditRegionClose(event)
      }
  };
  
  const handleClosing = (event) => {
    setValidated(false);
    handleEditRegionClose(event)
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
              <Form.Label>Enter the Name of Region</Form.Label>
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