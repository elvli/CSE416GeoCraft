import { React, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Dropdown, Row, Form, Col, Container, Card } from "react-bootstrap";
import { HandThumbsUpFill, HandThumbsDownFill, ThreeDotsVertical, PencilFill, HandThumbsUp, HandThumbsDown, } from 'react-bootstrap-icons';
import AuthContext from '../../auth'
import GlobalStoreContext from '../../store'
import RangeSlider from 'react-bootstrap-range-slider';
import './HeatEditBar.scss'
export default function RangeSelector(props) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const { setValue1, setValue2, setValue3, setValue4, value1, value2, value3, value4, max} = props
  const username = auth.loggedIn ? auth.user._id : 0;
  const navigate = useNavigate();



  return (
    <Card>
        <Card.Body>
            <Container>
                <Row>
                    <Col xs="8">
                        {value1}
                    <RangeSlider
                        onChange={e => setValue1(e.target.value)}
                        size='sm'
                        max={value2}
                    />
                    </Col>
                </Row>
                <Row>
                    <Col xs="8">
                        {value2}
                    <RangeSlider
                        onChange={e => setValue2(e.target.value)}
                        size='sm'
                        max={value3}
                        min={value1}
                    />
                    </Col>
                </Row>
                <Row>
                    <Col xs="8">
                        {value3}
                    <RangeSlider
                        onChange={e => setValue3(e.target.value)}
                        size='sm'
                        max={max}
                        min={value2}
                    />
                    </Col>
                </Row>
                <Row as={Row}>
                    <Col xs="8">
                        {value4}
                    <RangeSlider
                        onChange={e => setValue4(e.target.value)}
                        size='sm'
                        max={max}
                    />
                    </Col>
                </Row>
            </Container>
        </Card.Body>
    </Card>
    
  )
}