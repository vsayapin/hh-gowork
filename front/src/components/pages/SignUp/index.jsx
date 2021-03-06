import React, { useState, useCallback, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import MobileStepper from '@material-ui/core/MobileStepper';
import Select from '@material-ui/core/Select';
import withTheme from '@material-ui/core/styles/withTheme';
import Link from '@material-ui/core/Link';

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

import Cookies from 'js-cookie';

import store from 'src/store';

import Form from 'src/components/shared/Form';
import Header from 'src/components/shared/Header';
import HHLoginButton from 'src/components/shared/HHLoginButton';
import LinkButton from 'src/components/shared/LinkButton';
import SubmitButton from 'src/components/shared/SubmitButton';

import Api from 'src/api';

const MIN_PASSWORD_LENGTH = 8;
const SignUp = observer((props) => {
    const [email, setEmail] = useState('');
    const [firstPassword, setFirstPassword] = useState('');
    const [secondPassword, setSecondPassword] = useState('');
    const [checkbox, setCheckbox] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState(null);
    const [firstPasswordErrorMessage, setFirstPasswordErrorMessage] = useState(null);
    const [secondPasswordErrorMessage, setSecondPasswordErrorMessage] = useState(null);
    const [checkboxErrorMessage, setCheckboxErrorMessage] = useState(null);
    const [requestIsInProcess, setRequestState] = useState(false);

    const firstPasswordName = 'firstPassword';
    const secondPasswordName = 'secondPassword';
    const checkboxName = 'checkbox';

    useEffect(() => {
        if (Cookies.get('gw_email')) {
            props.history.push('/course');
        }
    }, [props.history]);

    const onPasswordInputChange = useCallback((value, name) => {
        switch (name) {
            case firstPasswordName:
                setFirstPassword(value);
                break;
            case secondPasswordName:
                setSecondPassword(value);
                break;
            case checkboxName:
                setCheckbox(value);
                break;
        }
    }, []);

    const getInputChecks = useCallback(() => {
        const passwordLengthIsCorrect = firstPassword.length >= MIN_PASSWORD_LENGTH;
        const passwordsMatch = firstPassword === secondPassword;
        const checkboxIsChecked = checkbox;
        const inputIsCorrect = passwordLengthIsCorrect && passwordsMatch && checkboxIsChecked;

        return { passwordLengthIsCorrect, passwordsMatch, inputIsCorrect, checkboxIsChecked };
    }, [firstPassword, secondPassword, checkbox]);

    const onApiRequestFail = useCallback(() => {
        store.setSignUpStepNumber(0);
        setFormErrorMessage('?????????????????? ????????????????-?????????????????????? ?? ???????????????????? ?????? ??????');
    }, []);

    const processLoginApiResponse = useCallback((response) => {
        if (response && response.status >= 200 && response.status < 300) {
            store.incrementSignUpStep();
        }
    }, []);

    const processRegisterApiResponse = useCallback(
        (response) => {
            if (response.status >= 200 && response.status < 300) {
                Api.login(email, firstPassword)
                    .then((response) => {
                        processLoginApiResponse(response);
                    })
                    .catch(onApiRequestFail);
            }
        },
        [email, firstPassword, onApiRequestFail, processLoginApiResponse]
    );

    const cleanInputErrorMessages = useCallback(() => {
        setFormErrorMessage(null);
        setFirstPasswordErrorMessage(null);
        setSecondPasswordErrorMessage(null);
        setCheckboxErrorMessage(null);
    }, []);

    const onRegisterError = useCallback(
        (error) => {
            if (error.response && error.response.status) {
                const status = error.response.status;

                if (status >= 400 && status < 500) {
                    store.setSignUpStepNumber(0);
                    setFormErrorMessage('?????????????????????? ???????????? ???????????? ?????? ??????????????????????');
                } else {
                    store.setSignUpStepNumber(0);
                    setFormErrorMessage('??????-???? ?????????? ???? ??????, ???????????????????? ?????? ??????');
                }
            } else {
                onApiRequestFail();
            }
        },
        [onApiRequestFail]
    );

    const onRegisterSubmit = useCallback(
        (event) => {
            event.preventDefault();
            cleanInputErrorMessages();
            const inputChecks = getInputChecks();
            if (inputChecks.inputIsCorrect) {
                setRequestState(true);
                Api.register(email, firstPassword)
                    .then((response) => {
                        processRegisterApiResponse(response);
                    })
                    .catch(onRegisterError)
                    .finally(() => {
                        setRequestState(false);
                    });
            } else {
                if (!inputChecks.passwordLengthIsCorrect) {
                    setFirstPasswordErrorMessage('?????????? ???????????? ???????????? ???????????????????? ???? ?????????? 8 ????????????????');
                }
                if (!inputChecks.passwordsMatch) {
                    setSecondPasswordErrorMessage('?????? ???????? ???????????? ?????????????????? ???????????????????? ????????????');
                }
                if (!inputChecks.checkboxIsChecked) {
                    setCheckboxErrorMessage('???????????????????? ???????? ???????????????? ?? ??????????????????');
                }
            }
        },
        [email, firstPassword, getInputChecks, cleanInputErrorMessages, processRegisterApiResponse, onRegisterError]
    );

    const tutorialSteps = [
        <React.Fragment key="0">
            <Box style={props.theme.h1}>??????????????????????</Box>
            <Box style={props.theme.h2}>
                ?????????????? ??????????????
                <br />
                ?????????? ????????????
            </Box>
            <Form
                fields={[{ label: 'E-Mail', type: 'email', value: email, errorMessage: null, name: 'email' }]}
                submitButtonText="??????????????????????"
                submitButtonIsDisabled={false}
                onSubmit={store.incrementSignUpStep}
                onInputChange={setEmail}
                errorMessage={formErrorMessage}
            />
            <HHLoginButton />
            <LinkButton href="/signin" name="??????????" color={'primary'} />
        </React.Fragment>,
        <React.Fragment key="1">
            <Box style={props.theme.h4}>???????????????????? ????????????, ?????????? ?????????? ?? ????????????????</Box>
            <Form
                fields={[
                    {
                        label: '?????????????? ????????????',
                        type: 'password',
                        value: firstPassword,
                        errorMessage: firstPasswordErrorMessage,
                        name: firstPasswordName,
                    },
                    {
                        label: '?????????????????? ????????????',
                        type: 'password',
                        value: secondPassword,
                        errorMessage: secondPasswordErrorMessage,
                        name: secondPasswordName,
                    },
                    {
                        label: (
                            <span>
                                {'?? ???????????????? ?? '}
                                <Link href={'https://gowork.ru.com/policy'}>
                                    {'?????????????????? ?????????????????? ???????????????????????? ????????????'}
                                </Link>
                            </span>
                        ),
                        type: 'checkbox',
                        value: checkbox,
                        errorMessage: checkboxErrorMessage,
                        name: checkboxName,
                    },
                ]}
                submitButtonText="??????????"
                submitButtonIsDisabled={requestIsInProcess}
                onSubmit={onRegisterSubmit}
                onInputChange={onPasswordInputChange}
                errorMessage={null}
            />
            <Box mt={3} style={props.theme.h5} textAlign="center">
                ?????? 2 ???? 3-??
            </Box>
        </React.Fragment>,
        <React.Fragment key="2">
            <Box style={props.theme.h4}>?? ?????????? ???????????????????????????????? ?????????????? ???? ?????????? ?????????????</Box>
            <Box px={2} py={6}>
                <Select labelId="label" value="item-0" variant="outlined" fullWidth={true}>
                    <MenuItem value="item-0">?????????????????? 1</MenuItem>
                    <MenuItem value="item-1">?????????????????? 2</MenuItem>
                </Select>
            </Box>
            <SubmitButton href="/course" submitButtonText="???????????? ??????????????" />
        </React.Fragment>,
    ];

    return (
        <React.Fragment>
            <Header />
            <Container>
                <Box maxWidth={props.theme.form.maxWidth} mx="auto">
                    {tutorialSteps[store.signUpStep]}
                    <MobileStepper
                        steps={tutorialSteps.length}
                        position="static"
                        activeStep={store.signUpStep}
                        nextButton={<Box flex={1} />}
                        backButton={
                            <Box flex={1}>
                                {store.signUpStep !== 0 && (
                                    <Button size="small" onClick={store.decrementSignUpStep}>
                                        <KeyboardArrowLeft />
                                        ??????????
                                    </Button>
                                )}
                            </Box>
                        }
                    />
                </Box>
            </Container>
        </React.Fragment>
    );
});

export default withRouter(withTheme(SignUp));
