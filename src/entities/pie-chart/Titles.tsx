import { getCurrentDate } from '@/shared/utils/currentDate'
import { Typography } from 'antd'

const Titles: React.FC = () => {
  const { Text } = Typography

  return (
    <div
      style={{ display: 'flex', justifyContent: 'space-around', width: '70vw' }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Text strong style={{ fontSize: '15px' }}>
          {`Статистика доходов за ${getCurrentDate()}`}
        </Text>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Text strong style={{ fontSize: '15px' }}>
          {`Статистика расходов за ${getCurrentDate()}`}
        </Text>
      </div>
    </div>
  )
}

export default Titles
