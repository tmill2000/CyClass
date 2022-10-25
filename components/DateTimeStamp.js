import  React, { useState } from 'react'

export const DateTimeStamp = () => {

    var [date] = useState(new Date());

    /* 
        To implement this date time stamp in the application simply:

        <div className="Test">
            <DateTimeStamp></DateTimeStamp>
        </div>
    */

    return(
        <div>
            <p>{date.toLocaleDateString()} {date.toLocaleTimeString()}</p>
        </div>
    )
}

export default DateTimeStamp;
