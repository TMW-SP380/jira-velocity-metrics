'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { MetricsData } from '@/types'

interface MetricsChartsProps {
  metrics: MetricsData
  isLoading?: boolean
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#a8edea']

export default function MetricsCharts({ metrics, isLoading = false }: MetricsChartsProps) {
  // Debug logging
  console.log('[MetricsCharts] Metrics data:', {
    hasCommitMetrics: !!metrics.commitMetrics,
    commitMetrics: metrics.commitMetrics,
    developerCommits: metrics.commitMetrics?.developerCommits,
    totalCommits: metrics.commitMetrics?.totalCommits
  })

  // Prepare AI usage data
  const aiUsageData = [
    { name: 'With AI', value: metrics.aiMetrics?.timeSavedTotal || 0 },
    { name: 'Without AI', value: (metrics.aiMetrics?.committedStoryPoints || 0) - (metrics.aiMetrics?.timeSavedTotal || 0) }
  ].filter(item => item.value > 0)

  // Prepare developer commits data
  const developerCommitsRaw = metrics.commitMetrics?.developerCommits || {}
  
  // List of invalid/placeholder developer names to filter out
  const invalidNames = ['user', 'your_email@tailoredbrands.com', 'unknown', 'n/a', 'na']
  
  const developerCommitsData = Object.entries(developerCommitsRaw)
    .map(([name, value]) => ({ name, value: Number(value) || 0 }))
    .filter(item => {
      // Filter out invalid/placeholder developer names
      if (item.value <= 0) return false
      
      const name = (item.name || '').trim().toLowerCase()
      
      // Check if name matches any invalid pattern
      if (!name || name === '') return false
      if (invalidNames.includes(name)) return false
      if (name.includes('your_email@tailoredbrands.com')) return false
      
      return true
    })
    .sort((a, b) => b.value - a.value)
  
  console.log('[MetricsCharts] Developer commits data:', developerCommitsData)

  // Prepare story commits data
  const storyCommitsData = Object.entries(metrics.commitMetrics?.storyCommits || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  // Prepare developer story points data
  const developerStoryPointsRaw = metrics.commitMetrics?.developerStoryPoints || {}
  const developerStoryPointsData = Object.entries(developerStoryPointsRaw)
    .map(([name, value]) => ({ name, value: Number(value) || 0 }))
    .filter(item => {
      // Filter out invalid/placeholder developer names (same as commits)
      if (item.value <= 0) return false
      const name = (item.name || '').trim().toLowerCase()
      const invalidNames = ['user', 'your_email@tailoredbrands.com', 'unknown', 'n/a', 'na']
      if (!name || name === '') return false
      if (invalidNames.includes(name)) return false
      if (name.includes('your_email@tailoredbrands.com')) return false
      return true
    })
    .sort((a, b) => b.value - a.value)
  
  console.log('[MetricsCharts] Developer story points data:', developerStoryPointsData)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          padding: '0.75rem',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>
            {payload[0].name}
          </p>
          <p style={{ margin: '0.25rem 0 0 0', color: '#667eea', fontWeight: '600' }}>
            {payload[0].value} {payload[0].name.includes('Commit') ? 'commits' : 'story points'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#2d3748',
          margin: 0
        }}>
          Metrics Dashboard
        </h2>
        {isLoading && (
          <div style={{
            padding: '0.5rem 1rem',
            background: '#e6f3ff',
            color: '#0066cc',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            🔄 Loading new data...
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* AI Usage Metrics */}
        {aiUsageData.length > 0 && (
          <div style={{
            background: '#f7fafc',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              AI Usage Metrics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={aiUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {aiUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'white',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#4a5568'
            }}>
              <p><strong>Time Saved:</strong> {metrics.aiMetrics?.timeSavedTotal || 0} SP</p>
              <p><strong>Time Saved %:</strong> {metrics.aiMetrics?.timeSavedPercent || 0}%</p>
            </div>
          </div>
        )}

        {/* Developer Commits */}
        <div style={{
          background: '#f7fafc',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Developer Commits
          </h3>
          
          {developerCommitsData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={developerCommitsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => {
                      // Truncate long names
                      const displayName = name.length > 15 ? name.substring(0, 12) + '...' : name
                      return `${displayName}: ${(percent * 100).toFixed(1)}%`
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {developerCommitsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Developer Commits Table */}
              <div style={{
                marginTop: '1.5rem',
                background: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr style={{
                      background: '#667eea',
                      color: 'white'
                    }}>
                      <th style={{
                        padding: '0.75rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>Developer</th>
                      <th style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>Commits</th>
                      <th style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {developerCommitsData.map((dev, index) => {
                      const total = developerCommitsData.reduce((sum, d) => sum + d.value, 0)
                      const percent = total > 0 ? ((dev.value / total) * 100).toFixed(1) : 0
                      return (
                        <tr key={dev.name} style={{
                          borderBottom: '1px solid #e2e8f0',
                          background: index % 2 === 0 ? 'white' : '#f7fafc'
                        }}>
                          <td style={{
                            padding: '0.75rem',
                            fontWeight: '500',
                            color: '#2d3748'
                          }}>{dev.name}</td>
                          <td style={{
                            padding: '0.75rem',
                            textAlign: 'right',
                            color: '#667eea',
                            fontWeight: '600'
                          }}>{dev.value}</td>
                          <td style={{
                            padding: '0.75rem',
                            textAlign: 'right',
                            color: '#4a5568'
                          }}>{percent}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#718096'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                No developer commits found
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Commits will appear here when developers make commits referencing sprint tickets.
              </p>
              <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: '#a0aec0' }}>
                Make sure commits reference tickets like: ELECOM-123
              </p>
            </div>
          )}
          
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'white',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#4a5568'
          }}>
            <p><strong>Total Commits:</strong> {metrics.commitMetrics?.totalCommits || 0}</p>
            <p><strong>Stories with Commits:</strong> {metrics.commitMetrics?.storiesWithCommits || 0}</p>
            {metrics.commitMetrics?.totalCommitsScanned && metrics.commitMetrics.totalCommitsScanned > 0 && (
              <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.5rem' }}>
                <strong>Total Commits Scanned:</strong> {metrics.commitMetrics.totalCommitsScanned}
                {metrics.commitMetrics.totalCommitsScanned > (metrics.commitMetrics?.totalCommits || 0) && (
                  <span style={{ display: 'block', marginTop: '0.25rem', color: '#e53e3e', fontSize: '0.8rem' }}>
                    ⚠️ Some commits don't reference sprint tickets
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Developer Story Points */}
      {developerStoryPointsData.length > 0 && (
        <div style={{
          background: '#f7fafc',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          gridColumn: 'span 2'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1rem'
          }}>
            Developer Story Points
          </h3>
          {developerStoryPointsData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={developerStoryPointsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {developerStoryPointsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Developer Story Points Table */}
              <div style={{ marginTop: '1.5rem' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr style={{
                      background: '#667eea',
                      color: 'white'
                    }}>
                      <th style={{
                        padding: '0.75rem',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>Developer</th>
                      <th style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>Story Points</th>
                      <th style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {developerStoryPointsData.map((dev, index) => {
                      const total = developerStoryPointsData.reduce((sum, d) => sum + d.value, 0)
                      const percent = total > 0 ? ((dev.value / total) * 100).toFixed(1) : 0
                      return (
                        <tr key={dev.name} style={{
                          borderBottom: '1px solid #e2e8f0',
                          background: index % 2 === 0 ? 'white' : '#f7fafc'
                        }}>
                          <td style={{
                            padding: '0.75rem',
                            fontWeight: '500',
                            color: '#2d3748'
                          }}>{dev.name}</td>
                          <td style={{
                            padding: '0.75rem',
                            textAlign: 'right',
                            color: '#667eea',
                            fontWeight: '600'
                          }}>{dev.value.toFixed(1)} SP</td>
                          <td style={{
                            padding: '0.75rem',
                            textAlign: 'right',
                            color: '#4a5568'
                          }}>{percent}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#718096'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                No developer story points found
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Story points will appear here when developers work on sprint tickets with story points assigned.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Story Commits Bar Chart */}
      {storyCommitsData.length > 0 && (
        <div style={{
          background: '#f7fafc',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginTop: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Commits by Story (Top 10)
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={storyCommitsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                style={{ fontSize: '0.75rem' }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#667eea" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Stats */}
      <div style={{
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Story Points Committed</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
            {metrics.currentSprint?.committedStoryPoints || 0}
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Story Points Completed</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
            {metrics.currentSprint?.completedStoryPoints || 0}
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Completion Rate</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
            {metrics.currentSprint?.completionRate || 0}%
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Commits</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
            {metrics.commitMetrics?.totalCommits || 0}
          </div>
        </div>
      </div>
    </div>
  )
}
