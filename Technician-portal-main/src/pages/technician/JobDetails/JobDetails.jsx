import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiMail,
  FiUser,
  FiClock,
  FiFileText,
  FiTool,
  FiCreditCard,
  FiCheckCircle,
  FiShield
} from "react-icons/fi";

import API from "../../../services/api";

import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import Button from "../../../components/common/Button/Button";
import JobTimeline from "../../../components/jobs/JobTimeline/JobTimeline";

import "./JobDetails.css";


export default function JobDetails() {

  const params = useParams();
  const navigate = useNavigate();


  /* =========================
     BOOKING ID
  ========================= */

  const id =
    params.id ||
    params.bookingId;


  /* =========================
     STATE
  ========================= */

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] =
    useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationGenerated, setVerificationGenerated] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [verificationExpires, setVerificationExpires] = useState(null);
const [verificationMobile, setVerificationMobile] = useState("");
  /* =========================
     FETCH JOB
  ========================= */

  const fetchJob = async () => {

    if (!id) {

      setError("Booking ID is missing.");
      setLoading(false);

      return;
    }


    try {

      setLoading(true);
      setError("");


      const res = await API.get(
        `/bookings/technician/my-jobs/${id}`
      );


      /*
        Backend may return:

        booking object

        OR

        { job: {...} }
      */

      const jobData =
        res.data?.job ||
        res.data;


      setJob(jobData);

      /*
       * Keep local verification UI synchronized with
       * the latest booking state from the server.
       */
      const latestCustomerVerified =
        Number(jobData?.customer_verified) === 1 ||
        jobData?.customer_verified === true ||
        String(jobData?.customer_verified).toLowerCase() === "true" ||
        Boolean(jobData?.customer_verified_at);

      if (latestCustomerVerified) {
        setVerificationGenerated(false);
        setVerificationCode("");
        setVerificationExpires(false);
        setVerificationError("");
      }

    } catch (err) {

      console.error(
        "Failed to load job:",
        err
      );


      setError(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Failed to load job details."
      );


      setJob(null);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchJob();

  }, [id]);


  /* =========================
     NORMALIZED DATA
  ========================= */

  const status = String(
    job?.status || ""
  )
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");


  const customerName =
    job?.customer_name ||
    job?.user_name ||
    job?.name ||
    "—";


  const customerEmail =
    job?.customer_email ||
    job?.user_email ||
    job?.email ||
    "—";


  const customerPhone =
    job?.customer_phone ||
    job?.phone ||
    "—";


  const customerCity =
    job?.customer_city ||
    job?.city ||
    "—";


  const serviceName =
    job?.service_name ||
    job?.service ||
    "—";


  const bookingDate =
    job?.booking_date ||
    job?.date ||
    "—";


  const bookingTime =
    job?.booking_time ||
    job?.time ||
    "—";


  const address =
    job?.address ||
    "No address provided";


  const notes =
    job?.notes ||
    "No additional notes provided.";


  const bookingId =
    job?.id ||
    job?.booking_id ||
    id;


  /* =========================
     PRICE
  ========================= */

  const price =
    job?.price ??
    job?.amount ??
    job?.total_amount ??
    null;


  /* =========================
     PAYMENT
  ========================= */

  const paymentStatus = String(
    job?.payment_status ||
    job?.paymentStatus ||
    ""
  )
    .toLowerCase()
    .trim();


  const paymentPaid =
    paymentStatus === "paid" ||
    paymentStatus === "success" ||
    paymentStatus === "successful" ||
    paymentStatus === "completed";


  const paymentPending =
    !paymentPaid;


  /* =========================
     CUSTOMER VERIFICATION
  ========================= */

const customerVerified =
  Number(job?.customer_verified) === 1 ||
  job?.customer_verified === true ||
  String(job?.customer_verified).toLowerCase() === "true" ||
  Boolean(job?.customer_verified_at);
  /* =========================
     ASSIGNMENT
  ========================= */

  const technicianAssigned =
    Boolean(
      job?.technician_id ||
      job?.technicianId
    );


  /* =========================
     JOB STATES
  ========================= */

  const jobStarted =
    status === "in_progress";


  const jobCompleted =
    status === "completed";


  /* =========================
     TIMELINE
  ========================= */

  const timelineSteps = useMemo(() => {

    return [

      {
        step: "Booking Created",
        time: job?.created_at || "",
        done: true
      },


      {
        step: "Payment Verified",
        time:
          job?.payment_verified_at ||
          "",
        done: paymentPaid
      },


      {
        step: "Technician Assigned",
        time:
          job?.assigned_at ||
          "",
        done: technicianAssigned
      },


      {
        step: "Customer Verified",
        time:
          job?.customer_verified_at ||
          "",
        done: customerVerified,
        current:
          !customerVerified &&
          !jobStarted &&
          !jobCompleted
      },


      {
        step: "Job Started",
        time:
          job?.started_at ||
          "",
        done:
          jobStarted ||
          jobCompleted,
        current:
          jobStarted
      },


      {
        step: "Job Completed",
        time:
          job?.completed_at ||
          "",
        done: jobCompleted
      }

    ];

  }, [
    job,
    paymentPaid,
    technicianAssigned,
    customerVerified,
    jobStarted,
    jobCompleted
  ]);


  /* =========================
     UPDATE STATUS
  ========================= */

  const updateStatus = async (newStatus) => {

    if (!id) {

      alert(
        "Booking ID is missing."
      );

      return;
    }


    try {

      setActionLoading(true);


      await API.put(
        `/bookings/technician/my-jobs/${id}/status`,
        {
          status: newStatus
        }
      );


      await fetchJob();

    } catch (err) {

      console.error(
        "Failed to update job:",
        err
      );


      alert(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Failed to update job."
      );

    } finally {

      setActionLoading(false);

    }
  };
  /* =========================
     GENERATE CUSTOMER CODE
  ========================= */
const generateVerificationCode = async () => {
  if (!id) {
    setVerificationError("Booking ID is missing.");
    return;
  }

  /*
   * NEVER generate another code if the current
   * booking is already verified.
   */
  if (
    Number(job?.customer_verified) === 1 ||
    job?.customer_verified === true ||
    String(job?.customer_verified).toLowerCase() === "true" ||
    Boolean(job?.customer_verified_at)
  ) {
    console.log(
      "Customer already verified. Skipping code generation."
    );

    setVerificationGenerated(false);
    setVerificationCode("");
    setVerificationExpires(false);
    setVerificationError("");

    return;
  }

  try {
    setVerificationLoading(true);
    setVerificationError("");

    const res = await API.post(
      `/bookings/technician/my-jobs/${id}/customer-verification`
    );

    console.log(
      "Verification code response:",
      res.data
    );

    if (res.data?.success) {

      /*
       * Backend sends the masked customer mobile
       * after successfully generating the OTP.
       */
      setVerificationMobile(
        res.data.mobile || job?.phone || ""
      );

      setVerificationGenerated(true);

      setVerificationCode("");

      setVerificationExpires(
        true
      );
    }

  } catch (err) {

    console.error(
      "Failed to generate verification code:",
      err.response?.status,
      err.response?.data,
      err
    );

    /*
     * Backend says customer is already verified.
     * Refresh the booking so the UI gets the
     * latest customer_verified value.
     */
    if (
      err.response?.status === 400 &&
      err.response?.data?.msg ===
        "Customer is already verified"
    ) {

      setVerificationGenerated(false);
      setVerificationCode("");
      setVerificationExpires(false);
      setVerificationError("");

      await fetchJob();

      return;
    }

    setVerificationError(
      err.response?.data?.msg ||
      err.response?.data?.message ||
      "Failed to send verification code."
    );

  } finally {
    setVerificationLoading(false);
  }
};
  /* =========================
     VERIFY CUSTOMER CODE
  ========================= */

  const verifyCustomer = async () => {
    const code = verificationCode.trim();

    if (!code) {
      setVerificationError(
        "Please enter the customer verification code."
      );
      return;
    }

    try {
      setVerificationLoading(true);
      setVerificationError("");

      const res = await API.post(
        `/bookings/technician/my-jobs/${id}/customer-verification/verify`,
        {
          verification_code: code
        }
      );

      console.log(
        "Customer verification response:",
        res.data
      );

      /* =========================
         SUCCESS
      ========================= */

      if (res.data?.success) {

        setVerificationGenerated(false);

        setVerificationCode("");

        setVerificationExpires(false);

        setVerificationError("");

        /* Refresh booking */
        await fetchJob();

        return;
      }

    } catch (err) {

      console.error(
        "Customer verification failed:",
        err.response?.status,
        err.response?.data,
        err
      );

      setVerificationError(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Customer verification failed."
      );

    } finally {

      setVerificationLoading(false);

    }
  };

  /* =========================
     START JOB
  ========================= */
  const startJob = async () => {

    if (!customerVerified) {

      alert(
        "Customer verification is required before starting the job."
      );

      return;
    }

    await updateStatus(
      "in_progress"
    );
  };

  /* =========================
     COMPLETE JOB
  ========================= */

  const completeJob = async () => {

    if (status !== "in_progress") {

      alert(
        "The job must be in progress before it can be completed."
      );

      return;
    }


    await updateStatus(
      "completed"
    );
  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (
      <div className="job-details">

        <div className="card">
          Loading job details...
        </div>

      </div>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error || !job) {

    return (
      <div className="job-details">

        <button
          className="back-link"
          onClick={() =>
            navigate("/jobs")
          }
        >
          <FiArrowLeft />
          Back to Jobs
        </button>


        <div className="card">

          <p>
            {error || "Job not found."}
          </p>


          <Button
            onClick={() =>
              navigate("/jobs")
            }
          >
            Back to Jobs
          </Button>

        </div>

      </div>
    );
  }


  return (
    <div className="job-details">

      {/* =========================
          BACK
      ========================= */}

      <button
        className="back-link"
        onClick={() =>
          navigate("/jobs")
        }
      >
        <FiArrowLeft />
        Back to Jobs
      </button>


      {/* =========================
          HEADER
      ========================= */}

      <div className="job-details-header card">

        <div>

          <h2>
            {serviceName}
          </h2>


          <span className="job-id">
            Booking #{bookingId}
          </span>

        </div>


        <StatusBadge
          status={job.status}
        />

      </div>


      <div className="job-details-grid">

        {/* =========================
            MAIN
        ========================= */}

        <div className="job-details-main card">

          <div className="jd-tabs">

            <button className="active">
              Overview
            </button>

          </div>


          <div className="jd-overview">

            {/* =========================
                CUSTOMER
            ========================= */}

            <div className="jd-section">

              <h4>
                <FiUser />
                Customer Information
              </h4>


              <div className="jd-info-grid">

                <div>

                  <span>
                    Customer Name
                  </span>

                  <strong>
                    {customerName}
                  </strong>

                </div>


                <div>

                  <span>
                    Email
                  </span>

                  <strong>
                    {customerEmail}
                  </strong>

                </div>


                <div>

                  <span>
                    Phone
                  </span>

                  <strong>
                    {customerPhone}
                  </strong>

                </div>


                <div>

                  <span>
                    City
                  </span>

                  <strong>
                    {customerCity}
                  </strong>

                </div>

              </div>

            </div>


            {/* =========================
                SERVICE
            ========================= */}

            <div className="jd-section">

              <h4>
                <FiTool />
                Service Information
              </h4>


              <div className="jd-info-grid">

                <div>

                  <span>
                    Service
                  </span>

                  <strong>
                    {serviceName}
                  </strong>

                </div>


                <div>

                  <span>
                    Booking ID
                  </span>

                  <strong>
                    #{bookingId}
                  </strong>

                </div>


                {price !== null && (
                  <div>

                    <span>
                      Amount
                    </span>

                    <strong>
                      ₹{price}
                    </strong>

                  </div>
                )}

              </div>

            </div>


            {/* =========================
                APPOINTMENT
            ========================= */}

            <div className="jd-section">

              <h4>
                <FiCalendar />
                Appointment
              </h4>


              <div className="jd-info-grid">

                <div>

                  <span>
                    Date
                  </span>

                  <strong>
                    {bookingDate}
                  </strong>

                </div>


                <div>

                  <span>
                    Time
                  </span>

                  <strong>
                    {bookingTime}
                  </strong>

                </div>

              </div>

            </div>


            {/* =========================
                LOCATION
            ========================= */}

            <div className="jd-section">

              <h4>
                <FiMapPin />
                Service Location
              </h4>


              <p className="jd-address">
                {address}
              </p>

            </div>


            {/* =========================
                PHONE
            ========================= */}

            <div className="jd-section">

              <h4>
                <FiPhone />
                Customer Phone
              </h4>


              <p className="jd-address">
                {customerPhone}
              </p>

            </div>


            {/* =========================
                NOTES
            ========================= */}

            <div className="jd-section">

              <h4>
                <FiFileText />
                Customer Notes
              </h4>


              <p className="jd-notes">
                {notes}
              </p>

            </div>


            {/* =========================
                PAYMENT
            ========================= */}

            <div className="jd-section">

              <h4>
                <FiCreditCard />
                Payment
              </h4>


              <div className="jd-verification-box">

                <div>

                  <span>
                    Payment Status
                  </span>

                  <strong
                    className={
                      paymentPaid
                        ? "jd-success"
                        : "jd-warning"
                    }
                  >
                    {paymentPaid
                      ? "✓ Payment Verified"
                      : "Payment Pending"}
                  </strong>

                </div>


                {job?.payment_verified_at && (

                  <div>

                    <span>
                      Verified At
                    </span>

                    <strong>
                      {job.payment_verified_at}
                    </strong>

                  </div>

                )}

              </div>

            </div>


            {/* =========================
    CUSTOMER VERIFICATION
========================= */}

            <div className="jd-section">

              <h4>
                <FiShield />
                Customer Verification
              </h4>


              <div className="jd-verification-box">

                {/* =========================
        VERIFIED
    ========================= */}

                {customerVerified ? (

                  <>

                    <div>

                      <span>
                        Verification Status
                      </span>

                      <strong className="jd-success">
                        ✓ Customer Verified
                      </strong>

                    </div>


                    {job?.customer_verified_at && (

                      <div>

                        <span>
                          Verified At
                        </span>

                        <strong>
                          {job.customer_verified_at}
                        </strong>

                      </div>

                    )}

                  </>

                ) : (

                  /* =========================
                     NOT VERIFIED
                  ========================= */

                  <>

                    <div>

                      <span>
                        Verification Status
                      </span>

                      <strong className="jd-warning">
                        Customer Not Verified
                      </strong>

                    </div>


                    {/* =========================
            GENERATE CODE
        ========================= */}

                    {!customerVerified &&
                      !verificationGenerated && (

                        <Button
                          fullWidth
                          disabled={verificationLoading}
                          onClick={generateVerificationCode}
                        >
                          {verificationLoading
                            ? "Checking..."
                            : "Generate Verification Code"}
                        </Button>

                      )}

                    {/* =========================
            ENTER CODE
        ========================= */}

                    {verificationGenerated &&
                      !customerVerified && (
<div className="customer-verification-form">

  {/* =========================
      CODE SENT MESSAGE
  ========================= */}

  {verificationGenerated && (

    <div className="verification-sent-message">

      <strong>
        Verification code sent
      </strong>

      <span>
        Code sent to{" "}
        <strong>
          {verificationMobile || "customer mobile"}
        </strong>
      </span>

    </div>

  )}


  <label>
    Enter Customer Verification Code
  </label>


  <input
    type="text"
    inputMode="numeric"
    maxLength={6}
    value={verificationCode}
    onChange={(e) => {

      const value =
        e.target.value
          .replace(/\D/g, "")
          .slice(0, 6);

      setVerificationCode(value);

      setVerificationError("");

    }}
    placeholder="Enter 6-digit code"
    disabled={
      verificationLoading
    }
  />


  {verificationExpires && (

    <small>
      Code expires in 10 minutes.
    </small>

  )}


  <button
    type="button"
    onClick={verifyCustomer}
    disabled={
      verificationLoading ||
      verificationCode.length !== 6
    }
  >

    {verificationLoading
      ? "Verifying..."
      : "Verify Customer"}

  </button>


  {verificationError && (

    <p className="verification-error">
      {verificationError}
    </p>

  )}

</div>

                    )}

                  </>

                )}

              </div>

            </div>


            {/* =========================
                TIMELINE
            ========================= */}

            <div className="jd-section">

              <h4>
                <FiClock />
                Booking Timeline
              </h4>


              <JobTimeline
                steps={timelineSteps}
              />

            </div>


            {/* =========================
                BOOKING INFORMATION
            ========================= */}

            <div className="jd-section">

              <h4>
                <FiClock />
                Booking Information
              </h4>


              <div className="jd-info-grid">

                <div>

                  <span>
                    Booking Created
                  </span>

                  <strong>
                    {job.created_at || "—"}
                  </strong>

                </div>


                <div>

                  <span>
                    Status
                  </span>

                  <strong>
                    {job.status || "—"}
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =========================
            SIDE ACTIONS
        ========================= */}

        <div className="job-details-side card">

          <h4>
            Job Actions
          </h4>


          {/* =========================
              PAYMENT WARNING
          ========================= */}

          {paymentPending &&
            !jobCompleted && (

              <div className="jd-action-warning">

                <FiCreditCard />

                <span>
                  Payment has not been verified.
                </span>

              </div>

            )}


          {/* =========================
              START JOB
          ========================= */}

          {[
            "pending",
            "confirmed",
            "assigned"
          ].includes(status) &&
            technicianAssigned &&
            customerVerified &&
            !jobStarted &&
            !jobCompleted && (

              <Button
                fullWidth
                disabled={actionLoading}
                onClick={startJob}
              >
                {actionLoading
                  ? "Starting..."
                  : "Start Job"}
              </Button>

            )}


          {/* =========================
              COMPLETE JOB
          ========================= */}

          {status === "in_progress" && (

            <Button
              fullWidth
              disabled={
                actionLoading
              }
              onClick={
                completeJob
              }
            >

              {actionLoading
                ? "Completing..."
                : "Mark as Completed"}

            </Button>

          )}


          {/* =========================
              COMPLETED
          ========================= */}

          {jobCompleted && (

            <div className="jd-completed">

              <FiCheckCircle />

              <strong>
                Job Completed
              </strong>

              <span>
                This booking has been completed.
              </span>

            </div>

          )}


          {/* =========================
              CALL CUSTOMER
          ========================= */}

          {customerPhone !== "—" && (

            <a
              href={`tel:${customerPhone}`}
              className="job-call-btn"
            >
              <FiPhone />
              Call Customer
            </a>

          )}


          {/* =========================
              EMAIL CUSTOMER
          ========================= */}

          {customerEmail !== "—" && (

            <a
              href={`mailto:${customerEmail}`}
              className="job-call-btn"
            >
              <FiMail />
              Email Customer
            </a>

          )}

        </div>

      </div>

    </div>
  );
}