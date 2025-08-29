import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import { CalendarEventBox, CalendarModal, FabAddNew, FabDelete, Navbar } from "../";
import { localizer, getMessagesEs } from '../../helpers'
import { useAuthStore, useCalendarStore, useUiStore } from '../../hooks';


export const CalendarPage = () => {
    const { user } = useAuthStore()
    const { openDateModal } = useUiStore();
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();

    const [lastView] = useState(localStorage.getItem('lastView') || 'week');

    const eventStyleGetter = (event) => {
        const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);

        const style = {
            backgroundColor: isMyEvent ? '#0F172A' : '#d1d5db',
            border: '1px solid #9ca3af',
            opacity: '0.8px',
            color: 'white',
        };

        return {
            style
        };
    };

    const onDoubleClick = () => {
        openDateModal();
    }

    const onSelect = (event) => {
        setActiveEvent(event);
    };

    const onViewChanged = (event) => {
        localStorage.setItem('lastView', event);
    };

    useEffect(() => {
        startLoadingEvents();
    }, []);

    return (
        <>
            <Navbar />

            <Calendar
                culture='es'
                localizer={localizer}
                events={events}
                defaultView={lastView}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100vh - 80px)' }}
                messages={getMessagesEs()}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEventBox
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />

            <CalendarModal />
            <FabAddNew />
            <FabDelete />
        </>
    )
}