/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'

import { Button, Input, Popconfirm, Table, Select, Typography } from 'antd'
import dayjs from 'dayjs'
import budgetStore, { IBudgetStore } from '../../shared/stores/budget'
import { ExpandedRowRender } from './exapmle'
import { EditableCell, EditableRow } from './EditableRowAndCell'
import CostsExpandedRowRender from './CostsExpandedRowRender'

type EditableTableProps = Parameters<typeof Table>[0]

interface DataType {
  key: React.Key
  cost: string
  sum: string
  isNew: boolean
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

const CostsTableSummary: React.FC = () => {
  const [selectedMonth, userBudgetData] = budgetStore((s: IBudgetStore) => [
    s.selectedMonth,
    s.userBudgetData,
  ])
  // const { Text } = Typography
  console.log(dayjs(selectedMonth).format('MM.YYYY'))
  console.log(userBudgetData)

  const { Text } = Typography
  // const {
  //   budget_data: { costs },
  // } = userBudgetData || {}
  // console.log(costs)

  const [dataSource, setDataSource] = useState<DataType[]>([])

  useEffect(() => {
    let totalAmountByCategory
    if (userBudgetData) {
      totalAmountByCategory =
        userBudgetData?.budget_data?.costs?.reduce((acc: any, entry: any) => {
          if (acc[entry.category_id]) {
            acc[entry.category_id] += entry.amount
          } else {
            acc[entry.category_id] = entry.amount
          }
          return acc
        }, {}) ?? []
    }
    const dataSourcePrepare: DataType[] = []
    for (const key in totalAmountByCategory) {
      const costName = userBudgetData?.budget_data?.costs_categories.find(
        (category: any) => String(category.id) === key,
      )
      const { name } = costName
      const obj: DataType = {
        sum: totalAmountByCategory[key],
        cost: name,
        isNew: false,
        key,
      }
      dataSourcePrepare.push(obj)
    }
    setDataSource(dataSourcePrepare)
  }, [userBudgetData])

  const [selectTargetValue, setSelectTargetValue] = useState('')
  const handleSelectChange = (value: string) => {
    value.length === 0 ? setSelectTargetValue('') : setSelectTargetValue(value)
    // value.length === 0 ? setAddNewItemState(false) : setAddNewItemState(true)
  }

  const [selectOptions, setSelectOptions] = useState([])

  useEffect(() => {
    const options = userBudgetData?.budget_data?.costs_categories
      .map((category: { name: string; id: number }) => {
        return { value: category.id, label: category.name }
      })
      .filter((category: any) => {
        const usedCategory = dataSource.find(
          (dataSource) => dataSource.cost === category.label,
        )
        return !usedCategory
      })
    setSelectOptions(options)
  }, [userBudgetData, dataSource])

  // const dateFormat = 'YYYY-MM-DD'

  const [count, setCount] = useState(2)

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)
    setSelectTargetValue('')
    setInputTargetValue('')
  }

  const handleCancel = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)
    setAddNewItemState(false)
  }
  const [inputTargetValue, setInputTargetValue] = useState('')
  const handleSaveNewItem = (key: React.Key) => {
    const newData = dataSource.map((item) => {
      const listNum = String(
        userBudgetData?.budget_data?.costs_categories.length + 1,
      )
      let selectTargetValueObject
      const [selectValue] = selectTargetValue
      if (selectTargetValue.length > 0) {
        selectTargetValueObject =
          userBudgetData?.budget_data?.costs_categories.find(
            (category: any) => String(category.id) === String(selectValue),
          )
      }
      const value =
        selectTargetValue.length > 0
          ? selectTargetValueObject?.name
          : inputTargetValue
      const keyValue =
        selectTargetValue.length > 0 ? selectTargetValueObject?.id : listNum
      return item.key === key
        ? {
            sum: 0,
            cost: value,
            isNew: false,
            key: String(keyValue),
          }
        : item
    })
    //@ts-expect-error
    setDataSource(newData)
    setAddNewItemState(false)
    setSelectTargetValue('')
    setInputTargetValue('')
  }
  console.log(dataSource)

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputTargetValue(e.target.value)
  }

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Расход ',
      dataIndex: 'cost',
      width: '50%',
      render: (_, record) => {
        if (record.isNew) {
          return (
            <>
              <Select
                placeholder="Выберете существующую статью расхода из списка"
                onChange={(value) => handleSelectChange(value)}
                options={selectOptions}
                style={{ width: '100%' }}
                mode="multiple"
                maxCount={1}
                disabled={inputTargetValue ? true : false}
              />
              <Text mark style={{ padding: 20 }}>
                или
              </Text>
              <Input
                placeholder="Введите название статьи"
                // allowClear
                onChange={onInputChange}
                disabled={selectTargetValue ? true : false}
              />
            </>
          )
        }
        return record.cost // Или отображаем что-то другое для существующих записей
      },
      editable: false,
    },
    {
      title: 'Общая сумма',
      dataIndex: 'sum',
      editable: false,
    },
    {
      title: 'Действия',
      dataIndex: 'action',
      render: (_, record) => {
        if (record.isNew) {
          return (
            <>
              <Button onClick={() => handleSaveNewItem(record.key)}>
                Save
              </Button>

              <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => handleCancel(record.key)}
              >
                <Button>Cancel</Button>
              </Popconfirm>
            </>
          )
        }
        return (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button>Delete</Button>
          </Popconfirm>
        ) // Или отображаем что-то другое для существующих записей
      },
    },
  ]

  console.log(dataSource)
  const [addNewItemState, setAddNewItemState] = useState(false)
  const handleAdd = () => {
    const newData: DataType = {
      key: `new_${count}`,
      cost: '',
      sum: '',
      isNew: true,
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
        <Button
          onClick={handleAdd}
          type="primary"
          style={{ marginBottom: 10, right: 0 }}
          disabled={addNewItemState}
        >
          Добавить статью расхода
        </Button>
      </div>
      <Table
        // style={{ width: '90%' }}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        expandable={{
          expandedRowRender: (record) => (
            <CostsExpandedRowRender record={record} />
          ), // expandedRowRender: (record) => ExpandedRowRender(record),
          // defaultExpandedRowKeys: ['1', '2'],
          defaultExpandAllRows: true,
          columnWidth: 50,
        }}
        pagination={{ position: ['bottomLeft'] }}
      />
    </>
  )
}

export default CostsTableSummary
