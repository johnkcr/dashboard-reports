import PaperBase from '@material-ui/core/Paper';
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { contentInset, contentInsetValidatorFn } from 'js/styles/content-inset';
import { margin, marginValidatorFn } from 'js/styles/margin';

/**
 * @typedef {{
 *   contentInset?: import('js/styles/typings/content-inset').ContentInset
 * } & import('@material-ui/core').PaperProps & import('js/styles/typings/margin').Margin} Props
 */

/**
 * @param {Props} props
 * @param {any} ref
 * @returns {React.ReactElement | null}
 */
function RefForwardingPaper(
  {
    children,
    contentInset = { top: 20, left: 16, bottom: 20, right: 16 },
    ...props
  },
  ref
) {
  return (
    <StyledPaper
      square
      elevation={2}
      contentInset={contentInset}
      {...props}
      ref={ref}
    >
      {children}
    </StyledPaper>
  );
}

/** @type {React.FunctionComponent<Props>} */
const PaperType = PaperBase;

const StyledPaper = styled(PaperType).withConfig({
  shouldForwardProp: prop =>
    marginValidatorFn(prop) && contentInsetValidatorFn(prop)
})`
  ${props => contentInset(props)}
  ${props => margin(props)}
`;

export const Paper = forwardRef(RefForwardingPaper);
