import React, { lazy, useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

let interval: ReturnType<typeof setInterval> | undefined;

export default class SelectLabels extends React.Component<any, any>{

  constructor(props:any) {
    super(props);
    this.state = {value: '', text:'' , arrdata: [{}], interval: null };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeValues = this.handleChangeValues.bind(this);
    //this.onchange = props.onchange;
  }

  handleChange(event: SelectChangeEvent, index:any) {
    this.setState({value: event.target.value, text: index.props.children });
  }

  handleChangeValues(){
    this.setState({arrdata: this.props.values });
  }

  componentDidMount() {
    interval = setInterval(() => this.handleChangeValues(), 1000);
  }
  componentWillUnmount() {
    interval;
  }


render(){
  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: 350 }}>
        <InputLabel id="demo-simple-select-helper-label">{this.props.title}</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id={this.props.title}
          value={this.state.value}
          label={this.props.title}
          onChange={this.handleChange}
          onClose={this.props.onchange}
        >
          <MenuItem value=" ">
            <em>None</em>
          </MenuItem>

          {Array.isArray(this.state.arrdata) ? this.state.arrdata.map((e, key) => {
              return <MenuItem key={key} value={e.id}>{e.name}</MenuItem>;
          }) : "" }

        </Select>
        <FormHelperText>{this.props.help}</FormHelperText>
      </FormControl>

    </div>
  );
}
}
