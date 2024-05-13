import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { produce } from 'immer'
import { SERVICES_BUDGET } from '../../api/BudgetData'
import { Modal } from 'antd'
export interface IBudgetStore {
  localeName: string
  userBudgetData: any
  monthBudgetData: any
  selectedMonth: string | undefined
  costsCategories: any
  incomesCategories: any
  getCostCategories: (data?: any) => void
  setSelectedMonth: (dateString: string | string[]) => void
  getUserBudgetData: (username: string, date: string) => Promise<any>
  getMonthData: (month: number) => Promise<any>
  getIncomesCategories: () => Promise<any>
  getCostsCategories: () => Promise<any>
  setMonthBudgetData: (data?: any) => void
  updateMonthBudgetData: (data: any, month: number) => Promise<any>
  createMonthBudgetData: (data: any) => Promise<any>
  state: any
  error: string | undefined
  setError: (error?: string) => void
  clearStore: () => void
}

const budgetStore = create<IBudgetStore>(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        localeName: 'Данные бюджета',
        incomesCategories: undefined,
        userBudgetData: undefined,
        monthBudgetData: undefined,
        selectedMonth: undefined,
        getIncomesCategories: async () => {
          try {
            const response = await SERVICES_BUDGET.Models.getIncomesCategories()
            if (response?.success) {
              if (response?.data !== undefined) {
                const data = produce((draft: IBudgetStore) => {
                  draft.incomesCategories = response?.data
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
        getCostsCategories: async () => {
          try {
            const response = await SERVICES_BUDGET.Models.getCostsCategories()
            if (response?.success) {
              if (response?.data !== undefined) {
                const data = produce((draft: IBudgetStore) => {
                  draft.costsCategories = response?.data
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
            }
          } catch (error: any) {
            produce(get(), (draft: IBudgetStore) => {
              draft.state = 'Ошибка при обновлении хранилища'
              draft.error =
                error instanceof Error ? error.message : String(error)
            })
          }
        },
        updateMonthBudgetData: async (data: any, month: number) => {
          try {
            const response = await SERVICES_BUDGET.Models.updateBudgetData(
              data,
              month,
            )
            if (response?.status === 200) {
              const data = produce((draft: IBudgetStore) => {
                draft.monthBudgetData = response?.data
              })

              set(data)
              // set((draft: any) => {
              //   draft.store.jsonDirectionsData = response?.data;
              //   draft.store.directionsData = response?.data;
              // });
            }
          } catch (error: any) {
            produce(get(), (draft: IBudgetStore) => {
              draft.state = 'Ошибка при обновлении хранилища'
              draft.error =
                error instanceof Error ? error.message : String(error)
            })
          }
        },
        createMonthBudgetData: async (data: any) => {
          try {
            const response = await SERVICES_BUDGET.Models.createMonthBudgetData(
              data,
            )
            if (response?.status === 200) {
              const data = produce((draft: IBudgetStore) => {
                draft.monthBudgetData = response?.data
              })

              set(data)
              // set((draft: any) => {
              //   draft.store.jsonDirectionsData = response?.data;
              //   draft.store.directionsData = response?.data;
              // });
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
        setMonthBudgetData: (data: any) => {
          set((state: IBudgetStore) => {
            state.monthBudgetData = data
          })
        },
        clearStore: () => {
          set((state: IBudgetStore) => {
            state.monthBudgetData = undefined
          })
          set((state: IBudgetStore) => {
            state.userBudgetData = undefined
          })
          set((state: IBudgetStore) => {
            state.selectedMonth = undefined
          })
        },
      })),
    ),
  ) as any,
)

export default budgetStore
