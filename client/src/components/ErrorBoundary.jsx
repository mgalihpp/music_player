/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Replace this with your actual error logging function
const logErrorToMyService = (error, errorInfo) => {
  // Your error logging logic goes here
  console.error("Error logged:", error, errorInfo);
};
export default ErrorBoundary;
