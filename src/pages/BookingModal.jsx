import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import validator from "validator";
import DOMPurify from "dompurify";
import "react-datepicker/dist/react-datepicker.css";
import {
    db,
    collection,
    addDoc,
    query,
    where,
    getDocs,
} from "../../config/firebaseConfig";
import { ClipLoader } from "react-spinners";
import { FaTimesCircle } from "react-icons/fa";

Modal.setAppElement("#root");

const BookingModal = ({ isOpen, onClose, service, category }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [availableTimes, setAvailableTimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
    const [nameError, setNameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [dateError, setDateError] = useState("");
    const [timeError, setTimeError] = useState("");

    const generateTimeSlots = useCallback(() => {
        const startTime = 9;
        const endTime = 17;
        return Array.from(
            { length: endTime - startTime },
            (_, i) => `${startTime + i}:00`
        );
    }, []);

    const filterAvailableTimes = useCallback(
        (bookedSlots) => {
            setAvailableTimes(
                generateTimeSlots().filter(
                    (time) => !bookedSlots.includes(time)
                )
            );
        },
        [generateTimeSlots]
    );

    const fetchBookedSlots = useCallback(async () => {
        if (!selectedDate) return;
        setLoading(true);
        try {
            const formattedDate = selectedDate?.toLocaleDateString();
            const q = query(
                collection(db, "bookings"),
                where("date", "==", formattedDate)
            );
            const snapshot = await getDocs(q);
            const bookedSlots = snapshot.docs.map((doc) => doc.data().time);
            filterAvailableTimes(bookedSlots);
        } catch (err) {
            console.log("Error Occurred: ", err);
        } finally {
            setLoading(false);
        }
    }, [selectedDate, filterAvailableTimes]);

    useEffect(() => {
        if (selectedDate) {
            fetchBookedSlots();
        }
    }, [selectedDate, fetchBookedSlots]);

    function validateInputs() {
        let valid = true;
        // Reset all error states
        setNameError("");
        setPhoneError("");
        setEmailError("");
        setDateError("");
        setTimeError("");

        const phonePattern = /^9[1236][0-9]{7}$/;

        if (!phone) {
            setPhoneError("Please enter your phone number");
            valid = false;
        } else if (!phonePattern.test(phone)) {
            setPhoneError("Please enter a valid Portuguese phone number");
            valid = false;
        }

        if (!selectedDate) {
            setDateError("Please select a available date");
            valid = false;
        }
        if (!selectedTime) {
            setTimeError("Please select a valid time");
            valid = false;
        }
        if (!name) {
            setNameError("Please enter your name");
            valid = false;
        }
        if (!email) {
            setEmailError("Please enter your email");
            valid = false;
        } else if (!validator.isEmail(email)) {
            setEmailError("Please enter a valid email address");
            valid = false;
        }

        return valid;
    }

    const handleBooking = async () => {
        if (!validateInputs()) return;

        const bookingData = {
            name: DOMPurify.sanitize(name),
            phone: DOMPurify.sanitize(phone),
            email: DOMPurify.sanitize(email),
            service: service.name,
            category: category.name,
            date: DOMPurify.sanitize(selectedDate.toLocaleDateString()),
            time: DOMPurify.sanitize(selectedTime),
        };

        setLoading(true);
        try {
            await addDoc(collection(db, "bookings"), bookingData);

            console.log("Booking Confirmed:", bookingData);
            setIsBookingConfirmed(true);

            //reset fields
            setSelectedDate(null);
            setSelectedTime("");
            setName("");
            setPhone("");
            setEmail("");
        } catch (err) {
            console.log("An error occurred:", err);
            alert("Error saving booking");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseConfirmation = () => {
        setIsBookingConfirmed(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={true}
            className="bg-white p-2 md:p-6 rounded-lg shadow-lg max-w-screen mx-auto mt-20 overflow-hidden"
            overlayClassName="fixed inset-0 bg-opacity-50 flex justify-center items-center"
        >
            {isBookingConfirmed ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-green-500 mb-4">
                        Booking is Confirmed!
                    </h2>
                    <p>Your appointment has been book with success</p>
                    <button
                        className="bg-amber-500 text-white p-3 mt-5 rounded-md hover:bg-amber-600 transition w-full"
                        onClick={handleCloseConfirmation}
                    >
                        Close
                    </button>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold">
                        {service.name} - {category.name}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Price: ${category.price} | Duration: {category.duration}
                    </p>
                    {/* select a date */}
                    <label className="block">Select Date:</label>
                    <div className="relative">
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            minDate={new Date()}
                            className={`border p-2 rounded-md w-full focus:bg-amber-500 ${
                                dateError ? "border-red-500" : ""
                            }`}
                            dateFormat="MM/dd/yyyy"
                        />
                        {selectedDate && (
                            <button
                                className="absolute top-2 right-2 text-red-500"
                                type="button"
                                onClick={() => {
                                    setSelectedDate(null);
                                    setSelectedTime("");
                                }}
                            >
                                <FaTimesCircle size={20} />
                            </button>
                        )}
                    </div>
                    {dateError && (
                        <span className="text-red-500 text-sm">
                            {" "}
                            {dateError}{" "}
                        </span>
                    )}
                    {/* select a time */}
                    <label className="block mt-4">Select a Time:</label>
                    {loading ? (
                        <div className="flex justify-between items-center">
                            <ClipLoader color="#f59e0b" size={35} />
                        </div>
                    ) : (
                        <select
                            className={`border p-2 rounded-md w-full mt-2 bg-white shadow-sm focus:ring-amber-600 focus:border-amber-600 focus:bg-amber-500 ${
                                timeError ? "border-red-500" : ""
                            }`}
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        >
                            <option value="">Choose a Time</option>
                            {availableTimes.length > 0 ? (
                                availableTimes.map((time) => (
                                    <option key={time} value={time}>
                                        {" "}
                                        {time}{" "}
                                    </option>
                                ))
                            ) : (
                                <option className="text-red-500" disabled>
                                    No Slots Available
                                </option>
                            )}
                        </select>
                    )}
                    {timeError && (
                        <span className="text-red-500 text-sm">
                            {" "}
                            {timeError}{" "}
                        </span>
                    )}

                    <label htmlFor="name" className="block mt-4">
                        Your name:
                    </label>
                    <input
                        type="text"
                        value={name}
                        className={`border p-2 rounded-md w-full focus:bg-amber-500 ${
                            nameError ? "border-red-500" : ""
                        }`}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {nameError && (
                        <span className="text-red-500 text-sm">
                            {" "}
                            {nameError}{" "}
                        </span>
                    )}
                    <label className="block mt-4">Phone:</label>
                    <input
                        className={`border p-2 rounded-md w-full focus:bg-amber-500 ${
                            phoneError ? "border-red-500" : ""
                        }`}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    {phoneError && (
                        <span className="text-red-500 text-sm">
                            {phoneError}
                        </span>
                    )}

                    <label className="block mt-4">Email:</label>
                    <input
                        className={`border p-2 rounded-md w-full focus:bg-amber-500 ${
                            emailError ? "border-red-500" : ""
                        }`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError ? (
                        <span className="text-red-500 text-sm">
                            {emailError}
                        </span>
                    ) : (
                        ""
                    )}

                    {/* confirm booking */}
                    <button
                        className="bg-amber-500 text-white p-3 mt-5 rounded-md hover:bg-amber-600 transition w-full"
                        onClick={handleBooking}
                    >
                        Confirm Booking
                    </button>
                    <button
                        className="text-red-500 mt-3 block text-center w-full"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </>
            )}
        </Modal>
    );
};

export default BookingModal;
