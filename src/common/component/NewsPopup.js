import React, {useState} from "react";
import {Modal, Button} from "react-bootstrap";

const NewsPopup = ({show, handleClose}) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>쇼핑몰 소식</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>🎉 특별한 세일 이벤트! 🎉</p>
                <p>이번 주에는 최대 30% 할인! 놓치지 마세요!</p>
                <p>더 많은 소식을 확인하려면 계속 쇼핑하세요!</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NewsPopup;