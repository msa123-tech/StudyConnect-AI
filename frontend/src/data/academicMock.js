/**
 * Mock academic data for Academic Snapshot and Course Context.
 * Communicates "academic intelligence" in the UI without backend changes.
 */

export const dashboardAcademicSnapshot = {
  upcomingAssignment: {
    courseCode: "CS483",
    title: "Homework 3",
    dueIn: "2 days",
  },
  upcomingExam: {
    courseCode: "CS550",
    title: "Midterm",
    in: "1 week",
  },
  aiStudySuggestion: {
    courseCode: "CS483",
    text: "Focus on graph traversal and dynamic programming concepts for CS483.",
  },
};

/**
 * Get course-level mock context. Can key by courseId later for variety.
 * Uses real description when provided.
 */
export function getCourseContextMock(
  courseId,
  courseName = "",
  courseCode = "",
  description = "",
) {
  return {
    description:
      description ||
      (courseName
        ? `${courseName} covers core concepts and prepares you for advanced topics.`
        : "Course materials and collaboration hub."),
    currentTopic: "Divide and Conquer · Recurrence Relations",
    nextDeadline: "Problem set due in 5 days",
    aiInsight: {
      text: "Students in this course are actively discussing divide and conquer techniques. Would you like a quick summary?",
      cta: "Get summary",
    },
  };
}
