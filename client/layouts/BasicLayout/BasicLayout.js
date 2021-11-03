import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from '../../components/Header';
import classNames from 'classnames';

export default function BasicLayout(props) {
    const {children, className}=props;

    return (
        <Container fluid className={classNames('basic-layout', {
            [className]:className,
        })}>
            <Header/>
            <Container className='content'>{children}</Container>
        </Container>
    )
}