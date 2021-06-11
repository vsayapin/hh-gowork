import React from 'react';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';

import withTheme from '@material-ui/core/styles/withTheme';

import TestStep from 'src/components/pages/Test/components/TestStep';

import Header from 'src/components/shared/Header';
import SharedNav from 'src/components/shared/Nav';
import UserSettings from 'src/components/shared/UserSettings';

const Test = (props) => {
    const progressPercentage = 25;

    const paragraphs = [
        {
            id: 0,
            name: 'Введение',
            steps: [
                {
                    id: 0,
                    theory: 'string',
                    question: {
                        html: '<span>Какие цели на курс вы ставите?</span>',
                    },
                },
            ],
        },
        {
            id: 1,
            name: 'Введение',
            steps: [
                {
                    id: 0,
                    theory: 'string',
                    question: {
                        html: '<span>Какие цели на курс вы ставите?</span>',
                    },
                },
                {
                    id: 1,
                    theory: 'string',
                    question: {
                        html: '<span>Какие цели на курс вы ставите?</span>',
                    },
                },
            ],
        },
        {
            id: 2,
            name: 'Введение',
            steps: [
                {
                    id: 0,
                    theory: 'string',
                    question: {
                        html: '<span>Какие цели на курс вы ставите?</span>',
                    },
                },
            ],
        },
    ];

    const answers = [
        [
            {
                correctAnswers: [0],
                answersExplanations: {
                    explanation:
                        'Тут мы выводим информацию об ответе и обобщаем почему именно так, если пользователь ответил не верно',
                },
                correct: true,
            },
        ],
        [
            {
                correctAnswers: [0],
                answersExplanations: {
                    explanation:
                        'Тут мы выводим информацию об ответе и обобщаем почему именно так, если пользователь ответил не верно',
                },
                correct: true,
            },
            {
                correctAnswers: [0],
                answersExplanations: {
                    explanation:
                        'Тут мы выводим информацию об ответе и обобщаем почему именно так, если пользователь ответил не верно',
                },
                correct: false,
            },
        ],
        [
            {
                correctAnswers: [0],
                answersExplanations: {
                    explanation:
                        'Тут мы выводим информацию об ответе и обобщаем почему именно так, если пользователь ответил не верно',
                },
                correct: true,
            },
        ],
    ];

    return (
        <React.Fragment>
            <Header UserSettings={UserSettings} TestNav={SharedNav} />
            <LinearProgress variant="determinate" value={progressPercentage} />
            <Container>
                {paragraphs.map((paragraph, paragraphIndex) => (
                    <React.Fragment key={paragraph.id}>
                        <Box style={props.theme.h5} color={'#A1A1A1'} fontWeight="fontWeightBold" mt={5}>
                            {`§ ${paragraph.name}`}
                        </Box>
                        {paragraph.steps.map((step, stepIndex) => (
                            <TestStep
                                key={step.id}
                                data={step}
                                number={`${paragraphIndex + 1}.${stepIndex + 1}`}
                                answer={answers[paragraphIndex][stepIndex]}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </Container>
        </React.Fragment>
    );
};

export default withTheme(Test);
