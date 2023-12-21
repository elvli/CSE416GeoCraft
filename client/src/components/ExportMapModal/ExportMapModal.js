import React, { useState, useContext, useRef } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import GlobalStoreContext from "../../store";
import "./ExportMapModal.scss";

export default function ExportMapModal(props) {
  const downloadLinkRef = useRef(null);
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
      var downloadType = formData.get("fileType");

      if (downloadType === 'json') {
        downloadJson();
      }
      else if (downloadType === 'jpg') {
        downloadPic(2);
      }
      else {
        downloadPic(1);
      }

      handleExportMapClose(event);
    }
  };

  const handleClosing = (event) => {
    handleExportMapClose(event);
  };

  const downloadJson = async () => {
    const mapId = store.currentList._id
    const data = await store.getMapDataById(mapId);
    const json = JSON.stringify(data);


    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    downloadLinkRef.current.href = url;
    var string = store.currentList.name;
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

              <Form.Select name='fileType' required >
                <option value="">Select export type</option>
                <option value="json">JSON</option>
                <option value="jpg">JPG</option>
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