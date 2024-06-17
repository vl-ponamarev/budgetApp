import { FC, useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row } from 'antd'
import { Typography } from 'antd';
import { useAccountStore } from '@/shared/stores/accounts';
import { Link, useLocation } from 'react-router-dom';


const { Title, Text } = Typography;

const Login: FC = () => {

    const login = useAccountStore((state) => state.login)
    const signIn = useAccountStore((state) => state.signIn)

    const handleSubmit = async (values: any) => {
        const username = values?.username
        const password = values?.password

        currentLocation === '/' ? login(username, password) : signIn(username, password)
    }

    const location = useLocation();
    const[currentLocation, setCurrentLocation] = useState(location.pathname);

    useEffect(() => {
        setCurrentLocation(location.pathname);
    },[location])



    return (
        <Row
            align="middle"
            justify="center"
            style={{
                height: '100vh',

            }}
        >
            <Col
                span={24} style={{ height: '100%', display: 'flex',
                    flexDirection: 'column', justifyContent: 'center',
                    alignItems: 'center' }}
            >
                <Title level={2}>Авторизация</Title>
                <Form
                    title="Авторизация"
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={handleSubmit}
                    onFinishFailed={() => {console.log('Ошибка')}}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '' }]}
                    >
                        <Input size="large" placeholder="Введите логин" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '' }]}
                    >
                        <Input.Password size="large" placeholder="Введите пароль" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            size="large"
                            type="primary" htmlType="submit"
                            style={{ width: '100%' }}
                        >
                            Подтвердить
                        </Button>
                    </Form.Item>
                </Form>
                <Link to={currentLocation === '/' ? '/sign-in' : "/login"}>
                    <Text>{currentLocation === '/' ? 'Зарегистрироваться' :'Войти' }</Text>
                </Link>
            </Col>
        </Row>
    )
}

export default Login