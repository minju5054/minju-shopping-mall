import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";

const PriceFilter = ({ searchQuery, setSearchQuery }) => {
    const [query] = useSearchParams();
    const [minPrice, setMinPrice] = useState(query.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(query.get("maxPrice") || "");

    // 엔터 키를 누르면 필터를 적용하는 함수수
    const onKeyPressHandler = (event) => {
        if (event.key === "Enter") {
            applyFilter();
        }
    };

    // 입력된 최소, 최대 가격을 기반으로 검색 쿼리를 업데이틀틀
    const applyFilter = () => {
        setSearchQuery({
            ...searchQuery,
            page: 1,
            minPrice: minPrice,
            maxPrice: maxPrice,
        });
    };

    return (
        <div className="price-filter">
          <FontAwesomeIcon icon={faFilter} />
          <input
            type="number"
            placeholder="최소 가격"
            onKeyPress={onKeyPressHandler}
            onChange={(e) => setMinPrice(e.target.value)}
            value={minPrice}
          />
          <input
            type="number"
            placeholder="최대 가격"
            onKeyPress={onKeyPressHandler}
            onChange={(e) => setMaxPrice(e.target.value)}
            value={maxPrice}
          />
          <button type="button" onClick={applyFilter}>
            필터 적용
          </button>
        </div>
      );
};


export default PriceFilter;