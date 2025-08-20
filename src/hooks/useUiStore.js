import { useDispatch, useSelector } from "react-redux"
import { onOpenDateModal, onCloseDateModal, onClearActiveEvent } from "../store";

export const useUiStore = () => {
    const dispatch = useDispatch();

    const { isDateModalOpen } = useSelector(state => state.ui);

    const openDateModal = () => {
        dispatch(onOpenDateModal());
    };

    const closeDateModal = () => {
        dispatch(onCloseDateModal());
        dispatch(onClearActiveEvent())
    }

    const toggleDataModal = () => {
        (isDateModalOpen)
            ? openDateModal()
            : closeDateModal()
    }

    return {
        //props
        isDateModalOpen,

        //metodos
        openDateModal,
        closeDateModal,
        toggleDataModal
    }
}