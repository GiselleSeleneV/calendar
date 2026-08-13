import { useAuthStore, useCalendarStore, useUiStore } from "../../hooks";
import { addHours } from "date-fns";

export const FabAddNew = () => {
    const { openDateModal } = useUiStore();
    const { setActiveEvent } = useCalendarStore();
    const { user } = useAuthStore();

    const handleClickNew = () => {
        setActiveEvent({
            title: '',
            notes: '',
            start: new Date(),
            end: addHours(new Date(), 2),
            bgColor: '#fafafa',
            user: {
                _id: user.uid,
                name: user.name
            }
        });
        openDateModal();
    };

    return (
        <button
            onClick={handleClickNew}
            className="fab fab-add"
            type="button"
            aria-label="Crear nuevo evento"
        >
            <i className="fas fa-plus"></i>
        </button>
    );
};
