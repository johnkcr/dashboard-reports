import { useDeleteCustomReportMutation } from 'js/api/mutation/delete-custom-report/use-delete-custom-report.mutation';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo
} from 'react';

/**
 * @typedef {{
 *  isCreateCustomReportDrawerVisible: boolean
 *  isEditCustomReportDrawerVisible: boolean
 *  isDeleteConfirmationModalVisible: boolean
 *  editCustomReportId: string | null
 * }} State
 */

/**
 * @typedef {{
 *  presentCreateCustomReportDrawer: () => void
 *  dismissCreateCustomReportDrawer: () => void
 *  presentEditCustomReportDrawer: (id: string) => void
 *  dismissEditCustomReportDrawer: () => void
 *  presentDeleteConfirmationDialog: (customReport: import('js/typings/custom-report').CustomReport) => () => void
 *  dismissDeleteConfirmationModal: () => void
 *  deleteCustomReport: () => void
 * }} Actions
 */

/** @type {any} */
const DEFAULT_VALUE = undefined;

/** @type {React.Context<State>} */
export const ActionsStateContext = createContext(DEFAULT_VALUE);

/** @returns {State} */
export function useActionsState() {
  /** @type {any} */
  const context = useContext(ActionsStateContext);
  return context;
}

/** @type {React.Context<Actions>} */
export const ActionsContext = createContext(DEFAULT_VALUE);

/** @returns {Actions} */
export function useActions() {
  /** @type {any} */
  const context = useContext(ActionsContext);
  return context;
}

/** @type {React.FunctionComponent} */
export const ActionsProvider = ({ children }) => {
  const [state, setState] = useState({
    isCreateCustomReportDrawerVisible: false,
    isEditCustomReportDrawerVisible: false,
    isDeleteConfirmationModalVisible: false,
    editCustomReportId: null
  });

  const presentCreateCustomReportDrawer = useCallback(
    () => setState(s => ({ ...s, isCreateCustomReportDrawerVisible: true })),
    []
  );

  const dismissCreateCustomReportDrawer = useCallback(
    () => setState(s => ({ ...s, isCreateCustomReportDrawerVisible: false })),
    []
  );

  const presentEditCustomReportDrawer = useCallback(
    id =>
      setState(s => ({
        ...s,
        isEditCustomReportDrawerVisible: true,
        editCustomReportId: id
      })),
    []
  );

  const dismissEditCustomReportDrawer = useCallback(
    () => setState(s => ({ ...s, isEditCustomReportDrawerVisible: false })),
    []
  );

  /** @type {React.MutableRefObject<any>} */
  const presentedCustomReport = useRef();
  const presentDeleteConfirmationDialog = useCallback(
    customReport => () => {
      presentedCustomReport.current = customReport;
      setState(s => ({ ...s, isDeleteConfirmationModalVisible: true }));
    },
    []
  );

  const dismissDeleteConfirmationModal = useCallback(
    () => setState(s => ({ ...s, isDeleteConfirmationModalVisible: false })),
    []
  );

  const { mutate } = useDeleteCustomReportMutation();
  const deleteCustomReport = useCallback(() => {
    mutate({
      id: presentedCustomReport.current._id
    });
    setState(s => ({ ...s, isDeleteConfirmationModalVisible: false }));
  }, [mutate]);

  const actions = useMemo(
    () => ({
      presentCreateCustomReportDrawer,
      dismissCreateCustomReportDrawer,
      presentEditCustomReportDrawer,
      dismissEditCustomReportDrawer,
      presentDeleteConfirmationDialog,
      dismissDeleteConfirmationModal,
      deleteCustomReport
    }),
    [
      presentCreateCustomReportDrawer,
      dismissCreateCustomReportDrawer,
      presentEditCustomReportDrawer,
      dismissEditCustomReportDrawer,
      presentDeleteConfirmationDialog,
      dismissDeleteConfirmationModal,
      deleteCustomReport
    ]
  );

  return ((
    <ActionsStateContext.Provider value={state}>
      <ActionsContext.Provider value={actions}>
        {children}
      </ActionsContext.Provider>
    </ActionsStateContext.Provider>
  ));
};
