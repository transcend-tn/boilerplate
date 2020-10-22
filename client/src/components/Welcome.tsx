import React from 'react';
import { useState } from 'react';
import { Col, Row, Button, Modal } from 'react-bootstrap';
import Media from 'react-bootstrap/esm/Media';
import { RiTeamLine, RiThumbUpLine, RiHistoryLine, RiEarthFill } from 'react-icons/ri';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

function Welcome() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function HandlerSupprimer() {
    console.log('Votre compte à été supprimé');
    handleClose();
  }
  return (
    <div className="w-75">
      <Row>
        <Col sm={6}>
          <h1 className="text-primary display-4">PFE 2020</h1>
          <p className="lead">
            <div>Un espace dédié à vos projets collaboratifs !</div>
          </p>
        </Col>
        <Col sm={6}>
          <SignInForm handleShowModal={handleShow} />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col sm={6}>
          <Media className="m-2 p-2 flex-fill">
            <RiTeamLine size={30} className="mr-3" />
            <Media.Body>
              <h5>Collaboration</h5>
              <p className="text-muted">Travaillez ensemble sur la même version</p>
            </Media.Body>
          </Media>
        </Col>
        <Col sm={6}>
          <Media className="m-2 p-2 flex-fill">
            <RiThumbUpLine size={30} className="mr-3" />
            <Media.Body>
              <h5>Facilité d’utilisation</h5>
              <p className="text-muted">pas de complicité, Facile à manipuler</p>
            </Media.Body>
          </Media>
        </Col>
        <Col sm={6}>
          <Media className="m-2 p-2 flex-fill">
            <RiHistoryLine size={30} className="mr-3" />
            <Media.Body>
              <h5>Historique du document</h5>
              <p className="text-muted"> Revenez à n’importe quelle version précédente</p>
            </Media.Body>
          </Media>
        </Col>
        <Col sm={6}>
          <Media className="m-2 p-2 flex-fill">
            <RiEarthFill size={30} className="mr-3" />
            <Media.Body>
              <h5>Travaillez n’importe où</h5>
              <p className="text-muted">Accédez à votre travail où que vous soyez</p>
            </Media.Body>
          </Media>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Inscription </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignUpForm />
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-0">
          <Button variant="success" onClick={HandlerSupprimer}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Welcome;
