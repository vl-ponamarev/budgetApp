/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import { Button, Input, Popconfirm, Table, Select, Typography } from 'antd'
import budgetStore, { IBudgetStore } from '@/shared/stores/budget'
import {
  EditableCell,
  EditableRow,
} from '@/shared/ui/editable-row-cell/EditableRowAndCell' // import IncomesExpandedRowRender from './IncomesExpandedRowRender'
import IncomesExpandedRowRender from './IncomesExpandedRowRender'

type EditableTableProps = Parameters<typeof Table>[0]

interface DataType {
  key: React.Key
  income: string
  sum: string | number
  isNew: boolean
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

const IncomesTableSummary: React.FC = () => {
  const [
    selectedMonth,
    userBudgetData,
    incomesCategories,
    monthBudgetData,
    updateBudgetData,
  ] = budgetStore((s: IBudgetStore) => [
    s.selectedMonth,
    s.userBudgetData,
    s.incomesCategories,
    s.monthBudgetData,
    s.updateBudgetData,
  ])

  // const { Text } = Typography
  console.log(selectedMonth)
  console.log(userBudgetData)
  console.log(incomesCategories)
  console.log(monthBudgetData)

  const { Text } = Typography
  // const { user_id } = userBudgetData
  // console.log(user_id)

  const [dataSource, setDataSource] = useState<DataType[]>([])

  useEffect(() => {
    let totalAmountByCategory: { [key: number]: number } = {}
    if (userBudgetData) {
      totalAmountByCategory =
        userBudgetData?.budget_data?.incomes?.reduce((acc: any, entry: any) => {
          if (acc[entry.category_id]) {
            acc[entry.category_id] += Number(entry.amount)
          } else {
            acc[entry.category_id] = Number(entry.amount)
          }
          return acc
        }, {}) ?? []
    }

    const updatedTotalAmountByCategory = { ...totalAmountByCategory }

    userBudgetData?.budget_data?.incomes_categories.forEach((category) => {
      const { id } = category
      if (!(id in updatedTotalAmountByCategory)) {
        updatedTotalAmountByCategory[id] = 0
      }
    })

    const dataSourcePrepare: DataType[] = []

    for (const key in updatedTotalAmountByCategory) {
      const incomeName = userBudgetData?.budget_data?.incomes_categories.find(
        (category: any) => String(category.id) === String(key),
      )

      const { name } = incomeName ?? ''
      const obj: DataType = {
        sum: Number(updatedTotalAmountByCategory[key]),
        income: name,
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
  }

  const [selectOptions, setSelectOptions] = useState([])

  useEffect(() => {
    const options = incomesCategories
      ?.map((category: { name: string; id: number }) => {
        return { value: category.id, label: category.name }
      })
      .filter((category: any) => {
        const usedCategory = dataSource.find(
          (dataSource) => dataSource.income === category.label,
        )
        return !usedCategory
      })
    setSelectOptions(options)
  }, [userBudgetData, dataSource])

  const [count, setCount] = useState(2)

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)
    setSelectTargetValue('')
    setInputTargetValue('')

    const userBudgetDataCopy = structuredClone(userBudgetData)
    const newIncomesCategories =
      userBudgetDataCopy?.budget_data?.incomes_categories.filter(
        (item) => String(item.id) !== String(key),
      )
    const updatedIncomes = userBudgetDataCopy?.budget_data?.incomes.filter(
      (item) => String(item.category_id) !== String(key),
    )
    //@ts-ignore
    userBudgetDataCopy.budget_data.incomes_categories = newIncomesCategories
    //@ts-ignore
    userBudgetDataCopy.budget_data.incomes = updatedIncomes
    console.log('userBudgetDataCopy', userBudgetDataCopy)
    console.log(key)
    //@ts-ignore
    updateBudgetData(userBudgetDataCopy, selectedMonth, userBudgetData?.user_id)
  }

  const handleCancel = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)
    setAddNewItemState(false)
  }
  const [inputTargetValue, setInputTargetValue] = useState('')
  const handleSaveNewItem = (key: React.Key) => {
    let newIncomesCategories
    const newData = dataSource?.map((item) => {
      const listNum = String(
        (userBudgetData?.budget_data?.incomes_categories?.length ?? 0) + 1,
      )
      let selectTargetValueObject
      const [selectValue] = selectTargetValue
      if (selectTargetValue.length > 0) {
        selectTargetValueObject = incomesCategories?.find(
          (category: any) => String(category.id) === String(selectValue),
        )
      }
      const value =
        selectTargetValue.length > 0
          ? selectTargetValueObject?.name
          : inputTargetValue
      const keyValue =
        selectTargetValue.length > 0 ? selectTargetValueObject?.id : listNum
      newIncomesCategories = { id: keyValue, name: value }
      return item.key === key
        ? {
            sum: 0,
            income: value,
            isNew: false,
            key: String(keyValue),
          }
        : item
    })
    setDataSource(newData)
    setAddNewItemState(false)
    setSelectTargetValue('')
    setInputTargetValue('')

    const userBudgetDataCopy = structuredClone(userBudgetData)
    userBudgetDataCopy?.budget_data?.incomes_categories.push(
      newIncomesCategories,
    )
    console.log(userBudgetDataCopy)

    if (userBudgetData?.user_id) {
      updateBudgetData(
        userBudgetDataCopy,
        selectedMonth,
        userBudgetData?.user_id,
      )
    }
  }

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
      title: 'Доход ',
      dataIndex: 'income',
      width: '70%',
      render: (_, record) => {
        if (record.isNew) {
          return (
            <>
              <Select
                placeholder="Выберете статью дохода из списка"
                onChange={(value) => handleSelectChange(value)}
                options={selectOptions}
                style={{ width: '100%' }}
                mode="multiple"
                maxCount={1}
                disabled={inputTargetValue ? true : false}
              />
              <Text mark style={{ padding: 40 }}>
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
        return record.income // Или отображаем что-то другое для существующих записей
      },
      editable: false,
    },
    {
      title: 'Общая сумма',
      dataIndex: 'sum',
      editable: false,
      width: '15%',
    },
    {
      title: 'Действия',
      dataIndex: 'action',
      width: '15%',

      render: (_, record) => {
        if (record.isNew) {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Button onClick={() => handleSaveNewItem(record.key)}>
                Save
              </Button>

              {/* <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => handleCancel(record.key)}
              > */}
              <Button onClick={() => handleCancel(record.key)}>Cancel</Button>
              {/* </Popconfirm> */}
            </div>
          )
        }
        return (
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Popconfirm
              title={`При удалении категории будут \n удалены все ее записи. Удалить?`}
              onConfirm={() => handleDelete(record.key)}
            >
              <Button>Delete</Button>
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
      income: '',
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
      <div style={{ width: '90%', marginTop: 30 }}>
        <Button
          onClick={handleAdd}
          style={{ marginBottom: 10, right: 0 }}
          disabled={addNewItemState}
        >
          Добавить статью дохода
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
            <IncomesExpandedRowRender record={record} />
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

export default IncomesTableSummary
