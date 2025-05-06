// ForgotPassword.jsx
import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '../../firebase'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const auth = getAuth(app);

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
      console.log("Attempting reset for: ", email);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Reset your password</h2>
      <input style={{marginLeft: '15px', width: '400px'}}
        type="email"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleReset} style={{marginTop: '10px', marginLeft: '15px', height: '30px',width: '170px',backgroundColor: 'blue',borderRadius: '10px',border: 'none',color: 'white',fontWeight: 'bold',fontSize: '18px',cursor: 'pointer'}}>Send Reset Email</button>
      <p>{message}</p>
    </div>
  );
};

export default ForgotPassword;
