import { FiMessageCircle } from "react-icons/fi";
import "./Support.css";

// Full-page support entry point. The main chat experience is the
// floating ChatbotButton + ChatbotWindow available on every technician page.
export default function Support() {
  return (
    <div className="support-page card">
      <FiMessageCircle className="support-icon" />
      <h2>Need Help?</h2>
      <p className="text-gray">
        Use the chat icon in the bottom-right corner on any page to talk to ServiceHub
        Assistant — get booking help, track a job, reschedule, or upload photos/videos.
      </p>
    </div>
  );
}
