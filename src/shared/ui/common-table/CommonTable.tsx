import React, { useEffect, useState } from 'react'
import { Button, Popconfirm, Table, DatePicker, Tooltip } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { CloseOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import budgetStore, { IBudgetStore } from '@/shared/stores/budget'

import {
  EditableCell,
  EditableRow,
} from '../editable-row-cell/EditableRowAndCell'

type EditableTableProps = Parameters<typeof Table>[0]

interface DataType {
  key: React.Key
  date: Dayjs
  amount: number
  comment: string
  category_id: number
  isNew: boolean
}

type CommonTableProps = {
  record: any
  data: 'costs' | 'incomes'
}

type TDataValue = {
  category_id: number
  amount: number
  comment: string
  date: string
  id: number
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

const CommonTable: React.FC<CommonTableProps> = ({ record, data }) => {
  const [selectedMonth, userBudgetData, updateBudgetData] = budgetStore(
    (s: IBudgetStore) => [
      s.selectedMonth,
      s.userBudgetData,
      s.updateBudgetData,
    ],
  )

  const [dataSource, setDataSource] = useState<DataType[]>([])
  const [count, setCount] = useState(2)
  const [actualDate, setActualDate] = useState<any>(undefined)
  const [actualIncomesId, setActualIncomesId] = useState<any>(undefined)
  const [addNewItemState, setAddNewItemState] = useState(false)
  const dateFormat = 'YYYY-MM-DD'

  useEffect(() => {
    if (userBudgetData) {
      const dataByCategory = userBudgetData?.budget_data[data]
        ?.reduce((acc: any[], dataValue: TDataValue) => {
          if (String(dataValue.category_id) === record.key) {
            acc.push(dataValue)
          }
          return acc
        }, [])
        .map((item: TDataValue) => {
          return {
            date: dayjs(item.date, dateFormat),
            amount: item.amount,
            comment: item.comment,
            key: item.id,
            category_id: item.category_id,
            isNew: false,
          }
        })

      setDataSource(dataByCategory)
    }
  }, [userBudgetData])

  // const dateFormat = 'YYYY-MM-DD'

  const handleDelete = (key: React.Key) => {
    const newData = dataSource?.filter((item) => item.key !== key)
    setDataSource(newData)

    const userBudgetDataCopy = userBudgetData
      ? structuredClone(userBudgetData)
      : null
    const updatedIncomes = userBudgetDataCopy?.budget_data[data].filter(
      (item) => String(item.id) !== String(key),
    )
    if (userBudgetDataCopy) {
      userBudgetDataCopy.budget_data[data] = updatedIncomes ?? []
    }

    updateBudgetData(userBudgetDataCopy, selectedMonth, userBudgetData?.user_id)
  }

  const handleCancel = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)
    setAddNewItemState(false)
  }

  const handleSaveNewItem = (key: React.Key) => {
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
      id: uuidv4(),
      category_id: newIncome?.category_id,
      amount: newIncome?.amount,
      date: actualDate?.toDate(),
      comment: newIncome?.comment,
    }

    const userBudgetDataCopy = structuredClone(userBudgetData)
    userBudgetDataCopy?.budget_data[data].push(newItemIncome)

    if (userBudgetData?.user_id) {
      updateBudgetData(
        userBudgetDataCopy,
        selectedMonth,
        userBudgetData?.user_id,
      )
    }
  }

  const onChange = (...args: any[]) => {
    setActualDate(args[0].add(1, 'day'))
    setActualIncomesId(args[2]?.key)
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
            onChange={(date, dateString) => {
              if (onChange && record) {
                onChange(date, dateString, record)
              }
            }}
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
              }}
            >
              <Button
                onClick={() => handleSaveNewItem(record.key)}
                shape="round"
                size="small"
                style={{
                  backgroundColor: 'green',
                  color: 'white',
                  boxShadow: '-1px 1px 5px #9CA5B1',
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
                  boxShadow: '-1px 1px 5px #9CA5B1',
                }}
                onClick={() => handleCancel(record.key)}
              >
                <CloseOutlined />
              </Button>
            </div>
          )
        }
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              height: '40px',
            }}
          >
            <Popconfirm
              title="Удалить запись?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Tooltip
                title={data === 'incomes' ? 'Удалить доход' : 'Удалить расход'}
              >
                <Button
                  shape="round"
                  size="small"
                  style={{
                    backgroundColor: '#FF2F16',
                    color: 'white',
                    boxShadow: '-1px 1px 5px #9CA5B1',
                    height: '100%',
                  }}
                >
                  <DeleteOutlined style={{ fontSize: '16px' }} />
                </Button>
              </Tooltip>
            </Popconfirm>
          </div>
        )
      },
    },
  ]

  const handleAdd = () => {
    const newData: DataType = {
      key: `new_${count}`,
      amount: 0,
      comment: 'Введите комментарий',
      isNew: true,
      date: dayjs(),
      category_id: record.key,
    }

    setDataSource([newData, ...dataSource])
    setCount(count + 1)
    setAddNewItemState(true)
  }

  useEffect(() => {
    if (!addNewItemState) {
      const userBudgetDataCopy = structuredClone(userBudgetData)

      const updatedIncomes = userBudgetDataCopy?.budget_data[data].map(
        (item: any) => {
          return item.id === actualIncomesId
            ? {
                ...item,
                date: actualDate?.toDate(),
              }
            : item
        },
      )

      if (userBudgetDataCopy) {
        userBudgetDataCopy.budget_data[data] = updatedIncomes ?? []
      }
      updateBudgetData(
        userBudgetDataCopy,
        selectedMonth,
        userBudgetData?.user_id,
      )
    }
    return
  }, [actualDate])

  const handleSave = (row: DataType) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setActualIncomesId(row.key)
    setDataSource(newData)
    if (!addNewItemState) {
      const userBudgetDataCopy = structuredClone(userBudgetData)

      const updatedIncomes = userBudgetDataCopy?.budget_data[data].map(
        (item: any) => {
          return item.id === row.key
            ? {
                ...item,
                amount: row.amount,
                comment: row.comment,
                date: row.date.toDate(),
              }
            : item
        },
      )

      if (userBudgetDataCopy) {
        userBudgetDataCopy.budget_data[data] = updatedIncomes ?? []
      }
      updateBudgetData(
        userBudgetDataCopy,
        selectedMonth,
        userBudgetData?.user_id,
      )
    }
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
        <Tooltip
          title={data === 'incomes' ? 'Добавить доход' : 'Добавить расход'}
        >
          <Button
            onClick={handleAdd}
            type="default"
            style={{ marginBottom: 10, right: 0 }}
            disabled={addNewItemState}
          >
            {data === 'incomes' ? 'Добавить доход' : 'Добавить расход'}
          </Button>{' '}
        </Tooltip>
      </div>
      <Table
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

export default CommonTable
