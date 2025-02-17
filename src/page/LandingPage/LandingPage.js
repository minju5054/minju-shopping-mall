import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import PriceFilter from "../../common/component/PriceFilter";
import NewsPopup from "../../common/component/NewsPopup";

const LandingPage = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const [query, setQuery] = useSearchParams();
  const name = query.get("name");

  const [showDiscountPopup, setShowDiscountPopup] = useState(true);
  const [showFWPopup, setshowFWPopup] = useState(true);

  useEffect(() => {
    dispatch(
      getProductList({
        name,
      })
    );
  }, [query]);
  
  // 검색 쿼리 상태 추가
  const [searchQuery, setSearchQuery] = useState({
    name: query.get("name") || "",
    minPrice: query.get("minPrice") || "",
    maxPrice: query.get("maxPrice") || "",
  });
  
  
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(
      getProductList({
        name: query.get("name") || "",
        minPrice: query.get("minPrice") || "",
        maxPrice: query.get("maxPrice") || "",
      })
    );
  }, [query]);

 
  return (
    <Container>
      {showDiscountPopup && <NewsPopup type="discount" onClose={() => setShowDiscountPopup(false)} />}
      {showFWPopup && <NewsPopup type="fw-release" onClose={() => setshowFWPopup(false)}/>}
      <PriceFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} className="price-filter"/>
      <Row>
        {productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {searchQuery.name === "" ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <h2>{searchQuery.name}과 일치한 상품이 없습니다!`</h2>
            )}
          </div>
        )}
      </Row>
    </Container>
  );
};

export default LandingPage;
