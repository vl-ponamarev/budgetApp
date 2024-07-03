/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import {
  Button,
  Input,
  Popconfirm,
  Table,
  Select,
  Typography,
  message,
  Tooltip,
} from 'antd'
import { v4 as uuidv4 } from 'uuid'
import budgetStore, { IBudgetStore } from '../../shared/stores/budget'
import {
  EditableCell,
  EditableRow,
} from '@/shared/ui/editable-row-cell/EditableRowAndCell'
import CommonTable from '@/shared/ui/common-table/CommonTable'
import { CustomAddCategoryIcon } from '@/shared/ui/customIcons/customAddCategoryIcon'
import { CustomDeleteIcon } from '@/shared/ui/customIcons/customDeleteIcon'

type EditableTableProps = Parameters<typeof Table>[0]

interface DataType {
  key: React.Key
  cost: string
  sum: string | number
  isNew: boolean
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

const CostsTableSummary: React.FC = () => {
  const [
    selectedMonth,
    userBudgetData,
    costsCategories,
    incomesCategories,
    monthBudgetData,
    updateBudgetData,
  ] = budgetStore((s: IBudgetStore) => [
    s.selectedMonth,
    s.userBudgetData,
    s.costsCategories,
    s.incomesCategories,
    s.monthBudgetData,
    s.updateBudgetData,
  ])

  // const { Text } = Typography
  console.log(selectedMonth)
  console.log(userBudgetData)
  console.log(incomesCategories)
  console.log(monthBudgetData)

  // console.log(user_id)

  const {
    budget_data: { costs_categories },
  } = userBudgetData ?? { budget_data: { costs_categories: [] } }

  console.log(costs_categories)

  const [dataSource, setDataSource] = useState<DataType[]>([])
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    let totalAmountByCategory: { [key: number]: number } = {}
    if (userBudgetData) {
      totalAmountByCategory =
        userBudgetData?.budget_data?.costs?.reduce((acc: any, entry: any) => {
          if (acc[entry.category_id]) {
            acc[entry.category_id] += Number(entry.amount)
          } else {
            acc[entry.category_id] = Number(entry.amount)
          }
          return acc
        }, {}) ?? []
    }

    const updatedTotalAmountByCategory = { ...totalAmountByCategory }

    console.log(updatedTotalAmountByCategory)

    userBudgetData?.budget_data?.costs_categories.forEach((category) => {
      const { id } = category
      if (!(id in updatedTotalAmountByCategory)) {
        updatedTotalAmountByCategory[id] = 0
      }
    })

    const dataSourcePrepare: DataType[] = []

    for (const key in updatedTotalAmountByCategory) {
      const costName = userBudgetData?.budget_data?.costs_categories.find(
        (category: any) => String(category.id) === String(key),
      )

      const { name } = costName ?? ''
      const obj: DataType = {
        sum: Number(updatedTotalAmountByCategory[key]),
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
    const options = costsCategories
      ?.map((category: { name: string; id: number }) => {
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

  const [count, setCount] = useState(2)

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)
    setSelectTargetValue('')
    setInputTargetValue('')

    const userBudgetDataCopy = structuredClone(userBudgetData)
    const newCostsCategories =
      userBudgetDataCopy?.budget_data?.costs_categories?.filter(
        (item) => String(item.id) !== String(key),
      ) ?? []
    const updatedCosts =
      userBudgetDataCopy?.budget_data?.costs?.filter(
        (item) => String(item.category_id) !== String(key),
      ) ?? []
    if (userBudgetDataCopy) {
      userBudgetDataCopy.budget_data.costs_categories = newCostsCategories
      userBudgetDataCopy.budget_data.costs = updatedCosts
    }

    console.log('userBudgetDataCopy', userBudgetDataCopy)
    console.log(key)

    updateBudgetData(userBudgetDataCopy, selectedMonth, userBudgetData?.user_id)
  }

  const handleCancel = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)
    setAddNewItemState(false)
  }
  const [inputTargetValue, setInputTargetValue] = useState('')

  console.log(dataSource)

  const handleSaveNewItem = (key: React.Key) => {
    let neWCostsCategory: { [key: string]: string } = {}
    console.log(key)

    const newData = dataSource?.map((item, index) => {
      let selectTargetValueObject
      const [selectValue] = selectTargetValue
      console.log(selectValue)

      if (selectTargetValue.length > 0) {
        console.log(costsCategories)

        selectTargetValueObject = costsCategories?.find(
          (category: any) => String(category.id) === String(selectValue),
        )
      }
      console.log(inputTargetValue)
      console.log(selectTargetValueObject)

      const value = selectTargetValueObject
        ? selectTargetValueObject?.name
        : inputTargetValue
      const keyValue = selectTargetValueObject
        ? selectTargetValueObject?.id
        : uuidv4()
      neWCostsCategory = { id: keyValue, name: value }
      return item.key === key
        ? {
            sum: 0,
            cost: value,
            isNew: false,
            key: String(keyValue),
          }
        : item
    })

    const isInputValueExist = costs_categories?.filter(
      (category: any) =>
        category?.name?.toLowerCase() ===
        String(inputTargetValue.toLowerCase()),
    )

    console.log(newData)

    if (isInputValueExist.length > 0) {
      messageApi.open({
        type: 'error',
        content: 'Статья расходов уже существует',
      })
      setAddNewItemState(false)
      setSelectTargetValue('')
      setInputTargetValue('')
    } else {
      console.log('oks')

      setDataSource(newData)
      setAddNewItemState(false)
      setSelectTargetValue('')
      setInputTargetValue('')
      const userBudgetDataCopy = structuredClone(userBudgetData)
      userBudgetDataCopy?.budget_data?.costs_categories.push(neWCostsCategory)
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
      title: 'Расход ',
      dataIndex: 'cost',
      width: '70%',
      render: (_, record) => {
        if (record.isNew) {
          return (
            <>
              <Select
                placeholder="Выберете статью расхода из списка"
                onChange={(value) => handleSelectChange(value)}
                options={selectOptions}
                style={{ width: '100%' }}
                mode="multiple"
                maxCount={1}
                disabled={inputTargetValue ? true : false}
              />
              <Typography.Text style={{ padding: 40 }}>или</Typography.Text>
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
      width: '15%',
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
                height: '100%',
              }}
            >
              {contextHolder}

              <Button onClick={() => handleSaveNewItem(record.key)}>
                Сохранить
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-start',
              height: '40px',
            }}
          >
            <Popconfirm
              title={`При удалении статьи будут \n удалены все ее записи. Удалить?`}
              onConfirm={() => handleDelete(record.key)}
            >
              <Tooltip title="Удалить статью">
                <Button style={{ border: 'none', height: '100%' }}>
                  <CustomDeleteIcon />
                </Button>
              </Tooltip>
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
      cost: '',
      sum: '',
      isNew: true,
    }
    setDataSource([newData, ...dataSource])
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
      <div style={{ width: '90%', margin: '30px 0 10px 0' }}>
        <Tooltip title="Добавить новую статью">
          <Button
            onClick={handleAdd}
            style={{ marginBottom: 10, right: 0, border: 'none' }}
            disabled={addNewItemState}
          >
            <CustomAddCategoryIcon />
          </Button>
        </Tooltip>
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
            <CommonTable record={record} data="costs" />
          ),
          defaultExpandAllRows: true,
          columnWidth: 50,
        }}
        pagination={{ position: ['bottomLeft'] }}
      />
    </>
  )
}

export default CostsTableSummary
