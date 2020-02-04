import React, { Component } from 'react'
import Popup from "reactjs-popup";
import CreateUserForm from './CreateUserForm';

const AddUserModal = () => (
  <Popup trigger={<button>Add User</button>} position="right center">
    {close => (
      <div className="modal">
        <a className="close" onClick={close}> &times; </a>
        <div className="header"> Create User Below </div>
        <div className="content">
          <CreateUserForm />
        </div>
        <div className="actions">
          <button className="button"
            onClick={() => {
              console.log("modal closed ");
              close();
            }}>
            Close
          </button>
        </div>
      </div>
    )}
  </Popup>
);

export default AddUserModal;
