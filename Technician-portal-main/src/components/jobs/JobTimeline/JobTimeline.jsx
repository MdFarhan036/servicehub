import {
  FiCheck,
  FiCircle
} from "react-icons/fi";

import "./JobTimeline.css";


export default function JobTimeline({ steps = [] }) {

  return (
    <ul className="job-timeline">

      {steps.map((step, index) => {

        const done = Boolean(step?.done);

        const current =
          Boolean(step?.current) && !done;


        return (
          <li
            key={
              step?.id ||
              `${step?.step || "step"}-${index}`
            }
            className={`timeline-item ${
              done ? "done" : ""
            } ${
              current ? "current" : ""
            }`}
          >

            {/* =========================
                TIMELINE DOT
            ========================= */}

            <span className="timeline-dot">

              {done ? (
                <FiCheck />
              ) : (
                <FiCircle />
              )}

            </span>


            {/* =========================
                CONTENT
            ========================= */}

            <div className="timeline-content">

              <p className="timeline-step">
                {step?.step || "—"}
              </p>


              {step?.time && (
                <span className="timeline-time">
                  {step.time}
                </span>
              )}


              {step?.description && (
                <span className="timeline-description">
                  {step.description}
                </span>
              )}

            </div>

          </li>
        );

      })}

    </ul>
  );
}