import React from 'react'
import AuthContext from '../../contexts/auth'
import { showSessionExpiredModal } from '../../utils/sessionExpiredModal'
import { breadCrumble } from '../../utils/translation/breadCrumble'
import {
  ErrorCard,
  ErrorContainer,
  ErrorText,
  ErrorTitle,
  RedirectingContainer,
  RedirectingText,
  ReloadButton,
  Spinner
} from './styles'

interface ErrorBoundaryState {
  hasError: boolean
  errorInfo: string
  isAuthError: boolean
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps & { handleSessionExpired?: () => void },
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps & { handleSessionExpired?: () => void }) {
    super(props)
    this.state = { hasError: false, errorInfo: '', isAuthError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const isAuthError =
      (error as any)?.response?.status === 401 ||
      (error as any)?.status === 401 ||
      error.name === 'UnauthorizedError' ||
      error.message.includes('401')

    return {
      hasError: true,
      errorInfo: error.message,
      isAuthError
    }
  }

  componentDidCatch(error: Error) {
    if (this.state.isAuthError) {
      if (this.props.handleSessionExpired) {
        this.props.handleSessionExpired()
      } else {
        showSessionExpiredModal()
      }
    }

    if (error?.message?.includes('not valid JSON') || error?.message?.includes('undefined')) {
      try {
        const toRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const val = localStorage.getItem(key);
            if (!val || val === 'undefined' || val === 'null') {
              toRemove.push(key);
            }
          }
        }
        toRemove.forEach((k) => localStorage.removeItem(k));
      } catch {}
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isAuthError) {
        return (
          <ErrorContainer>
            <ErrorCard>
              <ErrorTitle>{breadCrumble('session.expired.title')}</ErrorTitle>
              <ErrorText>{breadCrumble('session.expired.text')}</ErrorText>
              <RedirectingContainer>
                <Spinner />
                <RedirectingText>Redirecionando para login...</RedirectingText>
              </RedirectingContainer>
            </ErrorCard>
          </ErrorContainer>
        )
      }

      return (
        <ErrorContainer>
          <h1>Algo deu errado.</h1>
          <p>Erro: {this.state.errorInfo}</p>
          <ReloadButton
            onClick={() => {
              try {
                const toRemove: string[] = [];
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key) {
                    const val = localStorage.getItem(key);
                    if (!val || val === 'undefined' || val === 'null') {
                      toRemove.push(key);
                    }
                  }
                }
                toRemove.forEach((k) => localStorage.removeItem(k));
              } catch {}
              window.location.reload();
            }}
          >
            Recarregar Página
          </ReloadButton>
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <AuthContext.Consumer>
      {(authContext) => (
        <ErrorBoundaryClass handleSessionExpired={authContext?.handleSessionExpired}>
          {children}
        </ErrorBoundaryClass>
      )}
    </AuthContext.Consumer>
  )
}
