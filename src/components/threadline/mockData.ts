export const MOCK_CLIENTS = [
  { 
    name: "Liam Alexander O'Sullivan", 
    id: "125566", 
    extId: "C-8891", 
    clinicians: ["Dr. Sarah Jenkins", "Dr. Mark Ronson"], 
    extra: 0, 
    ref: "St. Jude Hospital", 
    last: "May 02, 2026 – 10:00 AM", 
    consent: true,
    hasConflicts: true,
    missingDocs: []
  },
  { 
    name: "Ella Grace Robinson", 
    id: "125570", 
    extId: "C-3349", 
    clinicians: ["Dr. Emily Blunt"], 
    extra: 0, 
    ref: "Family Practice", 
    last: "Apr 18, 2026 – 11:00 AM", 
    consent: true,
    hasConflicts: false,
    missingDocs: []
  },
  { 
    name: "Chloe Isabella Thompson", 
    id: "125567", 
    extId: "C-9012", 
    clinicians: ["Dr. Sarah Jenkins"], 
    extra: 1, 
    ref: "School Counseling", 
    last: "Apr 28, 2026 – 2:30 PM", 
    consent: false,
    hasConflicts: false,
    missingDocs: ["Consent Form", "Referral Letter", "School Reports"]
  },
  { 
    name: "Mia Catherine Henderson", 
    id: "125568", 
    extId: "C-7743", 
    clinicians: ["Dr. Mark Ronson"], 
    extra: 0, 
    ref: "Self-Referral", 
    last: "Apr 25, 2026 – 9:15 AM", 
    consent: true,
    hasConflicts: false,
    missingDocs: ["School Observation"]
  },
  { 
    name: "Sophie Elizabeth Brown", 
    id: "125569", 
    extId: "C-1120", 
    clinicians: ["Dr. Sarah Jenkins", "Dr. Emily Blunt"], 
    extra: 1, 
    ref: "St. Jude Hospital", 
    last: "Apr 20, 2026 – 4:00 PM", 
    consent: false,
    hasConflicts: false,
    missingDocs: ["Consent Form", "Standardized Assessment"]
  },
];

export const MOCK_ASSESSMENTS = [
  { 
    title: "GAD-7 (Generalized Anxiety Disorder)", 
    subtitle: "Feb 10, 2026 • Dr. Sarah Jenkins", 
    status: "completed",
    date: "Feb 10, 2026",
    description: "Evaluates the presence and severity of general anxiety symptoms over the past two weeks.",
    notes: "Client reported improved sleep but sustained anxiety triggers at workplace.",
    overallImpression: "Moderate Anxiety",
    score: "12",
    percentile: "85th",
    descriptor: "Moderate"
  },
  { 
    title: "PHQ-9 (Patient Health Questionnaire)", 
    subtitle: "Mar 15, 2026 • Dr. Mark Ronson", 
    status: "in-progress",
    date: "Mar 15, 2026",
    description: "Multipurpose instrument for screening, diagnosing, monitoring and measuring the severity of depression.",
    notes: "Pending review of items 7 and 8 with client during next session."
  },
  { 
    title: "WAI (Working Alliance Inventory)", 
    subtitle: "Apr 02, 2026 • Dr. Sarah Jenkins", 
    status: "not-started",
    date: "Apr 02, 2026",
    description: "Assesses the therapeutic bond and agreement on therapy goals.",
    notes: "Scheduled for next intake session to establish baseline."
  },
  { 
    title: "ASRS-6 (Adult ADHD Screening)", 
    subtitle: "Jan 20, 2026 • Dr. Emily Blunt", 
    status: "completed",
    date: "Jan 20, 2026",
    description: "Screening scale for adult ADHD based on DSM-V criteria.",
    notes: "Elevated score on inattention subscale. Requires further diagnostic interview.",
    overallImpression: "Highly Likely ADHD",
    score: "5/6",
    percentile: "92nd",
    descriptor: "Significant"
  },
  { 
    title: "DASS-21 (Depression Anxiety Stress Scale)", 
    subtitle: "Scheduled • Dr. Sarah Jenkins", 
    status: "not-started",
    date: "Apr 10, 2026",
    description: "A set of three self-report scales designed to measure the negative emotional states of depression, anxiety and stress.",
    notes: "Baseline assessment for new referral."
  },
];

export const REQUIRED_DOCUMENTS = ['referral-letter', 'parent-questionnaire', 'school-report'];

export const MOCK_DOCUMENTS = [
  { id: "doc-1", name: "School Reports", type: "PDF", version: "Updated 2025-02-10", creationDate: "Mar 15, 2026", uploadDate: "Dec 01, 2026", uploadedAt: "2026-12-01T10:00:00Z", status: "uploaded" },
  { id: "doc-2", name: "Letters", type: "Docs", version: "Version 1.0", creationDate: "Apr 22, 2026", uploadDate: "Jan 18, 2027", uploadedAt: "2027-01-18T14:30:00Z", status: "required", description: "Provides initial context, reason for assessment, and primary concerns identified by the referring professional." },
  { id: "doc-3", name: "Client Digital Journal", type: "Docs", version: "Updated", creationDate: "May 01, 2026", uploadDate: "May 01, 2026", uploadedAt: "2026-05-01T09:00:00Z", status: "required", description: "Personal notes and journal entries documenting the client's daily experiences, thoughts, and reflections on their symptoms." },
  { id: "doc-4", name: "Medical Records", type: "PDF", version: "Initial", creationDate: "Jun 10, 2026", uploadDate: "Jun 12, 2026", uploadedAt: "2026-06-12T11:00:00Z", status: "optional", description: "Past medical history, medications, and physical health records that may relate to psychological functioning." },
  { id: "doc-5", name: "Previous Assessment Results", type: "PDF", version: "Final", creationDate: "Jan 05, 2026", uploadDate: "Jan 10, 2026", uploadedAt: "2026-01-10T11:00:00Z", status: "optional", description: "Results and reports from previously administered psychological or educational assessments." },
];

export const MOCK_EVIDENCE_ITEMS = [
  { label: "Journal Entry", score: "0.92", type: "evidence", sourceDocumentId: "doc-3", sourceDocumentName: "Client Digital Journal", hasConflict: true },
  { label: "Behavioural pattern", score: "0.65", type: "evidence", sourceDocumentId: "doc-1", sourceDocumentName: "School Reports", hasConflict: true },
  { label: "Mood Symptom", score: "0.42", type: "evidence", sourceDocumentId: "doc-2", sourceDocumentName: "Letters", hasConflict: false },
  { label: "Assessment Result", score: "0.95", type: "evidence", hasConflict: false },
  { label: "Depressed mood", score: "0.84", type: "criteria", hasConflict: false },
  { label: "Fear of negative evaluation (Criteria)", score: "0.55", type: "criteria", hasConflict: false },
  { label: "Persistent concern about additional", score: "0.32", type: "criteria", hasConflict: false },
  { label: "Fear of negative evaluation", score: "High", type: "nextstep", impact: "High information gain", hasConflict: false },
  { label: "Severity of depressive symptoms", score: "Medium", type: "nextstep", impact: "Quantifies symptom severity", hasConflict: false },
  { label: "Duration of mood symptoms", score: "Low", type: "nextstep", impact: "Medium", hasConflict: false }
];

export const MOCK_REPORT_MAPPING_IDS = ["Journal Entry", "Mood Symptom", "Assessment Result"];

export const MOCK_CONFLICTS = [
  { id: "c1", description: "Teacher notes contradict parent report on social anxiety" },
  { id: "c2", description: "Journal entry frequency does not match reported symptom severity" }
];

export const MOCK_MISSING_DOCUMENTS = [
  { id: "d1", name: "School Report", description: "Required for comprehensive understanding of academic performance and behavioral patterns in an educational setting." },
  { id: "d2", name: "Referral Letter", description: "Provides initial context, reason for assessment, and primary concerns identified by the referring professional." }
];

export const MOCK_CLIENT_DATA: Record<string, {
  sessions: { date: string, focus: string, notes: string }[],
  assessments: { 
    title: string, 
    subtitle: string, 
    status: string, 
    date?: string, 
    description?: string, 
    notes?: string,
    overallImpression?: string,
    score?: string,
    percentile?: string,
    descriptor?: string
  }[],
  evidence: { type: string, description: string, date: string, label?: string, score?: string, hasConflict?: boolean }[],
  analysis: { thread: string, insight: string }[],
  reports: { title: string, date: string }[],
  conflicts?: { id: string, description: string }[],
  missingDocuments?: { id: string, name: string }[],
  documents?: { id: string, name: string, type: string, version: string, creationDate: string, uploadDate: string, uploadedAt: string | null, status: string }[]
}> = {
  "125566": {
    sessions: [
      { date: "2026-05-02", focus: "Anxiety Management", notes: "Review of GAD-7 results." },
      { date: "2026-05-03", focus: "Cognitive Restructuring", notes: "Addressing negative thought patterns." },
      { date: "2026-05-04", focus: "Exposure Therapy", notes: "Practicing mindfulness in high-anxiety triggers." }
    ],
    assessments: [
      { 
        title: "GAD-7", 
        subtitle: "Feb 10, 2026 • Dr. Sarah Jenkins", 
        status: "completed",
        overallImpression: "Moderate Anxiety",
        score: "12",
        percentile: "85th",
        descriptor: "Moderate"
      },
      { 
        title: "PHQ-9", 
        subtitle: "Mar 15, 2026 • Dr. Mark Ronson", 
        status: "completed",
        overallImpression: "Mild Depression",
        score: "7",
        percentile: "62nd",
        descriptor: "Mild"
      },
      {
        title: "DASS-21",
        subtitle: "Scheduled • Dr. Sarah Jenkins",
        status: "not-started"
      }
    ],
    evidence: [{ type: "Journal", description: "Entry regarding social situations.", date: "2026-05-01", label: "Journal Entry", score: "0.92", hasConflict: true }],
    analysis: [{ thread: "Anxiety", insight: "High social anxiety." }],
    reports: [{ title: "Initial Assessment", date: "2026-04-10" }],
    conflicts: [MOCK_CONFLICTS[0]],
    missingDocuments: [],
    documents: [
      { id: "doc-1", name: "School Reports", type: "PDF", version: "Updated 2025-02-10", creationDate: "Mar 15, 2026", uploadDate: "Dec 01, 2026", uploadedAt: "2026-12-01T10:00:00Z", status: "uploaded" },
      { id: "doc-4", name: "Medical Records", type: "PDF", version: "Initial", creationDate: "Jun 10, 2026", uploadDate: "Jun 12, 2026", uploadedAt: "2026-06-12T11:00:00Z", status: "optional" }
    ]
  },
  "125567": {
    sessions: [],
    assessments: [
      { title: "GAD-7", subtitle: "Scheduled • Dr. Sarah Jenkins", status: "not-started" },
      { title: "PHQ-9", subtitle: "Scheduled • Dr. Sarah Jenkins", status: "not-started" },
      { title: "WAI", subtitle: "Scheduled • Dr. Sarah Jenkins", status: "not-started" }
    ],
    evidence: [],
    analysis: [],
    reports: [],
    conflicts: [],
    missingDocuments: [
      { id: "md-chloe-1", name: "Consent Form" },
      { id: "md-chloe-2", name: "Referral Letter" },
      { id: "md-chloe-3", name: "School Reports" }
    ],
    documents: [
      { id: "doc-chloe-1", name: "School Reports", type: "PDF", version: "-", creationDate: "-", uploadDate: "-", uploadedAt: null, status: "required" },
      { id: "doc-chloe-2", name: "Consent Form", type: "Docs", version: "-", creationDate: "-", uploadDate: "-", uploadedAt: null, status: "required" },
      { id: "doc-chloe-3", name: "Referral Letter", type: "Docs", version: "-", creationDate: "-", uploadDate: "-", uploadedAt: null, status: "required" }
    ]
  },
  "125568": {
    sessions: [{ date: "2026-04-25", focus: "Self-Harm Prevention", notes: "Safety planning updated." }],
    assessments: [
      { title: "PHQ-9", subtitle: "Mar 20, 2026 • Dr. Mark Ronson", status: "completed" },
      { title: "DASS-21", subtitle: "Ongoing • Dr. Sarah Jenkins", status: "in-progress" }
    ],
    evidence: [{ type: "Safety Plan", description: "Updated checklist.", date: "2026-04-24" }],
    analysis: [{ thread: "Mood", insight: "Low mood persists." }],
    reports: [{ title: "Safety Progress", date: "2026-04-22" }],
    conflicts: [],
    missingDocuments: [MOCK_MISSING_DOCUMENTS[0]],
    documents: [
      { id: "doc-125568-1", name: "Medical Records", type: "PDF", version: "V2", creationDate: "2026-01-01", uploadDate: "2026-01-02", uploadedAt: "2026-01-02T10:00:00Z", status: "optional" }
    ]
  },
  "125569": {
    sessions: [{ date: "2026-04-20", focus: "ADHD Management", notes: "Coping with distractibility." }],
    assessments: [{ title: "ASRS-6", subtitle: "Jan 20, 2026 • Dr. Emily Blunt", status: "completed" }],
    evidence: [{ type: "Focus Log", description: "Tracked productive hours.", date: "2026-04-19" }],
    analysis: [{ thread: "Focus", insight: "Morning productivity is higher." }],
    reports: [{ title: "Baseline Report", date: "2026-04-05" }],
    conflicts: [],
    missingDocuments: [MOCK_MISSING_DOCUMENTS[0], MOCK_MISSING_DOCUMENTS[1]]
  },
  "125570": {
    sessions: [
      { date: "2026-04-18", focus: "Goal Setting", notes: "Setting SMART goals." },
      { date: "2026-04-20", focus: "Implementation", notes: "Starting daily checklists." },
      { date: "2026-04-22", focus: "Review", notes: "Adjusting goals based on feedback." }
    ],
    assessments: [
      { title: "WAI", subtitle: "Apr 15, 2026 • Dr. Emily Blunt", status: "completed" },
      { title: "ASRS-6", subtitle: "Apr 16, 2026 • Dr. Emily Blunt", status: "completed" }
    ],
    evidence: [{ type: "Goal Sheet", description: "Weekly task list.", date: "2026-04-17", label: "Goal Sheet", score: "0.95" }],
    analysis: [{ thread: "Motivation", insight: "Strong internal motivation." }],
    reports: [{ title: "Treatment Plan", date: "2026-04-01" }],
    conflicts: [],
    missingDocuments: []
  }
};
