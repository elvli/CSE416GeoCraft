import React from "react";
import "./ExportMapModal.scss";
import { Form, Button, Modal } from "react-bootstrap";
import GlobalStoreContext from "../../store";
import { useState, useContext, useRef } from "react";

export default function ExportMapModal(props) {
  const downloadLinkRef = useRef(null);
  const [jsonData, setJsonData] = useState('');
  const { exportMapShow, handleExportMapClose } = props
  const [validated, setValidated] = useState(false);
  const { store } = useContext(GlobalStoreContext);
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
      console.log(formData.get('mapType'))
      var downloadType = formData.get("mapType")

      if (downloadType == 'json') {
        downloadJson()
      }
      else if (downloadType == 'jpeg') {
        downloadPic(2)
      }
      else {
        downloadPic(1)
      }

      handleExportMapClose(event)
    }
  };

  const handleClosing = (event) => {
    handleExportMapClose(event)
  };

  const downloadJson = async () => {
    const mapId = store.currentList._id
    const data = await store.getMapDataById(mapId)
    const json = JSON.stringify(data);


    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    downloadLinkRef.current.href = url;
    var string = store.currentList.name
    downloadLinkRef.current.download = string.concat('.json');
    downloadLinkRef.current.click();

    URL.revokeObjectURL(url);
  };

  const downloadPic = async (arg) => {
    const rewait = await store.setPrint(arg);
  }


  return (
    <div>
      <Modal centered show={exportMapShow} onHide={handleExportMapClose}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Export Map?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Are you sure you want to export this map?</p>
            <Form.Group>
              <Form.Label>Export as</Form.Label>
              
              <Form.Select name='mapType' required >
                <option value="">Select export type</option>
                <option value="json">JSON</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </Form.Select>
            </Form.Group>
            <a href="#" ref={downloadLinkRef} style={{ display: 'none' }} />
          </Modal.Body>

          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="secondary" onClick={handleClosing}>
              Close
            </Button>

            <Form.Group>
              <Button variant="primary" type="submit">
                Confirm
              </Button>
            </Form.Group>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}