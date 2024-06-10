import React from 'react';
import styles from './CustomerRegister.module.css';

const CustomerRegister = () => {
//company field validation
  const [company, setCompany] = useState('');
  const [companyError, setCompanyError] = useState('');

  const handleCompanyChange = (event) => {
    const companyValue = event.target.value;
    setCompany(companyValue);

    if (companyValue.trim() === '') {
      setCompanyError('Company name is required');
    } else {
      setCompanyError('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform form submission or further validation here
    if (companyError) {
    // Do not submit if there's an error
      return;
    }

    // Proceed with submission
  };
//----------------------------------------------------------------------------------------//
    // First name field validation
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');

  const handleFirstNameChange = (event) => {
    const firstNameValue = event.target.value;
    setFirstName(firstNameValue);

    if (firstNameValue.trim() === '') {
      setFirstNameError('First name is required');
    } else {
      setFirstNameError('');
    }
  };
  //-------------------------------------------------------------------------------------//
  // Last name field validation
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const handleLastNameChange = (event) => {
    const lastNameValue = event.target.value;
    setLastName(lastNameValue);

    if (lastNameValue.trim() === '') {
      setLastNameError('Last name is required');
    } else {
      setLastNameError('');
    }
  };
  //-------------------------------------------------------------------------------------//
  // Email field validation
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };
  //-------------------------------------------------------------------------------------//
  // Password field validation
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (event) => {
    const passwordValue = event.target.value;
    setPassword(passwordValue);

    if (passwordValue.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError('');
    }

  };

  return (
    <div className={`${styles.container} customer-register`}>
      <header>
        <img
          className={styles.logo}
          alt="Company Logo"
          src="https://generation-sessions.s3.amazonaws.com/c8e8f48f376e078602d60c3565370f1f/img/logo-1@2x.png"
        />
      </header>

      <main>
        <h1 className={styles.heading}>Sign Up</h1>
        <p className={styles.paragraph}>Create your account</p>

        {/* first name input */}
        <div className={`${styles.inputGroup} ${styles.firstNameInput}`}>
          <label htmlFor="first-name">First Name</label>
          <input
            id="first-name"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </div>

         {/* Last Name input */}
        <div className={`${styles.inputGroup} ${styles.lastNameInput}`}>
          <label htmlFor="last-name">Last Name</label>
          <input
            id="last-name"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={handleLastNameChange}
          />
          {lastNameError && <p className={styles.error}>{lastNameError}</p>}
        </div>

        {/* email input */}
        <div className={`${styles.inputGroup} ${styles.emailInput}`}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <p className={styles.error}>{emailError}</p>}
        </div>

        {/* password input */}
        <div className={`${styles.inputGroup} ${styles.passwordInput}`}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <p className={styles.error}>{passwordError}</p>}
        </div>
      
        {/* Company input */}
        <div className={`${styles.inputGroup} ${styles.companyInput}`}>
          <label htmlFor="company">Company</label>
          <input id="company" type="text" placeholder="Company Name" />
          <img
            alt="Company Icon"
            src="https://generation-sessions.s3.amazonaws.com/c8e8f48f376e078602d60c3565370f1f/img/---icon--briefcase-@2x.png"
          />
        </div>

        {/* Role Select Options */}
        <div className={styles.roleSelector}>
          <label htmlFor="role">Select Role</label>
          <select id="role" value={selectedRole} onChange={handleRoleChange}>
            <option value="">-Select Role-</option>
            <option value="tenant">Tenant</option>
            <option value="ad-hoc">Ad-hoc</option>
            {/* More options can be added here */}
          </select>
          {roleError && <p className={styles.error}>{roleError}</p>}
          <img
            alt="Dropdown Arrow"
            src="https://generation-sessions.s3.amazonaws.com/c8e8f48f376e078602d60c3565370f1f/img/polygon-1-4@2x.png"
          />
        </div>

        <button type="submit" className={styles.createAccountBtn} onClick={handleSubmit}>
          Create Account
        </button>
      </main>

      <footer>
        <p className={styles.loginPrompt}>
          Already have an account? <a href="#" className={styles.loginLink}>Log in</a>
        </p>
      </footer>
    </div>
  );
};

export default CustomerRegister;
