export const CalendarEventBox = ({ event }) => {

    const { title, user } = event;

    return (
        <div className="calendar-event">
            <strong className="calendar-event__title">{title}</strong>
            <span className="calendar-event__user">{user.name}</span>
        </div>
    )
}
