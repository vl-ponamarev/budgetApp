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
    monthBudgetData,
  ] = budgetStore((s: IBudgetStore) => [
    s.selectedMonth,
    s.getUserBudgetData,
    s.getCostsCategories,
    s.getIncomesCategories,
    s.userBudgetData,
    s.createMonthBudgetData,
    s.clearStore,
    s.monthBudgetData,
  ])

  const handleLogout = useCallback(() => {
    logout()
    localStorage.removeItem('selectedModeId')
    localStorage.removeItem('id')
    clearStore()
  }, [logout])

  const userName = localStorage.getItem('username')

  console.log(selectedMonth)
  console.log(userBudgetData)
  console.log(monthBudgetData)

  const id = localStorage.getItem('id')

  console.log(id)

  useEffect(() => {
    if (id && selectedMonth) {
      getUserBudgetData(selectedMonth, Number(id))
      console.log('ok')
    }
  }, [selectedMonth])

  useEffect(() => {
    if (userBudgetData) {
      console.log(userBudgetData)
      return
    } else if (!userBudgetData && selectedMonth) {
      console.log('ok')
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

  // useEffect(() => {
  //   if (userBudgetData && Object.keys(userBudgetData).length > 0) {
  //     return
  //   } else {
  //     const id = localStorage.getItem('id')
  //     const newUserData = {
  //       user_id: Number(id),
  //       budget_data: {
  //         incomes_categories: [],
  //         costs_categories: [],
  //         incomes: [],
  //         costs: [],
  //       },
  //     }
  //     if (selectedMonth) {
  //       createMonthBudgetData(newUserData, selectedMonth, Number(id))
  //     }
  //   }
  // }, [userBudgetData, selectedMonth])
  console.log(userBudgetData)

  return (
    <>
      <Flex justify={'space-between'} align={'center'} style={{ height: 60 }}>
        <MonthPicker />
        <Button onClick={() => handleLogout()}>Выйти</Button>
      </Flex>

      <div>{userName}</div>
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
