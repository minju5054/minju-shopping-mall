import React, { useState } from "react";
import "../style/Popup.css";

const NewsPopup = ({ type, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className={`popup-overlay ${type === "discount" ? "discount" : "fw-release"}`}>
            <div className="popup-content">
                <button className="popup-close-x" onClick={handleClose}>✖</button>
                {type === "discount" ? (
                    <>
                        <h2 className="popup-title">🔥 30% 할인! 🔥</h2>
                        <p>!!오직 쇼핑몰 회원만을 위한 이벤트!!</p>
                        <p>한정 기간 동안 특별 할인 혜택을 놓치지 마세요!</p>
                        <p>✔️할인 쿠폰을 다운받아 사용하세요</p>
                    </>
                ):(
                    <>
                        <h2 className="popup-title">🍂 F/W 신상 출시 🍂</h2>
                        <p>새로운 시즌 컬렉션을 지금 만나보세요!</p>
                    </>
                )}
                <button className="popup-close" onClick={handleClose}>닫기</button>
            </div>
        </div>
    );
};

export default NewsPopup;