import './navbar.css';

export const Navbar = () => {
    return (
        <div className="navbar custom-navbar mb-4 px-4">
            <span className="navbar-brand">
                <i className="fas fa-calendar-alt"></i>
                &nbsp;
                Giselle
            </span>

            <button className='btn btn-outline-danger'>
                <i className='fas fa-sign-out-alt'></i>
                <span>Salir</span>
            </button>

        </div>
    )
}