import { useEffect, useState } from 'react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useForm } from '../../hooks/useForm';
import './loginPage.css';
import Swal from 'sweetalert2';

const loginformFields = {
    loginEmail: '',
    loginPassword: ''
};

const registerformFields = {
    registerName: '',
    registerEmail: '',
    registerPassword: '',
    registerPassword2: ''
};

const loginFormValidations = {
    loginEmail: [(value) => value.includes('@')],
    loginPassword: [(value) => value.length >= 1],
};

const registerFormValidations = {
    registerName: [(value) => value.trim().length > 0],
    registerEmail: [(value) => value.includes('@')],
    registerPassword: [(value) => value.length >= 6, 'La contraseña debe tener al menos 6 caracteres'],
    registerPassword2: [(value) => value.length >= 6, 'La confirmación debe tener al menos 6 caracteres'],
};

const showAuthError = (title, text) => {
    Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonText: 'Entendido',
        background: '#fff',
        color: '#0F172A',
        customClass: {
            popup: 'auth-swal-popup',
            confirmButton: 'auth-swal-confirm',
            title: 'auth-swal-title',
            htmlContainer: 'auth-swal-text',
            icon: 'auth-swal-icon',
        },
        buttonsStyling: false,
    });
};

export const LoginPage = () => {

    const { startLogin, startRegister, errorMessage } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const { loginEmail, loginPassword, onInputChange: onLoginInputChange, isFormValid: isLoginValid } = useForm(loginformFields, loginFormValidations);

    const { registerName, registerEmail, registerPassword, registerPassword2, onInputChange: onRegisterInputChange, isFormValid: isRegisterValid, registerPasswordValid, registerPassword2Valid } = useForm(registerformFields, registerFormValidations);

    const loginSubmit = (event) => {
        event.preventDefault();

        startLogin({ email: loginEmail, password: loginPassword })
    };

    const registerSubmit = (event) => {
        event.preventDefault();

        if (registerPassword.length < 6) {
            showAuthError('Registro fallido', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (registerPassword !== registerPassword2) {
            showAuthError('Registro fallido', 'Las contraseñas no coinciden. Verifícalas e inténtalo nuevamente.');
            return;
        }

        startRegister({ name: registerName, email: registerEmail, password: registerPassword })
    }

    useEffect(() => {
        if (errorMessage !== undefined && errorMessage !== '') {
            showAuthError('Error', errorMessage);
        }
    }, [errorMessage])

    return (
        <div className="auth-page">
            <div className="auth-shell">
                <header className="auth-brand">
                    <span className="auth-brand__icon" aria-hidden="true">
                        <i className="fas fa-calendar-alt"></i>
                    </span>
                    <div className="auth-brand__text">
                        <h1 className="auth-brand__title">Calendar</h1>
                        <p className="auth-brand__subtitle">Organiza tu día con claridad</p>
                    </div>
                </header>

                <div className="auth-panels">
                    <section className="auth-panel auth-panel--login">
                        <div className="auth-panel__header">
                            <h2>Ingreso</h2>
                            <p>Accede a tu cuenta para continuar</p>
                        </div>

                        <form className="auth-form" onSubmit={loginSubmit}>
                            <label className="auth-field">
                                <span className="auth-field__label">Correo</span>
                                <div className="auth-field__control">
                                    <i className="fas fa-envelope" aria-hidden="true"></i>
                                    <input
                                        type="text"
                                        placeholder="tu@correo.com"
                                        name="loginEmail"
                                        value={loginEmail}
                                        onChange={onLoginInputChange}
                                        autoComplete="email"
                                    />
                                </div>
                            </label>

                            <label className="auth-field">
                                <span className="auth-field__label">Contraseña</span>
                                <div className="auth-field__control">
                                    <i className="fas fa-lock" aria-hidden="true"></i>
                                    <input
                                        type="password"
                                        placeholder="Tu contraseña"
                                        name="loginPassword"
                                        value={loginPassword}
                                        onChange={onLoginInputChange}
                                        autoComplete="current-password"
                                    />
                                </div>
                            </label>

                            <button
                                type="submit"
                                className={`auth-submit auth-submit--login ${!isLoginValid ? 'is-disabled' : ''}`}
                                disabled={!isLoginValid}
                            >
                                Iniciar sesión
                            </button>
                        </form>
                    </section>

                    <section className="auth-panel auth-panel--register">
                        <div className="auth-panel__header">
                            <h2>Registro</h2>
                            <p>Crea una cuenta nueva en segundos</p>
                        </div>

                        <form className="auth-form" onSubmit={registerSubmit}>
                            <label className="auth-field">
                                <span className="auth-field__label">Nombre</span>
                                <div className="auth-field__control">
                                    <i className="fas fa-user" aria-hidden="true"></i>
                                    <input
                                        type="text"
                                        placeholder="Tu nombre"
                                        name="registerName"
                                        value={registerName}
                                        onChange={onRegisterInputChange}
                                        autoComplete="name"
                                    />
                                </div>
                            </label>

                            <label className="auth-field">
                                <span className="auth-field__label">Correo</span>
                                <div className="auth-field__control">
                                    <i className="fas fa-envelope" aria-hidden="true"></i>
                                    <input
                                        type="email"
                                        placeholder="tu@correo.com"
                                        name="registerEmail"
                                        value={registerEmail}
                                        onChange={onRegisterInputChange}
                                        autoComplete="email"
                                    />
                                </div>
                            </label>

                            <div className="auth-field password-field">
                                <span className="auth-field__label">Contraseña</span>
                                <div className="auth-field__control">
                                    <i className="fas fa-lock" aria-hidden="true"></i>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Mínimo 6 caracteres"
                                        name="registerPassword"
                                        value={registerPassword}
                                        onChange={onRegisterInputChange}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(v => !v)}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                    </button>
                                </div>
                                {registerPasswordValid && <small className="validation-message-register">{registerPasswordValid}</small>}
                            </div>

                            <div className="auth-field password-field">
                                <span className="auth-field__label">Repite la contraseña</span>
                                <div className="auth-field__control">
                                    <i className="fas fa-lock" aria-hidden="true"></i>
                                    <input
                                        type={showPassword2 ? 'text' : 'password'}
                                        placeholder="Confirma tu contraseña"
                                        name="registerPassword2"
                                        value={registerPassword2}
                                        onChange={onRegisterInputChange}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword2(v => !v)}
                                        aria-label={showPassword2 ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        <i className={`fas ${showPassword2 ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                    </button>
                                </div>
                                {registerPassword2Valid && <small className="validation-message-register">{registerPassword2Valid}</small>}
                            </div>

                            <button
                                type="submit"
                                className={`auth-submit auth-submit--register ${!isRegisterValid ? 'is-disabled' : ''}`}
                                disabled={!isRegisterValid}
                            >
                                Crear cuenta
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    )
}
