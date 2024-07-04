import { useCallback, useEffect } from 'react'
import { Button, Flex } from 'antd'
import budgetStore, { IBudgetStore } from '../../shared/stores/budget'
import MonthPicker from '@/entities/month-picker/MonthPicker'
import { PieChartCosts } from '@/entities/pie-chart/PieChartCosts'
import { useAccountStore } from '@/shared/stores/accounts'
import { PieChartIncomes } from '@/entities/pie-chart/PieChartIncomes'
import CostsTableSummary from '@/entities/costs-table/CostsTableSummary'
import IncomesTableSummary from '@/entities/incomes-tables/IncomsTableSummary'
import IncomesCostsSummary from '@/entities/incomes-costs-summary/IncomesCostsSummary'
import Titles from '@/entities/pie-chart/Titles'
import { CompareChart } from '@/entities/pie-chart/CompareChart'

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

  const userName = localStorage.getItem('username')
  const id = localStorage.getItem('id')

  useEffect(() => {
    if (id && selectedMonth) {
      getUserBudgetData(selectedMonth, Number(id))
    }
  }, [selectedMonth])

  useEffect(() => {
    if (userBudgetData) {
      return
    } else if (!userBudgetData && selectedMonth) {
      const newUserData = {
        user_id: Number(id),
        budget_data: {
          incomes_categories: [],
          costs_categories: [],
          incomes: [],
          costs: [],
        },
      }

      createMonthBudgetData(newUserData, selectedMonth, Number(id))
    }
  }, [userBudgetData, id, selectedMonth])

  useEffect(() => {
    getCostsCategories()
    getIncomesCategories()
  }, [])

  return (
    <>
      <Flex justify={'space-between'} align={'center'} style={{ height: 60 }}>
        <MonthPicker />
        <Button onClick={() => handleLogout()}>Выйти</Button>
      </Flex>

      <Titles />
      {((userBudgetData && userBudgetData?.budget_data?.incomes.length > 0) ||
        (userBudgetData && userBudgetData?.budget_data?.costs.length > 0)) && (
        <div style={{ display: 'flex', maxWidth: '100vw' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '70vw',
            }}
          >
            <div style={{ display: 'flex', margin: '16px', maxWidth: '100%' }}>
              <PieChartIncomes />
              <PieChartCosts />
            </div>
            <IncomesCostsSummary />
          </div>

          <CompareChart />
        </div>
      )}

      <IncomesTableSummary />
      <CostsTableSummary />
    </>
  )
}

export default MainPage
