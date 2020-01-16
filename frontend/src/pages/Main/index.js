import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import { Link } from 'react-router-dom';
import './style.css';

import logo from '../../assets/logo.svg';
import dislike from '../../assets/dislike.svg';
import like from '../../assets/like.svg';
import itsamatch from '../../assets/itsamatch.png';
import api from '../../services/api';

export default function Main({ match }) {

  const { id: logedUser } = match.params

  const [users, setUsers] = useState([])
  const [matchDev, setMatchDev] = useState(null)

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: logedUser
        }
      })

      setUsers(response.data)
    }

    loadUsers()
  }, [logedUser])

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: {
        user: logedUser
      }
    })

    socket.on('match', dev => {
      setMatchDev(dev)
    })
  }, [logedUser])

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: {
        user: logedUser
      }
    })

    setUsers(users.filter(user => user._id !== id))
  }

  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: {
        user: logedUser
      }
    })

    setUsers(users.filter(user => user._id !== id))
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="TinDev" />
      </Link>

      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt={user.name} />
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>

              <div className="buttons">
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={dislike} alt="Dislike" />
                </button>
                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={like} alt="Like" />
                </button>
              </div>

            </li>
          ))}
        </ul>
      ) : (
          <div className="empty">Acabou...</div>
        )}

      {matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="it`s a match" />
          <img src={matchDev.avatar} alt="it`s a match" className="avatar" />
          <strong>{matchDev.name}</strong>
          <p className="bio">{matchDev.bio}</p>

          <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
        </div>
      )}

    </div>
  );
}
