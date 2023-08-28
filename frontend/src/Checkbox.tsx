import { useState } from 'react';
import './Checkbox.css';

type CheckboxProps = {
  value: boolean,
  readOnly?: boolean,
  onClick: () => void
};

export default function Checkbox(props: CheckboxProps) {
  return <div className={'Checkbox ' + (props.value ? 'checked' : 'unchecked')} onClick={e => {
    e.stopPropagation();
    if (!props.readOnly) {
      props.onClick();
    }
  }} />;
}