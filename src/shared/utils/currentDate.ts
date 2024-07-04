import dayjs from 'dayjs'
import budgetStore from '@/shared/stores/budget'

let currentDate = dayjs().format('MM.YYYY')

const updateCurrentDate = (selectedMonth: any) => {
  currentDate = selectedMonth
    ? dayjs()
        .month(selectedMonth - 1)
        .format('MM.YYYY')
    : dayjs().format('MM.YYYY')
}

const unsubscribe = budgetStore.subscribe((state) => {
  updateCurrentDate(state.selectedMonth)
})

// unsubscribe()

export const getCurrentDate = () => currentDate
