// Import necessary modules and components
import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

// Define the interface for the component state
interface IState {
  data: ServerRespond[];
  showGraph: boolean;
}

// Define the App component
class App extends Component<{}, IState> {
  // Initialize a property to store the interval ID
  private intervalId: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);

    // Initialize the state with showGraph set to false
    this.state = {
      data: [],
      showGraph: false,
    };
  }

  /**
   * Start streaming data when the component mounts
   */
  componentDidMount() {
    // Set an interval to call the getDataFromServer function every 100 milliseconds
    this.intervalId = setInterval(() => this.getDataFromServer(), 100);
  }

  /**
   * Stop streaming data when the component unmounts
   */
  componentWillUnmount() {
    // Clear the interval when the component is unmounted
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Get new data from the server and update the state with the new data
   */
  getDataFromServer() {
    // Call the DataStreamer.getData function to fetch server responds
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      // Filter out duplicate data based on timestamp
      const uniqueData = serverResponds.filter((data) => {
        return !this.state.data.some((existingData) => existingData.timestamp === data.timestamp);
      });

      // Update the state with the unique data
      this.setState({ data: [...this.state.data, ...uniqueData] });
    });
  }

  /**
   * Render the Graph component with state.data passed as a property
   */
  renderGraph() {
    // Render the graph only when showGraph is true
    return this.state.showGraph && <Graph data={this.state.data} />;
  }

  /**
   * Render the App component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => { 
              // Set showGraph to true when the button is clicked
              this.setState({ showGraph: true });
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

// Export the App component as the default export
export default App;
