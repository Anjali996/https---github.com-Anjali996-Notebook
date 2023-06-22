import React, { useState, useEffect } from 'react';
import image from './removebg.png';
import lock from './Vector.png';
import message from './message.png';

import './Notes.css';

function Notes() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [name, setName] = useState('');
  const [storedData, setStoredData] = useState([]);
  const [notes, setNotes] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [showImage, setShowImage] = useState(true);
  const [savedData, setSavedData] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const colors = ['#F08080', '#fec971', '#00d4fe', '#e4ee91', '#e4ee76'];

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !selectedColor) {
      setErrorMessage('*Please fill in all fields');
      return;
    }
    const newData = { name, selectedColor };
    const updatedData = [...storedData, newData];
    setStoredData(updatedData);
    localStorage.setItem('storedData', JSON.stringify(updatedData));
    setName('');
    setSelectedColor('');
    setShowPopup(false);
    setErrorMessage(''); // Clear the error message
  };

  const handleNameButtonClick = (name) => {
    setCurrentName(name);
    setSelectedName(name);
    setNotes('');
    setShowPopup(false);
    setShowImage(false); // Hide the image and lock elements
  };

  useEffect(() => {
    const dataFromLocalStorage = localStorage.getItem('storedData');
    if (dataFromLocalStorage) {
      setStoredData(JSON.parse(dataFromLocalStorage));
    }
  }, []);

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSaveNotes();
    }
  };

  const handleSaveNotes = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const updatedData = storedData.map((data) => {
      if (data.name === currentName) {
        return { ...data, notes: notes, date: currentDate, time: currentTime };
      }
      return data;
    });
    setStoredData(updatedData);
    localStorage.setItem('storedData', JSON.stringify(updatedData));
    setShowPopup(false);

    const newData = updatedData.find((data) => data.name === currentName);
    if (newData) {
      setSavedData([newData]);
    } else {
      setSavedData([]);
    }
  };

  useEffect(() => {
    const updatedSavedNotes = storedData
      .filter((data) => data.name === currentName)
      .map((data) => ({
        notes: data.notes,
        date: data.date || '',
        time: data.time || '',
      }));
    setSavedNotes(updatedSavedNotes);
  }, [currentName, storedData]);

  return (
    <>
      <div className='body'>
        <div className='sidenav'>
          <h2 id='a7'> Pocket Notebook</h2>
          <br />
          <button type='button' id='a1' onClick={togglePopup}>
            + Click me
          </button>

          {storedData.length > 0 && (
            <div className='bar'>
              {storedData.map((data, index) => (
                <div key={index} className='name-button-container'>
                  <button
                    className={`name-button ${
                      data.name === selectedName ? 'selected' : ''
                    }`}
                    style={{ backgroundColor: data.selectedColor }}
                    onClick={() => handleNameButtonClick(data.name)}
                  >
                    {data.name.substring(0, 2)}
                  </button>
                  <span className='full-name'>{data.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='main'>
          {showImage && (
            <>
              <div id='image'>
                <img src={image} alt='image' />
                <h2 id='a2'>Pocket Notes</h2>
                <h6 id='a3'>
                  Send and receive messages without keeping your phone online.
                  <br />
                  Use Pocket Notes on up to 4 linked devices and 1 mobile phone
                </h6>
              </div>

              <div id='a4'>
                <img src={lock} alt='lock' />
                end-to-end encrypted
              </div>
            </>
          )}

          {showPopup && (
            <div className='popup'>
              <div className='popup-content'>
                <h3>Create Notes Group</h3>
                <label>
                  Group Name:
                  <input
                    type='text'
                    id='name'
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                </label>

                <ul className='choose-colors'>
                  Choose color
                  {colors.map((color, index) => (
                    <li
                      key={index}
                      className={`color ${
                        selectedColor === color ? 'selected' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelection(color)}
                      required
                    ></li>
                  ))}
                </ul>

                {errorMessage && (
                  <p className='error-message'>{errorMessage}</p>
                )}

                <button type='submit' onClick={handleSubmit} id='a6'>
                  Create
                </button>
              </div>
            </div>
          )}

          {currentName && (
            <div className='notes-container'>
              <div className='show-name'>
                <div className='name-button-container'>
                  <button
                    className={`name-button ${
                      selectedName === currentName ? 'selected' : ''
                    }`}
                    style={{
                      backgroundColor: storedData.find(
                        (data) => data.name === currentName
                      )?.selectedColor,
                    }}
                    onClick={() => handleNameButtonClick(currentName)}
                  >
                    {currentName.substring(0, 2)}
                  </button>
                  <span className='full-name'>{currentName}</span>
                </div>

                {savedNotes.map((note, index) => (
                  <div key={index} className='saved-notes'>
                    <div className='left-container'>
                      <h5>{note.time}</h5>
                      <br />
                      {note.date}
                    </div>
                    <div className='right-container'>
                      <p>{note.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='text'>
                <div className='text-area'>
                  <textarea
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder='Write your notes here ...'
                    onKeyPress={handleKeyPress}
                  ></textarea>
                  <span id='mess'>
                    <button id='saved-text' onClick={handleSaveNotes}>
                      <img src={message} alt='message' />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Notes;
