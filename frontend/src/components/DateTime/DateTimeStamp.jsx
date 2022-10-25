import  React, { useState } from 'react'

const DateTimeStamp = () => {

    const [date] = useState(new Date());

    /* 
        To implement this date time stamp in the application simply:

        <div className="Test">
            <DateTimeStamp></DateTimeStamp>
        </div>
    */

    return(
        <div id="date-time">
            <p>{date.toLocaleDateString()} {date.toLocaleTimeString()}</p>
        </div>
    )
}

export default DateTimeStamp;
