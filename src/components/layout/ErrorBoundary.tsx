import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Enterprise production Error Boundary.
 * Catches unhandled runtime exceptions gracefully and displays
 * a sleek, brand-aligned fallback UI rather than a white screen crash.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, log to telemetry (e.g. Sentry / Datadog)
    if (import.meta.env.DEV) {
      console.error('Unhandled store error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-bg px-6 text-center text-text selection:bg-accent-soft selection:text-text">
          <div className="mx-auto max-w-md">
            <span className="display text-3xl tracking-[-0.02em] text-text">
              SHOP<span className="text-accent">NOW</span>
            </span>

            <div className="mt-8 grid size-16 place-items-center rounded-full bg-accent-soft text-accent mx-auto">
              <AlertTriangle size={32} />
            </div>

            <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              An unexpected error interrupted your shopping experience. Refreshing the storefront usually resolves this immediately.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 rounded-btn bg-action px-6 py-3 text-[15px] font-semibold text-action-text shadow-sm transition-colors hover:bg-action-hover"
              >
                <RefreshCw size={16} />
                <span>Reload storefront</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center rounded-btn border-[1.5px] border-text bg-bg px-6 py-3 text-[15px] font-semibold text-text transition-colors hover:bg-bg-alt"
              >
                Return to home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
