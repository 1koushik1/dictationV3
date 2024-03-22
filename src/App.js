import './App.css';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import DraggableModalDialog from './components/DraggableModalDialog';
import AudioRecorder from './components/AudioRecorder';

function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className="App">
        <header className="App-header">
          <Button className="modal-btn" onClick={function () {
            setShow(true);
          }}>Start rappin</Button>
        </header>
      </div>

      <Modal show={show} dialogAs={DraggableModalDialog} onHide={function () {
        setShow(false);
      }} backdrop='static'>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">rappin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AudioRecorder />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <footer>
        <p>copyright © 2024 Telerapp</p>
        <p>Rappin powered by Telerapp​</p>
      </footer>
    </>
  );
}

export default App;
