import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [step, setStep] = useState(1); // 1 = email, 2 = password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setStep(2);
            setError('');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Pure frontend login - accept any credentials
        setTimeout(() => {
            localStorage.setItem('token', 'demo-token');
            localStorage.setItem('username', email);
            onLogin(email);
            handleClose();
            setLoading(false);
        }, 500);
    };

    const handleClose = () => {
        onClose();
        // Reset after close animation
        setTimeout(() => {
            setStep(1);
            setEmail('');
            setPassword('');
            setError('');
        }, 400);
    };

    const handleBack = () => {
        setStep(1);
        setPassword('');
        setError('');
    };

    return (
        <>
            <div
                className={`modal-overlay ${isOpen ? 'visible' : ''}`}
                onClick={handleClose}
            />
            <div className={`login-modal ${isOpen ? 'open' : ''}`}>
                <div className="modal-handle" onClick={handleClose} />

                {step === 1 ? (
                    <form onSubmit={handleEmailSubmit} className="modal-form">
                        <input
                            type="text"
                            placeholder="Email or phone number"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="modal-input"
                            autoFocus
                            required
                        />
                        {error && <p className="modal-error">{error}</p>}
                        <button type="submit" className="modal-button">
                            Continue
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordSubmit} className="modal-form">
                        <div className="modal-back" onClick={handleBack}>
                            ← {email}
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="modal-input"
                            autoFocus
                            required
                        />
                        {error && <p className="modal-error">{error}</p>}
                        <button
                            type="submit"
                            className="modal-button"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                )}
            </div>
        </>
    );
};

export default LoginModal;
