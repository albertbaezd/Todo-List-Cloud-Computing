import * as React from 'react';
import { Button } from '@mui/material';

const StatusBar = ({ activeFilter, onFilterChange }) => {
  const handleFilterChange = (filter) => {
    onFilterChange(filter);
  };

  // Define styles based on the activeFilter value
  const pendingButtonStyles = activeFilter === false ? { borderRadius: '10px 2px' } : {borderRadius: "0px"};
  const completedButtonStyles = activeFilter === true ? { borderRadius: '10px 2px' } : {borderRadius:"0px"};

  return (
    <div style={{ display: 'flex' }}>
      <Button
        variant={activeFilter === false ? 'contained' : 'outlined'}
        onClick={() => handleFilterChange(false)}
        style={{ ...pendingButtonStyles, width: '50%' }}
      >
        Pending
      </Button>
      <Button
        variant={activeFilter === true ? 'contained' : 'outlined'}
        onClick={() => handleFilterChange(true)}
        style={{ ...completedButtonStyles, width: '50%' }}
      >
        Completed
      </Button>
    </div>
  );
};

export default StatusBar;
