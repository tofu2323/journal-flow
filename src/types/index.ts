export interface JournalEntry {
  id: string;
  type: JournalType;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

export type JournalType = 
  | 'formal-practice'
  | 'informal-practice' 
  | 'pleasant-event'
  | 'unpleasant-event'
  | 'difficult-communication';

export interface FormalPracticeEntry extends JournalEntry {
  type: 'formal-practice';
  practiceType: string;
  duration: number;
  insights: string;
}

export interface InformalPracticeEntry extends JournalEntry {
  type: 'informal-practice';
  practiceType: string;
  duration: number;
  insights: string;
}

export interface PleasantEventEntry extends JournalEntry {
  type: 'pleasant-event';
  event: string;
  awarenessAtTime: boolean;
  bodyFeelings: string;
  moodAndThoughts: string;
  currentThoughts: string;
}

export interface UnpleasantEventEntry extends JournalEntry {
  type: 'unpleasant-event';
  event: string;
  awarenessAtTime: boolean;
  bodyFeelings: string;
  moodAndThoughts: string;
  currentThoughts: string;
}

export interface DifficultCommunicationEntry extends JournalEntry {
  type: 'difficult-communication';
  content: string;
  person: string;
  problemOrigin: string;
  myDesire: string;
  whatIGot: string;
  theirDesire: string;
  whatTheyGot: string;
  feelings: string;
  resolved: boolean;
  resolution: string;
}