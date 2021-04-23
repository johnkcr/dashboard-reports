import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { margin, marginValidatorFn } from 'js/styles/margin';

/** @type {React.FunctionComponent<import('@material-ui/core').ButtonProps & import('js/styles/typings/margin').Margin>} */
export const ClearAllFilters = props => {
  return ((
    <StyledButton type="button" color="primary" {...props}>
      <Glyph className={clsx('fas', 'fa-times')} />
      Clear all filters
    </StyledButton>
  ));
};

const StyledButton = styled(Button).withConfig({
  shouldForwardProp: prop => marginValidatorFn(prop)
})`
  .MuiButton-label {
    font-family: Roboto;
    font-weight: 700;
    font-size: 11px;
    line-height: 17px;
    letter-spacing: 0.1px;
  }

  ${props => margin(props)};
`;

const Glyph = styled('i')`
  margin-right: 6px;
  transform: translateY(-1px);
`;
