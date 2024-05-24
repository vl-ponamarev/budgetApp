import React, { useEffect, useState } from 'react'
import {
  Button,
  Popconfirm,
  Table,
  DatePicker,
  Tooltip,
  DatePickerProps,
} from 'antd'
import budgetStore, { IBudgetStore } from '../../shared/stores/budget'
import {
  EditableCell,
  EditableRow,
} from '../../shared/ui/editable-row-cell/EditableRowAndCell'
import dayjs, { Dayjs } from 'dayjs'
import { CloseOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons'

type EditableTableProps = Parameters<typeof Table>[0]

interface DataType {
  key: React.Key
  date: Dayjs
  amount: number
  comment: string
  category_id: number
  isNew: boolean
}

type IncomesExpandedRowRenderProps = {
  record: any
}

type TIncome = {
  category_id: number
  amount: number
  comment: string
  date: string
  id: number
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

const IncomesExpandedRowRender: React.FC<IncomesExpandedRowRenderProps> = ({
  record,
}) => {
  const [selectedMonth, userBudgetData, updateBudgetData] = budgetStore(
    (s: IBudgetStore) => [
      s.selectedMonth,
      s.userBudgetData,
      s.updateBudgetData,
    ],
  )

  console.log(record)
  console.log(userBudgetData)

  const [dataSource, setDataSource] = useState<DataType[]>([])
  const dateFormat = 'YYYY-MM-DD'

  useEffect(() => {
    if (userBudgetData) {
      const dataByCategory = userBudgetData?.budget_data?.incomes
        ?.reduce((acc: any[], income: TIncome) => {
          if (String(income.category_id) === record.key) {
            acc.push(income)
          }
          return acc
        }, [])
        .map((item: TIncome) => {
          return {
            date: dayjs(item.date, dateFormat),
            amount: item.amount,
            comment: item.comment,
            key: item.id,
            category_id: item.category_id,
            isNew: false,
          }
        })
      console.log(dataByCategory)

      setDataSource(dataByCategory)
    }
  }, [userBudgetData])

  // const dateFormat = 'YYYY-MM-DD'

  const [count, setCount] = useState(2)

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)

    const userBudgetDataCopy = structuredClone(userBudgetData)
    const updatedIncomes = userBudgetDataCopy?.budget_data?.incomes.filter(
      (item) => String(item.id) !== String(key),
    )
    userBudgetDataCopy.budget_data.incomes = updatedIncomes

    updateBudgetData(userBudgetDataCopy, selectedMonth, userBudgetData?.user_id)
  }

  const handleCancel = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)
    setAddNewItemState(false)
  }

  const handleSaveNewItem = (key: React.Key) => {
    console.log(key)

    const newData = dataSource.map((item) => {
      return item.key === key
        ? {
            ...item,
            isNew: false,
          }
        : item
    })
    setDataSource(newData)
    setAddNewItemState(false)
    const newIncome = dataSource.find((item) => item.key === key)

    const newItemIncome = {
      id: userBudgetData
        ? userBudgetData?.budget_data?.incomes?.length + 1
        : null,
      category_id: newIncome?.category_id,
      amount: newIncome?.amount,
      date: newIncome?.date.toDate(),
      comment: newIncome?.comment,
    }

    const userBudgetDataCopy = structuredClone(userBudgetData)
    userBudgetDataCopy?.budget_data?.incomes.push(newItemIncome)

    if (userBudgetData?.user_id) {
      updateBudgetData(
        userBudgetDataCopy,
        selectedMonth,
        userBudgetData?.user_id,
      )
    }
  }
  console.log(dataSource)

  const onChange: DatePickerProps<Dayjs[]>['onChange'] = (date, dateString) => {
    console.log(date, dateString)
  }

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Дата ',
      dataIndex: 'date',
      width: '20%',
      render: (_, record) => {
        return (
          <DatePicker
            placeholder="Выберете дату"
            onChange={onChange}
            style={{ width: '100%' }}
            defaultValue={record.date}
          />
        )
      },
      editable: false,
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      editable: true,
      width: '15%',
    },
    {
      title: 'Комментарий',
      dataIndex: 'comment',
      editable: true,
      width: '50%',
    },
    {
      title: 'Действия',
      dataIndex: 'action',
      width: '15%',
      render: (_, record) => {
        if (record.isNew) {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Button
                onClick={() => handleSaveNewItem(record.key)}
                shape="round"
                size="small"
                style={{
                  backgroundColor: 'green',
                  color: 'white',
                  boxShadow: '-5px 10px 15px rgba(67,196,169,.6)',
                }}
              >
                <SaveOutlined />
              </Button>

              <Button
                shape="round"
                size="small"
                style={{
                  backgroundColor: '#FF2F16',
                  color: 'white',
                }}
                onClick={() => handleCancel(record.key)}
              >
                <CloseOutlined />
              </Button>
            </div>
          )
        }
        return (
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Popconfirm
              title="Удалить запись?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button
                shape="round"
                size="small"
                style={{
                  backgroundColor: '#FF2F16',
                  color: 'white',
                }}
              >
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </div>
        ) // Или отображаем что-то другое для существующих записей
      },
    },
  ]

  const [addNewItemState, setAddNewItemState] = useState(false)
  const handleAdd = () => {
    const newData: DataType = {
      key: `new_${count}`,
      amount: 0,
      comment: 'Введите комментарий',
      isNew: true,
      date: dayjs(),
      category_id: Number(record.key),
    }

    setDataSource([...dataSource, newData])
    setCount(count + 1)
    setAddNewItemState(true)
  }

  const handleSave = (row: DataType) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <>
      <div style={{ width: '90%' }}>
        <Tooltip title="Добавить доход">
          <Button
            onClick={handleAdd}
            type="default"
            style={{ marginBottom: 10, right: 0 }}
            disabled={addNewItemState}
          >
            Добавить доход
          </Button>{' '}
        </Tooltip>
      </div>
      <Table
        // style={{ width: '90%' }}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={{ position: ['bottomRight'] }}
      />
    </>
  )
}

export default IncomesExpandedRowRender
