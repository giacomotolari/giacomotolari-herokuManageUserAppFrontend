import { useState, useEffect } from 'react';
import './App.scss';
import { GrEdit } from 'react-icons/gr';
import { RiDeleteBin6Line } from 'react-icons/ri';

function App() {
  const [users, setUsers] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const loadUsers = async () => {
    const response = await fetch(backendUrl);
    const users = await response.json();
    users.forEach((user) => (user.isEditingEmail = false));
    setUsers(users);
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteButton = async (user) => {
    await fetch(`${backendUrl}/deleteuser/${user._id}`, { method: 'DELETE' });
    loadUsers();
  };

  const handleEditButton = (user) => {
    user.isEditingEmail = !user.isEditingEmail;
    setUsers([...users]);
  };

  const handleEditCancelButton = (user) => {
    // user.isEditingEmail = !user.isEditingEmail;
    loadUsers();
  };

  const handleEmailChange = (user, e) => {
    user.email = e.target.value;
    setUsers([...users]);
  };

  const handleEmailSave = async (user) => {
    await fetch(`${backendUrl}/edituser/${user._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
      }),
    });
    loadUsers();
  };

  return (
    <div className='App'>
      <h1>User Management APP</h1>
      <div className='topRow'>
        <button>Add User</button>
        <br />
      </div>
      <section className='users'>
        {users.map((user, index) => {
          return (
            <div key={index} className='userCard'>
              <div className='row'>
                <div className='label'>Full Name:</div>
                <div className='data'>{user.name}</div>
              </div>
              <br />

              <div className='row'>
                <div className='label'>User Name:</div>
                <div className='data'>{user.username}</div>
              </div>
              <div className='row'>
                <div className='label'>E-Mail:</div>
                {!user.isEditingEmail && (
                  <div className='data'>{user.email}</div>
                )}
                {user.isEditingEmail && (
                  <div className='data editing'>
                    <input
                      type='text'
                      onChange={(e) => handleEmailChange(user, e)}
                      value={user.email}
                    />
                    <button onClick={() => handleEmailSave(user)}>Save</button>
                    <button onClick={() => handleEditCancelButton(user)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className='iconRow'>
                <button
                  onClick={() => handleDeleteButton(user)}
                  className='icon'
                >
                  <RiDeleteBin6Line />
                </button>
                <button className='icon' onClick={() => handleEditButton(user)}>
                  <GrEdit />
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default App;
