import { useContext, useState } from "react";
import { RestaurantContext } from "../context/RestaurantContext";

export default function ReservationsPage() {
  const { reservations, addReservation, cancelReservation } =
    useContext(RestaurantContext);

  const [bookingType, setBookingType] = useState("Table Reservation");
  const [guestName, setGuestName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [eventNotes, setEventNotes] = useState("");
  const [error, setError] = useState("");
  const [confirmationMsg, setConfirmationMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName.trim() || !date || !time) {
      setError("Please fill in your name, date, and time.");
      return;
    }

    setError("");
    const booking = addReservation({
      bookingType,
      guestName,
      date,
      time,
      guests: Number(guests),
      eventNotes: bookingType !== "Table Reservation" ? eventNotes : "Standard seating",
    });

    setConfirmationMsg(
      `Confirmation #${booking.id}: Your ${booking.bookingType} for ${booking.guests} guests on ${booking.date} at ${booking.time} has been submitted!`
    );
    setGuestName("");
    setDate("");
    setTime("");
    setGuests(2);
    setEventNotes("");
  };

  return (
    <div className="page-container">
      <h2>Table Reservations & Special Events</h2>

      {confirmationMsg && <div className="success-banner">{confirmationMsg}</div>}

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Book a Table or Event</h3>
          {error && <p className="error-text">{error}</p>}

          <label>
            Reservation Type:
            <select
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value)}
            >
              <option value="Table Reservation">Standard Table Reservation</option>
              <option value="Birthday Party">Special Event - Birthday Party</option>
              <option value="Corporate Gathering">Special Event - Corporate Gathering</option>
            </select>
          </label>

          <input
            type="text"
            placeholder="Full Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <label>
            Number of Guests:
            <input
              type="number"
              min="1"
              max="50"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </label>

          {bookingType !== "Table Reservation" && (
            <input
              type="text"
              placeholder="Event details (cake request, projector, dietary notes...)"
              value={eventNotes}
              onChange={(e) => setEventNotes(e.target.value)}
            />
          )}

          <button type="submit" className="btn-primary">
            Confirm Booking
          </button>
        </form>

        <div>
          <h3>Your Bookings</h3>
          {reservations.length === 0 ? (
            <p>No active reservations yet.</p>
          ) : (
            reservations.map((res) => (
              <div key={res.id} className="order-card">
                <div>
                  <h4>
                    {res.bookingType} — {res.guestName}
                  </h4>
                  <p>
                    {res.date} at {res.time} ({res.guests} guests)
                  </p>
                  <p>
                    <small>{res.eventNotes}</small>
                  </p>
                  <span className="status-badge">{res.status}</span>
                </div>
                {res.status !== "Canceled" && (
                  <button
                    onClick={() => cancelReservation(res.id)}
                    className="btn-danger"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}