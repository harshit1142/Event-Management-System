import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatTime = (isoString, targetTz) => {
    if (!isoString) return "--";
    // Displays time in the selected profile's timezone
    return dayjs.utc(isoString).tz(targetTz).format('DD MMM YYYY, hh:mm A');
};
