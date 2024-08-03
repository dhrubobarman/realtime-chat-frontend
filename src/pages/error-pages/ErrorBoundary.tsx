import React, { Component, ErrorInfo } from 'react';
import ErrorPage from './error-page';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error: ', error, errorInfo);
    this.setState({ hasError: true, error, errorInfo });
  }

  reset() {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <ErrorPage reset={this.reset.bind(this)} error={this.state.error} errorInfo={this.state.errorInfo} />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
