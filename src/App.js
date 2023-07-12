import React, { useState } from 'react';
import './App.css';
import logo from './logo.png';

function App() {

  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [category, setCategory] = useState('');
  const [img, setImg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!term || !definition || !category) {
      alert('Please check your inputs.');
      return;
    }

    const entry = {
      term: term,
      definition: definition,
      category: category,
      //      img: img,
      img: ""
    };

    await fetch('http://localhost:5050/the-ewc/api/glossary/add/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    })
      .then(response => {
        if (response.ok) {
          console.log('Success!')
          setTerm('');
          setDefinition('');
          setCategory('');
          setImg('');
          setSubmitted(true);
        }
        else {
          console.error('Error uploading file:', response.statusText);
        }
      })
      .then(data => console.log(data))
      .catch(error => console.error(error));
  };

  return (
    <div className="App">
      <div className="logo-container">
        <img src={logo} alt="Logo" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="term">Term</label>
          <input type="text" name="term" value={term} onChange={(e) => setTerm(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="definition">Definition</label>
          <textarea name="definition" value={definition} onChange={(e) => setDefinition(e.target.value)} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">-</option>
            <option value="brand">brand</option>
            <option value="general">general</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="img">img</label>
          <input type="text" name="img" value={img} onChange={(e) => setImg(e.target.value)} />
        </div>
        <button type="submit">Submit</button>
      </form>
      {submitted && (
        <p className="submitted-message">Your contribution has been sent. Thank you!</p>
      )}
    </div>
  );
}

export default App;

