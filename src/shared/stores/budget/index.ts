import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { produce } from 'immer'
import { SERVICES_BUDGET } from '../../api/BudgetData'
import { Modal } from 'antd'
export interface IBudgetStore {
  localeName: string
  budgetData: any
  userBudgetData: any
  monthBudgetData: any
  selectedMonth: string
  setSelectedMonth: (dateString: string | string[]) => void
  getUserBudgetData: (username: string, date: string) => Promise<any>
  getMonthData: (month: number) => Promise<any>
  getBudgetData: () => Promise<any>
  setBudgetData: (data?: any) => void
  updateBudgetData: (data: any, month: string, username: string) => Promise<any>
  state: any
  error: string | undefined
  setError: (error?: string) => void
}

const budgetStore = create<IBudgetStore>(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        localeName: 'Данные бюджета',
        budgetData: undefined,
        userBudgetData: undefined,
        monthBudgetData: undefined,
        selectedMonth: '2024-02',
        getBudgetData: async () => {
          try {
            const response = await SERVICES_BUDGET.Models.getAllBudgetData()
            if (response?.success) {
              if (response?.data !== undefined) {
                const data = produce((draft: IBudgetStore) => {
                  draft.budgetData = response?.data
                })
                set(data)
                // set((draft: any) => {
                //   draft.store.jsonDirectionsData = response?.data;
                //   draft.store.directionsData = response?.data;
                // });
              }
            } else {
              Modal.error({
                title: 'Ошибка загрузки расписаний с сервера',
              })
            }
          } catch (error: any) {
            produce(get(), (draft: IBudgetStore) => {
              draft.state = 'Ошибка при обновлении хранилища'
              draft.error =
                error instanceof Error ? error.message : String(error)
            })
          }
        },
        getUserBudgetData: async (username: string, date: string) => {
          try {
            const response = await SERVICES_BUDGET.Models.getUserBudgetData({
              username,
              date,
            })
            if (response?.success) {
              if (response?.data !== undefined) {
                const data = produce((draft: IBudgetStore) => {
                  draft.userBudgetData = response?.data
                })
                set(data)
                // set((draft: any) => {
                //   draft.store.jsonDirectionsData = response?.data;
                //   draft.store.directionsData = response?.data;
                // });
              }
            } else {
              Modal.error({
                title: 'Ошибка загрузки расписаний с сервера',
              })
            }
          } catch (error: any) {
            produce(get(), (draft: IBudgetStore) => {
              draft.state = 'Ошибка при обновлении хранилища'
              draft.error =
                error instanceof Error ? error.message : String(error)
            })
          }
        },
        getMonthData: async (month: number) => {
          try {
            const response = await SERVICES_BUDGET.Models.getMonthData(month)
            if (response?.success) {
              if (response?.data !== undefined) {
                const data = produce((draft: IBudgetStore) => {
                  draft.monthBudgetData = response?.data
                })
                set(data)
                // set((draft: any) => {
                //   draft.store.jsonDirectionsData = response?.data;
                //   draft.store.directionsData = response?.data;
                // });
              }
            } else {
              Modal.error({
                title: 'Ошибка загрузки расписаний с сервера',
              })
            }
          } catch (error: any) {
            produce(get(), (draft: IBudgetStore) => {
              draft.state = 'Ошибка при обновлении хранилища'
              draft.error =
                error instanceof Error ? error.message : String(error)
            })
          }
        },
        updateBudgetData: async (data: any, month: string) => {
          try {
            const response = await SERVICES_BUDGET.Models.updateBudgetData(
              data,
              month,
            )
            if (response?.success) {
              if (response?.data !== undefined && response?.data.length > 0) {
                const data = produce((draft: IBudgetStore) => {
                  draft.budgetData = response?.data
                })

                set(data)
                // set((draft: any) => {
                //   draft.store.jsonDirectionsData = response?.data;
                //   draft.store.directionsData = response?.data;
                // });
              } else {
                set({ budgetData: response.data })
              }
            } else {
              Modal.error({
                title: 'Ошибка загрузки расписаний с сервера',
              })
            }
          } catch (error: any) {
            produce(get(), (draft: IBudgetStore) => {
              draft.state = 'Ошибка при обновлении хранилища'
              draft.error =
                error instanceof Error ? error.message : String(error)
            })
          }
        },
        setSelectedMonth: (month: string) => {
          set((state: IBudgetStore) => {
            state.selectedMonth = month
          })
        },
        setBudgetData: (data: any) => {
          set((state: IBudgetStore) => {
            state.budgetData = data
          })
        },
      })),
    ),
  ) as any,
)
export default budgetStore
