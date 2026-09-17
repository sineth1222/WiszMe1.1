"use client";

import { Component, type ReactNode } from "react";

interface SceneErrorBoundaryProps {
  children: ReactNode;
  onSkip: () => void;
  accentColor?: string;
}

interface SceneErrorBoundaryState {
  hasError: boolean;
}

export class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  constructor(props: SceneErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("Scene failed to render, offering fallback:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm opacity-70">Hmm, that part hiccuped a little.</p>
          <button
            onClick={this.props.onSkip}
            className="rounded-full px-6 py-2.5 text-sm font-medium text-white"
            style={{ background: this.props.accentColor ?? "#B98CFF" }}
          >
            Continue ✨
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
