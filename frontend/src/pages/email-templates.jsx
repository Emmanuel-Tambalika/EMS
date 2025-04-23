import React from 'react';
import { Html, Button, Text, Section } from '@react-email/components';

export const PaymentSuccessEmail = ({ user, event, ticketsCount, amount }) => (
  <Html>
    <Section style={styles.main}>
      <Text style={styles.heading}>Booking Confirmed!</Text>
      <Text style={styles.text}>Hello {user.name},</Text>
      <Text style={styles.text}>
        Your booking for {event.name} has been confirmed.
      </Text>
      
      <Section style={styles.details}>
        <Text style={styles.detailItem}>Event: {event.name}</Text>
        <Text style={styles.detailItem}>Date: {new Date(event.date).toLocaleDateString()}</Text>
        <Text style={styles.detailItem}>Tickets: {ticketsCount}</Text>
        <Text style={styles.detailItem}>Amount: ${amount}</Text>
      </Section>

      <Button href={event.ticketsUrl} style={styles.button}>
        View Tickets
      </Button>
    </Section>
  </Html>
);

export const NewBookingAlertEmail = ({ organizer, attendee, event, ticketsCount }) => (
  <Html>
    <Section style={styles.main}>
      <Text style={styles.heading}>New Booking Alert</Text>
      <Text style={styles.text}>Hello {organizer.name},</Text>
      <Text style={styles.text}>
        {attendee.name} has booked {ticketsCount} tickets for {event.name}.
      </Text>
      
      <Section style={styles.details}>
        <Text style={styles.detailItem}>Attendee: {attendee.name}</Text>
        <Text style={styles.detailItem}>Email: {attendee.email}</Text>
        <Text style={styles.detailItem}>Event: {event.name}</Text>
        <Text style={styles.detailItem}>Date: {new Date(event.date).toLocaleDateString()}</Text>
      </Section>

      <Button href={`/dashboard/events/${event._id}`} style={styles.button}>
        View Event Dashboard
      </Button>
    </Section>
  </Html>
);

const styles = {
  main: {
    backgroundColor: '#ffffff',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    fontSize: '24px',
    color: '#333333',
    marginBottom: '20px'
  },
  text: {
    fontSize: '16px',
    color: '#666666',
    margin: '10px 0'
  },
  details: {
    margin: '20px 0',
    padding: '15px',
    backgroundColor: '#f5f5f5'
  },
  detailItem: {
    fontSize: '14px',
    margin: '5px 0'
  },
  button: {
    backgroundColor: '#0070f3',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none'
  }
};
