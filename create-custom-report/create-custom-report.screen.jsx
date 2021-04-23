import {
  Button,
  Layout,
  NavigationBar,
  Form,
  ActivityIndicator,
  useFormContext,
  Screen,
  TextField
} from 'js/components';
import React from 'react';
import t from './i18n/en.json';
import styled from 'styled-components';
import { useFormState } from 'react-final-form';

export const CreateCustomReportScreen = ({}) => {
  const { handleSubmit } = useFormContext();
  const { submitting } = useFormState();
  return (
    <Screen>
      <NavigationBar title={t.title} />
      <Layout.Centered>
        <Form.Element>
          <Form.Errors />
          <Form.Field name="customReportName">
            {({ input }) => (
              <TextField
                type="text"
                label={t.nameLabel}
                placeholder={t.namePlaceholder}
                {...input}
              />
            )}
          </Form.Field>
          <ActionRow>
            <Button
              size="large"
              type="submit"
              glyph="check"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {t.submit}
            </Button>
            {submitting ? (
              <ActivityIndicator size={24} marginLeft={16} />
            ) : null}
          </ActionRow>
        </Form.Element>
      </Layout.Centered>
    </Screen>
  );
};

const ActionRow = styled('div')`
  margin-top: 22px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
