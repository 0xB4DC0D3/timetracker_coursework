import "./Select.css";

import { useState } from 'react'

type SelectProps = {
  selected: { value: string; label: string; };
  options: {
    value: string;
    label: string;
  }[];
  onChange: (event: any) => void;
}

const Select = (props: SelectProps) => {
  return (
    <select className="select select-sm h-10 leading-5 select-bordered w-full" value={props.selected.value} onChange={props.onChange}>
      {props.options.map(option => <option key={option.value} value={option.value} label={option.label} />)}
    </select>
  );
};

export default Select;