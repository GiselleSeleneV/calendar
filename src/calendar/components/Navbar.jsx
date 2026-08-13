import { useAuthStore } from '../../hooks/useAuthStore';
import './navbar.css';

export const Navbar = () => {

    const { startLogout, user } = useAuthStore();
    return (
        <header className="custom-navbar">
            <div className="custom-navbar__brand">
                <span className="custom-navbar__icon" aria-hidden="true">
                    <i className="fas fa-calendar-alt"></i>
                </span>
                <div className="custom-navbar__text">
                    <span className="custom-navbar__app">Calendar</span>
                    <span className="custom-navbar__user">{user.name}</span>
                </div>
            </div>

            <button
                onClick={startLogout}
                className="custom-navbar__logout"
                type="button"
            >
                <i className="fas fa-sign-out-alt"></i>
                <span>Salir</span>
            </button>
        </header>
    )
}
