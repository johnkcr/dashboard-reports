import Typography from '@material-ui/core/Typography';
import { palette } from 'js/theme/palette';
import React from 'react';
import styled from 'styled-components';

/** @type {React.FunctionComponent<{ type: 'columns' | 'rows' | 'values' | 'filters'}>} */
export const TableHeader = ({ type }) => {
  if (type === 'columns' || type === 'rows') {
    return ((
      <Container>
        <Field>Field</Field>
        <Order>Order</Order>
      </Container>
    ));
  } else if (type === 'values') {
    return ((
      <Container>
        <Field>Field</Field>
        <SummarizeFunction>Summarize function</SummarizeFunction>
      </Container>
    ));
  } else if (type === 'filters') {
    return ((
      <Container>
        <Field>Field</Field>
        <SummarizeFunction>Status</SummarizeFunction>
      </Container>
    ));
  }
  return null;
};

const Container = styled('div')`
  margin-top: -6px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;

  @media only screen and (max-width: 760px) {
    display: none;
  }
`;

const Label = styled(Typography)`
  font-family: Roboto;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  letter-spacing: 0.37px;
  color: ${palette.gray.main};
`;

const Field = styled(Label)`
  margin-left: 16px;
  flex: 1;
`;
const Order = styled(Label)`
  margin-right: 50px;
  width: 175px;
`;
const SummarizeFunction = styled(Label)`
  margin-right: 50px;
  width: 175px;
`;
