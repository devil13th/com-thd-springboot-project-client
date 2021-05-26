import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
class NoteFullCalendar extends React.Component {
  state = {

  }

  handleDateClick = (arg) => { // bind with an arrow function
    alert(arg.dateStr)
  }

  render() {
    return (
      
      <FullCalendar
        plugins={[ dayGridPlugin,interactionPlugin ]}
        initialView="dayGridMonth"
        events={[
          { title: 'event 1', date: '2021-05-01' },
          { title: 'event 2', date: '2021-05-02' }
        ]}
        dateClick={this.handleDateClick}
      />
      
    )
  }
}

export default NoteFullCalendar