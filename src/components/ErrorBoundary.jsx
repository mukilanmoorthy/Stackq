import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Trigger fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // Optionally send error logs to Supabase/LogRocket/etc.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center flex-col text-center px-4">
          <h1 className="text-2xl font-semibold text-red-600">Something went wrong.</h1>
          <p className="text-muted-foreground mt-2">
            Please refresh the page or go back to the home screen.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
