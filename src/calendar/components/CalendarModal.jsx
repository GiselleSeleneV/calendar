import "react-datepicker/dist/react-datepicker.css";
import { addHours, differenceInSeconds } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
import 'sweetalert2/dist/sweetalert2.min.css'
import Swal from "sweetalert2";
import { useAuthStore, useCalendarStore, useUiStore } from "../../hooks";
import './calendarModal.css';

registerLocale('es', es)

const customStyles = {
    content: {
        inset: 'unset',
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        margin: '0',
        position: 'relative',
        border: '1px solid rgba(148, 163, 184, 0.35)',
        background: '#ffffff',
        overflow: 'auto',
        borderRadius: '18px',
        padding: '1.35rem 1.35rem 1.2rem',
        maxWidth: '520px',
        width: 'calc(100vw - 2rem)',
        maxHeight: 'min(90vh, 680px)',
        boxShadow: '0 24px 48px rgba(15, 23, 42, 0.22)',
        outline: 'none',
    },
    overlay: {
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {
    const { user } = useAuthStore();
    const { activeEvent, startSavingEvent } = useCalendarStore();
    const { isDateModalOpen, closeDateModal } = useUiStore();

    const [formSubmitted, setFormSubmitted] = useState(false);

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: addHours(new Date()),
        end: addHours(new Date(), 2)
    });

    const titleClass = useMemo(() => {

        if (!formSubmitted) return '';

        return (formValues.title.length > 0)
            ? ''
            : 'is-invalid'

    }, [formValues.title, formSubmitted])

    const isMyEvent = useMemo(() => {
        if (!activeEvent) return true;
        return isMyEventSafe(activeEvent, user);
    }, [activeEvent, user]);

    const modalTitle = useMemo(() => {
        if (!activeEvent?.id && !activeEvent?._id) return 'Nuevo evento';
        return isMyEvent ? 'Editar evento' : 'Detalle del evento';
    }, [activeEvent, isMyEvent]);

    useEffect(() => {
        if (activeEvent !== null) {
            setFormValues({ ...activeEvent })
        }
    }, [activeEvent]);

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onDateChanged = (event, changing) => {
        setFormValues({
            ...formValues,
            [changing]: event,
        })
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true);

        const difference = differenceInSeconds(formValues.end, formValues.start);

        if (isNaN(difference) || difference <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Fechas no válidas',
                text: 'Por favor, verifícalas e inténtalo de nuevo.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#0F172A',
            });

            return;
        };

        if (formValues.title.length <= 0) return;

        await startSavingEvent(formValues);
        closeDateModal();
        setFormSubmitted(false);
    }

    return (
        <Modal
            isOpen={isDateModalOpen}
            onRequestClose={closeDateModal}
            style={customStyles}
            className='calendar-modal'
            overlayClassName='calendar-modal-overlay'
            closeTimeoutMS={220}
        >
            <div className="calendar-modal__header">
                <div>
                    <p className="calendar-modal__eyebrow">Calendar</p>
                    <h2 className="calendar-modal__title">{modalTitle}</h2>
                </div>
                <button
                    type="button"
                    className="calendar-modal__close"
                    onClick={closeDateModal}
                    aria-label="Cerrar"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <form className="calendar-modal__form" onSubmit={onSubmit}>
                <div className="calendar-modal__grid">
                    <label className="calendar-modal__field">
                        <span>Fecha y hora inicio</span>
                        <DatePicker
                            selected={formValues.start}
                            onChange={(event) => onDateChanged(event, 'start')}
                            className={`calendar-modal__input ${!isMyEvent ? 'is-disabled' : ''}`}
                            dateFormat='Pp'
                            showTimeSelect
                            locale='es'
                            disabled={!isMyEvent}
                        />
                    </label>

                    <label className="calendar-modal__field">
                        <span>Fecha y hora fin</span>
                        <DatePicker
                            minDate={formValues.start}
                            selected={formValues.end}
                            onChange={(event) => onDateChanged(event, 'end')}
                            className={`calendar-modal__input ${!isMyEvent ? 'is-disabled' : ''}`}
                            dateFormat='Pp'
                            showTimeSelect
                            locale='es'
                            timeCaption='Hora'
                            disabled={!isMyEvent}
                        />
                    </label>
                </div>

                <label className="calendar-modal__field">
                    <span>Título</span>
                    <input
                        type="text"
                        className={`calendar-modal__input ${titleClass} ${!isMyEvent ? 'is-disabled' : ''}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={formValues.title}
                        onChange={onInputChanged}
                        disabled={!isMyEvent}
                    />
                </label>

                <label className="calendar-modal__field">
                    <span>Notas</span>
                    <textarea
                        className={`calendar-modal__input calendar-modal__textarea ${!isMyEvent ? 'is-disabled' : ''}`}
                        placeholder="Información adicional"
                        rows="4"
                        name="notes"
                        value={formValues.notes}
                        onChange={onInputChanged}
                        disabled={!isMyEvent}
                    ></textarea>
                </label>

                <div className="calendar-modal__actions">
                    <button
                        type="button"
                        className="calendar-modal__btn calendar-modal__btn--ghost"
                        onClick={closeDateModal}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={`calendar-modal__btn calendar-modal__btn--primary ${!isMyEvent ? 'is-disabled' : ''}`}
                        disabled={!isMyEvent}
                    >
                        <i className="far fa-save"></i>
                        <span>Guardar</span>
                    </button>
                </div>
            </form>
        </Modal>
    )
}

function isMyEventSafe(activeEvent, user) {
    return (user.uid === activeEvent.user._id) || (user.uid === activeEvent.user.uid);
}
