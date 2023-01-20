// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
          else if (data && data.title.includes('Error')) setErrors([data.message]);
        }
      );
  };

  return (
    <div className="login-modal-box">
      <div className="login-modal-header">Log In</div>
      <div className="login-modal-form">
        <div className="form-information">
          <form onSubmit={handleSubmit}>
            <ul className="error-list">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
            <div className="input-box" id="credential-input-box">
              <div className="input-field" id="credential-input-field">
                <label className="input-label">
                  <input
                    className="input-data"
                    type="text"
                    placeholder="Username or Email"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="single-error-information">
                Please input a valid username or email.
              </div>
            </div>
            <div className="input-box" id="password-input-box">
              <div className="input field" id="credential-input-field">
                <label className="input-label">
                  <input
                    className="input-data"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="single-error-information">
                Please input a valid password.
              </div>
            </div>
            <div className="login-button-box">
              <button className="login-button" type="submit">Log In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginFormModal;
