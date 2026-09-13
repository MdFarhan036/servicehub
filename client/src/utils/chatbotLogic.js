// Simple rule-based bot logic (frontend-only, no backend yet)

export function getBotReply(optionId) {
  switch (optionId) {
    case "booking-help":
      return "Sure! To help with a booking, please share the Job ID (e.g. JB-2291) or tell me what issue you're facing.";
    case "track-booking":
      return "You can track any job's live status from the Jobs tab, or tell me the Job ID here and I'll pull it up.";
    case "cancel-reschedule":
      return "To cancel or reschedule a job, share the Job ID and the new date/time you'd prefer, or say 'cancel' to cancel it.";
    case "photo-upload":
      return "Great — please attach the photo using the upload button below. Accepted formats: JPG, PNG, WEBP (max 10MB).";
    case "video-upload":
      return "Please attach the video using the upload button below. Accepted formats: MP4, MOV, WEBM (max 10MB).";
    case "talk-to-agent":
      return "Connecting you to a human agent... (this is a demo — no backend is connected yet). An agent typically replies within 5 minutes.";
    default:
      return "Got it! Our support team will follow up shortly.";
  }
}

export function getTextReply(userText) {
  const text = userText.toLowerCase();

  if (text.includes("job") && /jb-\d+/.test(text)) {
    const id = text.match(/jb-\d+/)[0].toUpperCase();
    return `Looking up ${id}... this is a demo response — once the backend is connected, I'll show real-time status here.`;
  }
  if (text.includes("cancel")) {
    return "I understand you'd like to cancel. Please confirm the Job ID and I'll process the cancellation once support is connected.";
  }
  if (text.includes("reschedule")) {
    return "No problem — share the new preferred date and time along with the Job ID.";
  }
  if (text.includes("earning") || text.includes("payment")) {
    return "You can check all your payments in the Earnings tab. Payments are usually credited within 24 hours of job completion.";
  }
  if (text.includes("hi") || text.includes("hello")) {
    return "Hello! How can I assist you today?";
  }
  return "Thanks for the message! A support agent will review this shortly. You can also use the quick options below.";
}
