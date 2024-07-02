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
  userBudgetDataOnSelectedMonth: IUserBudgetData | undefined
  monthBudgetData: any
  selectedMonth: string | undefined
  costsCategories: any
  incomesCategories: any
  getCostCategories: (data?: any) => void
  setSelectedMonth: (dateString: string) => void
  getUserBudgetData: (month: string, userId: number) => Promise<any>
  getUserBudgetDataOnSelectedMonth: (
    month: string,
    userId: number,
  ) => Promise<any>
  getMonthData: (month: string) => Promise<any>
  getIncomesCategories: () => Promise<any>
  getCostsCategories: () => Promise<any>
  setMonthBudgetData: (data?: any) => void
  updateBudgetData: (
    data: any,
    month: string | undefined,
    userId: number | undefined,
  ) => Promise<any>
  createMonthBudgetData: (
    data: any,
    month: string | undefined,
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
        userBudgetDataOnSelectedMonth: undefined,
        monthBudgetData: undefined,
        selectedMonth: undefined,
        getIncomesCategories: async () => {
          try {
            const response = await SERVICES_BUDGET.Models.getIncomesCategories()
            if (response?.success) {
              if (response?.data !== undefined) {
                const data = produce((draft: IBudgetStore) => {
                  draft.incomesCategories = response?.data?.incomes_categories
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
                  draft.costsCategories = response?.data?.costs_categories
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
        getUserBudgetData: async (month: string, userId: number) => {
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
        getUserBudgetDataOnSelectedMonth: async (
          month: string,
          userId: number,
        ) => {
          const data = { month: month, userId: userId }
          try {
            const response = await SERVICES_BUDGET.Models.getUserBudgetData(
              data,
            )
            if (response?.success) {
              if (response?.data !== undefined) {
                const users_data = response?.data?.users_data
                const data = produce((draft: IBudgetStore) => {
                  draft.userBudgetDataOnSelectedMonth = users_data
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
        getMonthData: async (month: string) => {
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
          month: string,
          userId: number,
        ) => {
          try {
            const response = await SERVICES_BUDGET.Models.createBudgetData(
              data,
              month,
              userId,
            )
            console.log(response.data)

            if (response?.data) {
              console.log(response.data)

              // const data = produce((draft: IBudgetStore) => {
              //   draft.monthBudgetData = response?.data
              // })

              // set(data)
              set((draft: any) => {
                draft.monthBudgetData = response?.data.newUser
                draft.userBudgetData = response?.data.newUser
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
