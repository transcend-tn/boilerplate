import React from "react";
import { Row, Col } from "react-bootstrap";
import Favoris from "../components/Favoris";
import ProfileCard from "../components/ProfileCard";

const FAVORIS: number[] = [1, 2];

function FavorisPage() {
  return (
    <Row>
      <Col>
        <ProfileCard followers={15} username="Username" following={23} />
      </Col>
      <Col>
        <div>
          <h2 className="mb-3">Mes Favoris</h2>
          <>
           {FAVORIS.map(value => {
             return (
               <Favoris key={`favoris-${value}`} document='document 1' timeEdit="12/04/2019" />
             )
           })}
          </>
        </div>
      </Col>
    </Row>
  );
}

export default FavorisPage;
