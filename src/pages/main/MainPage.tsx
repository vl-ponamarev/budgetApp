import { useCallback, useEffect } from 'react'
import { Button } from 'antd'
import budgetStore, { IBudgetStore } from '../../shared/stores/budget'
import MonthPicker from '../../entities/ui/MonthPicker'
import { PieChartCosts } from '../../entities/pie-chart/PieChartCosts'
import { useAccountStore } from '../../shared/stores/accounts'
import { PieChartIncomes } from '../../entities/pie-chart/PieChartIncomes'
import CostsTableSummary from '../../entities/costs-table/CostsTableSummary'
import IncomesTableSummary from '../../entities/incomes-tables/IncomsTableSummary'

const MainPage = () => {
  const logout = useAccountStore((s) => s.logout)
  const [
    selectedMonth,
    getUserBudgetData,
    getCostsCategories,
    getIncomesCategories,
    userBudgetData,
    createMonthBudgetData,
    clearStore,
  ] = budgetStore((s: IBudgetStore) => [
    s.selectedMonth,
    s.getUserBudgetData,
    s.getCostsCategories,
    s.getIncomesCategories,
    s.userBudgetData,
    s.createMonthBudgetData,
    s.clearStore,
  ])

  const handleLogout = useCallback(() => {
    logout()
    localStorage.removeItem('selectedModeId')
    localStorage.removeItem('id')
    clearStore()
  }, [logout])
  // const getUserBudgetData = budgetStore((s: IBudgetStore) => s.getUserBudgetData)

  const userName = localStorage.getItem('username')

  useEffect(() => {
    const id = localStorage.getItem('id')
    if (id && selectedMonth) {
      getUserBudgetData(selectedMonth, Number(id))
      // getMonthData(Number(selectedMonth.split('-')[1]) - 1)
    }
  }, [selectedMonth])

  useEffect(() => {
    getCostsCategories()
    getIncomesCategories()
  }, [])

  useEffect(() => {
    if (userBudgetData && Object.keys(userBudgetData).length > 0) {
      return
    } else {
      const id = localStorage.getItem('id')
      const newUserData = {
        user_id: Number(id),
        budget_data: {
          incomes_categories: [],
          costs_categories: [],
          incomes: [],
          costs: [],
        },
      }
      if (selectedMonth) {
        createMonthBudgetData(newUserData, selectedMonth, Number(id))
      }
    }
  }, [userBudgetData, selectedMonth])

  return (
    <>
      <Button style={{ margin: '16px 10px 0' }} onClick={() => handleLogout()}>
        Выйти
      </Button>
      <MonthPicker />
      <div>{userName}</div>

      <div style={{ display: 'flex', margin: '16px', width: '100%' }}>
        {/* <PieChartIncomes /> */}
        <PieChartCosts />
      </div>

      <CostsTableSummary />
      <IncomesTableSummary />
    </>
  )
}

export default MainPage
