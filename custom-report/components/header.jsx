import styled from 'styled-components';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Glyph, Header as HeaderBase } from 'js/components';

export const Header = ({}) => {
  return (
    <StyledHeader title="Customize Report">
      <Help>
        <StyledGlyph name="arrows-alt" />
        <HelpLabel>Drag and drop fields to reorder.</HelpLabel>
      </Help>
    </StyledHeader>
  );
};

const StyledHeader = styled(HeaderBase)`
  @media only screen and (max-width: 500px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Help = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HelpLabel = styled(Typography)`
  font-style: italic;
  transform: translateY(-1px);
`;

const StyledGlyph = styled(Glyph)`
  margin-right: 8px;
  transform: translateY(-1px);
`;
