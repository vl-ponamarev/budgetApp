import { Table, TableColumnsType } from 'antd'
import budgetStore, { IBudgetStore } from '../../shared/stores/budget'
import { useEffect } from 'react'

interface ExpandedDataType {
  key: React.Key
  date: string
  name: string
  upgradeNum: string
}

export const ExpandedRowRender = (record: any) => {
  console.log(record)

  const columns: TableColumnsType<ExpandedDataType> = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Status',
      key: 'state',
    },
    { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    {
      title: 'Action',
      key: 'operation',
    },
  ]

  const [selectedMonth, userBudgetData] = budgetStore((s: IBudgetStore) => [
    s.selectedMonth,
    s.userBudgetData,
  ])
  // const { Text } = Typography
  console.log(record)
  console.log(userBudgetData)
  useEffect(() => {
    console.log('ok')
  }, [])
  const data = []
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i.toString(),
      date: '2014-12-24 23:12:00',
      name: 'This is production name',
      upgradeNum: 'Upgraded: 56',
    })
  }
  return (
    <Table
      columns={columns}
      dataSource={data}
      //   bordered
      pagination={{ position: ['bottomRight'] }}
    />
  )
}
