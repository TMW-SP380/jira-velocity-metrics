export interface Board {
  id: string
  name: string
  projectKey: string
}

export interface AIMetrics {
  committedStoryPoints: number
  completedStoryPoints: number
  timeSavedTotal: number
  timeSavedPercent: number
  aiStoryPointsCommitted: number
}

export interface CommitMetrics {
  totalCommits: number
  storiesWithCommits: number
  developerCommits: Record<string, number>
  storyCommits: Record<string, number>
  developerStoryPoints?: Record<string, number>
}

export interface CurrentSprint {
  sprintName: string
  committedStoryPoints: number
  completedStoryPoints: number
  completionRate: number
  defectCount: number
}

export interface MetricsData {
  currentSprint: CurrentSprint
  aiMetrics: AIMetrics | null
  commitMetrics: CommitMetrics | null
}
