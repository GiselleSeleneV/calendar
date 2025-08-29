import "react-datepicker/dist/react-datepicker.css";
import { addHours, differenceInSeconds } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
import 'sweetalert2/dist/sweetalert2.min.css'
import Swal from "sweetalert2";
import { useAuthStore, useCalendarStore, useUiStore } from "../../hooks";

registerLocale('es', es)

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
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
            Swal.fire('Las fechas ingresadas no son válidas.', 'Por favor, verifíquelas.', 'error')

            return;
        };

        if (formValues.title.length <= 0) return;

        await startSavingEvent(formValues);
        closeDateModal();
        setFormSubmitted(false);
    }

    const isMyEvent = useMemo(() => {
        if (!activeEvent) return true; // por defecto si no hay evento activo
        return (user.uid === activeEvent.user._id) || (user.uid === activeEvent.user.uid);
    }, [activeEvent, user]);

    return (
        <Modal
            isOpen={isDateModalOpen}
            onRequestClose={closeDateModal}
            style={customStyles}
            className='modal'
            overlayClassName='modal-fondo'
            closeTimeoutMS={200}
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form className="container" onSubmit={onSubmit}>

                <div className="form-group mb-2 d-flex flex-column">
                    <label className="label-bold-medium">Fecha y hora inicio</label>
                    <DatePicker
                        selected={formValues.start}
                        onChange={(event) => onDateChanged(event, 'start')}
                        className={`${!isMyEvent && 'input-disabled'} form-control`}
                        dateFormat='Pp'
                        showTimeSelect
                        locale='es'
                        disabled={!isMyEvent}
                    />
                </div>

                <div className="form-group mb-4 d-flex flex-column ">
                    <label className="label-bold-medium">Fecha y hora fin</label>
                    <DatePicker
                        minDate={formValues.start}
                        selected={formValues.end}
                        onChange={(event) => onDateChanged(event, 'end')}
                        className={`${!isMyEvent && 'input-disabled'} form-control`}
                        dateFormat='Pp'
                        showTimeSelect
                        locale='es'
                        timeCaption='Hora'
                        disabled={!isMyEvent}
                    />
                </div>
                <hr />
                <div className="form-group mb-3">
                    <label className="label-bold-medium">Título y notas</label>
                    <input
                        type="text"
                        className={`${titleClass} ${!isMyEvent && 'input-disabled'} form-control} form-control `} placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={formValues.title}
                        onChange={onInputChanged}
                        disabled={!isMyEvent}
                    />
                    <small id="emailHelp" className="form-text text-muted ml-2">Título</small>
                </div>

                <div className="form-group mb-3">
                    <textarea
                        type="text"
                        className={`${!isMyEvent && 'input-disabled'} form-control`}
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={formValues.notes}
                        onChange={onInputChanged}
                        disabled={!isMyEvent}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted ml-2">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className={`${!isMyEvent ? 'btn-save-disabled' : 'btn-save'}`}
                    disabled={!isMyEvent}
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}