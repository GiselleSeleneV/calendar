import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import { CalendarEventBox, CalendarModal, FabAddNew, FabDelete, Navbar } from "../";
import { localizer, getMessagesEs } from '../../helpers'
import { useAuthStore, useCalendarStore, useUiStore } from '../../hooks';
import './calendarPage.css';


export const CalendarPage = () => {
    const { user } = useAuthStore()
    const { openDateModal } = useUiStore();
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();

    const [lastView] = useState(localStorage.getItem('lastView') || 'week');

    const eventStyleGetter = (event) => {
        const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);

        const style = {
            backgroundColor: isMyEvent ? '#0F172A' : '#94a3b8',
            borderRadius: '8px',
            opacity: 0.95,
            color: 'white',
            border: '0px',
            display: 'block',
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
        <div className="calendar-page">
            <Navbar />

            <div className="calendar-page__workspace">
                <div className="calendar-page__surface">
                    <Calendar
                        culture='es'
                        localizer={localizer}
                        events={events}
                        defaultView={lastView}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        messages={getMessagesEs()}
                        eventPropGetter={eventStyleGetter}
                        components={{
                            event: CalendarEventBox
                        }}
                        onDoubleClickEvent={onDoubleClick}
                        onSelectEvent={onSelect}
                        onView={onViewChanged}
                    />
                </div>
            </div>

            <CalendarModal />
            <FabAddNew />
            <FabDelete />
        </div>
    )
}
