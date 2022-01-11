import { React } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap'
import { Formik, useField } from 'formik';
import * as Yup from 'yup';
import styles from '../layout/LoginContainer.module.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DangerousIcon from '@mui/icons-material/Dangerous';

import translate from '../Utils/engToHeb.json'

export function SignupForm({ formSubmit, message }) {
    const navigate = useNavigate();

    const InputField = ({ label, ...props }) => {
        const [field, meta] = useField(props);
        return (
            <Form.Group className="mb-3">
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    isInvalid={meta.touched && !!meta.error}
                    // isValid={meta.value && !meta.error}
                    {...field} {...props}
                />
                {/* <Form.Control.Feedback></Form.Control.Feedback> */}
                <Form.Control.Feedback type="invalid">
                    {meta.error}
                </Form.Control.Feedback>
            </Form.Group>
        )
    }

    const handleLoginPage = () => {
        navigate('/login')
    }


    return (
        <div className={styles.felids} style={{ marginTop: '10vh' }}>
            {message && message.data !== undefined && message.status === 'OK' ?
                <div>
                    <Alert variant={'success'} style={{ marginTop: 20 }} >
                        <div className='row align-items-center mb-2'>
                            <CheckCircleIcon color='success' fontSize='large' className='col' />
                        </div>
                        <div className='col text-center'>
                            {message.data}
                        </div>
                    </Alert>
                    <Row className="mb-3">
                        <Col onClick={handleLoginPage}><span id="login" className={`badge smallBtn ${styles.badgeLight}`}>חזרה למסך כניסה</span></Col>
                    </Row>
                </div>
                :
                <div>
                    <h3 className={styles.title}>הרשמה למערכת</h3>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            email: '',
                            firstName: '',
                            lastName: '',
                            password: '',
                            passwordVer: ''
                        }}
                        validationSchema={Yup.object({
                            email: Yup.string().email(translate.reqEmailMsg).required(translate.requiredMsg),
                            firstName: Yup.string().required(translate.requiredMsg),
                            lastName: Yup.string().required(translate.requiredMsg),
                            password: Yup.string().min(6, translate.passValidMsg).required(translate.requiredMsg),
                            passwordVer: Yup.string().oneOf([Yup.ref('password'), null], 'סיסמאות לא זהות').required(translate.requiredMsg)
                        })}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            if (formSubmit) {
                                setSubmitting(true);
                                await formSubmit(values);
                                setSubmitting(false);

                            }
                        }}
                        validateOnBlur={false}
                    >
                        {({ isSubmitting, handleSubmit, handleChange, setFieldValue }) => (
                            <Form noValidate onSubmit={handleSubmit} onChange={handleChange}>
                                <InputField
                                    label={`כתובת דוא"ל:`}
                                    type='email'
                                    name="email"
                                    disabled={isSubmitting}
                                />
                                <InputField
                                    label={`שם פרטי:`}
                                    name="firstName"
                                    type='text'
                                    disabled={isSubmitting}
                                />
                                <InputField
                                    label={`שם משפחה:`}
                                    name="lastName"
                                    type='text'
                                    disabled={isSubmitting}
                                />
                                <InputField
                                    label={`סיסמה:`}
                                    name="password"
                                    type='password'
                                    disabled={isSubmitting}
                                />
                                <InputField
                                    label={`הקלד שוב את הסיסמה:`}
                                    name="passwordVer"
                                    type='password'
                                    disabled={isSubmitting}
                                />
                                <div className={`form-group d-grid gap-2 mx-auto ${styles.saveBtn}`}>
                                    <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ?
                                        <div>אנא המתן... <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /></div>
                                        : "הרשמה"}</Button>
                                    <Row className="mb-3">
                                        <Col onClick={handleLoginPage}><span id="forgot" className={`badge smallBtn ${styles.badgeLight}`}>כבר רשום?</span></Col>
                                    </Row>
                                    {message && message.data !== undefined && message.status !== 'OK' ?
                                        <Alert variant={'danger'} style={{ marginTop: 20 }}>{<DangerousIcon color='danger' fontSize='large' />} {message.data}</Alert> : null}
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            }
        </div>
    )
}
