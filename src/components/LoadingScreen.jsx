import './LoadingScreen.css';

export const LoadingScreen = ({ message = 'Cargando...' }) => {
    return (
        <div className="loading-screen" role="status" aria-live="polite">
            <div className="loading-screen__content">
                <div className="loading-screen__spinner" aria-hidden="true">
                    <span className="loading-screen__ring"></span>
                    <span className="loading-screen__dot"></span>
                </div>
                <p className="loading-screen__text">{message}</p>
                <div className="loading-screen__bar" aria-hidden="true">
                    <span className="loading-screen__bar-fill"></span>
                </div>
            </div>
        </div>
    );
};
