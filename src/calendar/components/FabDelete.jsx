import { useCalendarStore, useUiStore } from "../../hooks";

export const FabDelete = () => {
    const { startDeletingEvent, hasEventSelected } = useCalendarStore();
    const { isDateModalOpen } = useUiStore();

    const handleDelete = () => {
        startDeletingEvent();
    }

    const isVisible = hasEventSelected && !isDateModalOpen;

    return (
        <button
            onClick={handleDelete}
            className={`fab fab-danger ${isVisible ? 'is-visible' : ''}`}
            type="button"
            aria-label="Eliminar evento"
            style={{
                display: isVisible ? 'flex' : 'none'
            }}
        >
            <i className="fas fa-trash-alt"></i>
        </button>
    )
}
