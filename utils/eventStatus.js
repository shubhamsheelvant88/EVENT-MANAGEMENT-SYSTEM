function getEventStatus(eventDate) {
    const today = new Date();
    const date = new Date(eventDate);

    // remove time from both dates
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if(date > today) {
        return "Upcoming";
    }

    if(date.getTime() === today.getTime()) {
        return "Ongoing"
    }
    return "Completed";
}

module.exports  = getEventStatus;