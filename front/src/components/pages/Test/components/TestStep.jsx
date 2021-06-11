import React from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import withTheme from '@material-ui/core/styles/withTheme';

const TestStep = (props) => (
    <Box mb={5}>
        <Box mt={2} mb={2} fontSize={11} fontWeight="fontWeightBold">
            Задание {props.number}
        </Box>
        <Box mb={2} fontSize={11} dangerouslySetInnerHTML={{ __html: props.data.question.html }}></Box>
        <Paper elevation={10}>
            <Box px={3} py={1.5}>
                <Box style={props.theme.h6}>Ваш ответ:</Box>
            </Box>
        </Paper>
        <Box
            fontSize={9}
            borderLeft={1}
            borderColor={props.answer.correct ? 'primary.main' : 'error.main'}
            mt={3}
            pl={3}
            py={1}
        >
            {props.answer.answersExplanations.explanation}
        </Box>
    </Box>
);

export default withTheme(TestStep);
