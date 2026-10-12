import { useEffect, useState } from "react";
import "./App.css";

function App() {

const refreshDischargeAnalytics = async () => {
    try {
        setDischargeLoading(true);
        setDischargeError("");

        const response = await fetch(
            "http://localhost:5000/api/analytics/discharges/refresh",
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.details ||
                errorData.error ||
                "Failed to refresh materialized view"
            );
        }

        // Fetch the updated materialized view
        const dataResponse = await fetch(
            "http://localhost:5000/api/analytics/discharges"
        );

        if (!dataResponse.ok) {
            throw new Error("Failed to fetch refreshed data");
        }

        const data = await dataResponse.json();

        setDischargeData(data.summary);

    } catch (error) {
        console.error("Discharge refresh error:", error);

        setDischargeError(
            error.message || "Failed to refresh discharge analytics"
        );

    } finally {
        setDischargeLoading(false);
    }
};
    // =========================
    // GENERAL
    // =========================

    const [view, setView] = useState("patients");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // PATIENTS
    // =========================

    const [patients, setPatients] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientDetails, setPatientDetails] = useState(null);

    // =========================
    // CLINICS
    // =========================

    const [clinics, setClinics] = useState([]);
    const [clinicPage, setClinicPage] = useState(1);
    const [clinicTotalPages, setClinicTotalPages] = useState(1);

    const [clinicSearchInput, setClinicSearchInput] = useState("");
    const [clinicSearch, setClinicSearch] = useState("");

    const [selectedClinic, setSelectedClinic] = useState(null);
    const [clinicDetails, setClinicDetails] = useState(null);

    // =========================
    // APPOINTMENTS
    // =========================

    const [appointments, setAppointments] = useState([]);
    const [appointmentPage, setAppointmentPage] = useState(1);
    const [appointmentTotalPages, setAppointmentTotalPages] =
        useState(1);

    const [appointmentStatus, setAppointmentStatus] = useState("");

    const [appointmentSearchInput, setAppointmentSearchInput] =
        useState("");
    const [appointmentSearch, setAppointmentSearch] =
        useState("");

    const [selectedAppointment, setSelectedAppointment] =
        useState(null);
    const [appointmentDetails, setAppointmentDetails] =
        useState(null);

    // =========================
    // BOOKING
    // =========================

    const [bookingPatients, setBookingPatients] = useState([]);
    const [bookingClinics, setBookingClinics] = useState([]);

    const [bookingPatientId, setBookingPatientId] = useState("");
    const [bookingClinicId, setBookingClinicId] = useState("");
    const [bookingCopay, setBookingCopay] = useState("");

    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingResult, setBookingResult] = useState(null);
    const [bookingError, setBookingError] = useState("");

    // =========================
    // AUDIT TRAIL
    // =========================

    const [auditPatients, setAuditPatients] = useState([]);

    const [auditPatientId, setAuditPatientId] = useState("");
    const [auditFrom, setAuditFrom] = useState("");
    const [auditTo, setAuditTo] = useState("");

    const [auditLogs, setAuditLogs] = useState([]);
    const [auditLoading, setAuditLoading] = useState(false);
    const [auditError, setAuditError] = useState("");

    const [analyticsData, setAnalyticsData] = useState([]);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [analyticsError, setAnalyticsError] = useState("");

    const [dischargeData, setDischargeData] = useState([]);
    const [dischargeLoading, setDischargeLoading] = useState(false);
    const [dischargeError, setDischargeError] = useState("");
    // =========================
    // FETCH PATIENTS
    // =========================

useEffect(() => {
    if (view !== "analytics") {
        return;
    }

    const fetchAnalytics = async () => {
        try {
            setAnalyticsLoading(true);
            setDischargeLoading(true);

            setAnalyticsError("");
            setDischargeError("");

            const revenueResponse = await fetch(
                "http://localhost:5000/api/analytics/clinic-revenue"
            );

            if (!revenueResponse.ok) {
                throw new Error("Failed to fetch revenue analytics");
            }

            const revenueData = await revenueResponse.json();

            setAnalyticsData(revenueData.analytics);


            const dischargeResponse = await fetch(
                "http://localhost:5000/api/analytics/discharges"
            );

            if (!dischargeResponse.ok) {
                throw new Error("Failed to fetch discharge analytics");
            }

            const dischargeResult =
                await dischargeResponse.json();

            setDischargeData(dischargeResult.summary);

        } catch (error) {
            console.error(error);

            setAnalyticsError(
                "Failed to load revenue analytics"
            );

            setDischargeError(
                "Failed to load discharge analytics"
            );

        } finally {
            setAnalyticsLoading(false);
            setDischargeLoading(false);
        }
    };

    fetchAnalytics();

}, [view]);

    useEffect(() => {
        if (view !== "patients") return;

        const fetchPatients = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:5000/api/patients?page=${page}&limit=20&search=${encodeURIComponent(
                        search
                    )}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch patients");
                }

                const data = await response.json();

                setPatients(data.patients);
                setTotalPages(data.totalPages);
            } catch (err) {
                console.error(err);
                setError("Failed to load patients");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [view, page, search]);

    // =========================
    // FETCH PATIENT DETAILS
    // =========================

    useEffect(() => {
        if (!selectedPatient) {
            setPatientDetails(null);
            return;
        }

        const fetchPatientDetails = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/patients/${selectedPatient}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch patient details"
                    );
                }

                const data = await response.json();

                setPatientDetails(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load patient details");
            }
        };

        fetchPatientDetails();
    }, [selectedPatient]);

    // =========================
    // FETCH CLINICS
    // =========================

    useEffect(() => {
        if (view !== "clinics") return;

        const fetchClinics = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:5000/api/clinics?page=${clinicPage}&limit=20&search=${encodeURIComponent(
                        clinicSearch
                    )}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch clinics");
                }

                const data = await response.json();

                setClinics(data.clinics);
                setClinicTotalPages(data.totalPages);
            } catch (err) {
                console.error(err);
                setError("Failed to load clinics");
            } finally {
                setLoading(false);
            }
        };

        fetchClinics();
    }, [view, clinicPage, clinicSearch]);

    // =========================
    // FETCH CLINIC DETAILS
    // =========================

    useEffect(() => {
        if (!selectedClinic) {
            setClinicDetails(null);
            return;
        }

        const fetchClinicDetails = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/clinics/${selectedClinic}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch clinic details"
                    );
                }

                const data = await response.json();

                setClinicDetails(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load clinic details");
            }
        };

        fetchClinicDetails();
    }, [selectedClinic]);

    // =========================
    // FETCH APPOINTMENTS
    // =========================

    useEffect(() => {
        if (view !== "appointments") return;

        const fetchAppointments = async () => {
            try {
                setLoading(true);
                setError("");

                const url =
                    `http://localhost:5000/api/appointments` +
                    `?page=${appointmentPage}` +
                    `&limit=20` +
                    `&status=${encodeURIComponent(
                        appointmentStatus
                    )}` +
                    `&search=${encodeURIComponent(
                        appointmentSearch
                    )}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch appointments"
                    );
                }

                const data = await response.json();

                setAppointments(data.appointments);
                setAppointmentTotalPages(data.totalPages);
            } catch (err) {
                console.error(err);
                setError("Failed to load appointments");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [
        view,
        appointmentPage,
        appointmentStatus,
        appointmentSearch
    ]);

    // =========================
    // FETCH APPOINTMENT DETAILS
    // =========================

    useEffect(() => {
        if (!selectedAppointment) {
            setAppointmentDetails(null);
            return;
        }

        const fetchAppointmentDetails = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/appointments/${selectedAppointment}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch appointment details"
                    );
                }

                const data = await response.json();

                setAppointmentDetails(data);
            } catch (err) {
                console.error(err);
                setError(
                    "Failed to load appointment details"
                );
            }
        };

        fetchAppointmentDetails();
    }, [selectedAppointment]);

    // =========================
    // FETCH BOOKING DATA
    // =========================

    useEffect(() => {
        if (view !== "booking") return;

        const fetchBookingData = async () => {
            try {
                setBookingLoading(true);
                setBookingError("");

                const [
                    patientsResponse,
                    clinicsResponse
                ] = await Promise.all([
                    fetch(
                        "http://localhost:5000/api/patients?page=1&limit=5000"
                    ),
                    fetch(
                        "http://localhost:5000/api/clinics?page=1&limit=500"
                    )
                ]);

                if (!patientsResponse.ok) {
                    throw new Error(
                        "Failed to load patients"
                    );
                }

                if (!clinicsResponse.ok) {
                    throw new Error(
                        "Failed to load clinics"
                    );
                }

                const patientsData =
                    await patientsResponse.json();

                const clinicsData =
                    await clinicsResponse.json();

                setBookingPatients(
                    patientsData.patients
                );

                setBookingClinics(
                    clinicsData.clinics
                );
            } catch (err) {
                console.error(err);
                setBookingError(
                    "Failed to load booking data"
                );
            } finally {
                setBookingLoading(false);
            }
        };

        fetchBookingData();
    }, [view]);

    // =========================
    // FETCH AUDIT PATIENTS
    // =========================

    useEffect(() => {
        if (view !== "audit") return;

        const fetchAuditPatients = async () => {
            try {
                setAuditLoading(true);
                setAuditError("");

                const response = await fetch(
                    "http://localhost:5000/api/patients?page=1&limit=5000"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load patients"
                    );
                }

                const data = await response.json();

                setAuditPatients(data.patients);
            } catch (err) {
                console.error(err);
                setAuditError(
                    "Failed to load patients"
                );
            } finally {
                setAuditLoading(false);
            }
        };

        fetchAuditPatients();
    }, [view]);

    // =========================
    // PATIENT SEARCH
    // =========================

    const handlePatientSearch = () => {
        setPage(1);
        setSearch(searchInput);
    };

    // =========================
    // CLINIC SEARCH
    // =========================

    const handleClinicSearch = () => {
        setClinicPage(1);
        setClinicSearch(clinicSearchInput);
    };

    // =========================
    // APPOINTMENT SEARCH
    // =========================

    const handleAppointmentSearch = () => {
        setAppointmentPage(1);
        setAppointmentSearch(
            appointmentSearchInput
        );
    };

    // =========================
    // APPOINTMENT STATUS FILTER
    // =========================

    const handleAppointmentStatusChange = (e) => {
        setAppointmentPage(1);
        setAppointmentStatus(e.target.value);
    };

    // =========================
    // UPDATE APPOINTMENT STATUS
    // =========================

    const updateAppointmentStatus = async (
        appointmentId,
        newStatus
    ) => {
        try {
            setError("");

            const response = await fetch(
                `http://localhost:5000/api/appointments/${appointmentId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to update appointment"
                );
            }

            const refreshResponse = await fetch(
                `http://localhost:5000/api/appointments` +
                `?page=${appointmentPage}` +
                `&limit=20` +
                `&status=${encodeURIComponent(
                    appointmentStatus
                )}` +
                `&search=${encodeURIComponent(
                    appointmentSearch
                )}`
            );

            const refreshData =
                await refreshResponse.json();

            setAppointments(
                refreshData.appointments
            );

            setAppointmentTotalPages(
                refreshData.totalPages
            );

            if (
                selectedAppointment ===
                appointmentId
            ) {
                const detailsResponse =
                    await fetch(
                        `http://localhost:5000/api/appointments/${appointmentId}`
                    );

                if (detailsResponse.ok) {
                    const detailsData =
                        await detailsResponse.json();

                    setAppointmentDetails(
                        detailsData
                    );
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    // =========================
    // BOOK APPOINTMENT
    // =========================

    const handleBooking = async () => {
        try {
            setBookingError("");
            setBookingResult(null);

            if (!bookingPatientId) {
                setBookingError(
                    "Please select a patient"
                );
                return;
            }

            if (!bookingClinicId) {
                setBookingError(
                    "Please select a clinic"
                );
                return;
            }

            if (
                bookingCopay === "" ||
                Number(bookingCopay) < 0
            ) {
                setBookingError(
                    "Please enter a valid copay amount"
                );
                return;
            }

            setBookingLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/bookings",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        patient_id:
                            bookingPatientId,
                        clinic_id:
                            bookingClinicId,
                        copay_amount:
                            Number(bookingCopay)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to book appointment"
                );
            }

            setBookingResult(data);

            setBookingPatientId("");
            setBookingClinicId("");
            setBookingCopay("");
        } catch (err) {
            console.error(err);

            setBookingError(err.message);
        } finally {
            setBookingLoading(false);
        }
    };

    // =========================
    // LOAD AUDIT TRAIL
    // =========================

    const loadAuditTrail = async () => {
        try {
            setAuditError("");
            setAuditLogs([]);

            if (!auditPatientId) {
                setAuditError(
                    "Please select a patient"
                );
                return;
            }

            setAuditLoading(true);

            let url =
                `http://localhost:5000/api/audit-logs/${auditPatientId}`;

            const params = new URLSearchParams();

            if (auditFrom) {
                params.append(
                    "from",
                    `${auditFrom}T00:00:00`
                );
            }

            if (auditTo) {
                params.append(
                    "to",
                    `${auditTo}T23:59:59`
                );
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to load audit trail"
                );
            }

            setAuditLogs(data.logs);
        } catch (err) {
            console.error(err);

            setAuditError(
                err.message
            );
        } finally {
            setAuditLoading(false);
        }
    };

    // =========================
    // NAVIGATION
    // =========================

    const showPatients = () => {
        setView("patients");
        setSelectedPatient(null);
        setSelectedClinic(null);
        setSelectedAppointment(null);
        setError("");
    };

    const showClinics = () => {
        setView("clinics");
        setSelectedPatient(null);
        setSelectedClinic(null);
        setSelectedAppointment(null);
        setError("");
    };

    const showAppointments = () => {
        setView("appointments");
        setSelectedPatient(null);
        setSelectedClinic(null);
        setSelectedAppointment(null);
        setError("");
    };

    const showBooking = () => {
        setView("booking");
        setSelectedPatient(null);
        setSelectedClinic(null);
        setSelectedAppointment(null);
        setError("");
        setBookingError("");
        setBookingResult(null);
    };

    const showAudit = () => {
        setView("audit");
        setSelectedPatient(null);
        setSelectedClinic(null);
        setSelectedAppointment(null);
        setError("");
        setAuditError("");
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="loading">
                Loading CareConnect...
            </div>
        );
    }

    // =========================
    // MAIN UI
    // =========================

    return (
        <div className="app-container">

            {/* HEADER */}

            <div className="header">

                <h1>CareConnect</h1>

                <p>
                    On-Demand Telemedicine Platform
                </p>

                <div className="navigation">

                    <button
                        className={
                            view === "patients"
                                ? "nav-button active"
                                : "nav-button"
                        }
                        onClick={showPatients}
                    >
                        Patients
                    </button>

                    <button
                        className={
                            view === "clinics"
                                ? "nav-button active"
                                : "nav-button"
                        }
                        onClick={showClinics}
                    >
                        Clinics
                    </button>

                    <button
                        className={
                            view === "appointments"
                                ? "nav-button active"
                                : "nav-button"
                        }
                        onClick={showAppointments}
                    >
                        Appointments
                    </button>

                    <button
                        className={
                            view === "booking"
                                ? "nav-button active"
                                : "nav-button"
                        }
                        onClick={showBooking}
                    >
                        Book Appointment
                    </button>

                    <button
                        className={
                            view === "audit"
                                ? "nav-button active"
                                : "nav-button"
                        }
                        onClick={showAudit}
                    >
                        Audit Trail
                    </button>

                    <button
                        className={`nav-button ${view === "analytics" ? "active" : ""}`}
                        onClick={() => setView("analytics")}
                    >
                        Analytics
                    </button>

                </div>
            </div>

            {/* GENERAL ERROR */}

            {error && (
                <div className="error">
                    {error}
                </div>
            )}

            {/* ================================================= */}
            {/* PATIENTS */}
            {/* ================================================= */}

            {view === "patients" && (
                <div className="section">

                    <h2>Patients</h2>

                    <div className="search-container">

                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search patients..."
                            value={searchInput}
                            onChange={(e) =>
                                setSearchInput(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter"
                                ) {
                                    handlePatientSearch();
                                }
                            }}
                        />

                        <button
                            onClick={
                                handlePatientSearch
                            }
                        >
                            Search
                        </button>

                    </div>

                    {patients.length === 0 ? (
                        <div className="empty">
                            No patients found.
                        </div>
                    ) : (
                        <table className="patient-table">

                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>
                                        HSA Balance
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {patients.map(
                                    (patient) => (
                                        <tr
                                            key={
                                                patient.id
                                            }
                                        >

                                            <td>
                                                <button
                                                    className="patient-name-button"
                                                    onClick={() =>
                                                        setSelectedPatient(
                                                            patient.id
                                                        )
                                                    }
                                                >
                                                    {
                                                        patient.name
                                                    }
                                                </button>
                                            </td>

                                            <td>
                                                $
                                                {Number(
                                                    patient.hsa_balance
                                                ).toFixed(
                                                    2
                                                )}
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>
                    )}

                    <div className="pagination">

                        <button
                            disabled={page <= 1}
                            onClick={() => {
                                setPage(
                                    page - 1
                                );
                                setSelectedPatient(
                                    null
                                );
                            }}
                        >
                            Previous
                        </button>

                        <span className="page-number">
                            Page {page} of{" "}
                            {totalPages}
                        </span>

                        <button
                            disabled={
                                page >=
                                totalPages
                            }
                            onClick={() => {
                                setPage(
                                    page + 1
                                );
                                setSelectedPatient(
                                    null
                                );
                            }}
                        >
                            Next
                        </button>

                    </div>

                    {patientDetails && (
                        <div className="patient-details">

                            <h2>
                                Patient Details
                            </h2>

                            <div className="patient-detail-row">
                                <strong>
                                    Name:
                                </strong>{" "}
                                {
                                    patientDetails.name
                                }
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    HSA Balance:
                                </strong>{" "}
                                $
                                {Number(
                                    patientDetails.hsa_balance
                                ).toFixed(2)}
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    ID:
                                </strong>{" "}
                                {
                                    patientDetails.id
                                }
                            </div>

                        </div>
                    )}

                </div>
            )}

            {/* ================================================= */}
            {/* CLINICS */}
            {/* ================================================= */}

            {view === "clinics" && (
                <div className="section">

                    <h2>Clinics</h2>

                    <div className="search-container">

                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search clinics..."
                            value={
                                clinicSearchInput
                            }
                            onChange={(e) =>
                                setClinicSearchInput(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter"
                                ) {
                                    handleClinicSearch();
                                }
                            }}
                        />

                        <button
                            onClick={
                                handleClinicSearch
                            }
                        >
                            Search
                        </button>

                    </div>

                    {clinics.length === 0 ? (
                        <div className="empty">
                            No clinics found.
                        </div>
                    ) : (
                        <table className="patient-table">

                            <thead>

                                <tr>
                                    <th>Name</th>
                                    <th>
                                        Latitude
                                    </th>
                                    <th>
                                        Longitude
                                    </th>
                                    <th>
                                        Accepting
                                        Patients
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {clinics.map(
                                    (clinic) => (
                                        <tr
                                            key={
                                                clinic.id
                                            }
                                        >

                                            <td>
                                                <button
                                                    className="patient-name-button"
                                                    onClick={() =>
                                                        setSelectedClinic(
                                                            clinic.id
                                                        )
                                                    }
                                                >
                                                    {
                                                        clinic.name
                                                    }
                                                </button>
                                            </td>

                                            <td>
                                                {
                                                    clinic.latitude
                                                }
                                            </td>

                                            <td>
                                                {
                                                    clinic.longitude
                                                }
                                            </td>

                                            <td>
                                                {
                                                    clinic.is_accepting_patients
                                                        ? "Yes"
                                                        : "No"
                                                }
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>
                    )}

                    <div className="pagination">

                        <button
                            disabled={
                                clinicPage <= 1
                            }
                            onClick={() => {
                                setClinicPage(
                                    clinicPage - 1
                                );
                                setSelectedClinic(
                                    null
                                );
                            }}
                        >
                            Previous
                        </button>

                        <span className="page-number">
                            Page {clinicPage} of{" "}
                            {
                                clinicTotalPages
                            }
                        </span>

                        <button
                            disabled={
                                clinicPage >=
                                clinicTotalPages
                            }
                            onClick={() => {
                                setClinicPage(
                                    clinicPage + 1
                                );
                                setSelectedClinic(
                                    null
                                );
                            }}
                        >
                            Next
                        </button>

                    </div>

                    {clinicDetails && (
                        <div className="patient-details">

                            <h2>
                                Clinic Details
                            </h2>

                            <div className="patient-detail-row">
                                <strong>
                                    Name:
                                </strong>{" "}
                                {
                                    clinicDetails.name
                                }
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Latitude:
                                </strong>{" "}
                                {
                                    clinicDetails.latitude
                                }
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Longitude:
                                </strong>{" "}
                                {
                                    clinicDetails.longitude
                                }
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Accepting
                                    Patients:
                                </strong>{" "}
                                {
                                    clinicDetails.is_accepting_patients
                                        ? "Yes"
                                        : "No"
                                }
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    ID:
                                </strong>{" "}
                                {
                                    clinicDetails.id
                                }
                            </div>

                        </div>
                    )}

                </div>
            )}

            {/* ================================================= */}
            {/* APPOINTMENTS */}
            {/* ================================================= */}

            {view === "appointments" && (
                <div className="section">

                    <h2>Appointments</h2>

                    <div className="search-container">

                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search patient or clinic..."
                            value={
                                appointmentSearchInput
                            }
                            onChange={(e) =>
                                setAppointmentSearchInput(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter"
                                ) {
                                    handleAppointmentSearch();
                                }
                            }}
                        />

                        <button
                            onClick={
                                handleAppointmentSearch
                            }
                        >
                            Search
                        </button>

                        <select
                            className="search-input"
                            value={
                                appointmentStatus
                            }
                            onChange={
                                handleAppointmentStatusChange
                            }
                        >
                            <option value="">
                                All Statuses
                            </option>

                            <option value="WAITING">
                                Waiting
                            </option>

                            <option value="IN_CONSULTATION">
                                In Consultation
                            </option>

                            <option value="DISCHARGED">
                                Discharged
                            </option>

                        </select>

                    </div>

                    {appointments.length === 0 ? (
                        <div className="empty">
                            No appointments found.
                        </div>
                    ) : (
                        <table className="patient-table">

                            <thead>

                                <tr>
                                    <th>
                                        Patient
                                    </th>
                                    <th>
                                        Clinic
                                    </th>
                                    <th>
                                        Copay
                                    </th>
                                    <th>
                                        Status
                                    </th>
                                    <th>
                                        Created
                                    </th>
                                    <th>
                                        Action
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {appointments.map(
                                    (
                                        appointment
                                    ) => (
                                        <tr
                                            key={
                                                appointment.id
                                            }
                                        >

                                            <td>
                                                <button
                                                    className="patient-name-button"
                                                    onClick={() =>
                                                        setSelectedAppointment(
                                                            appointment.id
                                                        )
                                                    }
                                                >
                                                    {
                                                        appointment.patient_name
                                                    }
                                                </button>
                                            </td>

                                            <td>
                                                {
                                                    appointment.clinic_name
                                                }
                                            </td>

                                            <td>
                                                $
                                                {Number(
                                                    appointment.copay_amount
                                                ).toFixed(
                                                    2
                                                )}
                                            </td>

                                            <td>
                                                {
                                                    appointment.status
                                                }
                                            </td>

                                            <td>
                                                {new Date(
                                                    appointment.created_at
                                                ).toLocaleString()}
                                            </td>

                                            <td>

                                                {appointment.status ===
                                                    "WAITING" && (
                                                    <button
                                                        onClick={() =>
                                                            updateAppointmentStatus(
                                                                appointment.id,
                                                                "IN_CONSULTATION"
                                                            )
                                                        }
                                                    >
                                                        Start Consultation
                                                    </button>
                                                )}

                                                {appointment.status ===
                                                    "IN_CONSULTATION" && (
                                                    <button
                                                        onClick={() =>
                                                            updateAppointmentStatus(
                                                                appointment.id,
                                                                "DISCHARGED"
                                                            )
                                                        }
                                                    >
                                                        Discharge
                                                    </button>
                                                )}

                                                {appointment.status ===
                                                    "DISCHARGED" && (
                                                    <span>
                                                        Completed
                                                    </span>
                                                )}

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>
                    )}

                    <div className="pagination">

                        <button
                            disabled={
                                appointmentPage <=
                                1
                            }
                            onClick={() => {
                                setAppointmentPage(
                                    appointmentPage -
                                    1
                                );
                                setSelectedAppointment(
                                    null
                                );
                            }}
                        >
                            Previous
                        </button>

                        <span className="page-number">
                            Page{" "}
                            {
                                appointmentPage
                            }{" "}
                            of{" "}
                            {
                                appointmentTotalPages
                            }
                        </span>

                        <button
                            disabled={
                                appointmentPage >=
                                appointmentTotalPages
                            }
                            onClick={() => {
                                setAppointmentPage(
                                    appointmentPage +
                                    1
                                );
                                setSelectedAppointment(
                                    null
                                );
                            }}
                        >
                            Next
                        </button>

                    </div>

                    {appointmentDetails && (
                        <div className="patient-details">

                            <h2>
                                Appointment Details
                            </h2>

                            <div className="patient-detail-row">
                                <strong>
                                    Patient:
                                </strong>{" "}
                                {
                                    appointmentDetails.patient_name
                                }
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Clinic:
                                </strong>{" "}
                                {
                                    appointmentDetails.clinic_name
                                }
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Copay:
                                </strong>{" "}
                                $
                                {Number(
                                    appointmentDetails.copay_amount
                                ).toFixed(2)}
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Status:
                                </strong>{" "}
                                {
                                    appointmentDetails.status
                                }
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Created:
                                </strong>{" "}
                                {new Date(
                                    appointmentDetails.created_at
                                ).toLocaleString()}
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Appointment ID:
                                </strong>{" "}
                                {
                                    appointmentDetails.id
                                }
                            </div>

                        </div>
                    )}

                </div>
            )}

            {/* ================================================= */}
            {/* BOOK APPOINTMENT */}
            {/* ================================================= */}

            {view === "booking" && (
                <div className="section">

                    <h2>Book Appointment</h2>

                    <p>
                        Create a new appointment using
                        the CareConnect booking procedure.
                    </p>

                    {bookingError && (
                        <div className="error">
                            {bookingError}
                        </div>
                    )}

                    {bookingLoading ? (
                        <div className="empty">
                            Loading...
                        </div>
                    ) : (
                        <>

                            <div
                                style={{
                                    marginBottom: "20px"
                                }}
                            >

                                <label>
                                    <strong>
                                        Patient
                                    </strong>
                                </label>

                                <br />

                                <select
                                    className="search-input"
                                    value={
                                        bookingPatientId
                                    }
                                    onChange={(e) =>
                                        setBookingPatientId(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        marginTop: "8px",
                                        width: "100%"
                                    }}
                                >

                                    <option value="">
                                        Select a patient
                                    </option>

                                    {bookingPatients.map(
                                        (patient) => (
                                            <option
                                                key={
                                                    patient.id
                                                }
                                                value={
                                                    patient.id
                                                }
                                            >
                                                {patient.name}
                                                {" — HSA $"}
                                                {Number(
                                                    patient.hsa_balance
                                                ).toFixed(
                                                    2
                                                )}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            <div
                                style={{
                                    marginBottom: "20px"
                                }}
                            >

                                <label>
                                    <strong>
                                        Clinic
                                    </strong>
                                </label>

                                <br />

                                <select
                                    className="search-input"
                                    value={
                                        bookingClinicId
                                    }
                                    onChange={(e) =>
                                        setBookingClinicId(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        marginTop: "8px",
                                        width: "100%"
                                    }}
                                >

                                    <option value="">
                                        Select a clinic
                                    </option>

                                    {bookingClinics.map(
                                        (clinic) => (
                                            <option
                                                key={
                                                    clinic.id
                                                }
                                                value={
                                                    clinic.id
                                                }
                                            >
                                                {
                                                    clinic.name
                                                }
                                                {" — "}
                                                {
                                                    clinic.is_accepting_patients
                                                        ? "Accepting patients"
                                                        : "Not accepting patients"
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            <div
                                style={{
                                    marginBottom: "25px"
                                }}
                            >

                                <label>
                                    <strong>
                                        Copay Amount
                                    </strong>
                                </label>

                                <br />

                                <input
                                    className="search-input"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter copay amount"
                                    value={
                                        bookingCopay
                                    }
                                    onChange={(e) =>
                                        setBookingCopay(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        marginTop: "8px",
                                        width: "100%"
                                    }}
                                />

                            </div>

                            <button
                                onClick={
                                    handleBooking
                                }
                                disabled={
                                    bookingLoading
                                }
                            >
                                Book Appointment
                            </button>

                        </>
                    )}

                    {bookingResult && (
                        <div
                            className="patient-details"
                            style={{
                                marginTop: "30px"
                            }}
                        >

                            <h2>
                                Appointment Booked Successfully
                            </h2>

                            <div className="patient-detail-row">
                                <strong>
                                    Message:
                                </strong>{" "}
                                {
                                    bookingResult.message
                                }
                            </div>

                            <hr
                                style={{
                                    borderColor:
                                        "#374151",
                                    margin:
                                        "20px 0"
                                }}
                            />

                            <h3>
                                HSA Balance
                            </h3>

                            <div className="patient-detail-row">
                                <strong>
                                    Before:
                                </strong>{" "}
                                $
                                {Number(
                                    bookingResult.hsa.before
                                ).toFixed(2)}
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Amount Charged:
                                </strong>{" "}
                                $
                                {Number(
                                    bookingResult.hsa.amount_charged
                                ).toFixed(2)}
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    After:
                                </strong>{" "}
                                $
                                {Number(
                                    bookingResult.hsa.after
                                ).toFixed(2)}
                            </div>

                            <hr
                                style={{
                                    borderColor:
                                        "#374151",
                                    margin:
                                        "20px 0"
                                }}
                            />

                            <h3>
                                New Appointment
                            </h3>

                            <div className="patient-detail-row">
                                <strong>
                                    Patient:
                                </strong>{" "}
                                {
                                    bookingResult
                                        .appointment
                                        .patient_name
                                }
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Clinic:
                                </strong>{" "}
                                {
                                    bookingResult
                                        .appointment
                                        .clinic_name
                                }
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Copay:
                                </strong>{" "}
                                $
                                {Number(
                                    bookingResult
                                        .appointment
                                        .copay_amount
                                ).toFixed(2)}
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Status:
                                </strong>{" "}
                                {
                                    bookingResult
                                        .appointment
                                        .status
                                }
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Appointment ID:
                                </strong>{" "}
                                {
                                    bookingResult
                                        .appointment
                                        .id
                                }
                            </div>

                            <hr
                                style={{
                                    borderColor:
                                        "#374151",
                                    margin:
                                        "20px 0"
                                }}
                            />

                            <h3>
                                Wallet Audit Log
                            </h3>

                            <div className="patient-detail-row">
                                <strong>
                                    Action:
                                </strong>{" "}
                                {
                                    bookingResult
                                        .audit_log
                                        .action_type
                                }
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Amount Changed:
                                </strong>{" "}
                                $
                                {Number(
                                    bookingResult
                                        .audit_log
                                        .amount_changed
                                ).toFixed(2)}
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Balance After:
                                </strong>{" "}
                                $
                                {Number(
                                    bookingResult
                                        .audit_log
                                        .balance_after
                                ).toFixed(2)}
                            </div>

                            <div className="patient-detail-row">
                                <strong>
                                    Timestamp:
                                </strong>{" "}
                                {new Date(
                                    bookingResult
                                        .audit_log
                                        .timestamp
                                ).toLocaleString()}
                            </div>

                        </div>
                    )}

                </div>
            )}

            {/* ================================================= */}
            {/* AUDIT TRAIL */}
            {/* ================================================= */}

            {view === "audit" && (
                <div className="section">

                    <h2>Wallet Audit Trail</h2>

                    <p>
                        View HSA balance changes for a
                        selected patient.
                    </p>

                    {auditError && (
                        <div className="error">
                            {auditError}
                        </div>
                    )}

                    {auditLoading &&
                    auditPatients.length === 0 ? (
                        <div className="empty">
                            Loading patients...
                        </div>
                    ) : (
                        <>
                            {/* PATIENT */}

                            <div
                                style={{
                                    marginBottom:
                                        "20px"
                                }}
                            >

                                <label>
                                    <strong>
                                        Patient
                                    </strong>
                                </label>

                                <br />

                                <select
                                    className="search-input"
                                    value={
                                        auditPatientId
                                    }
                                    onChange={(e) =>
                                        setAuditPatientId(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        marginTop:
                                            "8px",
                                        width: "100%"
                                    }}
                                >

                                    <option value="">
                                        Select a patient
                                    </option>

                                    {auditPatients.map(
                                        (patient) => (
                                            <option
                                                key={
                                                    patient.id
                                                }
                                                value={
                                                    patient.id
                                                }
                                            >
                                                {
                                                    patient.name
                                                }
                                                {" — HSA $"}
                                                {Number(
                                                    patient.hsa_balance
                                                ).toFixed(
                                                    2
                                                )}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* DATE FILTER */}

                            <div
                                style={{
                                    display: "flex",
                                    gap: "15px",
                                    marginBottom:
                                        "25px",
                                    flexWrap:
                                        "wrap"
                                }}
                            >

                                <div>
                                    <label>
                                        <strong>
                                            From
                                        </strong>
                                    </label>

                                    <br />

                                    <input
                                        className="search-input"
                                        type="date"
                                        value={
                                            auditFrom
                                        }
                                        onChange={(e) =>
                                            setAuditFrom(
                                                e.target
                                                    .value
                                            )
                                        }
                                        style={{
                                            marginTop:
                                                "8px"
                                        }}
                                    />
                                </div>

                                <div>
                                    <label>
                                        <strong>
                                            To
                                        </strong>
                                    </label>

                                    <br />

                                    <input
                                        className="search-input"
                                        type="date"
                                        value={
                                            auditTo
                                        }
                                        onChange={(e) =>
                                            setAuditTo(
                                                e.target
                                                    .value
                                            )
                                        }
                                        style={{
                                            marginTop:
                                                "8px"
                                        }}
                                    />
                                </div>

                            </div>

                            <button
                                onClick={
                                    loadAuditTrail
                                }
                                disabled={
                                    auditLoading
                                }
                            >
                                {auditLoading
                                    ? "Loading..."
                                    : "Load Audit Trail"}
                            </button>

                        </>
                    )}

                    {/* AUDIT TABLE */}

                    {auditLogs.length > 0 && (
                        <div
                            style={{
                                marginTop:
                                    "30px"
                            }}
                        >

                            <h3>
                                Audit Records
                            </h3>

                            <table className="patient-table">

                                <thead>

                                    <tr>
                                        <th>
                                            Timestamp
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                        <th>
                                            Amount Changed
                                        </th>

                                        <th>
                                            Balance After
                                        </th>

                                        <th>
                                            Running Change
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {auditLogs.map(
                                        (log) => (
                                            <tr
                                                key={
                                                    log.id
                                                }
                                            >

                                                <td>
                                                    {new Date(
                                                        log.timestamp
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    {
                                                        log.action_type
                                                    }
                                                </td>

                                                <td>
                                                    $
                                                    {Number(
                                                        log.amount_changed
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </td>

                                                <td>
                                                    $
                                                    {Number(
                                                        log.balance_after
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </td>

                                                <td>
                                                    $
                                                    {Number(
                                                        log.running_change
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                    {/* NO RESULTS */}

                    {!auditLoading &&
                        auditPatientId &&
                        auditLogs.length === 0 && (
                            <div
                                className="empty"
                                style={{
                                    marginTop:
                                        "30px"
                                }}
                            >
                                No audit records found
                                for the selected
                                patient/date range.
                            </div>
                        )}

                </div>
            )}
{view === "analytics" && (
    <div className="section">
        <h2>Clinic Revenue Analytics</h2>

        {analyticsLoading && (
            <div className="empty">
                Loading analytics...
            </div>
        )}

        {analyticsError && (
            <div className="error">
                {analyticsError}
            </div>
        )}

        {!analyticsLoading &&
            !analyticsError &&
            analyticsData.length > 0 && (
                <>
                    {/* 7-Day Revenue Analytics */}
<div className="analytics-header">
    <div>
        <h3>Monthly Discharge Summary</h3>
        <p>
            Clinic discharge statistics from the
            materialized view.
        </p>
    </div>

    <button
        onClick={refreshDischargeAnalytics}
        disabled={dischargeLoading}
    >
        {dischargeLoading
            ? "Refreshing..."
            : "Refresh Data"}
    </button>
</div>

                    <div className="analytics-table-container">
                        <table className="patient-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Clinic</th>
                                    <th>Date</th>
                                    <th>Daily Revenue</th>
                                    <th>7-Day Average</th>
                                </tr>
                            </thead>

                            <tbody>
                                {analyticsData
                                    .filter((row) => {
                                        const latestDate =
                                            analyticsData.reduce(
                                                (latest, item) =>
                                                    item.revenue_date >
                                                    latest
                                                        ? item.revenue_date
                                                        : latest,
                                                analyticsData[0]
                                                    .revenue_date
                                            );

                                        return (
                                            row.revenue_date ===
                                            latestDate
                                        );
                                    })
                                    .map((row) => (
                                        <tr key={row.clinic_id}>
                                            <td>
                                                <strong>
                                                    #{row.clinic_rank}
                                                </strong>
                                            </td>

                                            <td>
                                                {row.clinic_name}
                                            </td>

                                            <td>
                                                {new Date(
                                                    row.revenue_date
                                                ).toLocaleDateString()}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    row.daily_revenue
                                                ).toFixed(2)}
                                            </td>

                                            <td>
                                                <strong>
                                                    ₹
                                                    {Number(
                                                        row.moving_7_day_average
                                                    ).toFixed(2)}
                                                </strong>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Monthly Discharge Summary */}
                    <div className="analytics-summary">
                        <div className="analytics-header">
                            <div>
                                <h3>Monthly Discharge Summary</h3>
                                <p>
                                    Clinic discharge statistics from the
                                    materialized view.
                                </p>
                            </div>
                        </div>

                        {dischargeLoading && (
                            <div className="empty">
                                Loading discharge summary...
                            </div>
                        )}

                        {dischargeError && (
                            <div className="error">
                                {dischargeError}
                            </div>
                        )}

                        {!dischargeLoading &&
                            !dischargeError &&
                            dischargeData.length > 0 && (
                                <div className="analytics-table-container">
                                    <table className="patient-table">
                                        <thead>
                                            <tr>
                                                <th>Clinic</th>
                                                <th>Month</th>
                                                <th>Total Discharges</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {(() => {
                                                const latestMonth =
                                                    dischargeData.reduce(
                                                        (latest, item) =>
                                                            item.discharge_month >
                                                            latest
                                                                ? item.discharge_month
                                                                : latest,
                                                        dischargeData[0]
                                                            .discharge_month
                                                    );

                                                return dischargeData
                                                    .filter(
                                                        (item) =>
                                                            item.discharge_month ===
                                                            latestMonth
                                                    )
                                                    .sort(
                                                        (a, b) =>
                                                            Number(
                                                                b.total_discharges
                                                            ) -
                                                            Number(
                                                                a.total_discharges
                                                            )
                                                    )
                                                    .map((item) => (
                                                        <tr
                                                            key={
                                                                item.clinic_id
                                                            }
                                                        >
                                                            <td>
                                                                {
                                                                    item.clinic_name
                                                                }
                                                            </td>

                                                            <td>
                                                                {new Date(
                                                                    item.discharge_month
                                                                ).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        month: "long",
                                                                        year: "numeric"
                                                                    }
                                                                )}
                                                            </td>

                                                            <td>
                                                                <strong>
                                                                    {
                                                                        item.total_discharges
                                                                    }
                                                                </strong>
                                                            </td>
                                                        </tr>
                                                    ));
                                            })()}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                    </div>
                </>
            )}

        {!analyticsLoading &&
            !analyticsError &&
            analyticsData.length === 0 && (
                <div className="empty">
                    No analytics data available.
                </div>
            )}
    </div>
)}

        </div>
    );
}

export default App;