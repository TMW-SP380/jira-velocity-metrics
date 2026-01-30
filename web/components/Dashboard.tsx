'use client'

import { useState, useEffect } from 'react'
import BoardSelector from './BoardSelector'
import MetricsCharts from './MetricsCharts'
import { fetchMetrics, checkAuthStatus, logout as apiLogout } from '@/lib/api'
import type { Board, MetricsData } from '@/types'

// Static boards list
const STATIC_BOARDS: Board[] = [
  {
    id: '58',
    name: 'Rental Discovery & Selection Squad',
    projectKey: 'ELECOM'
  },
  {
    id: '56',
    name: 'Search And Nav Board',
    projectKey: 'ELECOM'
  },
  {
    id: '284',
    name: 'Design System Team',
    projectKey: 'RFW'
  },
  {
    id: '47',
    name: 'Product Discovery-ECOM',
    projectKey: 'ELECOM'
  },
  {
    id: '50',
    name: 'Cart & Checkout',
    projectKey: 'ELECOM'
  }
]

export default function Dashboard() {
  const [boards] = useState<Board[]>(STATIC_BOARDS)
  const [selectedBoard, setSelectedBoard] = useState<string>(STATIC_BOARDS[0]?.id || '')
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [cachedMetrics, setCachedMetrics] = useState<MetricsData | null>(null) // Show previous while loading
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [refreshing, setRefreshing] = useState(false) // Background refresh in progress
  const [newDataReady, setNewDataReady] = useState(false) // New data available notification
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  // Check authentication on mount (optional - only if OAuth is configured)
  // If OAuth is not configured, the app will use .env credentials automatically
  useEffect(() => {
    // Only check auth status if OAuth might be configured
    // If it fails or returns not authenticated, we'll use .env credentials
    checkAuthStatus().then((status) => {
      if (status.authenticated && status.user) {
        setUser(status.user)
      }
      // Don't redirect - allow app to work with .env credentials
    }).catch(() => {
      // If auth check fails, continue with .env credentials
    })
  }, []) // Empty dependency array - only run on mount

  // Set default selected board on mount only - no automatic report generation
  useEffect(() => {
    // Set default selected board on mount
    if (STATIC_BOARDS.length > 0 && !selectedBoard) {
      setSelectedBoard(STATIC_BOARDS[0].id)
    }
    // Don't auto-load data - wait for user to click Generate Report button
  }, [])

  const handleLogout = async () => {
    try {
      await apiLogout()
      // Only redirect if OAuth was being used
      if (user) {
        window.location.reload()
      }
    } catch (err: any) {
      console.error('Error logging out:', err)
    }
  }

  const handleGenerateReport = async () => {
    if (!selectedBoard) {
      setError('Please select a board')
      return
    }

    // Save current metrics as cached/previous to show while loading
    if (metrics) {
      setCachedMetrics(metrics)
    }

    setLoading(true)
    setError(null)
    setNewDataReady(false)
    setRefreshing(true)

    try {
      console.log('Generating report for board:', selectedBoard)
      // Force refresh by adding refresh parameter
      const metricsData = await fetchMetrics(`${selectedBoard}?refresh=true`)
      console.log('Metrics received:', metricsData)
      setMetrics(metricsData)
      setCachedMetrics(null) // Clear cached after new data arrives
      setNewDataReady(true)
      // Auto-hide notification after 5 seconds
      setTimeout(() => setNewDataReady(false), 5000)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate report'
      console.error('Error generating report:', err)
      
      // Don't redirect on auth errors - allow .env credentials to work
      if (errorMessage === 'AUTH_REQUIRED' || err.response?.status === 401) {
        console.log('Auth error - will try with .env credentials if available')
        // Continue to show error but don't redirect
      }
      
      setError(errorMessage)
      // Restore cached metrics on error
      if (cachedMetrics) {
        setMetrics(cachedMetrics)
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!metrics && !cachedMetrics) {
      setError('Please generate a report first')
      return
    }

    setDownloadingPDF(true)
    setError(null)

    try {
      // Dynamically import html2canvas and jspdf with error handling
      let html2canvas, jsPDF
      try {
        html2canvas = (await import('html2canvas')).default
        jsPDF = (await import('jspdf')).jsPDF
      } catch (importError) {
        throw new Error('PDF libraries not loaded. Please run: cd web && npm install')
      }

      // Get the dashboard content element
      const dashboardElement = document.getElementById('dashboard-content')
      if (!dashboardElement) {
        throw new Error('Dashboard content not found')
      }

      // Capture the dashboard as canvas
      const canvas = await html2canvas(dashboardElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: dashboardElement.scrollWidth,
        height: dashboardElement.scrollHeight
      })

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgScaledWidth = imgWidth * ratio
      const imgScaledHeight = imgHeight * ratio

      // Calculate how many pages we need
      const pageHeight = imgScaledHeight
      let heightLeft = imgScaledHeight
      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgScaledWidth, imgScaledHeight)
      heightLeft -= pdfHeight

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgScaledHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgScaledWidth, imgScaledHeight)
        heightLeft -= pdfHeight
      }

      // Generate filename
      const boardName = boards.find(b => b.id === selectedBoard)?.name || 'Report'
      const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '')
      const filename = `${boardName}_velocity_report_${timestamp}.pdf`

      // Download PDF
      pdf.save(filename)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate PDF'
      console.error('Error generating PDF:', err)
      
      // If html2canvas fails, suggest installing dependencies
      if (errorMessage.includes('html2canvas') || errorMessage.includes('chunk')) {
        setError('PDF generation requires html2canvas. Please run: cd web && npm install && npm run build')
      } else {
        setError(errorMessage)
      }
    } finally {
      setDownloadingPDF(false)
    }
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div id="dashboard-content">
        <header style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#1a202c',
                marginBottom: '0.5rem'
              }}>
                Jira Velocity Dashboard
              </h1>
              <p style={{ color: '#718096', fontSize: '1.1rem' }}>
                AI Usage Metrics & Developer Commit Analytics
              </p>
            </div>
{/* User info and logout - only show if OAuth is being used */}
{user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#1a202c' }}>{user.name || user.email}</div>
                  <div style={{ fontSize: '0.9rem', color: '#718096' }}>{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#333'
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <BoardSelector
              boards={boards}
              selectedBoard={selectedBoard}
              onBoardChange={setSelectedBoard}
              onGenerate={handleGenerateReport}
              loading={loading}
            />
          </div>
          {(metrics || cachedMetrics) && (
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF || loading}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                background: downloadingPDF ? '#94a3b8' : '#2563eb',
                border: 'none',
                borderRadius: '8px',
                cursor: downloadingPDF || loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!downloadingPDF && !loading) {
                  e.currentTarget.style.background = '#1d4ed8'
                }
              }}
              onMouseLeave={(e) => {
                if (!downloadingPDF && !loading) {
                  e.currentTarget.style.background = '#2563eb'
                }
              }}
            >
              {downloadingPDF ? (
                <>
                  <span>⏳</span>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <span>📥</span>
                  <span>Download PDF</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Loading overlay when fetching Jira board details */}
        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '3rem 4rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              minWidth: '350px',
              maxWidth: '90%'
            }}>
              {/* Spinner Animation */}
              <div 
                className="loading-spinner"
                style={{
                  width: '60px',
                  height: '60px',
                  border: '5px solid #f3f3f3',
                  borderTop: '5px solid #667eea',
                  borderRadius: '50%'
                }} 
              />
              
              {/* Loading Message */}
              <div style={{
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#2d3748',
                  margin: '0 0 0.5rem 0'
                }}>
                  Preparing JIRA Board...
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#718096',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Please wait while we fetch board details
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#fed7d7',
            color: '#c53030',
            borderRadius: '8px',
            border: '1px solid #fc8181'
          }}>
            {error}
          </div>
        )}

        {refreshing && !loading && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#e6f3ff',
            color: '#0066cc',
            borderRadius: '8px',
            border: '1px solid #0066cc',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🔄</span>
            <span>Fetching latest data in background... Current report shown below</span>
          </div>
        )}

        {loading && cachedMetrics && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#fff3cd',
            color: '#856404',
            borderRadius: '8px',
            border: '1px solid #ffc107',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⏳</span>
            <span>Generating new metrics... Showing previous data below</span>
          </div>
        )}

        {newDataReady && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#d4edda',
            color: '#155724',
            borderRadius: '8px',
            border: '1px solid #28a745',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✅</span>
              <span>New report ready! Data has been updated.</span>
            </div>
            <button
              onClick={() => setNewDataReady(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#155724',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0 0.5rem'
              }}
            >
              ×
            </button>
          </div>
        )}

        {(metrics || cachedMetrics) && (
          <MetricsCharts metrics={metrics || cachedMetrics!} isLoading={loading && !metrics} />
        )}
        </div>
      </div>
    </div>
  )
}
