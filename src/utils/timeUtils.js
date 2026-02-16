export function getTimeRemaining(deadline, createdAt) {
  const now = new Date();
  const end = new Date(deadline);
  const start = new Date(createdAt);

  const totalDuration = end - start;
  const remaining = end - now;

  const totalMinutes = Math.floor(Math.abs(remaining) / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (remaining <= 0) {
    return {
      status: "overdue",
      hours,
      minutes,
      urgencyLevel: 3
    };
  }

  const progress = remaining / totalDuration;

  let urgencyLevel = 0;

  // Absolute urgency thresholds
  if (totalMinutes <= 10) {
    urgencyLevel = 3;
  } else if (totalMinutes <= 60) {
    urgencyLevel = 2;
  } else if (progress < 0.25) {
    urgencyLevel = 2;
  } else if (progress < 0.5) {
    urgencyLevel = 1;
  }

  return {
    status: "active",
    hours,
    minutes,
    urgencyLevel
  };
}
