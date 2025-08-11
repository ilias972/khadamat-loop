import { Component, ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ErrorBoundaryState {
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundaryInner extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("ErrorBoundary caught", error, info);
    }
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <Fallback onRetry={this.reset} />;
    }
    return this.props.children;
  }
}

function Fallback({ onRetry }: { onRetry: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="p-8 text-center" role="alert">
      <p className="mb-4 text-gray-700">{t("common.error")}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-orange-500 text-white rounded"
      >
        {t("common.retry")}
      </button>
    </div>
  );
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return <ErrorBoundaryInner>{children}</ErrorBoundaryInner>;
}

