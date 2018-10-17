import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    users: null,
  };

  componentDidMount() {
    fetch("/api/users")
      .then(response => response.json())
      .then(users => {
        this.setState({ users });
      });
  }

  render() {
    const { users } = this.state;
    if (!users) {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Lade Benutzer...
            </p>
          </header>
        </div>
      );
    }

    return (
      <div className="App">
        <h1>Benutzer</h1>
        <div className="container">
          {users.map(u => (
            <div key={`user-${u.id}`} className="user-container">
              {u.name}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default App;
