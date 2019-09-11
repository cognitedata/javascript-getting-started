import React, { Component } from 'react';
import { TimeseriesSearch, TimeseriesChart } from '@cognite/gearbox';
import './Layout.css';

class Layout extends Component {
  state = {
    timeseriesIds: [],
  }

  onTimeserieSelectionChange = timeseriesIds => {
    this.setState({ timeseriesIds });
  }

  render() {
    const { timeseriesIds } = this.state;
    return (
      <React.Fragment>
        <div className="left-side">
          <TimeseriesChart
            timeseriesIds={timeseriesIds}
            startTime={Date.now() - 30*24*60*60*1000}
            endTime={Date.now()}
            zoomable={true}
            contextChart={true} 
            styles={{container: {height:'100vh'}}}
          />
        </div>
        <div className="right-side">
          <TimeseriesSearch
            onTimeserieSelectionChange={this.onTimeserieSelectionChange}
            styles={{list: {height: '100vh'}}}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default Layout;
