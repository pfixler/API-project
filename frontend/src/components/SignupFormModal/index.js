import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
      <div className="signup-modal-box">
          <div className="signup-modal-header">Sign Up</div>
          <div className="signup-modal-form">
            <div className="form-information">
              <form onSubmit={handleSubmit}>
                <ul>
                  {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <div className="input-box" id="email-input-box">
                  <div className="input-field" id="email-input-field">
                    <label className="input-label">
                      <input
                        className="input-data"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div className="single-error-information">
                    We'll email you trip confirmations and receipts.
                  </div>
                </div>
                <div className="input-box" id="username-input-box">
                  <div className="input-field" id="username-input-field">
                    <label className="input-label">
                      <input
                        className="input-data"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div className="single-error-information">
                    Please use a unique username.
                  </div>
                </div>
                <div className="input-box" id="name-input-box">
                  <div className="secondary-input-box" id="first-name-input-box">
                    <div className="input-field" id="first-name-input-field">
                      <label className="input-label">
                        <input
                          className="input-data"
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </label>
                      </div>
                    </div>
                  <div className="secondary-input-box" id="last-name-input-box">
                    <div className="input-field" id="last-name-input-field">
                      <label className="input-label">
                        <input
                          className="input-data"
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <div className="single-error-information">
                    Make sure it matches the name on your government ID.
                  </div>
                </div>
                <div className="input-box" id="passwords-input-box">
                  <div className="secondary-input-box" id="password-input-box">
                    <div className="input-field" id="password-input-field">
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
                  </div>
                  <div className="secondary-input-box" id="confirm-password-input-box">
                    <div className="input-field" id="confirm-password-input-field">
                      <label className="input-label">
                        <input
                          className="input-data"
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <div className="single-error-information">
                    Make sure your passwords match.
                  </div>
                </div>
                <div className="signup-button-box">
                  <button className="signup-button" type="submit">Sign Up</button>
                </div>
              </form>
            </div>
          </div>
      </div>
  );
}

export default SignupFormModal;
