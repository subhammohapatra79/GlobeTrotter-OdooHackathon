import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import TripCard from "../components/trips/TripCard";
import api from "../services/api";
import "../styles/UserTrips.css";

const UserTrips = () => {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");

  // Hardcoded fallback trips
  const fallbackTrips = [
    {
      id: 1,
      title: "Goa Beach Vacation",
      destination: "Goa, India",
      startDate: "2025-01-05",
      endDate: "2025-01-12",
      status: "ongoing",
      budget: "₹25,000",
    },
    {
      id: 2,
      title: "Europe Backpacking",
      destination: "France, Italy",
      startDate: "2025-03-01",
      endDate: "2025-03-20",
      status: "upcoming",
      budget: "₹1,80,000",
    },
    {
      id: 3,
      title: "College Trip",
      destination: "Manali",
      startDate: "2024-10-10",
      endDate: "2024-10-15",
      status: "completed",
      budget: "₹18,000",
    },
  ];

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/trips");
        setTrips(res.data);
      } catch (err) {
        console.warn("API failed, loading fallback trips");
        setTrips(fallbackTrips);
      }
    };

    fetchTrips();
  }, []);

  const filterTrips = (status) =>
    trips.filter(
      (trip) =>
        trip.status === status &&
        trip.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      <Navbar />

      <div className="user-trips-container">
        {/* Search & Controls */}
        <div className="trip-controls">
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="control-buttons">
            <button>Group by</button>
            <button>Filter</button>
            <button>Sort by</button>
          </div>
        </div>

        {/* Ongoing */}
        <section>
          <h2>Ongoing</h2>
          <div className="trip-grid">
            {filterTrips("ongoing").map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        {/* Upcoming */}
        <section>
          <h2>Upcoming</h2>
          <div className="trip-grid">
            {filterTrips("upcoming").map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        {/* Completed */}
        <section>
          <h2>Completed</h2>
          <div className="trip-grid">
            {filterTrips("completed").map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default UserTrips;
