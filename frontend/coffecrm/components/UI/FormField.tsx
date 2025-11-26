"use client";

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

type Props = TextFieldProps & { label?: string };

/**
 * Small wrapper around MUI TextField to enforce consistent form sizes
 * and defaults across the application (small inputs, dense margins).
 */
const FormTextField: React.FC<Props> = (props) => {
  const { size = 'small', margin = 'dense', fullWidth = true, ...rest } = props;
  return <TextField size={size} margin={margin} fullWidth={fullWidth} {...rest} />;
};

export default FormTextField;
