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

  const handleLogout = useCallback(() => {
    logout()
    localStorage.removeItem('selectedModeId')
  }, [logout])

  const [
    selectedMonth,
    getUserBudgetData,
    getMonthData,
    monthBudgetData,
    getBudgetData,
    budgetData,
  ] = budgetStore((s: IBudgetStore) => [
    s.selectedMonth,
    s.getUserBudgetData,
    s.getMonthData,
    s.monthBudgetData,
    s.getBudgetData,
    s.budgetData,
  ])
  // const getUserBudgetData = budgetStore((s: IBudgetStore) => s.getUserBudgetData)

  console.log('selectedMonth', selectedMonth)

  console.log('username', username)

  // createBudgetData({ username: 'user', budget_data: {} }, '2024-03')

  useEffect(() => {
    if (username && selectedMonth) {
      getUserBudgetData(username, selectedMonth)
      getMonthData(1)
      getBudgetData()
    }
  }, [getUserBudgetData, selectedMonth, username])
  console.log(monthBudgetData)
  console.log(budgetData)

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
