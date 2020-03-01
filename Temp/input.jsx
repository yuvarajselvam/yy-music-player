import React from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import { videoService } from "./video.service";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: 200
    }
  }
}));

const search = async evt => {
  let searchKeyword = evt.target.value;
  let videoData = await videoService.getLink(searchKeyword);
  constructVideoURL(videoData);
};

const constructVideoURL = videoData => {
  //www.youtube.com/watch?v=${}
  console.log(videoData);
  let videoId = videoData.items[1].id.videoId;
  let videoURL = { link: `www.youtube.com/watch?v=${videoId}` };
  console.log(videoURL);
  axios.post("http://127.0.0.1:5000/download/", videoURL).then(
    res => {
      console.log(res);
    },
    error => {
      console.log(error);
    }
  );
};

const BasicTextFields = () => {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField id="standard-basic" label="Keyword" onBlur={search} />
    </form>
  );
};

export default BasicTextFields;
