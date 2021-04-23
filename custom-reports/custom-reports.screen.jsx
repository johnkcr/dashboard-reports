import React from 'react';
import {
  Screen,
  Tabs,
  AppBar,
  LoadingState,
  SwipeDrawer,
  Layout
} from 'js/components';
import { Header } from './components/header';
import { EmptyState } from './components/empty-state';
import t from './i18n/en.json';
import { CreateCustomReportContainer } from '../create-custom-report/create-custom-report.container';
import { useQueryResult } from './providers/query.provider';
import { DeleteConfirmationDialog } from './components/delete-confirmation-dialog';
import { useActions, useActionsState } from './providers/actions.provider';
import { EditCustomReportContainer } from '../edit-custom-report/edit-custom-report.container';
import { Paper } from '../custom-report/components/paper';
import { Table } from './components/table';

export const CustomReportsScreen = () => {
  const {
    isDeleteConfirmationModalVisible,
    isCreateCustomReportDrawerVisible,
    isEditCustomReportDrawerVisible,
    editCustomReportId
  } = useActionsState();
  const {
    dismissDeleteConfirmationModal,
    deleteCustomReport,
    dismissCreateCustomReportDrawer,
    dismissEditCustomReportDrawer
  } = useActions();
  const { isLoading, data } = useQueryResult();

  let content;
  if (isLoading) {
    content = <LoadingState />;
  } else if (!data || !data.length) {
    content = <EmptyState />;
  } else {
    content = (
      <Paper contentInset={{ top: 0, left: 0, right: 0, bottom: 0 }}>
        <Table />
      </Paper>
    );
  }

  return (
    <>
      <Screen title={t.title}>
        <AppBar>
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

        <Layout.FullWidth contentInset={{ top: 20 }}>
          <Header />
          {content}
        </Layout.FullWidth>
      </Screen>
      <DeleteConfirmationDialog
        visible={isDeleteConfirmationModalVisible}
        onRequestClose={dismissDeleteConfirmationModal}
        onDeleteCustomReport={deleteCustomReport}
      />
      <SwipeDrawer
        drawerOpen={isCreateCustomReportDrawerVisible}
        handleDrawerOpen={value => !value && dismissCreateCustomReportDrawer()}
      >
        {isCreateCustomReportDrawerVisible ? (
          <CreateCustomReportContainer />
        ) : null}
      </SwipeDrawer>
      <SwipeDrawer
        drawerOpen={isEditCustomReportDrawerVisible}
        handleDrawerOpen={value => !value && dismissEditCustomReportDrawer()}
      >
        {isEditCustomReportDrawerVisible && editCustomReportId ? (
          <EditCustomReportContainer id={editCustomReportId} />
        ) : null}
      </SwipeDrawer>
    </>
  );
};
