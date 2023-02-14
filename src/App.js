import React, { useState } from 'react';
import './App.css';
import logo from './logo.png';

function App() {

  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [category, setCategory] = useState('');
  const [img, setImg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const token = 'TsdcNfVKtMqz9fzjGfG9LMKCkg8nYG0cLXlW'
  const accessToken = 'ghp_' + token;
  const owner = 'the-ewc-contributor';
  const repo = 'the-ewc-api';
  const branch = 'main';
  const message = 'Add entry';
  const path = 'glossary.json';
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEntry = {
      term: term,
      definition: definition,
      category: category,
      img: img,
    };
    await fetch(url, {
      headers,
    })
      .then(response => response.json())
      .then(async data => {

        const content = data.content;
        const decodedContent = atob(content);
        const entries = JSON.parse(decodedContent);

        const sha = data.sha;

        entries.push(newEntry);
        entries.sort((a, b) => {
          const termA = a.term.toLowerCase();
          const termB = b.term.toLowerCase();
          if (termA < termB) {
            return -1;
          }
          if (termA > termB) {
            return 1;
          }
          return 0;
        });

        const fileContent = JSON.stringify(entries);
        const fileContentUint8Array = new TextEncoder().encode(fileContent);
        const encodedContent = btoa(String.fromCharCode.apply(null, fileContentUint8Array));

        const headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        };

        const body = JSON.stringify({
          message,
          content: encodedContent,
          branch,
          sha: sha,
        });

        const response = await fetch(url, {
          method: 'PUT',
          headers,
          body,
        });

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
          <input type="text" name="term" value={term} onChange={(e) => setTerm(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="definition">Definition</label>
          <textarea name="definition" value={definition} onChange={(e) => setDefinition(e.target.value)}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="Category">Category</label>
          <input type="text" name="category" value={category} onChange={(e) => setCategory(e.target.value)} />
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

