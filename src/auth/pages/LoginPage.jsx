import { useEffect } from 'react';
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

export const LoginPage = () => {

    const { startLogin, startRegister, errorMessage } = useAuthStore();

    const { loginEmail, loginPassword, onInputChange: onLoginInputChange, isFormValid: isLoginValid } = useForm(loginformFields, loginFormValidations);

    const { registerName, registerEmail, registerPassword, registerPassword2, onInputChange: onRegisterInputChange, isFormValid: isRegisterValid, registerPasswordValid, registerPassword2Valid } = useForm(registerformFields, registerFormValidations);

    const loginSubmit = (event) => {
        event.preventDefault();

        startLogin({ email: loginEmail, password: loginPassword })
    };

    const registerSubmit = (event) => {
        event.preventDefault();

        if (registerPassword.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Registro fallido',
                text: 'La contraseña debe tener al menos 6 caracteres.',
                confirmButtonText: 'Reintentar',
                confirmButtonColor: '#0F172A'
            });
            return;
        }

        if (registerPassword !== registerPassword2) {
            Swal.fire({
                icon: 'error',
                title: 'Registro fallido',
                text: 'Las contraseñas no coinciden. Verifícalas e inténtalo nuevamente.',
                confirmButtonText: 'Reintentar',
                confirmButtonColor: '#0F172A'
            });
            return;
        };


        startRegister({ name: registerName, email: registerEmail, password: registerPassword })
    }

    useEffect(() => {
        if (errorMessage !== undefined && errorMessage !== '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#0F172A'
            });
        }
    }, [errorMessage])

    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-6 login-form-1">
                    <h3>Ingreso</h3>
                    <form onSubmit={loginSubmit}>

                        <div className="form-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Correo"
                                name="loginEmail"
                                value={loginEmail}
                                onChange={onLoginInputChange}
                            />
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name="loginPassword"
                                value={loginPassword}
                                onChange={onLoginInputChange}
                            />
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="submit"
                                className={`${!isLoginValid ? 'btnSubmit-disabled-login' : 'btnSubmit'}`}
                                value="Login"
                                disabled={!isLoginValid}
                            />
                        </div>
                    </form>
                </div>

                <div className="col-md-6 login-form-2">
                    <h3>Registro</h3>

                    <form onSubmit={registerSubmit}>

                        <div className="form-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name="registerName"
                                value={registerName}
                                onChange={onRegisterInputChange}
                            />
                        </div>

                        <div className="form-group mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Correo"
                                name="registerEmail"
                                value={registerEmail}
                                onChange={onRegisterInputChange}
                            />
                        </div>

                        <div className="form-group mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name="registerPassword"
                                value={registerPassword}
                                onChange={onRegisterInputChange}
                            />
                            {registerPasswordValid && <small className="validation-message-register">{registerPasswordValid}</small>}
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Repita la contraseña"
                                name="registerPassword2"
                                value={registerPassword2}
                                onChange={onRegisterInputChange}
                            />
                            {registerPassword2Valid && <small className="validation-message-register">{registerPassword2Valid}</small>}
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="submit"
                                className={`${!isRegisterValid ? 'btnSubmit-disabled-register' : 'btnSubmit'}`}
                                value="Crear cuenta"
                                disabled={!isRegisterValid}
                            />

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}