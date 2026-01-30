'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { login, checkAuthStatus } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if already authenticated
    checkAuthStatus().then((status) => {
      if (status.authenticated) {
        router.push('/')
      }
    })

    // Check for error in URL params
    const urlError = searchParams.get('error')
    if (urlError) {
      setError(decodeURIComponent(urlError))
    }
  }, [router, searchParams])

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const authUrl = await login()
      // Redirect to Atlassian OAuth page
      window.location.href = authUrl
    } catch (err: any) {
      setError(err.message || 'Failed to initiate login')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#333'
        }}>
          Jira Velocity Dashboard
        </h1>
        <p style={{
          color: '#666',
          marginBottom: '2rem'
        }}>
          Sign in with your Atlassian account to access velocity metrics
        </p>

        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#c33'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? 'Redirecting...' : 'Login with Atlassian'}
        </button>

        <p style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          color: '#999',
          textAlign: 'center'
        }}>
          You'll be redirected to Atlassian to sign in securely
        </p>
      </div>
    </div>
  )
}
