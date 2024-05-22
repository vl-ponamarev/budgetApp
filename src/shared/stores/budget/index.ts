import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { produce } from 'immer'
import { SERVICES_BUDGET } from '../../api/BudgetData'
import { Modal } from 'antd'

export interface IUserBudgetData {
  user_id: number
  budget_data: {
    incomes_categories: any[]
    costs_categories: any[]
    incomes: any[]
    costs: any[]
  }
}

export interface IBudgetStore {
  localeName: string
  userBudgetData: IUserBudgetData | undefined
  monthBudgetData: any
  selectedMonth: number | undefined
  costsCategories: any
  incomesCategories: any
  getCostCategories: (data?: any) => void
  setSelectedMonth: (dateString: number) => void
  getUserBudgetData: (month: number, userId: number) => Promise<any>
  getMonthData: (month: number) => Promise<any>
  getIncomesCategories: () => Promise<any>
  getCostsCategories: () => Promise<any>
  setMonthBudgetData: (data?: any) => void
  updateBudgetData: (
    data: any,
    month: number | undefined,
    userId: number,
  ) => Promise<any>
  createMonthBudgetData: (
    data: any,
    month: number | undefined,
    userId: number,
  ) => Promise<any>
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
            console.log(response)

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
            console.log(response)

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
        getUserBudgetData: async (month: number, userId: number) => {
          try {
            const response = await SERVICES_BUDGET.Models.getUserBudgetData({
              month,
              userId,
            })
            console.log(response)

            if (response?.success) {
              if (response?.data !== undefined) {
                const users_data = response?.data?.users_data
                console.log(users_data)

                const data = produce((draft: IBudgetStore) => {
                  draft.userBudgetData = users_data
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
        createMonthBudgetData: async (
          data: any,
          month: number,
          userId: number,
        ) => {
          console.log(month)

          try {
            const response = await SERVICES_BUDGET.Models.createBudgetData(
              data,
              month,
              userId,
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
        updateBudgetData: async (data: any, month: number, userId: number) => {
          try {
            const response = await SERVICES_BUDGET.Models.updateBudgetData(
              data,
              month,
              userId,
            )
            if (response?.status === 200) {
              const data = produce((draft: IBudgetStore) => {
                draft.userBudgetData = response?.data?.users_data
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
        setSelectedMonth: (month: number) => {
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
