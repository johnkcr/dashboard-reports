import React from 'react';
import { Fields } from './components/fields';
import { Screen, Tabs, AppBar, Layout, LoadingState } from 'js/components';
import { Header } from './components/header';
import { NavigationBar } from './components/navigation-bar';
import { Toolbar } from './components/toolbar';
import { useQueryResult } from './providers/query.provider';
import { useFieldsQueryResult } from './providers/fields.provider';

export const CustomReportScreen = () => {
  const { isLoading, data } = useQueryResult();
  const { isLoading: isFieldsQueryLoading } = useFieldsQueryResult();

  let content;
  if (isLoading || isFieldsQueryLoading) {
    content = <LoadingState />;
  } else {
    content = <Fields />;
  }

  return (
    <Screen title={data ? `${data.name} - Custom Reports` : 'Custom Reports'}>
      <AppBar>
        <NavigationBar />
        <Tabs value={1} onChange={() => {}} elevated>
          <Tabs.Tab
            label="Dashboard"
            onClick={() => {
              window.location.href = '/#/reports';
            }}
          />
          <Tabs.Tab
            label="Custom Reports"
            onClick={() => {
              window.location.href = '/#/reports/custom-reports';
            }}
          />
        </Tabs>
      </AppBar>

      <Toolbar />

      <Layout.Centered contentInset={{ top: 16 }}>
        <Header />
        {content}
      </Layout.Centered>
    </Screen>
  );
};
