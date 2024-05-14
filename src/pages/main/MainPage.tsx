import { useCallback, useEffect } from 'react'
import { Button } from 'antd'
import budgetStore, { IBudgetStore } from '../../shared/stores/budget'
import MonthPicker from '../../entities/ui/MonthPicker'
import { PieChartCosts } from '../../entities/pie-chart/PieChartCosts'
import { useAccountStore } from '../../shared/stores/accounts'
import { PieChartIncomes } from '../../entities/pie-chart/PieChartIncomes'
import CostsTableSummary from '../../entities/costs-table/CostsTableSummary'

const MainPage = () => {
  const logout = useAccountStore((s) => s.logout)
  const { username } = useAccountStore((s) => s.store.data)

  const [
    selectedMonth,
    getUserBudgetData,
    getMonthData,
    monthBudgetData,
    getCostsCategories,
    getIncomesCategories,
    userBudgetData,
    updateMonthBudgetData,
    createMonthBudgetData,
    clearStore,
  ] = budgetStore((s: IBudgetStore) => [
    s.selectedMonth,
    s.getUserBudgetData,
    s.getMonthData,
    s.monthBudgetData,
    s.getCostsCategories,
    s.getIncomesCategories,
    s.userBudgetData,
    s.updateMonthBudgetData,
    s.createMonthBudgetData,
    s.clearStore,
  ])

  const handleLogout = useCallback(() => {
    logout()
    localStorage.removeItem('selectedModeId')
    clearStore()
  }, [logout])
  // const getUserBudgetData = budgetStore((s: IBudgetStore) => s.getUserBudgetData)

  console.log('selectedMonth', selectedMonth)

  console.log('username', username)

  // createBudgetData({ username: 'user', budget_data: {} }, '2024-03')

  useEffect(() => {
    if (username && selectedMonth) {
      getUserBudgetData(username, selectedMonth)
      getMonthData(Number(selectedMonth.split('-')[1]) - 1)
    }
  }, [getUserBudgetData, selectedMonth, username])

  useEffect(() => {
    getCostsCategories()
    getIncomesCategories()
  }, [])
  console.log(monthBudgetData)

  useEffect(() => {
    if (monthBudgetData && Object.keys(monthBudgetData).length > 0) {
      const { users_data } = monthBudgetData
      const user = users_data?.find((u: any) => u.user_name === username)
      console.log(user)
      if (user) {
        return
      } else {
        console.log('oks')
        const newUserDataID = monthBudgetData?.usersData?.length + 1
        const newUserData = {
          user_name: username,
          budget_data: {
            incomes_categories: [],
            costs_categories: [],
            incomes: [],
            costs: [],
          },
          id: newUserDataID,
        }

        const updatedData = { users_data: newUserData }
        const updatedMonthBudgetData = {
          ...monthBudgetData,
          usersData: updatedData,
        }

        console.log(monthBudgetData)
        console.log(updatedMonthBudgetData)

        updateMonthBudgetData(
          updatedMonthBudgetData,
          Number(selectedMonth?.split('-')[1]) - 1,
        )
      }
    } else {
      console.log('ok')

      const newUserData = {
        user_name: username,
        budget_data: {
          incomes_categories: [],
          costs_categories: [],
          incomes: [],
          costs: [],
        },
        id: 1,
      }
      if (selectedMonth && selectedMonth?.length > 0) {
        const monthBudgetData = {
          month: selectedMonth,
          users_data: [newUserData],
        }
        // createMonthBudgetData(monthBudgetData)
      }
    }
  }, [selectedMonth])

  return (
    <>
      <Button style={{ margin: '16px 10px 0' }} onClick={() => handleLogout()}>
        Выйти
      </Button>
      <MonthPicker />

      <div style={{ display: 'flex', margin: '16px', width: '100%' }}>
        <PieChartIncomes />
        <PieChartCosts />
      </div>

      <CostsTableSummary />
      {/* <IncomesTable /> */}
    </>
  )
}

export default MainPage
