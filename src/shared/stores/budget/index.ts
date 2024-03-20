import { produce } from 'immer'
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { SERVICES_BUDGET } from '../../api/BudgetData'
import { Modal } from 'antd'

export interface IBudgetStore {
  localeName: string
  budgetData: any
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  getBudgetData: (username: string, date: string) => Promise<any>
  updateBudgetData: (data: any, month: string, username: string) => Promise<any>
  createBudgetData: (data: any, month: any) => Promise<any>
  state: any
  error: string | undefined
  setError: (error?: string) => void
}

export const budgetStore = create<IBudgetStore>()(
  devtools(
    persist(
      (set: (partial: Partial<any>) => void, get: () => any) => ({
        localeName: 'Данные бюджета',
        budgetData: false,
        getBudgetData: async (username: string, date: string) => {
          try {
            const response = await SERVICES_BUDGET.Models.getBudgetData({
              username,
              date,
            })
            if (response?.success) {
              if (response?.data !== undefined && response?.data.length > 0) {
                const data = produce((draft: IBudgetStore) => {
                  draft.budgetData = response?.data
                })

                console.log(response?.data)

                set(data)
                // set((draft: any) => {
                //   draft.store.jsonDirectionsData = response?.data;
                //   draft.store.directionsData = response?.data;
                // });
              } else {
                set({ budgetData: response.data })
                get().setError('Нет данных')
              }
            } else {
              get().setError('Ошибка загрузки расписаний с сервера')
              Modal.error({
                title: 'Ошибка загрузки расписаний с сервера',
                content: `${get().error}`,
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
        createBudgetData: async (data: any, month: string) => {
          try {
            const response = await SERVICES_BUDGET.Models.createBudgetData(
              data,
              month,
            )
            if (response?.success) {
              if (response?.data !== undefined && response?.data.length > 0) {
                const data = produce((draft: IBudgetStore) => {
                  draft.budgetData = response?.data
                })

                console.log(response?.data)

                set(data)
                // set((draft: any) => {
                //   draft.store.jsonDirectionsData = response?.data;
                //   draft.store.directionsData = response?.data;
                // });
              } else {
                set({ budgetData: response.data })
                get().setError('Нет данных')
              }
            } else {
              get().setError('Ошибка загрузки расписаний с сервера')
              Modal.error({
                title: 'Ошибка загрузки расписаний с сервера',
                content: `${get().error}`,
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
        updateBudgetData: async (
          data: any,
          month: string,
          username: string,
        ) => {
          try {
            const response = await SERVICES_BUDGET.Models.updateBudgetData(
              data,
              month,
              username,
            )
            if (response?.success) {
              if (response?.data !== undefined && response?.data.length > 0) {
                const data = produce((draft: IBudgetStore) => {
                  draft.budgetData = response?.data
                })

                console.log(response?.data)

                set(data)
                // set((draft: any) => {
                //   draft.store.jsonDirectionsData = response?.data;
                //   draft.store.directionsData = response?.data;
                // });
              } else {
                set({ budgetData: response.data })
                get().setError('Нет данных')
              }
            } else {
              get().setError('Ошибка загрузки расписаний с сервера')
              Modal.error({
                title: 'Ошибка загрузки расписаний с сервера',
                content: `${get().error}`,
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
        token: '',
      }),
      { name: 'budgetStore' },
    ),
  ),
)
