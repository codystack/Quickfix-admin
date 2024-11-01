import React from 'react'
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { BookingView } from 'src/sections/booking/view';

const Bookings = () => {
    console.log("hi");
    return (
        <>
          <Helmet>
            <title> {`Bookings - ${CONFIG.appName}`}</title>
          </Helmet>
    
          <BookingView />
        </>
      );
}

export default Bookings