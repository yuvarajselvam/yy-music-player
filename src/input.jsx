import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { videoService } from './video.service';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

const search = async (evt) => {
    let searchKeyword = evt.target.value;
    let videoData = await videoService.getLink(searchKeyword);
    constructVideoURL(videoData);
}

const constructVideoURL = (videoData) => {
    //www.youtube.com/watch?v=${}
}

const BasicTextFields = () => {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField id="standard-basic" label="Keyword" onBlur={search} />
    </form>
  );
}

export default BasicTextFields;
