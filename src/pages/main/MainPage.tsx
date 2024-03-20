import { useCallback, useEffect } from 'react'
import { useAccountStore } from '../../shared/stores/accounts'
import { Button } from 'antd'
import { PieChart } from '../../entities/pie-chart/PieChart'
import { budgetStore } from '../../shared/stores/budget'
import dayjs from 'dayjs'
import MonthPicker from '../../entities/ui/MonthPicker'
import IncomesTable from '../../entities/incomes-table/IncomesTable'

const MainPage = () => {
  const logout = useAccountStore((s) => s.logout)
  const { username } = useAccountStore((s) => s.store.data)

  const handleLogout = useCallback(() => {
    logout()
    localStorage.removeItem('selectedModeId')
  }, [logout])

  const [getBudgetData, createBudgetData] = budgetStore((s) => [
    s.getBudgetData,
    s.createBudgetData,
  ])
  const currentDate = dayjs().format('YYYY.MM')

  const getData = useCallback(() => {
    getBudgetData(username, '2024.03')
    createBudgetData({ username: 'user', budget_data: {} }, '2024.03')
  }, [])

  useEffect(() => {
    if (username) {
      getBudgetData(username, currentDate)
    }
  }, [username])

  return (
    <>
      <Button style={{ margin: '16px 10px 0' }} onClick={() => handleLogout()}>
        Выйти
      </Button>
      <Button style={{ margin: '16px 10px 0' }} onClick={() => getData()}>
        GetData
      </Button>
      <MonthPicker />
      <PieChart />
      <IncomesTable />
    </>
  )
}

export default MainPage
