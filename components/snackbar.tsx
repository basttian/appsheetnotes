import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';

export default function DirectionSnackbar({...props}) {

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={props.open}
        message={props.message}
      />
    </div>
  );
}
